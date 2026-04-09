'use client'

import { forwardRef } from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ style, className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={className}
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        color: '#fff',
        fontSize: 13,
        padding: '10px 12px',
        resize: 'vertical',
        outline: 'none',
        boxSizing: 'border-box',
        lineHeight: 1.5,
        fontFamily: 'inherit',
        ...style,
      }}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
