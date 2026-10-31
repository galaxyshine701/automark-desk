import StatusBadge from './StatusBadge.jsx'
import { formatDue } from '../utils/format.js'

export default function ResultCard({ submission, assignment }) {
  if (!submission || !assignment) return null
  return (
    <div className="card result-card">
      <div className="card-head">
        <h3>Result — {assignment.title}</h3>
        <StatusBadge status={submission.status} />
      </div>
      <p><strong>Student:</strong> {submission.studentName}</p>
      {submission.obtainedMarks === null ? (
        <p><strong>Status:</strong> Awaiting instructor rubric scoring. No marks have been calculated yet.</p>
      ) : (
        <>
          <p><strong>Marks:</strong> {submission.obtainedMarks} / {assignment.totalMarks}</p>
          <p><strong>Raw marks:</strong> {submission.rawMarks} &nbsp;|&nbsp; <strong>Penalty:</strong> {submission.penaltyMarks}</p>
          <p><strong>Percentage:</strong> {submission.percentage}% &nbsp;|&nbsp; <strong>Grade:</strong> <span className="grade-mark">{submission.grade}</span></p>
        </>
      )}
      <p><strong>Late days:</strong> {submission.lateDays}</p>
      <p><strong>Submitted:</strong> {formatDue(submission.submittedAt)}</p>
      {submission.feedback && <p><strong>Instructor feedback:</strong> {submission.feedback}</p>}
      {submission.overrideReason && <p><strong>Override reason:</strong> {submission.overrideReason}</p>}
      <p className="muted">Final results appear here only after the instructor publishes them. Checked results are not final until published.</p>
    </div>
  )
}
