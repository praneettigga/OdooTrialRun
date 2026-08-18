import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/layout/Logo'
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

export function SignupPage() {
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

    if (result.error) {
      setFormError(result.error)
    } else if (result.hasSession) {
      navigate('/', { replace: true })
    } else {
      navigate('/login', {
        replace: true,
        state: { message: 'Check your email to confirm your account, then log in.' },
      })
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-between bg-primary px-6 py-8 text-ink sm:px-10 lg:px-14 lg:py-12">
        <Logo />
        <div className="py-12 lg:py-0">
          <h1 className="max-w-md font-display text-display-md uppercase">Give good things another life</h1>
          <p className="mt-5 max-w-sm text-lg text-ink-deep">Create an account to list what you no longer need and find what you do.</p>
        </div>
        <Link to="/" className="text-sm font-semibold text-ink underline-offset-4 hover:underline">Back to browsing</Link>
      </div>

      <div className="flex items-center justify-center bg-canvas px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <h2 className="font-display text-display-md">Create account</h2>
          <p className="mt-2 text-body">Your username appears beside the things you list.</p>
          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
            <Input label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} placeholder="you@example.com" />
            <Input label="Username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} error={errors.username} hint="2 to 40 characters" />
            <Input label="Password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} error={errors.password} hint="At least 8 characters" />
            {formError && <p role="alert" className="rounded-md bg-primary-pale px-4 py-3 text-sm font-medium text-ink-deep">{formError}</p>}
            <Button type="submit" size="lg" disabled={submitting} className="mt-1 w-full">{submitting ? 'Creating…' : 'Create account'}</Button>
          </form>
          <p className="mt-6 text-sm text-body">Already have an account? <Link to="/login" className="font-semibold text-ink underline underline-offset-4">Log in</Link></p>
        </div>
      </div>
    </div>
  )
}
