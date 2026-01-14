import React from 'react'

function Loader() {
    return (
        <div className="flex items-center justify-center py-10">
            <div
                className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
                aria-label="Loading"
                role="status"
            />
        </div>
    )
}

export default Loader
