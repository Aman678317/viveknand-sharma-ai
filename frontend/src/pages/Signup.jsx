import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Signup() {
  const navigate = useNavigate()
  const signup = useAuthStore((state) => state.signup)
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', country: '', preferredLanguage: 'en' })
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      await signup(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-white">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-300 text-slate-950"><Globe2 size={22} /></span>
          <div><h1 className="text-2xl font-semibold">Join GlobalTalk AI</h1><p className="text-sm text-slate-400">Build your multilingual identity</p></div>
        </div>
        {error && <p className="mb-3 rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-200">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input className="field" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input className="field" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="field" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <input className="field" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <select className="field" value={form.preferredLanguage} onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}>
            <option value="en">English</option><option value="hi">Hindi</option><option value="zh">Chinese</option><option value="ar">Arabic</option><option value="es">Spanish</option><option value="fr">French</option>
          </select>
        </div>
        <button className="mt-5 w-full rounded-lg bg-emerald-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-200">Create account</button>
        <p className="mt-5 text-center text-sm text-slate-400">Already registered? <Link className="text-cyan-300" to="/login">Login</Link></p>
      </form>
    </main>
  )
}
