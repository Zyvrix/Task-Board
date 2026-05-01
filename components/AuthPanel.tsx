'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { signInAction, signUpAction } from '@/app/actions'
import SubmitButton from '@/components/SubmitButton'

const initialState: { error?: string; success?: string } = {}

export default function AuthPanel() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [signInState, signInFormAction] = useFormState(signInAction, initialState)
  const [signUpState, signUpFormAction] = useFormState(signUpAction, initialState)

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <section className="max-w-2xl space-y-7">
          <span className="inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Full Stack Developer Assignment
          </span>
          <div>
            <h1 className="text-4xl font-semibold tracking-normal text-slate-950 sm:text-6xl">
              Build and manage your tasks.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              A complete full-stack task board with authentication, server-side data access,
              relational storage, and user-specific task management.
            </p>
          </div>
          <div className="grid max-w-xl gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <strong className="block text-slate-950">Backend</strong>
              Server actions
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <strong className="block text-slate-950">Database</strong>
              SQLite + Prisma
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <strong className="block text-slate-950">Security</strong>
              bcrypt + cookies
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-950">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {mode === 'signup'
                ? 'Sign up to create and manage your personal task board.'
                : 'Log in to continue to your task board.'}
            </p>
          </div>

          {mode === 'login' ? (
          <form
            action={signInFormAction}
            className="space-y-4"
          >
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            {signInState.error ? (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {signInState.error}
              </p>
            ) : null}

            <SubmitButton
              pendingLabel="Logging in..."
              className="w-full rounded-md bg-slate-950 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800"
            >
              Log in
            </SubmitButton>
          </form>
          ) : (
            <form action={signUpFormAction} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  name="name"
                  type="text"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              {signUpState.error ? (
                <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {signUpState.error}
                </p>
              ) : null}

              <SubmitButton
                pendingLabel="Creating account..."
                className="w-full rounded-md bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-700"
              >
                Sign up
              </SubmitButton>
            </form>
          )}

          <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                New to Task Board?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Create an account
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
