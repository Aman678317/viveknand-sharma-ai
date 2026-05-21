import { useState } from 'react'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'

export default function ProfileSettings() {
  const { user, setSession, accessToken } = useAuthStore()
  const [form, setForm] = useState({ fullName: user?.fullName || '', country: user?.country || '', bio: user?.bio || '', preferredLanguage: user?.preferredLanguage || 'en' })

  async function save() {
    const { data } = await api.patch('/users/profile', form)
    setSession({ user: data.user, accessToken })
  }

  return (
    <section className="max-w-2xl">
      <h2 className="mb-4 text-2xl font-semibold">Profile settings</h2>
      <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <input className="field" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="field" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <textarea className="field min-h-28" placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <button className="rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950" onClick={save}>Save profile</button>
      </div>
    </section>
  )
}
