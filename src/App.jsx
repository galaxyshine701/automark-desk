import { useEffect, useState } from 'react'
import TeacherDashboard from './views/TeacherDashboard.jsx'
import StudentDashboard from './views/StudentDashboard.jsx'
import ReviewSubmission from './views/ReviewSubmission.jsx'
import { loadState, saveState, resetState } from './data/storage.js'
import { demoAssignments, demoSubmissions } from './data/demoData.js'
import { checkMCQ } from './utils/checkMCQ.js'
import { calculateResult } from './utils/calculateResult.js'

export default function App() {
  const [view, setView] = useState('student')
  const [assignments, setAssignments] = useState(() => loadState()?.assignments || demoAssignments)
  const [submissions, setSubmissions] = useState(() => loadState()?.submissions || demoSubmissions)
  const [studentName, setStudentName] = useState('Demo Student')
  const [reviewId, setReviewId] = useState(null)

  useEffect(() => { saveState({ assignments, submissions }) }, [assignments, submissions])

  function createAssignment(a) { setAssignments((p) => [...p, a]) }

  function submitAssignment(assignment, existing, data) {
    const now = new Date().toISOString()
    let raw = null
    if (assignment.type === 'MCQ') raw = checkMCQ(assignment, data.answers).rawMarks
    const base = existing
      ? { ...existing, ...data, submittedAt: now }
      : { id: `s-${Date.now()}`, assignmentId: assignment.id, studentName, submittedAt: now, ...data, feedback: '', overrideReason: '', rubricScores: null }
    const result = calculateResult(assignment, { rawMarks: raw, submittedAt: base.submittedAt })
    const next = { ...base, ...result, status: 'Checked' }
    setSubmissions((p) => existing ? p.map((s) => s.id === existing.id ? next : s) : [...p, next])
  }

  function saveReview(patch) {
    const s = submissions.find((x) => x.id === reviewId)
    const a = assignments.find((x) => x.id === s.assignmentId)
    if (!s || !a) return
    let raw = s.rawMarks
    let obtainedOverride = null
    if (patch.rawMarks !== undefined) raw = patch.rawMarks
    if (patch.overrideMarks !== undefined) obtainedOverride = patch.overrideMarks
    const result = calculateResult(a, { rawMarks: raw, submittedAt: s.submittedAt })
    let next = { ...s, ...patch, ...result, status: 'Reviewed' }
    if (obtainedOverride !== null) {
      const percentage = a.totalMarks ? Math.round((obtainedOverride / a.totalMarks) * 1000) / 10 : 0
      const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'Fail'
      next = { ...next, obtainedMarks: obtainedOverride, percentage, grade }
    }
    // Keep patch fields that calculateResult would otherwise overwrite only for display fields.
    if (patch.rubricScores) next.rubricScores = patch.rubricScores
    setSubmissions((p) => p.map((x) => x.id === s.id ? next : x))
  }

  function publishReview() {
    const s = submissions.find((x) => x.id === reviewId)
    if (!s) return
    // A project with no rubric scores has no marks yet, so it cannot be published as final.
    if (s.obtainedMarks === null) return
    // If the teacher has not saved a review yet, publish the checked result as-is.
    setSubmissions((p) => p.map((x) => x.id === s.id ? { ...x, status: 'Final' } : x))
    setReviewId(null)
    setView('student')
  }

  function resetDemo() {
    resetState()
    setAssignments(demoAssignments)
    setSubmissions(demoSubmissions)
    setReviewId(null)
  }

  const reviewSubmission = submissions.find((s) => s.id === reviewId)
  const reviewAssignment = reviewSubmission ? assignments.find((a) => a.id === reviewSubmission.assignmentId) : null

  return (
    <div className="container">
      <header>
        <h1>AutoMark Desk</h1>
        <p className="muted">Teacher creates an assignment. Student submits it. The system checks it. Teacher reviews and publishes the final result.</p>
        <div className="toggle">
          <button className={view === 'student' ? 'primary' : ''} onClick={() => { setView('student'); setReviewId(null) }}>Student view</button>
          <button className={view === 'teacher' ? 'primary' : ''} onClick={() => { setView('teacher'); setReviewId(null) }}>Teacher view</button>
          <button onClick={resetDemo}>Reset demo data</button>
        </div>
        <p className="muted"><strong>Demo limitation:</strong> this toggle is not a real login. Teacher and Student views share the same browser and the same local data.</p>
      </header>
      <main>
        {view === 'teacher' && !reviewId && (
          <TeacherDashboard assignments={assignments} submissions={submissions} onCreate={createAssignment} onReview={(s) => setReviewId(s.id)} />
        )}
        {view === 'teacher' && reviewId && (
          <ReviewSubmission submission={reviewSubmission} assignment={reviewAssignment} onSave={saveReview} onPublish={publishReview} onBack={() => setReviewId(null)} />
        )}
        {view === 'student' && (
          <StudentDashboard assignments={assignments} submissions={submissions} studentName={studentName} setStudentName={setStudentName} onSubmit={submitAssignment} />
        )}
      </main>
      <footer className="muted">
        <p>Status flow: Submitted → Checked → Reviewed → Final / Graded. Late penalty: 5% of total marks per late day. Grades: A 90%+, B 80–89%, C 70–79%, D 60–69%, below that Fail.</p>
      </footer>
    </div>
  )
}
