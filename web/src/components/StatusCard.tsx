import StatusBadge from './StatusBadge'

interface Check {
    id: number
    url: string
    status_code: number
    latency: number
    created_at: string
}

interface StatusCardProps {
    check: Check
}

export default function StatusCard({ check }: StatusCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-slate-200">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 break-all">
                    {check.url}
                </h3>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <StatusBadge statusCode={check.status_code} />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Latency</span>
                    <span className="text-sm font-mono font-semibold text-slate-800">
                        {check.latency}ms
                    </span>
                </div>

                <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                        Last checked: {formatDate(check.created_at)}
                    </p>
                </div>
            </div>
        </div>
    )
}
