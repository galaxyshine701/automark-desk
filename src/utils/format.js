// Date text for the dashboards. A broken or empty date never throws.
function validDate(value) {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

// Example: "Wed 4 Nov, 5:00 pm"
export function formatDue(value) {
  const d = validDate(value)
  if (!d) return 'No date'
  return d.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
}

// The small calendar tile next to a deadline: { month: 'NOV', day: '4' }
export function dateChip(value) {
  const d = validDate(value)
  if (!d) return { month: '', day: '–' }
  return { month: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase(), day: String(d.getDate()) }
}
