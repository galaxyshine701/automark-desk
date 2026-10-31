import TypeIcon from './TypeIcon.jsx'
import StatusBadge from './StatusBadge.jsx'
import { formatDue } from '../utils/format.js'

function marksText(submission, assignment) {
  if (submission.obtainedMarks === null || submission.obtainedMarks === undefined) return 'Marks pending'
  const total = assignment ? assignment.totalMarks : '?'
  return `${submission.obtainedMarks} / ${total} · ${submission.percentage}% · Grade ${submission.grade}`
}

// One submission as a row. Used for the student's submitted work and the instructor's queue.
// `who` adds the student name (instructor side).
export default function SubmissionRow({ submission, assignment, actionLabel, onAction, who = false }) {
  const late = submission.lateDays > 0 ? `${submission.lateDays} late ${submission.lateDays === 1 ? 'day' : 'days'}` : 'on time'
  return (
    <article className="item-card">
      <TypeIcon type={assignment ? assignment.type : 'PROJECT'} />
      <div className="grow">
        <h3>{assignment ? assignment.title : 'Unknown assignment'}</h3>
        <p className="meta">{who && <>{submission.studentName} · </>}Submitted {formatDue(submission.submittedAt)} · {late}</p>
        <p className="meta">{marksText(submission, assignment)}</p>
      </div>
      <div className="item-side">
        <StatusBadge status={submission.status} />
        <button onClick={onAction}>{actionLabel}</button>
      </div>
    </article>
  )
}
