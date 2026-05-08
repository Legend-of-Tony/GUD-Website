import type { FormEvent } from 'react'
import { PasswordInput, TextInput } from './AdminFields'

type AdminLoginViewProps = {
  email: string
  password: string
  error: string
  isSigningIn: boolean
  onClose: () => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function AdminLoginView({
  email,
  password,
  error,
  isSigningIn,
  onClose,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginViewProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Admin Sign In</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Protected CMS access</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Sign in with a Supabase user account before editing services, images, or site content.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <TextInput label="Email" value={email} onChange={onEmailChange} />
          <PasswordInput label="Password" value={password} onChange={onPasswordChange} />

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Back to Site
            </button>
            <button
              type="submit"
              disabled={isSigningIn}
              className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningIn ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
