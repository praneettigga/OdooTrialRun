import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/layout/Logo'
import { requestPasswordReset, signIn, signUp } from '../../services/auth'
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

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // Mode is derived from the route, not held in state. Holding it locally let the
  // panel switch without the URL following, so a refresh or a Back press dropped
  // the visitor onto the other form and lost whatever they had typed.
  const mode: Mode = location.pathname === '/login' ? 'login' : 'signup'
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [username, setUsername] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [loginErrors, setLoginErrors] = useState<Errors>({})
  const [signupErrors, setSignupErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isReady, setIsReady] = useState(false)
  // Only a deliberate panel switch moves focus; landing on the page must not.
  const wantsFocus = useRef(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  // `inert` pulls focus off the outgoing panel, so hand it to the incoming form
  // rather than letting it drop to <body>. This has to wait for the render that
  // removes `inert` from the incoming panel — focusing inside a still-inert
  // container silently does nothing — hence an effect rather than a callback.
  useEffect(() => {
    if (!wantsFocus.current) return
    wantsFocus.current = false
    document.querySelector<HTMLInputElement>(`.${mode}-panel input`)?.focus()
  }, [mode])

  function switchMode(next: Mode) {
    setFormError(null)
    wantsFocus.current = true
    navigate(next === 'login' ? '/login' : '/signup')
  }

  // Reuses the email already typed into the login form rather than sending the
  // visitor to a separate page to type it again.
  async function handleForgotPassword() {
    setFormError(null)
    const invalid = validateLogin(loginEmail, 'placeholder').email
    if (invalid) {
      setLoginErrors({ ...loginErrors, email: 'Enter your email address first, then tap Forgot password.' })
      return
    }

    setSubmitting(true)
    const result = await requestPasswordReset(loginEmail.trim())
    setSubmitting(false)
    // Deliberately non-committal: Supabase succeeds for unregistered addresses
    // too, and saying "no such account" would leak who has one.
    setFormError(result.error ?? 'If that address has an account, a reset link is on its way.')
  }

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
    else { setFormError('Check your email to confirm your account, then log in.'); navigate('/login') }
  }

  const isLogin = mode === 'login'
  return <main className="auth-screen">
    <video className="auth-background-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
      <source src="/auth-background.mp4" type="video/mp4" />
    </video>
    <div className="auth-video-tint" aria-hidden="true" />
    <section className={`auth-card ${isLogin ? 'is-login' : 'is-signup'} ${isReady ? 'ready' : ''}`} aria-label="Account access">
      <form className="auth-form-panel signup-panel" onSubmit={handleSignup} noValidate inert={isLogin}>
        <div className="auth-form-content">
          <h1>Create account</h1><p>Your username appears beside the things you list.</p>
          <Field label="Username" value={username} autoComplete="username" onChange={(event) => setUsername(event.target.value)} error={signupErrors.username} hint="2 to 40 characters" />
          <Field label="Email" type="email" value={signupEmail} autoComplete="email" onChange={(event) => setSignupEmail(event.target.value)} error={signupErrors.email} />
          <Field label="Password" type="password" value={signupPassword} autoComplete="new-password" onChange={(event) => setSignupPassword(event.target.value)} error={signupErrors.password} hint="At least 8 characters" />
          {!isLogin && formError && <p className="auth-message" role="alert">{formError}</p>}
          <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button>
        </div>
      </form>

      <form className="auth-form-panel login-panel" onSubmit={handleLogin} noValidate inert={!isLogin}>
        <div className="auth-form-content">
          <h1>Welcome back</h1><p>Log in to pick up where you left off.</p>
          <Field label="Email" type="email" value={loginEmail} autoComplete="email" onChange={(event) => setLoginEmail(event.target.value)} error={loginErrors.email} />
          <Field label="Password" type="password" value={loginPassword} autoComplete="current-password" onChange={(event) => setLoginPassword(event.target.value)} error={loginErrors.password} />
          <button type="button" className="auth-forgot" onClick={() => void handleForgotPassword()} disabled={submitting}>
            Forgot password?
          </button>
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
