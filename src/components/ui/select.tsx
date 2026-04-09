'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { forwardRef } from 'react'

const Select = SelectPrimitive.Root
const SelectValue = SelectPrimitive.Value

const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '8px 12px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8,
      color: '#fff',
      fontSize: 13,
      cursor: 'pointer',
      outline: 'none',
      gap: 8,
      ...style,
    }}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>▼</SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position="popper"
      sideOffset={4}
      style={{
        background: '#1e1e2e',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 4,
        zIndex: 9999,
        minWidth: 'var(--radix-select-trigger-width)',
        maxHeight: 240,
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        ...style,
      }}
      {...props}
    >
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = 'SelectContent'

const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 10px',
      borderRadius: 6,
      color: 'rgba(255,255,255,0.8)',
      fontSize: 13,
      cursor: 'pointer',
      outline: 'none',
      userSelect: 'none',
      ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
