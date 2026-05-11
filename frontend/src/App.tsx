import { useState, useEffect } from 'react'
import { useTodos } from './hooks/useTodos'
import { Header } from './components/Header'
import { TodoTree } from './components/TodoTree'
import { Sidebar } from './components/Sidebar'
import { DetailPanel } from './components/DetailPanel'
import type { TodoItem } from './types'

function countItems(items: TodoItem[]): { total: number; completed: number } {
  let total = 0, completed = 0
  for (const item of items) {
    total++
    if (item.completed) completed++
    const sub = countItems(item.children)
    total += sub.total
    completed += sub.completed
  }
  return { total, completed }
}

function findItem(items: TodoItem[], id: string): TodoItem | null {
  for (const item of items) {
    if (item.id === id) return item
    const found = findItem(item.children, id)
    if (found) return found
  }
  return null
}

export function App() {
  const { state, dispatch } = useTodos()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const activeTask = state.tasks.find(t => t.id === state.activeTaskId) ?? null
  const { total, completed } = countItems(activeTask?.items ?? [])

  // reset selection when switching tasks
  useEffect(() => { setSelectedId(null) }, [state.activeTaskId])

  const selectedItem = selectedId && activeTask ? findItem(activeTask.items, selectedId) : null

  // clear selection if item was deleted
  useEffect(() => {
    if (selectedId && !selectedItem) setSelectedId(null)
  }, [selectedId, selectedItem])

  return (
    <div style={styles.layout}>
      <Sidebar tasks={state.tasks} activeTaskId={state.activeTaskId} dispatch={dispatch} />

      <main style={styles.main}>
        {!state.loaded ? (
          <div style={styles.center}>Loading…</div>
        ) : !activeTask ? (
          <div style={styles.center}>
            <EmptyState onAdd={() => dispatch({ type: 'ADD_TASK', name: 'New Task' })} />
          </div>
        ) : (
          <>
            <div style={styles.treeArea}>
              <Header
                taskName={activeTask.name}
                status={state.status}
                totalCount={total}
                completedCount={completed}
              />
              <TodoTree
                items={activeTask.items}
                dispatch={dispatch}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            <DetailPanel item={selectedItem} dispatch={dispatch} />
          </>
        )}
      </main>
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={styles.emptyInner}>
      <PlantSvg />
      <p style={styles.emptyText}>No tasks yet</p>
      <button style={styles.emptyBtn} onClick={onAdd}>Create a task</button>
    </div>
  )
}

function PlantSvg() {
  return (
    <svg width="48" height="60" viewBox="0 0 28 36" fill="none" stroke="#ddd" strokeWidth="1.2" strokeLinecap="round" style={{ display: 'block', margin: '0 auto 20px' }}>
      <line x1="14" y1="34" x2="14" y2="14" />
      <path d="M14 22 Q8 18 6 12 Q12 12 14 18" />
      <path d="M14 26 Q20 22 22 16 Q16 15 14 22" />
      <path d="M14 18 Q11 13 12 8 Q16 10 14 16" />
    </svg>
  )
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#fff',
  },
  main: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
  },
  treeArea: {
    flex: 1,
    minWidth: 0,
    padding: '0 32px 80px',
    maxWidth: 520,
  },
  center: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyInner: {
    textAlign: 'center',
  },
  emptyText: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 16,
  },
  emptyBtn: {
    background: 'none',
    border: '1px solid #e0e0e0',
    borderRadius: 3,
    padding: '7px 16px',
    fontSize: 13,
    color: '#888',
    cursor: 'pointer',
  },
}
