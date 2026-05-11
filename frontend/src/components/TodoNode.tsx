import { useState, useRef, useEffect } from 'react'
import type { TodoItem, Action } from '../types'
import { CollapseIcon } from './CollapseIcon'
import { AddItemRow } from './AddItemRow'

interface Props {
  item: TodoItem
  depth: number
  dispatch: React.Dispatch<Action>
  selectedId: string | null
  onSelect: (id: string) => void
}

function formatDeadline(deadline: string): { label: string; overdue: boolean } {
  const d = new Date(deadline + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdue = d < today
  const label = d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
  return { label, overdue }
}

export function TodoNode({ item, depth, dispatch, selectedId, onSelect }: Props) {
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(item.text)
  const [addingChild, setAddingChild] = useState(false)
  const editRef = useRef<HTMLInputElement>(null)

  const selected = selectedId === item.id

  useEffect(() => {
    if (editing && editRef.current) editRef.current.select()
  }, [editing])

  const commitEdit = () => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== item.text) {
      dispatch({ type: 'EDIT', id: item.id, text: trimmed })
    } else {
      setEditText(item.text)
    }
    setEditing(false)
  }

  const indent = depth * 20

  let rowBg = 'transparent'
  if (selected) rowBg = '#efefef'
  else if (hovered) rowBg = '#f7f7f7'

  return (
    <div>
      <div
        style={{ ...styles.row, paddingLeft: indent, background: rowBg }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => !editing && onSelect(item.id)}
      >
        <div style={styles.leftSlot}>
          {item.children.length > 0 ? (
            <CollapseIcon
              collapsed={item.collapsed}
              onClick={() => dispatch({ type: 'TOGGLE_COLLAPSE', id: item.id })}
            />
          ) : (
            <span style={styles.collapseGhost} />
          )}
        </div>

        <div
          style={{ ...styles.checkbox, borderColor: item.completed ? '#bbb' : '#888' }}
          onClick={e => { e.stopPropagation(); dispatch({ type: 'TOGGLE_COMPLETE', id: item.id }) }}
        >
          {item.completed && (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <line x1="1.5" y1="5" x2="4" y2="7.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="7.5" x2="8.5" y2="2.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <div style={styles.textArea}>
          {editing ? (
            <input
              ref={editRef}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => {
                if (e.key === 'Enter') commitEdit()
                if (e.key === 'Escape') { setEditText(item.text); setEditing(false) }
              }}
              onClick={e => e.stopPropagation()}
              style={styles.editInput}
            />
          ) : (
            <span
              style={{
                ...styles.text,
                color: item.completed ? '#aaa' : '#111',
                textDecoration: item.completed ? 'line-through' : 'none',
              }}
              onDoubleClick={e => { e.stopPropagation(); setEditing(true); setEditText(item.text) }}
            >
              {item.text}
            </span>
          )}

          {item.deadline && !editing && (() => {
            const { label, overdue } = formatDeadline(item.deadline)
            return (
              <span style={{
                ...styles.deadlinePill,
                color: overdue && !item.completed ? '#999' : '#c8c8c8',
                borderColor: overdue && !item.completed ? '#d0d0d0' : '#e8e8e8',
              }}>
                {label}
              </span>
            )
          })()}
        </div>

        <div style={{ ...styles.actions, opacity: hovered || selected ? 1 : 0 }}>
          <button
            style={styles.actionBtn}
            onClick={e => { e.stopPropagation(); setAddingChild(v => !v) }}
            title="Add child item"
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <line x1="6" y1="1" x2="6" y2="11" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="1" y1="6" x2="11" y2="6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            style={styles.actionBtn}
            onClick={e => { e.stopPropagation(); dispatch({ type: 'DELETE', id: item.id }) }}
            title="Delete item"
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <line x1="2" y1="2" x2="10" y2="10" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="10" y1="2" x2="2" y2="10" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {addingChild && (
        <AddItemRow
          depth={depth + 1}
          placeholder="Add child item…"
          onAdd={text => {
            dispatch({ type: 'ADD', parentId: item.id, text })
            setAddingChild(false)
          }}
        />
      )}

      {!item.collapsed && item.children.length > 0 && (
        <div>
          {item.children.map(child => (
            <TodoNode
              key={child.id}
              item={child}
              depth={depth + 1}
              dispatch={dispatch}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 8px 5px 0',
    transition: 'background 0.1s',
    borderRadius: 2,
    minHeight: 32,
    cursor: 'pointer',
  },
  leftSlot: {
    width: 18,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  collapseGhost: {
    display: 'inline-block',
    width: 18,
  },
  checkbox: {
    width: 16,
    height: 16,
    border: '1.5px solid #888',
    borderRadius: 2,
    flexShrink: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    transition: 'border-color 0.1s',
  },
  textArea: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: '1.5',
    userSelect: 'none',
    wordBreak: 'break-word',
  },
  deadlinePill: {
    fontSize: 11,
    border: '1px solid #e8e8e8',
    borderRadius: 3,
    padding: '1px 5px',
    flexShrink: 0,
    letterSpacing: '0.01em',
  },
  editInput: {
    flex: 1,
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #111',
    background: 'transparent',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    padding: '1px 0',
    color: '#111',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    transition: 'opacity 0.12s',
    flexShrink: 0,
    marginLeft: 8,
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '3px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 2,
  },
}
