import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorToast from '../../components/Common/ErrorToast';
import { WorkflowsAPI } from '../../api/workflows.api';
import { EventsAPI } from '../../api/events.api'
import { StepsAPI } from '../../api/steps.api'

function WorkflowCreate() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [err, setErr] = useState("");
    const [form, setForm] = useState({
        name: "",
        description: "",
        triggerEventType: "",
        active: true,
    });
    const [eventTypes, setEventTypes] = useState([]);
    const STEP_TYPES = ["ACTION_EMAIL", "ACTION_NOTIFICATION", "CONDITION", "DELAY"];
    const [steps, setSteps] = useState([]);

    const defaultConfigFor = (type) => {
        switch (type) {
            case "ACTION_EMAIL":
                return { toExpression: "{{payload.customerEmail}}", subjectTemplate: "", bodyTemplate: "" };
            case "ACTION_NOTIFICATION":
                return { messageTemplate: "" };
            case "CONDITION":
                return { fieldPath: "payload.totalAmount", operator: ">", compareValue: 500, onFalseSkip: 1 };
            case "DELAY":
                return { minutes: 10 };
            default:
                return {};
        }
    }

    const safeParseConfig = (config) => {
        if (!config) return {};
        if (typeof config === "object") return config;
        try {
            return JSON.parse(config);
        } catch {
            return {};
        }
    };

    useEffect(() => {
        fetchEventTypes();
    }, [])

    useEffect(() => {
        if (isEdit) {
            fetchWorkflow();
            fetchWorkflowSteps();
        }
    }, [isEdit, id]);


    const fetchWorkflow = async () => {
        setErr("")
        try {
            const res = await WorkflowsAPI.get(id);
            setForm({
                name: res.data.name || "",
                description: res.data.description || "",
                triggerEventType: res.data.triggerEventType || "",
                active: res.data.active,
            })
        } catch (error) {
            setErr(error?.response?.data || error.message || "Failed to load workflow details");
        }
    }

    const fetchWorkflowSteps = async () => {
        setErr("")
        try {
            const res = await StepsAPI.list(id);
            const workflowSteps = res.data;
            console.log(res.data);
            setSteps(
                workflowSteps
                    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                    .map((step) => ({
                        type: step.type || "",
                        config: safeParseConfig(step.config) ?? {},
                    }))
            )
        } catch (error) {
            setErr(error?.response?.data || error.message || "Failed to load workflow steps");
        }
    }

    const fetchEventTypes = async () => {
        setErr("")
        try {
            const res = await EventsAPI.eventTypes();
            setEventTypes(res.data);

            // If create mode AND triggerEventType empty, auto-select first
            setForm((prev) => {
                if (!isEdit && (!prev.triggerEventType || prev.triggerEventType === "") && res.data.length > 0) {
                    return { ...prev, triggerEventType: res.data[0] };
                }
                return prev;
            });
        } catch (error) {
            setErr(error?.response?.data || error.message || "Failed to load event types");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            if (!form.name.trim()) return setErr("Name is required");
            if (!form.triggerEventType) return setErr("Trigger event type is required");

            const stepsPayload = steps.map((step, index) => ({
                orderIndex: index,
                type: step.type,
                config: JSON.stringify(step.config),
            }));

            if (!isEdit) {
                const res = await WorkflowsAPI.create(form);
                const workflowId = res.data.id;
                // await WorkflowsAPI.setActive(workflowId, form.active);
                await StepsAPI.replaceAll(workflowId, stepsPayload);
            } else {
                await WorkflowsAPI.update(id, {
                    name: form.name,
                    description: form.description,
                    triggerEventType: form.triggerEventType,
                });
                // await WorkflowsAPI.setActive(id, form.active);
                await StepsAPI.replaceAll(id, stepsPayload);
            }
            navigate("/workflows");
        } catch (error) {
            console.log(error);
            setErr(error?.response?.data || error.message || "failed to save");
        }
    }

    const setField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    const handleAddStep = () => {
        setSteps((prev) => [
            ...prev,
            {
                type: "ACTION_EMAIL",
                config: defaultConfigFor("ACTION_EMAIL")
            }
        ]);
    }

    const handleRemoveStep = (idx) => {
        setSteps((prev) => prev.filter((step, i) => i !== idx));
    }

    const handleMoveStepDown = (idx) => {
        setSteps((prev) => {
            if (idx >= prev.length - 1) return prev;
            const copy = [...prev];
            const temp = copy[idx + 1];
            copy[idx + 1] = copy[idx];
            copy[idx] = temp;
            return copy;
        });
    }

    const handleMoveStepUp = (idx) => {
        if (idx === 0) return;
        setSteps((prev) => {
            const copy = [...prev];
            const temp = copy[idx - 1];
            copy[idx - 1] = copy[idx];
            copy[idx] = temp;
            return copy;
        });
    }

    const handleSteptype = (type, idx) => {
        setSteps((prev) => {
            const copy = [...prev];
            copy[idx] = {
                type: type,
                config: defaultConfigFor(type),
            };
            return copy;
        });
    }

    const handleStepConfigField = (idx, field, value) => {
        setSteps((prev) => {
            const copy = [...prev];
            copy[idx] = {
                ...copy[idx],
                config: {
                    ...copy[idx].config,
                    [field]: value
                },
            }
            return copy;
        });
    }

    const inputClass =
        "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

    const labelClass = "text-sm font-medium text-gray-700";

    const btnPrimary =
        "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500";

    const btnGreen =
        "inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500";

    const btnGhost =
        "inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50";

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='px-6 py-6'>
                <div className='flex justify-between items-center mb-6'>
                    <div>
                        <h1 className='text-2xl text-gray-900 font-bold'>
                            {isEdit ? "Edit Workflow" : "Create Workflow"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Define workflow metadata and steps in one place.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/workflows")}
                        className={btnGhost}
                    >
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6' >
                    {/* workflow Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <div className='space-y-4'>
                                <div>
                                    <label className={labelClass}>Name</label>
                                    <input
                                        className={inputClass}
                                        value={form.name}
                                        onChange={(e) => setField("name", e.target.value)}
                                        placeholder='Order placed flow'
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Trigger Event Type *</label>
                                    <select
                                        className={inputClass}
                                        value={form.triggerEventType}
                                        onChange={(e) => setField("triggerEventType", e.target.value)}
                                    >
                                        {eventTypes.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* <div>
                        <label className={labelClass}>
                            <input
                                type='checkbox'
                                className="sr-only peer"
                                checked={form.active}
                                onChange={(e) => setField("active", e.target.checked)}
                            />
                            <p className='font-semibold'>
                                Workflow Status:
                            </p>
                            <span
                                className={`relative inline-flex h-6 w-11 items-center rounded-full
                                        ${!form.active ? "bg-red-500" : "bg-green-500"}
                                        peer-checked:bg-success-300 transition-colors
                                        dark:bg-darkblack-400 dark:peer-checked:bg-success-300
                                `}
                            >
                                <span
                                    className={`absolute left-1.4 h-5 w-5 rounded-full bg-white shadow
                                            ${!form.active ? "left-0.5" : "translate-x-5"}
                                            transform transition dark:bg-darkblack-600
                                    `}
                                />
                            </span>
                            <p>{form.active ? "Active": "inActive"}</p>
                        </label>
                    </div> */}
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea
                                    className='mt-2 h-28 w-full border rounded-md p-2'
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) => setField("description", e.target.value)}
                                    placeholder='Sends confirmation email + internal notification'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Steps section */}
                    <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
                        {/* header row */}
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                            <div className='flex items-center gap-3'>
                                <h2 className='text-lg text-gray-900 font-bold'>Steps</h2>
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                                    {steps.length} steps
                                </span>
                            </div>
                            <button
                                type='button'
                                onClick={handleAddStep}
                                className={btnPrimary}
                            >
                                Add Step
                            </button>
                        </div>

                        {/* body */}
                        <div className="mt-4">
                            {steps.length === 0 ? (
                                <div className='rounded-lg border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500'>
                                    No steps yet. Click <span className="font-semibold">Add Step</span>.
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3' >
                                    {steps.map((step, idx) => (
                                        <div key={idx} className='relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                                            {/* left strip */}
                                            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-indigo-500" />
                                            <div className='mb-3 flex items-center justify-between'>
                                                <div>
                                                    <div>Step {idx + 1}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Configure action/condition
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <button
                                                        type="button"
                                                        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition"
                                                        onClick={() => handleMoveStepUp(idx)}
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition"
                                                        onClick={() => handleMoveStepDown(idx)}
                                                    >
                                                        ↓
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="p-1.5 rounded-md text-red-500 hover:bg-red-100 hover:text-red-700 transition"
                                                        onClick={() => handleRemoveStep(idx)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='mb-3'>
                                                <label className={labelClass}>Type</label>
                                                <select
                                                    className={inputClass}
                                                    value={step.type}
                                                    onChange={(e) => handleSteptype(e.target.value, idx)}
                                                >
                                                    {STEP_TYPES.map((t) => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* type specific config */}
                                            {step.type === "ACTION_EMAIL" && (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className={labelClass}>To</label>
                                                        <input
                                                            className={inputClass}
                                                            value={step.config.toExpression || ""}
                                                            onChange={(e) => handleStepConfigField(idx, "toExpression", e.target.value)}
                                                            placeholder="{{payload.customerEmail}}"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Subject</label>
                                                        <input
                                                            className={inputClass}
                                                            value={step.config.subjectTemplate || ""}
                                                            onChange={(e) => handleStepConfigField(idx, "subjectTemplate", e.target.value)}
                                                            placeholder="Thanks for your order {{payload.customerName}}"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Body</label>
                                                        <textarea
                                                            className={`${inputClass} min-h-[90px]`}
                                                            rows={3}
                                                            value={step.config.bodyTemplate || ""}
                                                            onChange={(e) => handleStepConfigField(idx, "bodyTemplate", e.target.value)}
                                                            placeholder="Order {{payload.orderId}} confirmed..."
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            )}
                                            {step.type === "ACTION_NOTIFICATION" && (
                                                <div>
                                                    <label className={labelClass}>Message</label>
                                                    <textarea
                                                        className={inputClass}
                                                        rows={3}
                                                        value={step.config.messageTemplate || ""}
                                                        onChange={(e) => handleStepConfigField(idx, "messageTemplate", e.target.value)}
                                                        placeholder="New order {{payload.orderId}}"
                                                    ></textarea>
                                                </div>
                                            )}
                                            {step.type === "CONDITION" && (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className={labelClass}>Field Path</label>
                                                        <input
                                                            className={inputClass}
                                                            value={step.config.fieldPath || ""}
                                                            onChange={(e) => handleStepConfigField(idx, "fieldPath", e.target.value)}
                                                            placeholder="payload.totalAmount"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Operator</label>
                                                        <select
                                                            className={inputClass}
                                                            value={step.config.operator || ">"}
                                                            onChange={(e) => handleStepConfigField(idx, "operator", e.target.value)}
                                                        >
                                                            <option value="">select operator</option>
                                                            <option value="==">==</option>
                                                            <option value=">">{">"}</option>
                                                            <option value="<">{"<"}</option>
                                                            <option value=">=">{">="}</option>
                                                            <option value="<=">{"<="}</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Value</label>
                                                        <input
                                                            className={inputClass}
                                                            value={step.config.compareValue || {}}
                                                            onChange={(e) => handleStepConfigField(idx, "compareValue", e.target.value)}
                                                            placeholder="500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>onFalseSkip</label>
                                                        <input
                                                            className={inputClass}
                                                            value={step.config.onFalseSkip ?? 1}
                                                            onChange={(e) => handleStepConfigField(idx, "onFalseSkip", Number(e.target.value))}
                                                            min={0}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {step.type === "DELAY" && (
                                                <div>
                                                    <label className={labelClass}>delay</label>
                                                    <input
                                                        type='number'
                                                        className={inputClass}
                                                        value={step.config.minutes ?? 5}
                                                        onChange={(e) => handleStepConfigField(idx, "minutes", Number(e.target.value))}
                                                        min={0}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex justify-end'>
                        <button
                            type='submit'
                            className={btnGreen}
                        >
                            {isEdit ? "Update Workflow" : "Save Workflow"}
                        </button>
                    </div>
                </form>

                <ErrorToast show={!!err} message={String(err)} onClose={() => setErr("")} />
            </div >
        </div>
    )
}

export default WorkflowCreate
