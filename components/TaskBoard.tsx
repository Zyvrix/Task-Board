import { signOutAction, updateTaskStatusAction } from '@/app/actions'
import TaskForm from '@/components/TaskForm'

type Task = {
  id: string
  title: string
  status: string
  createdAt: Date
}

type User = {
  id: string
  name: string | null
  email: string
}

type TaskBoardProps = {
  user: User
  tasks: Task[]
}

const statuses = ['Todo', 'In Progress', 'Done'] as const

const statusStyles: Record<string, string> = {
  Todo: 'border-slate-200 bg-slate-50 text-slate-700',
  'In Progress': 'border-amber-200 bg-amber-50 text-amber-800',
  Done: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

export default function TaskBoard({ user, tasks }: TaskBoardProps) {
  const counts = statuses.map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }))

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">Task Board</h1>
            <p className="mt-1 text-sm text-slate-500">
              {user.name ? `${user.name} · ${user.email}` : user.email}
            </p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 md:w-auto"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-8">
        <aside className="space-y-4">
          <TaskForm />

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">
              Status overview
            </h2>
            <div className="mt-4 grid gap-3">
              {counts.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                >
                  <span className="text-sm font-medium text-slate-700">{item.status}</span>
                  <span className="text-sm text-slate-500">{item.count}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold">Your tasks</h2>
            <p className="mt-1 text-sm text-slate-500">
              Create tasks and move them through the required statuses.
            </p>
          </div>

          {tasks.length === 0 ? (
            <div className="flex min-h-72 items-center justify-center px-5 py-16 text-center">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">No tasks yet</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Add your first task from the form. It will start as Todo by default.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {tasks.map((task) => (
                <article
                  key={task.id}
                  className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_190px]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words text-base font-semibold text-slate-950">
                        {task.title}
                      </h3>
                      <span
                        className={`rounded-md border px-2 py-1 text-xs font-medium ${
                          statusStyles[task.status] ?? statusStyles.Todo
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Created {task.createdAt.toLocaleDateString()}
                    </p>
                  </div>

                  <form action={updateTaskStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="taskId" value={task.id} />
                    <select
                      name="status"
                      defaultValue={task.status}
                      className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="min-h-10 rounded-md bg-slate-950 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
