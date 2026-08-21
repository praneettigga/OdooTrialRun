import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/layout/Logo'
import { useAuth } from '../../context/authContext'
import { updatePassword } from '../../services/auth'
import '../auth/AuthPage.css'

// The recovery link carries its own token. supabase-js exchanges it on load
// (detectSessionInUrl is on by default) and AuthProvider picks the session up
// through onAuthStateChange, so a session here means the link was good. No
// hand-parsing of the URL — that breaks as soon as the flow is PKCE rather
// than a hash fragment.
export function ResetPasswordPage() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }

    setSubmitting(true)
    const result = await updatePassword(password)
    setSubmitting(false)
    if (result.error) setError(result.error)
    // The recovery link already signed them in, so send them to the app rather
    // than to /login, which would bounce them straight back out.
    else navigate('/', { replace: true })
  }

  return (
    <main className="auth-screen">
      <video className="auth-background-video" autoPlay muted loop playsInline aria-hidden="true">
        <source src="/auth-background.mp4" type="video/mp4" />
      </video>
      <div className="auth-video-tint" aria-hidden="true" />

      <section className="auth-solo">
        <Logo />
        {loading ? (
          <p className="auth-solo__intro">Checking your link…</p>
        ) : session ? (
          <>
            <h1>Choose a new password</h1>
            <p className="auth-solo__intro">You are signed in from the reset link. Pick a new password to finish.</p>
            <form onSubmit={handleSubmit} noValidate>
              <label className="auth-field">
                <span>New password</span>
                <input
                  type="password"
                  value={password}
                  autoComplete="new-password"
                  autoFocus
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(error) || undefined}
                />
                <small>At least 8 characters</small>
              </label>
              {error && <p className="auth-message" role="alert">{error}</p>}
              <button className="auth-submit" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save password'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>That link has expired</h1>
            <p className="auth-solo__intro">
              Reset links can only be used once, and they time out. Request a fresh one from the login page.
            </p>
            <Link to="/login" className="auth-submit auth-solo__link">Back to log in</Link>
          </>
        )}
      </section>
    </main>
  )
}
