// src/app/auth/signup/page.tsx - same as login for OAuth apps
import { redirect } from 'next/navigation'
export default function SignupPage() { redirect('/auth/login') }
