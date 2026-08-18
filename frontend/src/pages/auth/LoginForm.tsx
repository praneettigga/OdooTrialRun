import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { signIn } from '../../services/auth'

type Errors = { email?: string; password?: string }

function validate(email: string, password: string): Errors {
  const errors: Errors = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Enter a valid email address.'
  if (password === '') errors.password = 'Enter your password.'
  return errors
}

export function LoginForm({ message }: { message?: unknown }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    const found = validate(email, password)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    const { error } = await signIn(email.trim(), password)
    setSubmitting(false)
    if (error) setFormError(error)
    else {
      const from = typeof location.state?.from === 'string' ? location.state.from : '/'
      navigate(from, { replace: true })
    }
  }

  return (
    <>
      <h2 id="auth-form-heading">Log in</h2>
      <p className="auth-panel__intro">Welcome back. Pick up where you left off.</p>
      {typeof message === 'string' && <p className="auth-panel__notice">{message}</p>}
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <Input label="Email" type="email" value={email} autoComplete="email" onChange={(event) => { setEmail(event.target.value); if (errors.email) setErrors({ ...errors, email: undefined }) }} error={errors.email} placeholder="you@example.com" />
        <Input label="Password" type="password" value={password} autoComplete="current-password" onChange={(event) => { setPassword(event.target.value); if (errors.password) setErrors({ ...errors, password: undefined }) }} error={errors.password} />
        {formError && <p role="alert" className="auth-panel__notice">{formError}</p>}
        <Button type="submit" size="lg" disabled={submitting} className="mt-1 w-full">{submitting ? 'Checking…' : 'Log in'}</Button>
      </form>
      <p className="auth-panel__switch">New here? <Link to="/signup">Create an account</Link></p>
    </>
  )
}
