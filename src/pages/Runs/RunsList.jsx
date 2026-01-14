import { useEffect, useState } from "react"
import { RunsAPI } from './../../api/runs.api';
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";

function RunsList() {
    const [runs, setRuns] = useState([]);
    const navigate = useNavigate();

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
        const fetchRuns = async () => {
            try {
                const res = await RunsAPI.list();
                setRuns(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchRuns();
    }, [])

    const columns = [
        { key: "id", label: "ID" },
        { key: "workflowId", label: "Workflow Id" },
        { key: "eventType", label: "Event Type" },
        { key: "sourceSystem", label: "Source System" },
        {
            key: "status",
            label: "Status",
            render: (row) => (
                <span
                    className={statusPill(row.status)}
                >
                    {row.status || "—"}
                </span>
            )
        },
        { key: "createdAt", label: "Created At", render: (row) => formatDate(row.createdAt) },
        { key: "startedAt", label: "Started At", render: (row) => formatDate(row.startedAt) },
        { key: "finishedAt", label: "Finished At", render: (row) => formatDate(row.finishedAt) },
        { key: "errorMessage", label: "Error Message" },
        {
            key: "actions", label: "Actions",
            render: (row) => (
                <button
                    onClick={() => navigate(`/runs/${row.id}`)}
                    className="px-2 py-1 rounded-md bg-slate-400 text-white"
                >
                    View Details
                </button>
            )
        }
    ]

    return (
        <div className='p-6'>
            <div className='font-semibold text-xl text-blue-800 mb-4'>
                Runs List
            </div>
            <Table columns={columns} data={runs} rowKey="id" />
        </div>
    )
}

export default RunsList
