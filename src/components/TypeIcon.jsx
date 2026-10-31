// Small icons for the two assignment types.
// MCQ: a clipboard with ticked boxes. Project: a browser window.
export default function TypeIcon({ type }) {
  if (type === 'MCQ') {
    return (
      <svg className="type-icon" viewBox="0 0 32 32" aria-hidden="true">
        <rect className="icon-fill" x="5" y="5" width="22" height="24" rx="3" />
        <rect className="icon-clip" x="11" y="2" width="10" height="6" rx="2" />
        <path className="icon-tick" d="M9 14 l2.5 2.5 l4 -5" />
        <rect className="icon-line" x="18" y="13" width="6" height="2" rx="1" />
        <path className="icon-tick" d="M9 22 l2.5 2.5 l4 -5" />
        <rect className="icon-line" x="18" y="21" width="6" height="2" rx="1" />
      </svg>
    )
  }
  return (
    <svg className="type-icon" viewBox="0 0 32 32" aria-hidden="true">
      <rect className="icon-fill" x="3" y="6" width="26" height="21" rx="3" />
      <rect className="icon-clip" x="3" y="6" width="26" height="6" rx="3" />
      <circle className="icon-dot" cx="7" cy="9" r="1.2" />
      <circle className="icon-dot" cx="11" cy="9" r="1.2" />
      <rect className="icon-line" x="7" y="16" width="12" height="2" rx="1" />
      <rect className="icon-line" x="7" y="21" width="18" height="2" rx="1" />
    </svg>
  )
}
