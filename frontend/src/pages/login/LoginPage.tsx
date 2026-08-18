import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Logo } from '../../components/layout/Logo'

// ponytail: stub at the real signature. Swap for services/auth.signIn once the
// backend lane lands it in docs/SERVICES.md — the call site does not change.
// Fails closed on purpose: a fake session would pass the route guard and then
// lose hours to phantom 401s behind RLS (plan §6).
async function signIn(_email: string, _password: string): Promise<{ error: string | null }> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    error: 'Sign-in is not connected yet. Accounts arrive with the Supabase schema this stage.',
  }
}

type Errors = { identifier?: string; password?: string }

function validate(identifier: string, password: string): Errors {
  const errors: Errors = {}

  if (identifier.trim() === '') {
    errors.identifier = 'Enter your email or username.'
  } else if (identifier.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
    errors.identifier = 'That email address is not complete.'
  }

  if (password === '') {
    errors.password = 'Enter your password.'
  }

  return errors
}

export function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const found = validate(identifier, password)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    const { error } = await signIn(identifier.trim(), password)
    setSubmitting(false)

    // On success this redirects to the dashboard — that route lands in Stage 3.
    if (error) setFormError(error)
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

          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
            <Input
              label="Email or username"
              type="text"
              value={identifier}
              autoComplete="username"
              onChange={(e) => {
                setIdentifier(e.target.value)
                if (errors.identifier) setErrors({ ...errors, identifier: undefined })
              }}
              error={errors.identifier}
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
        </div>
      </div>
    </div>
  )
}
