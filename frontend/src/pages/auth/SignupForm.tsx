import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { signUp } from '../../services/auth'

type Errors = { email?: string; username?: string; password?: string }

function validate(email: string, username: string, password: string): Errors {
  const errors: Errors = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
  if (username.trim().length < 2 || username.trim().length > 40) errors.username = 'Username must be 2 to 40 characters.'
  if (password.length < 8) errors.password = 'Use at least 8 characters.'
  return errors
}

export function SignupForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(email.trim(), username.trim(), password)
    setErrors(found)
    setFormError(null)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    const result = await signUp(email.trim(), password, username.trim())
    setSubmitting(false)
    if (result.error) setFormError(result.error)
    else if (result.hasSession) navigate('/', { replace: true })
    else navigate('/login', { replace: true, state: { message: 'Check your email to confirm your account, then log in.' } })
  }

  return (
    <>
      <h2 id="auth-form-heading">Create account</h2>
      <p className="auth-panel__intro">Your username appears beside the things you list.</p>
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <Input label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} placeholder="you@example.com" />
        <Input label="Username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} error={errors.username} hint="2 to 40 characters" />
        <Input label="Password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} error={errors.password} hint="At least 8 characters" />
        {formError && <p role="alert" className="auth-panel__notice">{formError}</p>}
        <Button type="submit" size="lg" disabled={submitting} className="mt-1 w-full">{submitting ? 'Creating…' : 'Create account'}</Button>
      </form>
      <p className="auth-panel__switch">Already have an account? <Link to="/login">Log in</Link></p>
    </>
  )
}
