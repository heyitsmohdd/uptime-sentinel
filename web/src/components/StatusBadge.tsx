interface StatusBadgeProps {
    statusCode: number
}

export default function StatusBadge({ statusCode }: StatusBadgeProps) {
    const isHealthy = statusCode >= 200 && statusCode < 300

    return (
        <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${isHealthy
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
        >
            <span
                className={`w-2 h-2 rounded-full mr-2 ${isHealthy ? 'bg-green-500' : 'bg-red-500'
                    }`}
            ></span>
            {statusCode === 0 ? 'Error' : statusCode}
        </div>
    )
}
