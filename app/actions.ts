'use server'

import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getCurrentUser, getSessionExpiry, SESSION_COOKIE } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const authSchema = z.object({
  name: z.string().trim().max(80).optional(),
  email: z.string().trim().email('Use a valid email address.').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

const taskSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required.').max(120),
})

const statusSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum(['Todo', 'In Progress', 'Done']),
})

type ActionState = {
  error?: string
  success?: string
}

async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = getSessionExpiry()

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  })
}

export async function signUpAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = authSchema.safeParse({
    name: formData.get('name') || undefined,
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Check your details.' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })

  if (existingUser) {
    return { error: 'An account with this email already exists.' }
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name || null,
      email: parsed.data.email,
      passwordHash,
    },
  })

  await createSession(user.id)
  revalidatePath('/')
  return { success: 'Account created.' }
}

export async function signInAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = authSchema.omit({ name: true }).safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Check your details.' }
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })

  if (!user) {
    return { error: 'Invalid email or password.' }
  }

  const isValidPassword = await bcrypt.compare(parsed.data.password, user.passwordHash)

  if (!isValidPassword) {
    return { error: 'Invalid email or password.' }
  }

  await createSession(user.id)
  revalidatePath('/')
  return { success: 'Signed in.' }
}

export async function signOutAction() {
  const token = cookies().get(SESSION_COOKIE)?.value

  if (token) {
    await prisma.session.deleteMany({ where: { token } })
  }

  cookies().delete(SESSION_COOKIE)
  revalidatePath('/')
}

export async function createTaskAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser()

  if (!user) {
    return { error: 'Please sign in again.' }
  }

  const parsed = taskSchema.safeParse({
    title: formData.get('title'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Task title is required.' }
  }

  await prisma.task.create({
    data: {
      title: parsed.data.title,
      userId: user.id,
    },
  })

  revalidatePath('/')
  return { success: 'Task created.' }
}

export async function updateTaskStatusAction(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return
  }

  const parsed = statusSchema.safeParse({
    taskId: formData.get('taskId'),
    status: formData.get('status'),
  })

  if (!parsed.success) {
    return
  }

  await prisma.task.updateMany({
    where: {
      id: parsed.data.taskId,
      userId: user.id,
    },
    data: {
      status: parsed.data.status,
    },
  })

  revalidatePath('/')
}
