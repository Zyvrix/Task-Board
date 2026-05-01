import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const SESSION_COOKIE = 'task_board_session'
const SESSION_DAYS = 7

export function getSessionExpiry() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
}

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value

  if (!token) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } })
    }
    return null
  }

  return session.user
}
