import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-400 text-slate-950"><ShieldCheck size={22} /></span>
          <div><h1 className="text-2xl font-semibold">Welcome back</h1><p className="text-sm text-slate-400">Secure AI communication access</p></div>
        </div>
        {error && <p className="mb-3 rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-200">{error}</p>}
        <input className="field" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="field mt-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="mt-5 w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">Login</button>
        <p className="mt-5 text-center text-sm text-slate-400">New here? <Link className="text-cyan-300" to="/signup">Create account</Link></p>
      </form>
    </main>
  )
}
