import { useEffect, useState } from 'react'
import { Phone, Video } from 'lucide-react'
import { api } from '../services/api'

export default function CallHistoryPage() {
  const [calls, setCalls] = useState([])
  useEffect(() => { api.get('/calls/history').then(({ data }) => setCalls(data.calls)) }, [])
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Call history</h2>
      <div className="grid gap-3">
        {calls.map((call) => (
          <div key={call._id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/10">{call.type === 'video' ? <Video size={18} /> : <Phone size={18} />}</span>
              <div><p className="font-medium">{call.caller?.fullName} → {call.receiver?.fullName}</p><p className="text-sm text-slate-400">{call.status} · {call.durationSeconds || 0}s</p></div>
            </div>
            <p className="text-xs text-slate-500">{new Date(call.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
