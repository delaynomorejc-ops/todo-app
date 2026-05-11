import { useState } from 'react'
import type { TaskList, Action } from '../types'
import { LogoMark } from './Logo'

interface Props {
  tasks: TaskList[]
  activeTaskId: string | null
  dispatch: React.Dispatch<Action>
}

function countCompleted(items: TaskList['items']): { total: number; completed: number } {
  let total = 0, completed = 0
  for (const item of items) {
    total++
    if (item.completed) completed++
    const sub = countCompleted(item.children)
    total += sub.total
    completed += sub.completed
  }
  return { total, completed }
}

function TaskRow({ task, active, dispatch }: { task: TaskList; active: boolean; dispatch: React.Dispatch<Action> }) {
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(task.name)
  const { total, completed } = countCompleted(task.items)

  const commitRename = () => {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== task.name) {
      dispatch({ type: 'RENAME_TASK', taskId: task.id, name: trimmed })
    } else {
      setEditName(task.name)
    }
    setEditing(false)
  }

  return (
    <div
      style={{
        ...styles.taskRow,
        background: active ? '#f4f4f4' : hovered ? '#f9f9f9' : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !editing && dispatch({ type: 'SELECT_TASK', taskId: task.id })}
    >
      <div style={styles.taskRowLeft}>
        {active && <span style={styles.activeBar} />}
        {editing ? (
          <input
            autoFocus
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') { setEditName(task.name); setEditing(false) }
            }}
            onClick={e => e.stopPropagation()}
            style={styles.renameInput}
          />
        ) : (
          <span
            style={{ ...styles.taskName, fontWeight: active ? 500 : 400 }}
            onDoubleClick={e => { e.stopPropagation(); setEditing(true); setEditName(task.name) }}
            title="Double-click to rename"
          >
            {task.name}
          </span>
        )}
      </div>
      <div style={styles.taskRowRight}>
        {total > 0 && !editing && (
          <span style={styles.count}>{completed}/{total}</span>
        )}
        {hovered && !editing && (
          <button
            style={styles.deleteBtn}
            onClick={e => {
              e.stopPropagation()
              dispatch({ type: 'DELETE_TASK', taskId: task.id })
            }}
            title="Delete task"
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export function Sidebar({ tasks, activeTaskId, dispatch }: Props) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  const submitNew = () => {
    const trimmed = newName.trim()
    if (trimmed) {
      dispatch({ type: 'ADD_TASK', name: trimmed })
    }
    setNewName('')
    setAdding(false)
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarTop}>
        <LogoMark size={26} color="#222" />
        <span style={styles.sidebarLabel}>Tasks</span>
      </div>

      <div style={styles.taskList}>
        {tasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            active={task.id === activeTaskId}
            dispatch={dispatch}
          />
        ))}
      </div>

      <div style={styles.sidebarBottom}>
        {adding ? (
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onBlur={submitNew}
            onKeyDown={e => {
              if (e.key === 'Enter') submitNew()
              if (e.key === 'Escape') { setNewName(''); setAdding(false) }
            }}
            placeholder="Task name…"
            style={styles.newTaskInput}
          />
        ) : (
          <button style={styles.newTaskBtn} onClick={() => setAdding(true)}>
            <svg width="11" height="11" viewBox="0 0 11 11" style={{ marginRight: 6, flexShrink: 0 }}>
              <line x1="5.5" y1="1" x2="5.5" y2="10" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="1" y1="5.5" x2="10" y2="5.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            New Task
          </button>
        )}
      </div>
    </aside>
  )
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 200,
    flexShrink: 0,
    borderRight: '1px solid #e8e8e8',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    paddingTop: 36,
  },
  sidebarTop: {
    padding: '0 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  sidebarLabel: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 13,
    color: '#aaa',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  taskList: {
    flex: 1,
    overflowY: 'auto',
  },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '7px 12px 7px 0',
    cursor: 'pointer',
    transition: 'background 0.1s',
    minHeight: 34,
    borderRadius: '0 3px 3px 0',
  },
  taskRowLeft: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    gap: 0,
  },
  activeBar: {
    display: 'inline-block',
    width: 2,
    height: 14,
    background: '#111',
    borderRadius: 1,
    flexShrink: 0,
    marginLeft: 12,
    marginRight: 8,
  },
  taskName: {
    fontSize: 14,
    color: '#111',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingLeft: 14,
    lineHeight: '1.4',
  },
  renameInput: {
    border: 'none',
    borderBottom: '1px solid #111',
    background: 'transparent',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    padding: '1px 0',
    color: '#111',
    width: '100%',
    marginLeft: 14,
  },
  taskRowRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
    minWidth: 32,
    justifyContent: 'flex-end',
  },
  count: {
    fontSize: 11,
    color: '#ccc',
    fontVariantNumeric: 'tabular-nums',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 2,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 2,
  },
  sidebarBottom: {
    padding: '12px 12px 32px',
    borderTop: '1px solid #f0f0f0',
  },
  newTaskBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    padding: '6px 0',
    width: '100%',
    transition: 'color 0.1s',
  },
  newTaskInput: {
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
    background: 'transparent',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    padding: '5px 0',
    color: '#111',
    width: '100%',
  },
}
