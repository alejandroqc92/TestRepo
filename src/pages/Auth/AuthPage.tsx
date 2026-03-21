import { useState, type FormEvent } from 'react'
import { useAuth } from '@/store/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const fn = mode === 'signin' ? signIn : signUp
    const { error: err } = await fn(email, password)
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <div className="min-h-svh bg-notion-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-notion-text mb-1">
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </h1>
        <p className="text-sm text-notion-text-secondary mb-8">
          {mode === 'signin' ? 'Welcome back.' : 'Start tracking your workouts.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />

          {error && (
            <p className="text-xs text-notion-red">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-1"
          >
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <p className="text-sm text-notion-text-secondary text-center mt-6">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}
            className="text-notion-text underline underline-offset-2"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
