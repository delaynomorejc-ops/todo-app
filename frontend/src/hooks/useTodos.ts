import { useReducer, useEffect, useRef } from 'react'
import type { TodoItem, TaskList, Action, State } from '../types'
import { fetchTasks, saveTasks } from '../api'

function makeItem(text: string): TodoItem {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    collapsed: false,
    children: [],
    createdAt: new Date().toISOString(),
  }
}

function findAndUpdate(items: TodoItem[], id: string, updater: (item: TodoItem) => TodoItem): TodoItem[] {
  return items.map(item => {
    if (item.id === id) return updater(item)
    return { ...item, children: findAndUpdate(item.children, id, updater) }
  })
}

function findAndDelete(items: TodoItem[], id: string): TodoItem[] {
  return items
    .filter(item => item.id !== id)
    .map(item => ({ ...item, children: findAndDelete(item.children, id) }))
}

function addChild(items: TodoItem[], parentId: string | null, newItem: TodoItem): TodoItem[] {
  if (parentId === null) return [...items, newItem]
  return items.map(item => {
    if (item.id === parentId) return { ...item, children: [...item.children, newItem], collapsed: false }
    return { ...item, children: addChild(item.children, parentId, newItem) }
  })
}

function updateActiveItems(state: State, updater: (items: TodoItem[]) => TodoItem[]): State {
  if (!state.activeTaskId) return state
  return {
    ...state,
    tasks: state.tasks.map(t =>
      t.id === state.activeTaskId ? { ...t, items: updater(t.items) } : t
    ),
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD': {
      const tasks = action.payload
      return {
        ...state,
        tasks,
        activeTaskId: tasks.length > 0 ? tasks[0].id : null,
        loaded: true,
      }
    }
    case 'ADD_TASK': {
      const newTask: TaskList = {
        id: crypto.randomUUID(),
        name: action.name.trim(),
        items: [],
        createdAt: new Date().toISOString(),
      }
      return { ...state, tasks: [...state.tasks, newTask], activeTaskId: newTask.id }
    }
    case 'RENAME_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.taskId ? { ...t, name: action.name.trim() } : t
        ),
      }
    case 'DELETE_TASK': {
      const remaining = state.tasks.filter(t => t.id !== action.taskId)
      let nextActive = state.activeTaskId
      if (state.activeTaskId === action.taskId) {
        const idx = state.tasks.findIndex(t => t.id === action.taskId)
        nextActive = remaining[Math.min(idx, remaining.length - 1)]?.id ?? null
      }
      return { ...state, tasks: remaining, activeTaskId: nextActive }
    }
    case 'SELECT_TASK':
      return { ...state, activeTaskId: action.taskId }
    case 'ADD': {
      const newItem = makeItem(action.text)
      return updateActiveItems(state, items => addChild(items, action.parentId, newItem))
    }
    case 'TOGGLE_COMPLETE':
      return updateActiveItems(state, items =>
        findAndUpdate(items, action.id, item => ({ ...item, completed: !item.completed }))
      )
    case 'TOGGLE_COLLAPSE':
      return updateActiveItems(state, items =>
        findAndUpdate(items, action.id, item => ({ ...item, collapsed: !item.collapsed }))
      )
    case 'EDIT':
      return updateActiveItems(state, items =>
        findAndUpdate(items, action.id, item => ({ ...item, text: action.text }))
      )
    case 'DELETE':
      return updateActiveItems(state, items => findAndDelete(items, action.id))
    case 'SET_NOTES':
      return updateActiveItems(state, items =>
        findAndUpdate(items, action.id, item => ({ ...item, notes: action.notes }))
      )
    case 'SET_DEADLINE':
      return updateActiveItems(state, items =>
        findAndUpdate(items, action.id, item => ({ ...item, deadline: action.deadline || undefined }))
      )
    case 'SET_STATUS':
      return { ...state, status: action.status }
    default:
      return state
  }
}

const initialState: State = { tasks: [], activeTaskId: null, status: 'idle', loaded: false }

export function useTodos() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    fetchTasks()
      .then(tasks => dispatch({ type: 'LOAD', payload: tasks }))
      .catch(() => dispatch({ type: 'SET_STATUS', status: 'error' }))
  }, [])

  useEffect(() => {
    if (!state.loaded) return
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      dispatch({ type: 'SET_STATUS', status: 'syncing' })
      saveTasks(state.tasks)
        .then(() => dispatch({ type: 'SET_STATUS', status: 'idle' }))
        .catch(() => dispatch({ type: 'SET_STATUS', status: 'error' }))
    }, 600)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [state.tasks, state.loaded])

  return { state, dispatch }
}
