import type { ServiceIconName } from '../types/site'

export function ServiceIcon({ icon }: { icon: ServiceIconName }) {
  const commonProps = {
    className: 'h-7 w-7',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  switch (icon) {
    case 'Hammer':
      return (
        <svg {...commonProps}>
          <path d="m14 6 4 4" />
          <path d="m10 10 8-8" />
          <path d="m12 8 4 4" />
          <path d="m8 12 4 4" />
          <path d="M5 19 19 5" />
          <path d="m4 20 4-1 9-9-3-3-9 9-1 4Z" />
        </svg>
      )
    case 'Droplets':
      return (
        <svg {...commonProps}>
          <path d="M12 3c-2.4 3.2-6 6.4-6 10a6 6 0 0 0 12 0c0-3.6-3.6-6.8-6-10Z" />
          <path d="M9 14a3 3 0 0 0 6 0" />
        </svg>
      )
    case 'House':
      return (
        <svg {...commonProps}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      )
    case 'Fence':
      return (
        <svg {...commonProps}>
          <path d="M4 21V7l2-3 2 3v14" />
          <path d="M10 21V7l2-3 2 3v14" />
          <path d="M16 21V7l2-3 2 3v14" />
          <path d="M4 12h16" />
        </svg>
      )
    case 'Grid2x2':
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      )
    case 'ClipboardList':
      return (
        <svg {...commonProps}>
          <path d="M9 4h6" />
          <path d="M10 2h4a1 1 0 0 1 1 1v2H9V3a1 1 0 0 1 1-1Z" />
          <path d="M8 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1" />
          <path d="m9 11 1.5 1.5L15 8" />
          <path d="M9 17h6" />
        </svg>
      )
    default:
      return null
  }
}

export function ChevronLeftIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

export function ChevronRightIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}
