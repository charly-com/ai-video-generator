// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatNGN(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function truncate(str: string, len = 100): string {
  return str.length > len ? `${str.slice(0, len)}…` : str
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return d.toLocaleDateString()
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    youtube: '#FF0000', instagram: '#E1306C', tiktok: '#010101',
    twitter: '#1DA1F2', linkedin: '#0A66C2', facebook: '#1877F2',
  }
  return colors[platform] ?? '#f97316'
}

export function getPlatformEmoji(platform: string): string {
  const emojis: Record<string, string> = {
    youtube: '▶️', instagram: '📸', tiktok: '🎵',
    twitter: '🐦', linkedin: '💼', facebook: '👤',
  }
  return emojis[platform] ?? '🌐'
}
