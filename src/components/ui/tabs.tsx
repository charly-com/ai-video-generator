'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { forwardRef } from 'react'

const Tabs = TabsPrimitive.Root

const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ style, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    style={{
      display: 'inline-flex',
      gap: 4,
      padding: 4,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      ...style,
    }}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ style, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    style={{
      padding: '7px 16px',
      borderRadius: 8,
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,0.4)',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s',
      whiteSpace: 'nowrap',
      ...style,
    }}
    onMouseEnter={e => {
      const el = e.currentTarget
      if (el.getAttribute('data-state') !== 'active') {
        el.style.color = 'rgba(255,255,255,0.7)'
        el.style.background = 'rgba(255,255,255,0.04)'
      }
    }}
    onMouseLeave={e => {
      const el = e.currentTarget
      if (el.getAttribute('data-state') !== 'active') {
        el.style.color = 'rgba(255,255,255,0.4)'
        el.style.background = 'transparent'
      }
    }}
    data-state-active-styles="true"
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ style, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    style={{ outline: 'none', ...style }}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
