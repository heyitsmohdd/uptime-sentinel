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
    onDelete: () => void
}

export default function StatusCard({ check, onDelete }: StatusCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-slate-200">
            <div className="flex items-start justify-between mb-4 gap-4">
                <h3 className="text-lg font-semibold text-slate-800 break-all">
                    {check.url}
                </h3>
                <button 
                    onClick={onDelete}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Delete monitor"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
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
