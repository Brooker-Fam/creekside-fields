import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { insforge } from '../../lib/insforge'

type Mode = 'signin' | 'signup'

export default function AdminLogin() {
  const [mode, setMode] = useState<Mode>('signin')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const navigate = useNavigate()
  const posthog = usePostHog()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setInfo(null)
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email'))
    const password = String(fd.get('password'))
    if (mode === 'signup') {
      const { error } = await insforge.auth.signUp({ email, password })
      if (error) {
        posthog?.captureException(error, { context: 'admin_signup' })
        setError(error.message ?? 'Sign-up failed')
        setSubmitting(false)
        return
      }
      posthog?.identify(email, { email })
      posthog?.capture('admin_signed_up', { method: 'password' })
      setInfo('Check your inbox to verify your email, then sign in.')
      setMode('signin')
      setSubmitting(false)
      return
    }
    const { error } = await insforge.auth.signInWithPassword({ email, password })
    if (error) {
      posthog?.captureException(error, { context: 'admin_login' })
      setError(error.message ?? 'Login failed')
      setSubmitting(false)
      return
    }
    posthog?.identify(email, { email })
    posthog?.capture('admin_logged_in', { method: 'password' })
    navigate('/admin')
  }

  async function signInWithGoogle() {
    posthog?.capture('admin_login_started', { method: 'google' })
    await insforge.auth.signInWithOAuth({ provider: 'google', redirectTo: window.location.origin + '/admin' })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl">{mode === 'signin' ? 'Admin sign-in' : 'Create an admin account'}</h1>
      <div className="mt-3 flex gap-2 text-sm">
        <button
          onClick={() => setMode('signin')}
          className={`rounded-full px-3 py-1 ${mode === 'signin' ? 'bg-blush-300 font-semibold' : 'text-mud-600 hover:underline'}`}
        >
          Sign in
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`rounded-full px-3 py-1 ${mode === 'signup' ? 'bg-blush-300 font-semibold' : 'text-mud-600 hover:underline'}`}
        >
          Create account
        </button>
      </div>
      <form onSubmit={onSubmit} className="card mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={6} className="input" />
        </div>
        {error && <p className="text-sm text-blush-500">{error}</p>}
        {info && <p className="text-sm text-sage-500">{info}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
          {submitting ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
        {mode === 'signin' && (
          <button type="button" onClick={signInWithGoogle} className="btn-secondary w-full justify-center">
            Continue with Google
          </button>
        )}
      </form>
      {mode === 'signup' && (
        <p className="mt-3 text-xs text-mud-600">
          Creating an account doesn't make you an admin automatically — Matt has to add you.
          After you sign up, ping him at <a className="underline" href="mailto:brookerhousehold@gmail.com">brookerhousehold@gmail.com</a>.
        </p>
      )}
    </div>
  )
}
