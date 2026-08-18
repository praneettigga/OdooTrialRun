import type { SelectHTMLAttributes } from 'react'
import { useId } from 'react'

// --chevron is defined in index.css so the arrow needs no icon dependency.
export const SELECT_CLASS =
  'w-full appearance-none rounded-xl border border-ink/20 bg-canvas py-2.5 pl-4 pr-10 text-sm ' +
  'font-semibold text-ink transition-colors duration-150 hover:border-ink/50 ' +
  'bg-[image:var(--chevron)] bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  /** Keeps the label for screen readers but hides it — for toolbar selects. */
  hideLabel?: boolean
  error?: string
  options: readonly { value: string; label: string }[]
}

export function Select({ label, hideLabel, error, options, className = '', ...props }: Props) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={hideLabel ? 'sr-only' : 'text-sm font-semibold text-ink'}
      >
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${SELECT_CLASS} ${error ? 'border-negative' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-sm font-medium text-negative-deep">
          {error}
        </p>
      )}
    </div>
  )
}
