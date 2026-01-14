import React from 'react'

function Table({ columns, data, rowKey }) {
    return (
        <div>
            <table className='min-w-full border border-gray-200'>
                <thead className='bg-gray-100'>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className='px-4 py-2 text-left border font-semibold'>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center py-4 text-gray-500"
                            >
                                No data found
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr
                                key={row[rowKey]}
                                className="hover:bg-gray-50"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-2 border">
                                        {col.render ? col.render(row): row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

        </div>
    )
}

export default Table
