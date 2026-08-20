import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/layout/Logo'
import { signIn, signUp } from '../../services/auth'
import './AuthPage.css'

type Mode = 'signup' | 'login'
type Errors = { email?: string; username?: string; password?: string }

function validateLogin(email: string, password: string): Errors {
  const errors: Errors = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Enter your password.'
  return errors
}

function validateSignup(email: string, username: string, password: string): Errors {
  const errors = validateLogin(email, password)
  if (username.trim().length < 2 || username.trim().length > 40) errors.username = 'Username must be 2 to 40 characters.'
  if (password.length > 0 && password.length < 8) errors.password = 'Use at least 8 characters.'
  return errors
}

function Field({ label, hint, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  return <label className="auth-field"><span>{label}</span><input {...props} aria-invalid={Boolean(error) || undefined} />{error ? <small className="auth-error">{error}</small> : hint ? <small>{hint}</small> : null}</label>
}

export function AuthPage({ initialMode = 'signup' }: { initialMode?: Mode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [username, setUsername] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [loginErrors, setLoginErrors] = useState<Errors>({})
  const [signupErrors, setSignupErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function switchMode(next: Mode) { setFormError(null); setMode(next) }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormError(null)
    const errors = validateLogin(loginEmail, loginPassword); setLoginErrors(errors)
    if (Object.keys(errors).length) return
    setSubmitting(true)
    const { error } = await signIn(loginEmail.trim(), loginPassword)
    setSubmitting(false)
    if (error) setFormError(error)
    else navigate(typeof location.state?.from === 'string' ? location.state.from : '/', { replace: true })
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormError(null)
    const errors = validateSignup(signupEmail, username, signupPassword); setSignupErrors(errors)
    if (Object.keys(errors).length) return
    setSubmitting(true)
    const result = await signUp(signupEmail.trim(), signupPassword, username.trim())
    setSubmitting(false)
    if (result.error) setFormError(result.error)
    else if (result.hasSession) navigate('/', { replace: true })
    else { setFormError('Check your email to confirm your account, then log in.'); setMode('login') }
  }

  const isLogin = mode === 'login'
  return <main className="auth-screen">
    <section className={`auth-card ${isLogin ? 'is-login' : 'is-signup'}`} aria-label="Account access">
      <form className="auth-form-panel signup-panel" onSubmit={handleSignup} noValidate aria-hidden={isLogin}>
        <div className="auth-form-content">
          <h1>Create account</h1><p>Your username appears beside the things you list.</p>
          <Field label="Username" value={username} autoComplete="username" onChange={(event) => setUsername(event.target.value)} error={signupErrors.username} hint="2 to 40 characters" />
          <Field label="Email" type="email" value={signupEmail} autoComplete="email" onChange={(event) => setSignupEmail(event.target.value)} error={signupErrors.email} />
          <Field label="Password" type="password" value={signupPassword} autoComplete="new-password" onChange={(event) => setSignupPassword(event.target.value)} error={signupErrors.password} hint="At least 8 characters" />
          {!isLogin && formError && <p className="auth-message" role="alert">{formError}</p>}
          <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button>
        </div>
      </form>

      <form className="auth-form-panel login-panel" onSubmit={handleLogin} noValidate aria-hidden={!isLogin}>
        <div className="auth-form-content">
          <h1>Welcome back</h1><p>Log in to pick up where you left off.</p>
          <Field label="Email" type="email" value={loginEmail} autoComplete="email" onChange={(event) => setLoginEmail(event.target.value)} error={loginErrors.email} />
          <Field label="Password" type="password" value={loginPassword} autoComplete="current-password" onChange={(event) => setLoginPassword(event.target.value)} error={loginErrors.password} />
          <span className="auth-forgot">Forgot password?</span>
          {isLogin && formError && <p className="auth-message" role="alert">{formError}</p>}
          <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'Checking…' : 'Log in'}</button>
        </div>
      </form>

      <aside className="auth-overlay" aria-live="polite">
        <div className="overlay-content overlay-signup"><Logo /><h2>Welcome back!</h2><p>Already have an account?</p><button type="button" onClick={() => switchMode('login')}>Log in <span>→</span></button></div>
        <div className="overlay-content overlay-login"><Logo /><h2>Hello, welcome!</h2><p>Don't have an account?</p><button type="button" onClick={() => switchMode('signup')}>Register <span>→</span></button></div>
        <Link to="/" className="auth-back">Back to browsing</Link>
      </aside>
    </section>
  </main>
}
