import type { TaskList } from './types'

const BASE = import.meta.env.VITE_API_BASE ?? ''

export async function fetchTasks(): Promise<TaskList[]> {
  const res = await fetch(`${BASE}/api/todos`)
  if (!res.ok) throw new Error('Failed to fetch')
  const data = await res.json()
  return data.tasks ?? []
}

export async function saveTasks(tasks: TaskList[]): Promise<void> {
  const res = await fetch(`${BASE}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks }),
  })
  if (!res.ok) throw new Error('Failed to save')
}
