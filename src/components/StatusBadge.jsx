// One badge for submission status (Checked, Reviewed, Final) and for deadline state
// (overdue, today, soon, later). Every badge has a word and a small shape,
// so the meaning never depends on colour alone.
function Glyph({ name }) {
  const common = { className: 'glyph', viewBox: '0 0 16 16', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (name === 'check') return <svg {...common}><path d="M3 8.5 L6.3 11.8 L13 4.6" /></svg>
  if (name === 'alert') return <svg {...common}><path d="M8 2.4 L14.2 13 H1.8 Z" /><path d="M8 6.6 V9.6" /><path d="M8 11.5 V11.6" /></svg>
  if (name === 'clock') return <svg {...common}><circle cx="8" cy="8" r="5.8" /><path d="M8 4.9 V8.2 L10.2 9.5" /></svg>
  if (name === 'calendar') return <svg {...common}><rect x="2.4" y="3.4" width="11.2" height="10.2" rx="1.6" /><path d="M2.4 7 H13.6 M5.6 2 V4.8 M10.4 2 V4.8" /></svg>
  return <svg {...common} fill="currentColor" stroke="none"><circle cx="8" cy="8" r="3" /></svg>
}

const GLYPH_FOR = { final: 'check', overdue: 'alert', today: 'clock', soon: 'clock', later: 'calendar' }

export default function StatusBadge({ status, tone, label }) {
  const key = tone || String(status).toLowerCase()
  return (
    <span className={`badge badge-${key}`}>
      <Glyph name={GLYPH_FOR[key] || 'dot'} />
      {label || status}
    </span>
  )
}
