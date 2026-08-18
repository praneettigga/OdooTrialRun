import type { InputHTMLAttributes } from 'react'
import { useId } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className = '', ...props }: Props) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={
          'w-full rounded-md border bg-canvas px-4 py-3 text-base text-ink ' +
          'placeholder:text-mute transition-colors duration-150 ' +
          (error ? 'border-negative' : 'border-ink/25 hover:border-ink/50') +
          ' ' +
          className
        }
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="text-sm text-mute">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-medium text-negative-deep">
          {error}
        </p>
      )}
    </div>
  )
}
