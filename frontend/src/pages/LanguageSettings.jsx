import { useState } from 'react'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'

const languages = [
  ['en', 'English'], ['hi', 'Hindi'], ['zh', 'Chinese'], ['ar', 'Arabic'], ['es', 'Spanish'], ['fr', 'French']
]

export default function LanguageSettings() {
  const { user, accessToken, setSession } = useAuthStore()
  const [selected, setSelected] = useState(user?.preferredLanguage || 'en')

  async function save() {
    const { data } = await api.patch('/users/profile', { preferredLanguage: selected })
    setSession({ user: data.user, accessToken })
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Language settings</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {languages.map(([code, label]) => (
          <button key={code} onClick={() => setSelected(code)} className={`rounded-lg border p-5 text-left transition ${selected === code ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'}`}>
            <span className="text-lg font-semibold">{label}</span>
            <span className="mt-1 block text-sm opacity-70">{code.toUpperCase()} text translation</span>
          </button>
        ))}
      </div>
      <button className="mt-5 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950" onClick={save}>Save language</button>
    </section>
  )
}
