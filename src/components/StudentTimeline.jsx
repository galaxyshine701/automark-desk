import TypeIcon from './TypeIcon.jsx'
import StatusBadge from './StatusBadge.jsx'
import { dateChip, formatDue } from '../utils/format.js'

// Work the student still has to hand in, earliest due date first.
// `items` is a list of { assignment, info } where info comes from deadlineInfo().
export default function StudentTimeline({ items, onOpen }) {
  if (!items.length) return <p className="empty">Nothing is waiting for you. Every assignment has been submitted.</p>
  return (
    <ol className="timeline">
      {items.map(({ assignment: a, info }) => {
        const chip = dateChip(a.dueDate)
        return (
          <li key={a.id} className={`tl-${info.state}`}>
            <div className="date-chip" aria-hidden="true">
              <span className="m">{chip.month}</span>
              <span className="d">{chip.day}</span>
            </div>
            <article className="item-card">
              <TypeIcon type={a.type} />
              <div className="grow">
                <h3>{a.title}</h3>
                <p className="meta">{a.className} · {a.type === 'MCQ' ? 'Quiz (MCQ)' : 'Project'} · {a.totalMarks} marks</p>
                <p className="meta">Due {formatDue(a.dueDate)}</p>
              </div>
              <div className="item-side">
                <StatusBadge tone={info.state} label={info.label} />
                <button className="primary" onClick={() => onOpen(a)}>{info.state === 'overdue' ? 'Submit late' : 'Open'}</button>
              </div>
            </article>
          </li>
        )
      })}
    </ol>
  )
}
