import { Phone, PhoneOff } from 'lucide-react'

export default function IncomingCallModal({ call, onAccept, onReject }) {
  if (!call) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-slate-900 p-5 text-center">
        <h3 className="text-xl font-semibold">Incoming {call.type} call</h3>
        <p className="mt-2 text-sm text-slate-400">{call.from}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-400 text-slate-950" onClick={onAccept}><Phone size={20} /></button>
          <button className="grid h-12 w-12 place-items-center rounded-lg bg-rose-500 text-white" onClick={onReject}><PhoneOff size={20} /></button>
        </div>
      </div>
    </div>
  )
}
