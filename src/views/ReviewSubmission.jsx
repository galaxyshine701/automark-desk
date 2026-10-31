import { useState } from 'react'
import ResultCard from '../components/ResultCard.jsx'
import { checkMCQ } from '../utils/checkMCQ.js'
import { formatDue } from '../utils/format.js'

export default function ReviewSubmission({ submission, assignment, onSave, onPublish, onBack }) {
  const [rubricScores, setRubricScores] = useState(submission.rubricScores || assignment.rubric.map(() => 0))
  const [overrideMarks, setOverrideMarks] = useState('')
  const [overrideReason, setOverrideReason] = useState(submission.overrideReason || '')
  const [feedback, setFeedback] = useState(submission.feedback || '')
  const [error, setError] = useState('')

  if (!submission || !assignment) return <p>Submission not found.</p>
  // A published result is official: it is shown here for reading only.
  const locked = submission.status === 'Final'
  const mcqDetails = assignment.type === 'MCQ' ? checkMCQ(assignment, submission.answers).details : []

  function save() {
    if (assignment.type === 'PROJECT') {
      const bad = rubricScores.some((v, i) => Number(v) < 0 || Number(v) > Number(assignment.rubric[i].marks))
      if (bad) { setError('Rubric marks must be within each criterion maximum.'); return }
      const raw = rubricScores.reduce((s, v) => s + Number(v || 0), 0)
      setError('')
      onSave({ rubricScores: rubricScores.map(Number), rawMarks: raw, feedback, overrideReason: '' })
      return
    }
    if (overrideMarks !== '') {
      if (!overrideReason.trim()) { setError('An override needs a written reason.'); return }
      setError('')
      onSave({ overrideMarks: Number(overrideMarks), feedback, overrideReason: overrideReason.trim() })
      return
    }
    setError('')
    onSave({ feedback, overrideReason: '' })
  }

  return (
    <div>
      <button onClick={onBack}>← Back to instructor dashboard</button>
      <h2 className="review-title">Review submission</h2>
      <p><strong>{assignment.title}</strong> — {submission.studentName} — submitted {formatDue(submission.submittedAt)}</p>
      {assignment.type === 'PROJECT' && (
        <div className="card form">
          <h3>Project links (open in a new tab)</h3>
          {submission.liveLink && <p><a href={submission.liveLink} target="_blank" rel="noreferrer">Open live website</a></p>}
          {submission.githubLink && <p><a href={submission.githubLink} target="_blank" rel="noreferrer">Open GitHub repo</a></p>}
          {submission.note && <p>Note: {submission.note}</p>}
          <h3>Rubric scoring</h3>
          {assignment.rubric.map((r, i) => (
            <label key={r.criterion}>{r.criterion} (max {r.marks}) <input type="number" min="0" max={r.marks} value={rubricScores[i]} disabled={locked} onChange={(e) => { const c = [...rubricScores]; c[i] = Number(e.target.value); setRubricScores(c) }} /></label>
          ))}
        </div>
      )}
      {assignment.type === 'MCQ' && (
        <div className="card form">
          <h3>MCQ answers</h3>
          {mcqDetails.map((d, i) => (
            <p key={i}>Q{i + 1}: {d.question} — Given: {d.given || '(blank)'} — Correct: {d.correctAnswer} — {d.correct ? 'Correct' : 'Wrong'} ({d.correct ? d.marks : 0} marks)</p>
          ))}
          <label>Override obtained marks (optional — raw marks stay in the record, override changes the published result)
            <input type="number" min="0" value={overrideMarks} disabled={locked} onChange={(e) => setOverrideMarks(e.target.value)} placeholder="Leave blank to keep the auto result" />
          </label>
          <label>Override reason (required if you override)
            <input value={overrideReason} disabled={locked} onChange={(e) => setOverrideReason(e.target.value)} />
          </label>
        </div>
      )}
      <div className="card form">
        <label>Instructor feedback <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} disabled={locked} /></label>
        {error && <p className="error">{error}</p>}
        <button className="primary" onClick={save} disabled={locked}>Save review (status: Reviewed)</button>
        <button onClick={onPublish} disabled={locked || submission.status === 'Checked' || (assignment.type === 'PROJECT' && submission.obtainedMarks === null)}>
          Publish final result
        </button>
        <p className="muted">{locked
          ? 'This result is published (Final). It can no longer be changed.'
          : 'Save the review first (status becomes Reviewed), then publish. Publishing makes the status Final, and the student can no longer edit the submission.'}</p>
      </div>
      <ResultCard submission={submission} assignment={assignment} />
    </div>
  )
}
