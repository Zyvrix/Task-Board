import AuthPanel from '@/components/AuthPanel'
import TaskBoard from '@/components/TaskBoard'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    return <AuthPanel />
  }

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return <TaskBoard user={user} tasks={tasks} />
}
