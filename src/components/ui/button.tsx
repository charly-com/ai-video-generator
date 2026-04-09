'use client'

import { forwardRef } from 'react'

type Variant = 'default' | 'outline' | 'ghost' | 'destructive'
type Size = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  default: {
    background: 'linear-gradient(135deg,#f97316,#ec4899)',
    color: '#fff',
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  ghost: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    border: 'none',
  },
  destructive: {
    background: 'rgba(239,68,68,0.1)',
    color: '#EF4444',
    border: '1px solid rgba(239,68,68,0.2)',
  },
}

const sizeStyles: Record<Size, React.CSSProperties> = {
  default: { padding: '9px 18px', fontSize: 13 },
  sm: { padding: '6px 12px', fontSize: 12 },
  lg: { padding: '12px 24px', fontSize: 15 },
  icon: { padding: '8px', width: 36, height: 36 },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', asChild, children, style, disabled, ...props }, ref) => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 9,
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'all 0.15s',
      whiteSpace: 'nowrap',
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    }

    // asChild: render the single child, passing button props to it
    if (asChild && children && typeof children === 'object') {
      const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>
      return (
        <child.type
          {...child.props}
          style={{ ...base, textDecoration: 'none', ...child.props.style }}
        />
      )
    }

    return (
      <button ref={ref} disabled={disabled} style={base} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
