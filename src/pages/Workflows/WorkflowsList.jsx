import { useEffect, useState } from "react"
import { WorkflowsAPI } from './../../api/workflows.api';
import Table from "../../components/Table";
import ErrorToast from "../../components/Common/ErrorToast";
import { useNavigate } from "react-router-dom";

function WorkflowsList() {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchWorkflows();
    }, [])

    const fetchWorkflows = async () => {
        setErr("");
        setLoading(true);
        try {
            const res = await WorkflowsAPI.list();
            setWorkflows(res.data);
        } catch (error) {
            console.log(error);
            setErr(error?.response?.data || error.message || "failed to fetch workflows")
        } finally {
            setLoading(false);
        }
    }

    const toggleActive = async (id, currentActive) => {
        setErr("");
        try {
            await WorkflowsAPI.setActive(id, !currentActive);
            await fetchWorkflows();
        } catch (error) {
            console.log(error);
            setErr(error?.response?.data || error.message || "Failed to update active state");
        }
    }

    const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        // { key: "description", label: "Description" },
        { key: "triggerEventType", label: "Trigger" },
        {
            key: "active",
            label: "Active",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <span
                        className={`px-2 py-1 rounded text-xs font-semibold 
                        ${row.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                        {row.active ? "Active" : "Inactive"}
                    </span>
                    <button
                        onClick={() => toggleActive(row.id, row.active)}
                        className="px-3 py-1 rounded-md border hover:bg-gray-50 text-sm"
                    >
                        {row.active ? "Disable" : "Enable"}
                    </button>
                </div>
            )
        },
        {
            key: "actions", label: "Actions",
            render: (row) => (
                <button
                    onClick={() => navigate(`/workflows/${row.id}/edit`)}
                    className="px-2 py-1 rounded-md bg-slate-400 text-white"
                >
                    Edit
                </button>
            )
        },
        // { key: "createdAt", label: "Created At" },
    ]

    return (
        <div className='p-6'>
            <div className="flex justify-between items-center mb-8">
                <div className='font-semibold text-2xl text-blue-800 '>
                    Workflows List
                </div>
                <button
                    onClick={() => navigate("/workflows/new")}
                    className="p-2 bg-blue-500 rounded-md text-white"
                >
                    + Workflow
                </button>
            </div>
            <Table columns={columns} data={workflows} rowKey="id" />
            
            <ErrorToast show={!!err} message={String(err)} onClose={() => setErr("")}
            />
        </div>
    )
}

export default WorkflowsList
