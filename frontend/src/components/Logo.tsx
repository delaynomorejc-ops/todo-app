interface Props {
  size?: number
  color?: string
}

export function LogoMark({ size = 28, color = '#111' }: Props) {
  return (
    <svg
      width={size}
      height={Math.round(size * 28 / 32)}
      viewBox="0 0 32 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="0.75" width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth="1.6" />
      <line x1="12" y1="4.5" x2="22" y2="4.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />

      <rect x="6" y="10" width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth="1.6" />
      <polyline points="7.8,13.8 9.6,15.7 13.2,11.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="17" y1="13.75" x2="29" y2="13.75" stroke={color} strokeWidth="1.6" strokeLinecap="round" />

      <rect x="11" y="19.25" width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth="1.6" />
      <line x1="22" y1="23" x2="30" y2="23" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
