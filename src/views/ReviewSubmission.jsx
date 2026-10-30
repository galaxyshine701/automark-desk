import { useState } from 'react'
import ResultCard from '../components/ResultCard.jsx'
import { checkMCQ } from '../utils/checkMCQ.js'

export default function ReviewSubmission({ submission, assignment, onSave, onPublish, onBack }) {
  const [rubricScores, setRubricScores] = useState(submission.rubricScores || assignment.rubric.map(() => 0))
  const [overrideMarks, setOverrideMarks] = useState('')
  const [overrideReason, setOverrideReason] = useState(submission.overrideReason || '')
  const [feedback, setFeedback] = useState(submission.feedback || '')
  const [error, setError] = useState('')

  if (!submission || !assignment) return <p>Submission not found.</p>
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
      <button onClick={onBack}>Back to teacher dashboard</button>
      <h2>Review submission</h2>
      <p><strong>{assignment.title}</strong> — {submission.studentName} — submitted {new Date(submission.submittedAt).toLocaleString()}</p>
      {assignment.type === 'PROJECT' && (
        <div className="card">
          <h3>Project links (open in a new tab)</h3>
          {submission.liveLink && <p><a href={submission.liveLink} target="_blank" rel="noreferrer">Open live website</a></p>}
          {submission.githubLink && <p><a href={submission.githubLink} target="_blank" rel="noreferrer">Open GitHub repo</a></p>}
          {submission.note && <p>Note: {submission.note}</p>}
          <h3>Rubric scoring</h3>
          {assignment.rubric.map((r, i) => (
            <label key={r.criterion}>{r.criterion} (max {r.marks}) <input type="number" min="0" max={r.marks} value={rubricScores[i]} onChange={(e) => { const c = [...rubricScores]; c[i] = Number(e.target.value); setRubricScores(c) }} /></label>
          ))}
        </div>
      )}
      {assignment.type === 'MCQ' && (
        <div className="card">
          <h3>MCQ answers</h3>
          {mcqDetails.map((d, i) => (
            <p key={i}>Q{i + 1}: {d.question} — Given: {d.given || '(blank)'} — Correct: {d.correctAnswer} — {d.correct ? 'Correct' : 'Wrong'} ({d.correct ? d.marks : 0} marks)</p>
          ))}
          <label>Override obtained marks (optional — raw marks stay in the record, override changes the published result)
            <input type="number" min="0" value={overrideMarks} onChange={(e) => setOverrideMarks(e.target.value)} placeholder="Leave blank to keep the auto result" />
          </label>
          <label>Override reason (required if you override)
            <input value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} />
          </label>
        </div>
      )}
      <div className="card form">
        <label>Teacher feedback <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} /></label>
        {error && <p className="error">{error}</p>}
        <button className="primary" onClick={save}>Save review (status: Reviewed)</button>
        <button onClick={onPublish} disabled={submission.status === 'Checked' || (assignment.type === 'PROJECT' && submission.obtainedMarks === null)}>
          Publish final result
        </button>
        <p className="muted">Save the review first (status becomes Reviewed), then publish. Publish changes the status to Final / Graded. After publishing, the student can no longer edit this submission.</p>
      </div>
      <ResultCard submission={submission} assignment={assignment} />
    </div>
  )
}
