import { useState, useRef } from 'react'

interface Props {
  onAdd: (text: string) => void
  placeholder?: string
  depth?: number
}

export function AddItemRow({ onAdd, placeholder = 'Add item…', depth = 0 }: Props) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = () => {
    const trimmed = text.trim()
    if (trimmed) {
      onAdd(trimmed)
      setText('')
    }
  }

  return (
    <div style={{ ...styles.row, paddingLeft: depth * 20 + 24 }}>
      <input
        ref={inputRef}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') setText('')
        }}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
    padding: '5px 0',
    fontSize: 14,
    color: '#111',
    background: 'transparent',
    outline: 'none',
    fontFamily: 'inherit',
  },
}
