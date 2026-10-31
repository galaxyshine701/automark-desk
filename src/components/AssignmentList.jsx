import TypeIcon from './TypeIcon.jsx'
import { formatDue } from '../utils/format.js'

export default function AssignmentList({ assignments }) {
  if (!assignments.length) return <p className="empty">No assignments yet. Use "Create new assignment" above.</p>
  return (
    <div className="stack">
      {assignments.map((a) => (
        <article key={a.id} className="item-card">
          <TypeIcon type={a.type} />
          <div className="grow">
            <h3>{a.title}</h3>
            <p className="meta">{a.className} · {a.type === 'MCQ' ? 'Quiz (MCQ)' : 'Project'} · {a.totalMarks} marks</p>
            <p className="meta">Due {formatDue(a.dueDate)} · Late rule: {a.latePenaltyPerDay}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
