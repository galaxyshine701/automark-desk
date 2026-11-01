import { useEffect, useState } from 'react'
import TeacherDashboard from './views/TeacherDashboard.jsx'
import StudentDashboard from './views/StudentDashboard.jsx'
import ReviewSubmission from './views/ReviewSubmission.jsx'
import Welcome from './components/Welcome.jsx'
import AppBar from './components/AppBar.jsx'
import { loadState, saveState, resetState } from './data/storage.js'
import { demoAssignments, demoSubmissions, COURSE } from './data/demoData.js'
import { checkMCQ } from './utils/checkMCQ.js'
import { calculateResult } from './utils/calculateResult.js'

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [view, setView] = useState('student')
  const [assignments, setAssignments] = useState(() => loadState()?.assignments || demoAssignments)
  const [submissions, setSubmissions] = useState(() => loadState()?.submissions || demoSubmissions)
  const [studentName, setStudentName] = useState('Demo Student')
  const [reviewId, setReviewId] = useState(null)

  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => { setSaveFailed(!saveState({ assignments, submissions })) }, [assignments, submissions])

  function enter(role) { setView(role); setReviewId(null); setScreen('app') }
  function switchView(role) { setView(role); setReviewId(null) }

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
    const a = s ? assignments.find((x) => x.id === s.assignmentId) : null
    if (!s || !a) return
    // A published result is official and is not changed again.
    if (s.status === 'Final') return
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
    setSubmissions((p) => p.map((x) => x.id === s.id ? { ...x, status: 'Final' } : x))
    setReviewId(null)
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
    <>
      {saveFailed && (
        <div role="alert" className="error">Your changes could not be saved in this browser. Data will be lost when you close the page.</div>
      )}
      {screen === 'app' && <AppBar view={view} onView={switchView} onHome={() => setScreen('welcome')} courseName={COURSE} />}
      <div className="shell">
        {screen === 'welcome' ? (
          <Welcome onEnter={enter} />
        ) : (
          <main>
            {view === 'teacher' && !reviewId && (
              <TeacherDashboard assignments={assignments} submissions={submissions} courseName={COURSE} onCreate={createAssignment} onReview={(s) => setReviewId(s.id)} />
            )}
            {view === 'teacher' && reviewId && (
              <ReviewSubmission submission={reviewSubmission} assignment={reviewAssignment} onSave={saveReview} onPublish={publishReview} onBack={() => setReviewId(null)} />
            )}
            {view === 'student' && (
              <StudentDashboard assignments={assignments} submissions={submissions} studentName={studentName} setStudentName={setStudentName} onSubmit={submitAssignment} />
            )}
          </main>
        )}
        <footer className="site-foot">
          <p className="muted"><strong>Demo limitation:</strong> the Student and Instructor switch is not a login. Both views share this browser and the same local data.</p>
          <button onClick={resetDemo}>Reset demo data</button>
        </footer>
      </div>
    </>
  )
}
