import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Logo } from '../../components/layout/Logo'
import { signIn } from '../../services/auth'

type Errors = { email?: string; password?: string }

function validate(email: string, password: string): Errors {
  const errors: Errors = {}

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (password === '') {
    errors.password = 'Enter your password.'
  }

  return errors
}

export function LoginPage() {
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
    else navigate('/', { replace: true })
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.1fr]">
      {/* Brand panel. Carries the hero band's lime through to the app edge. */}
      <div className="flex flex-col justify-between bg-primary px-6 py-8 text-ink sm:px-10 lg:px-14 lg:py-12">
        <Logo />
        <div className="py-12 lg:py-0">
          <h1 className="max-w-md font-display text-display-md uppercase">
            Everything here already exists
          </h1>
          <p className="mt-5 max-w-sm text-lg text-ink-deep">
            Sign in to list the things you have stopped using, and to find the ones someone else
            has.
          </p>
        </div>
        <Link
          to="/"
          className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
        >
          Back to browsing
        </Link>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-canvas px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <h2 className="font-display text-display-md">Log in</h2>
          <p className="mt-2 text-body">Welcome back. Pick up where you left off.</p>
          {location.state?.message && <p className="mt-4 rounded-md bg-primary-pale px-4 py-3 text-sm font-medium text-ink-deep">{location.state.message}</p>}

          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: undefined })
              }}
              error={errors.email}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors({ ...errors, password: undefined })
              }}
              error={errors.password}
            />

            {formError && (
              <p
                role="alert"
                className="rounded-md bg-primary-pale px-4 py-3 text-sm font-medium text-ink-deep"
              >
                {formError}
              </p>
            )}

            <Button type="submit" size="lg" disabled={submitting} className="mt-1 w-full">
              {submitting ? 'Checking…' : 'Log in'}
            </Button>
          </form>
          <p className="mt-6 text-sm text-body">New here? <Link to="/signup" className="font-semibold text-ink underline underline-offset-4">Create an account</Link></p>
        </div>
      </div>
    </div>
  )
}
