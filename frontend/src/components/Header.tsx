import type { SaveStatus } from '../types'

interface Props {
  taskName: string
  status: SaveStatus
  totalCount: number
  completedCount: number
}

export function Header({ taskName, status, totalCount, completedCount }: Props) {
  return (
    <header style={styles.header}>
      <div style={styles.top}>
        <h1 style={styles.title}>{taskName}</h1>
        <div style={styles.meta}>
          {totalCount > 0 && (
            <span style={styles.counter}>{completedCount} / {totalCount}</span>
          )}
          {status === 'syncing' && <span style={styles.dot} title="Saving…" />}
          {status === 'error' && <span style={{ ...styles.dot, background: '#ddd' }} title="Save failed" />}
        </div>
      </div>
      <div style={styles.divider} />
    </header>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    paddingTop: 36,
    marginBottom: 20,
  },
  top: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 400,
    fontSize: 26,
    color: '#111',
    letterSpacing: '-0.2px',
    lineHeight: 1,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 2,
  },
  counter: {
    fontSize: 13,
    color: '#bbb',
    fontVariantNumeric: 'tabular-nums',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#ccc',
    display: 'inline-block',
  },
  divider: {
    height: 1,
    background: '#e8e8e8',
  },
}
