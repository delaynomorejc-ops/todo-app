import { useState, useEffect, useRef } from 'react'
import type { TodoItem, Action } from '../types'

interface Props {
  item: TodoItem | null
  dispatch: React.Dispatch<Action>
}

export function DetailPanel({ item, dispatch }: Props) {
  const [notes, setNotes] = useState('')
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setNotes(item?.notes ?? '')
  }, [item?.id])

  const handleNotesChange = (value: string) => {
    setNotes(value)
    if (!item) return
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(() => {
      dispatch({ type: 'SET_NOTES', id: item.id, notes: value })
    }, 400)
  }

  const handleDeadlineChange = (value: string) => {
    if (!item) return
    dispatch({ type: 'SET_DEADLINE', id: item.id, deadline: value })
  }

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }

  useEffect(() => {
    autoResize()
  }, [notes])

  return (
    <aside style={styles.panel}>
      {!item ? (
        <div style={styles.placeholder}>
          <PlaceholderSvg />
          <p style={styles.placeholderText}>Select an item</p>
        </div>
      ) : (
        <div style={styles.inner}>
          <p style={styles.itemName}>{item.text}</p>

          <div style={styles.section}>
            <label style={styles.label}>Notes</label>
            <textarea
              ref={textareaRef}
              value={notes}
              onChange={e => { handleNotesChange(e.target.value); autoResize() }}
              placeholder="Add a note…"
              style={styles.textarea}
              rows={3}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Deadline</label>
            <div style={styles.dateRow}>
              <input
                type="date"
                value={item.deadline ?? ''}
                onChange={e => handleDeadlineChange(e.target.value)}
                style={styles.dateInput}
              />
              {item.deadline && (
                <button
                  style={styles.clearBtn}
                  onClick={() => handleDeadlineChange('')}
                  title="Clear deadline"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

function PlaceholderSvg() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1.2" strokeLinecap="round" style={{ display: 'block', margin: '0 auto 10px' }}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="13" x2="13" y2="13" />
    </svg>
  )
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    width: 240,
    flexShrink: 0,
    borderLeft: '1px solid #e8e8e8',
    minHeight: '100%',
    paddingTop: 36,
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginTop: 40,
  },
  placeholderText: {
    fontSize: 12,
    color: '#d0d0d0',
    textAlign: 'center',
  },
  inner: {
    padding: '0 20px 40px',
  },
  itemName: {
    fontSize: 13,
    color: '#888',
    marginBottom: 24,
    lineHeight: '1.5',
    wordBreak: 'break-word',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: 14,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    display: 'block',
    fontSize: 11,
    color: '#bbb',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: 'Georgia, serif',
  },
  textarea: {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #e8e8e8',
    background: 'transparent',
    fontSize: 13,
    fontFamily: 'inherit',
    color: '#333',
    outline: 'none',
    resize: 'none',
    lineHeight: '1.6',
    padding: '4px 0',
    overflow: 'hidden',
    minHeight: 60,
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    border: 'none',
    borderBottom: '1px solid #e8e8e8',
    background: 'transparent',
    fontSize: 13,
    fontFamily: 'inherit',
    color: '#555',
    outline: 'none',
    padding: '4px 0',
    cursor: 'pointer',
    flex: 1,
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 3,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
}
