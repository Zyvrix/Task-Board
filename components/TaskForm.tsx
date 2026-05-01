'use client'

import { useEffect, useRef } from 'react'
import { useFormState } from 'react-dom'
import { createTaskAction } from '@/app/actions'
import SubmitButton from '@/components/SubmitButton'

const initialState: { error?: string; success?: string } = {}

export default function TaskForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useFormState(createTaskAction, initialState)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Create task</h2>
      <form ref={formRef} action={formAction} className="mt-4 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            name="title"
            type="text"
            required
            maxLength={120}
            placeholder="Write API validation"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        {state.error ? (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.error}</p>
        ) : null}

        <SubmitButton
          pendingLabel="Adding..."
          className="w-full rounded-md bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-700"
        >
          Add task
        </SubmitButton>
      </form>
    </section>
  )
}
