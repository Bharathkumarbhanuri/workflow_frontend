import React, { useEffect } from "react";

function ErrorToast({ message, show, onClose, duration = 3000 }) {
    useEffect(() => {
        if (!show) return;

        const timer = setTimeout(() => {
            onClose?.();
        }, duration)

        return () => clearTimeout(timer);
    }, [show, duration, onClose])

    if (!show) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="flex items-start border justify-between border-red-200 bg-red-500 px-4 py-2
             text-white rounded-sm shadow-lg w-96">
                <div>
                    <div className="font-semibold">Error</div>
                    <div className="text-sm mt-1">
                        {message || "Something went wrong"}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-xs"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}

export default ErrorToast
