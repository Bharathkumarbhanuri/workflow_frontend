import { useEffect, useState } from "react";
import { NotificationsAPI } from "../../api/notifications.api";
import Table from "../../components/Table";
import ErrorToast from "../../components/Common/ErrorToast";

function NotificationsList() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setErr("");
        setLoading(true);
        try {
            const res = await NotificationsAPI.list({ page: 0, size: 30 });
            setNotifications(res.data.content || []);
        } catch (error) {
            console.error(error);
            setErr(
                error?.response?.data ||
                error.message ||
                "Failed to fetch notifications"
            );
        } finally {
            setLoading(false);
        }
    };

    const onMarkRead = async (id) => {
        setErr("");
        try {
            await NotificationsAPI.markRead(id);
            await fetchNotifications();
        } catch (error) {
            console.error(error);
            setErr(
                error?.response?.data ||
                error.message ||
                "Failed to mark notification as read"
            );
        }
    };

    const columns = [
        {
            key: "read",
            label: "Status",
            render: (row) => (row.read ? "✅ Read" : "🟡 Unread"),
        },
        {
            key: "message", label: "Message",
        },
        {
            key: "workflowRunId",
            label: "Run",
            render: (row) => row.workflowRunId ?? "-",
        },
        {
            key: "createdAt",
            label: "Created",
            render: (row) => new Date(row.createdAt).toLocaleString(),
        },
        {
            key: "actions",
            label: "Actions",
            render: (row) =>
                !row.read ? (
                    <button
                        onClick={() => onMarkRead(row.id)}
                        className="px-3 py-1 rounded-md border hover:bg-gray-50 text-sm"
                    >
                        Mark read
                    </button>
                ) : (
                    "-"
                ),
        },
    ];

    return (
        <div className="p-6">
            <div className="font-semibold text-2xl text-blue-800 mb-6">
                Notifications
            </div>

            <Table columns={columns} data={notifications} rowKey="id" />
            <ErrorToast show={!!err} message={String(err)} onClose={() => setErr("")} />
        </div>
    )
}

export default NotificationsList
