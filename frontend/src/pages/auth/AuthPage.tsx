import { Link, useLocation } from 'react-router-dom'
import { Logo } from '../../components/layout/Logo'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import './auth-page.css'

// Both /login and /signup render this component. Keeping the shell mounted lets
// the layout interpolate between modes instead of feeling like a new page.
export function AuthPage() {
  const location = useLocation()
  const mode = location.pathname === '/login' ? 'login' : 'signup'
  const isLogin = mode === 'login'

  const visual = isLogin
    ? {
        heading: 'Everything here already exists',
        copy: 'Sign in to list the things you have stopped using, and to find the ones someone else has.',
      }
    : {
        heading: 'Give good things another life',
        copy: 'Create an account to list what you no longer need and find what you do.',
      }

  return (
    <main className={`auth-shell auth-shell--${mode}`}>
      <section className="auth-visual" aria-labelledby="auth-visual-heading">
        <Logo />
        <div className="auth-visual__copy">
          <p className="auth-visual__eyebrow">Pass it forward</p>
          <h1 id="auth-visual-heading">{visual.heading}</h1>
          <p>{visual.copy}</p>
        </div>
        <Link to="/" className="auth-visual__back">
          Back to browsing
        </Link>
        <span className="auth-visual__orb auth-visual__orb--large" aria-hidden="true" />
        <span className="auth-visual__orb auth-visual__orb--small" aria-hidden="true" />
        <span className="auth-visual__loop" aria-hidden="true" />
      </section>

      <div className="auth-divider" aria-hidden="true" />

      <section className="auth-panel" aria-labelledby="auth-form-heading">
        <div className="auth-panel__inner" key={mode}>
          {isLogin ? (
            <LoginForm message={location.state?.message} />
          ) : (
            <SignupForm />
          )}
        </div>
      </section>
    </main>
  )
}
