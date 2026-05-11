export interface TodoItem {
  id: string
  text: string
  completed: boolean
  collapsed: boolean
  children: TodoItem[]
  createdAt: string
  notes?: string
  deadline?: string  // ISO date string YYYY-MM-DD
}

export interface TaskList {
  id: string
  name: string
  items: TodoItem[]
  createdAt: string
}

export type Action =
  // Task-level
  | { type: 'LOAD'; payload: TaskList[] }
  | { type: 'ADD_TASK'; name: string }
  | { type: 'RENAME_TASK'; taskId: string; name: string }
  | { type: 'DELETE_TASK'; taskId: string }
  | { type: 'SELECT_TASK'; taskId: string }
  // Item-level (operates on active task)
  | { type: 'ADD'; parentId: string | null; text: string }
  | { type: 'TOGGLE_COMPLETE'; id: string }
  | { type: 'TOGGLE_COLLAPSE'; id: string }
  | { type: 'EDIT'; id: string; text: string }
  | { type: 'DELETE'; id: string }
  | { type: 'SET_NOTES'; id: string; notes: string }
  | { type: 'SET_DEADLINE'; id: string; deadline: string }
  | { type: 'SET_STATUS'; status: SaveStatus }

export type SaveStatus = 'idle' | 'syncing' | 'error'

export interface State {
  tasks: TaskList[]
  activeTaskId: string | null
  status: SaveStatus
  loaded: boolean
}
