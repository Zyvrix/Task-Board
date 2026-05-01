'use client'

import { useFormStatus } from 'react-dom'

type SubmitButtonProps = {
  children: React.ReactNode
  pendingLabel?: string
  className?: string
}

export default function SubmitButton({
  children,
  pendingLabel = 'Working...',
  className = '',
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-65`}
    >
      {pending ? pendingLabel : children}
    </button>
  )
}
