import { useEffect, useState } from "react"
import EmailsAPI from '../../api/emails.api';
import Table from '../../components/Table';
import ErrorToast from '../../components/Common/ErrorToast';


function EmailsList() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        fetchAllEmails();
    }, []);

    const fetchAllEmails = async () => {
        setErr("");
        setLoading(true);
        try {
            const res = await EmailsAPI.list({ page: 0, size: 20 });
            setEmails(res.data)
        } catch (error) {
            console.error("Failed to fetch emails:", error);
            setErr(error?.response?.data || error.message || "Failed to fetch emails");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: "toAddress", label: "To" },
        { key: "subject", label: "Subject" },
        { key: "status", label: "Status" },
        { key: "workflowRunId", label: "Run", render: (row) => row.workflowRunId ?? "-" },
        { key: "createdAt", label: "Created", render: (row) => new Date(row.createdAt).toLocaleString() },
    ];

    return (
        <div className='p-6'>
            <div className="flex justify-between items-center mb-8">
                <div className='font-semibold text-2xl text-blue-800 '>
                    Emails List
                </div>
            </div>
            <Table columns={columns} data={emails} rowKey="id" />

            <ErrorToast show={!!err} message={String(err)} onClose={() => setErr("")}
            />
        </div>
    )
}

export default EmailsList
