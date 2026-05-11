interface Props {
  collapsed: boolean
  onClick: () => void
}

export function CollapseIcon({ collapsed, onClick }: Props) {
  return (
    <button onClick={onClick} style={styles.btn} aria-label={collapsed ? 'Expand' : 'Collapse'}>
      <svg width="10" height="10" viewBox="0 0 10 10">
        <polygon
          points="2,2 8,5 2,8"
          fill="#888"
          style={{
            transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
            transformOrigin: '5px 5px',
            transition: 'transform 0.15s ease',
          }}
        />
      </svg>
    </button>
  )
}

const styles: Record<string, React.CSSProperties> = {
  btn: {
    background: 'none',
    border: 'none',
    padding: '0 4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    opacity: 0.6,
  },
}
