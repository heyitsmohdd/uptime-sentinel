import { useState } from 'react'

interface AddMonitorFormProps {
    onMonitorAdded: () => void
}

export default function AddMonitorForm({ onMonitorAdded }: AddMonitorFormProps) {
    const [url, setUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!url.trim()) {
            setError('URL is required')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('http://localhost:8080/api/monitor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url.trim() }),
            })

            if (!response.ok) {
                throw new Error('Failed to add monitor')
            }

            setUrl('')
            onMonitorAdded()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add monitor')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Add New Monitor
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Adding...' : 'Add Monitor'}
                </button>
            </form>
            {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
