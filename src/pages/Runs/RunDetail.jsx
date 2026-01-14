import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { RunsAPI } from '../../api/runs.api';
import Table from '../../components/Table';
import ErrorToast from '../../components/Common/ErrorToast';

function RunDetail() {
    const { id } = useParams();
    const [run, setRun] = useState('');
    const [steps, setSteps] = useState([]);
    const [err, setErr] = useState("");
    const [selectedStepRun, setSelectedStepRun] = useState(null);

    const formatDate = (value) => {
        if (!value) return "N/A";
        const d = new Date(value);
        return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
    };

    const statusPill = (status) => {
        const base = "px-2 py-1 rounded text-xs font-semibold";
        if (status === "SUCCESS") return `${base} bg-green-100 text-green-700`;
        if (status === "RUNNING") return `${base} bg-yellow-100 text-yellow-800`;
        if (status === "FAILED") return `${base} bg-red-100 text-red-700`;
        return `${base} bg-gray-100 text-gray-700`;
    };

    useEffect(() => {
        if (!id) return;

        let timer;
        const load = async () => {
            await fetchRun();
        };

        load();

        timer = setInterval(async () => {
            // fetch latest run without spamming forever
            try {
                const res = await RunsAPI.get(id);
                setRun(res.data);

                const stepRes = await RunsAPI.steps(id);
                setSteps(stepRes.data);

                if (["SUCCESS", "FAILED"].includes(res.data.status)) {
                    clearInterval(timer);
                }
            } catch (e) {
                // optional: stop polling on error
                clearInterval(timer);
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [id]);


    const columns = [
        { key: "id", label: "Step Run ID" },
        { key: "workflowStepId", label: "Workflow Step ID" },
        {
            key: "status", label: "Status",
            render: (row) => <span className={statusPill(row.status)}>{row.status}</span>
        },
        { key: "startedAt", label: "Started At", render: (row) => formatDate(row.startedAt), },
        { key: "finishedAt", label: "Finished At", render: (row) => formatDate(row.finishedAt), },
        {
            key: "outputData",
            label: "Output Data",
            render: (row) => (
                <button
                    className="text-blue-600 underline"
                    onClick={() => setSelectedStepRun(row)}
                >
                    View
                </button>
            ),
        },
        {
            key: "errorMessage", label: "Error Message",
            render: (row) => (row.errorMessage ? String(row.errorMessage) : "—"),
        },

    ]

    return (
        <div className='min-h-screen bg-gray-50 p-6'>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
                <div className='text-2xl font-semibold'>Run Detail</div>
                <p className="text-sm text-gray-500">View detailed information about the selected run.</p>

                {/* run metadata */}
                <div className='grid grid-cols-1 md:grid-cols-2 mb-8 gap-6 mt-6'>
                    <div>
                        <p className="font-medium text-gray-700">Run ID</p>
                        <p className="text-gray-900">{run.id}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Workflow ID</p>
                        <p className="text-gray-900">{run.workflowId}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Event Type</p>
                        <p className="text-gray-900">{run.eventType}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Status</p>
                        <span className={statusPill(run.status)}>{run.status || "—"}</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Created At</p>
                        <p className="text-gray-900">{formatDate(run.createdAt)}</p>                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Started At</p>
                        <p className="text-gray-900">{formatDate(run.startedAt)}</p>                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Finished At</p>
                        <p className="text-gray-900">{formatDate(run.finishedAt)}</p>                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Error Message</p>
                        <p className="text-gray-900">{run.errorMessage || 'N/A'}</p>
                    </div>
                </div>
                {/* steps table */}
                <div>
                    <Table columns={columns} data={steps} rowKey="id" />
                    {selectedStepRun && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-lg font-semibold">Step Run {selectedStepRun.id}</div>
                                    <button
                                        className="px-3 py-1 rounded bg-gray-200"
                                        onClick={() => setSelectedStepRun(null)}
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="font-medium text-gray-700 mb-1">Output Data</div>
                                        <pre className="bg-gray-50 border rounded p-3 overflow-auto max-h-72 text-sm">
                                            {typeof selectedStepRun.outputData === "string"
                                                ? selectedStepRun.outputData
                                                : JSON.stringify(selectedStepRun.outputData, null, 2)}
                                        </pre>
                                    </div>

                                    <div>
                                        <div className="font-medium text-gray-700 mb-1">Error Message</div>
                                        <pre className="bg-gray-50 border rounded p-3 overflow-auto max-h-40 text-sm">
                                            {selectedStepRun.errorMessage || "—"}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ErrorToast show={!!err} message={String(err)} onClose={() => setErr("")} />
        </div>
    )
}

export default RunDetail
