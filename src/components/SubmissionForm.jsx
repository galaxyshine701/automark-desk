import { useState } from 'react'

export default function SubmissionForm({ assignment, existing, studentName, onSubmit }) {
  const [answers, setAnswers] = useState(existing?.answers || assignment.questions.map(() => ''))
  const [liveLink, setLiveLink] = useState(existing?.liveLink || '')
  const [githubLink, setGithubLink] = useState(existing?.githubLink || '')
  const [note, setNote] = useState(existing?.note || '')
  const [error, setError] = useState('')

  const isPastDue = new Date() > new Date(assignment.dueDate)
  const canEdit = !existing || (!isPastDue && existing.status !== 'Final')

  function submit(e) {
    e.preventDefault()
    if (!canEdit) { setError('Editing is blocked after the due date or after the result is Final.'); return }
    if (assignment.type === 'MCQ' && answers.some((a) => !a)) { setError('Please answer every question.'); return }
    if (assignment.type === 'PROJECT' && !liveLink.trim()) { setError('A live link is required for a project submission.'); return }
    setError('')
    onSubmit({ answers, liveLink: liveLink.trim(), githubLink: githubLink.trim(), note: note.trim() })
  }

  if (!canEdit && existing) {
    return <p className="card">This submission can no longer be edited: it is past the due date or the result is already Final.</p>
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h3>{existing ? 'Edit submission' : 'Submit'} — {assignment.title}</h3>
      {error && <p className="error">{error}</p>}
      {assignment.type === 'MCQ' ? assignment.questions.map((q, i) => (
        <fieldset key={i}>
          <legend>Question {i + 1}: {q.text} ({q.marks} marks)</legend>
          {q.options.map((opt) => (
            <label key={opt} className="radio">
              <input type="radio" name={`q-${i}`} value={opt} checked={answers[i] === opt} onChange={() => { const c = [...answers]; c[i] = opt; setAnswers(c) }} /> {opt}
            </label>
          ))}
        </fieldset>
      )) : (
        <>
          <label>Live website link <input value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="https://..." /></label>
          <label>GitHub repo link (optional) <input value={githubLink} onChange={(e) => setGithubLink(e.target.value)} placeholder="https://github.com/..." /></label>
          <label>Note <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What did you build?" /></label>
          <p className="muted">No file upload in this demo. The instructor will open your links in a new tab.</p>
        </>
      )}
      <p className="muted">Submitting as: {studentName}</p>
      <button type="submit" className="primary">{existing ? 'Update submission' : 'Submit assignment'}</button>
    </form>
  )
}
