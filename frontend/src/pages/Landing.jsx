import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center text-white">
      <div className="flex min-h-screen flex-col justify-end bg-slate-950/65 px-6 pb-16 md:px-12">
        <h1 className="max-w-4xl text-5xl font-semibold md:text-7xl">GLOBALTALK AI</h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-200">Realtime multilingual chat, AI translation, voice, and video for global teams, creators, businesses, and future AI meetings.</p>
        <div className="mt-8 flex gap-3">
          <Link className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950" to="/signup">Start</Link>
          <Link className="rounded-lg border border-white/20 px-5 py-3 font-semibold" to="/login">Login</Link>
        </div>
      </div>
    </main>
  )
}
