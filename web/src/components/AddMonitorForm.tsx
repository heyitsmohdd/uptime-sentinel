import { useState } from 'react'

interface AddMonitorFormProps {
    onMonitorAdded: () => void
    apiKey: string
}

export default function AddMonitorForm({ onMonitorAdded, apiKey }: AddMonitorFormProps) {
    const [url, setUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!url.trim()) {
            setError('URL is required')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(`${API_URL}/api/monitor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey
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
        <div className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800/50 backdrop-blur-md animate-in opacity-0">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4 tracking-wide">Add New Monitor</h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="flex-1 px-4 py-3 border border-zinc-800 bg-zinc-950/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all disabled:opacity-50 text-zinc-100 placeholder-zinc-600"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-zinc-100 text-zinc-950 font-semibold rounded-xl hover:bg-white hover:shadow-lg hover:shadow-zinc-100/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98]"
                >
                    {isSubmitting ? 'Adding...' : 'Add Monitor'}
                </button>
            </form>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>
    )
}
