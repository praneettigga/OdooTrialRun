import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'ink' | 'ghost'
type Size = 'md' | 'lg'

// DESIGN.md: the primary action is always the highest-contrast pill against its
// own surface — lime on neutral, ink on lime. Never lime on lime.
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-ink hover:bg-primary-active',
  ink: 'bg-ink text-primary hover:bg-ink-deep',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
}

const SIZES: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold ' +
  'transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none'

function classes(variant: Variant, size: Size, className: string) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim()
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: Props) {
  return <button className={classes(variant, size, className)} {...props} />
}

type LinkProps = {
  to: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function ButtonLink({ to, variant = 'primary', size = 'md', className = '', children }: LinkProps) {
  return (
    <Link to={to} className={classes(variant, size, className)}>
      {children}
    </Link>
  )
}
