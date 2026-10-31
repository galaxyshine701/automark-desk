import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import StudentTimeline from '../components/StudentTimeline.jsx'
import SubmissionRow from '../components/SubmissionRow.jsx'
import SubmissionForm from '../components/SubmissionForm.jsx'
import ResultCard from '../components/ResultCard.jsx'
import MarkingRules from '../components/MarkingRules.jsx'
import { deadlineInfo, sortByDueDate, studentSummary } from '../utils/dashboard.js'

export default function StudentDashboard({ assignments, submissions, studentName, setStudentName, onSubmit }) {
  const [selected, setSelected] = useState(null)
  const now = new Date()
  const name = studentName.trim()

  const mine = submissions.filter((s) => s.studentName === studentName)
  const submissionFor = (a) => mine.find((s) => s.assignmentId === a.id)
  const summary = studentSummary(assignments, submissions, studentName, now)

  const todo = sortByDueDate(assignments.filter((a) => !submissionFor(a)))
    .map((a) => ({ assignment: a, info: deadlineInfo(a, null, now) }))
  const submitted = mine
    .map((s) => ({ submission: s, assignment: assignments.find((a) => a.id === s.assignmentId) }))
    .filter((x) => x.assignment)
    .sort((a, b) => new Date(b.submission.submittedAt) - new Date(a.submission.submittedAt))

  const selectedAssignment = assignments.find((a) => a.id === selected)
  const mySubmission = selectedAssignment ? submissionFor(selectedAssignment) : null

  const today = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const nameBox = (
    <section className="panel" aria-labelledby="who-title">
      <h2 id="who-title">Signed in as</h2>
      <label className="field">Student name
        <input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      </label>
      <p className="meta">Demo only: change the name to act as another student. Results are kept per name.</p>
    </section>
  )

  if (selectedAssignment) {
    return (
      <div className="layout">
        <div className="main-col">
          <button onClick={() => setSelected(null)}>← Back to my dashboard</button>
          {mySubmission && mySubmission.status === 'Final' ? (
            <ResultCard submission={mySubmission} assignment={selectedAssignment} />
          ) : (
            <>
              <SubmissionForm assignment={selectedAssignment} existing={mySubmission} studentName={studentName} onSubmit={(data) => { onSubmit(selectedAssignment, mySubmission, data) }} />
              {mySubmission && <ResultCard submission={mySubmission} assignment={selectedAssignment} />}
            </>
          )}
        </div>
        <aside className="aside">{nameBox}<MarkingRules /></aside>
      </div>
    )
  }

  function open(a) {
    if (!name) return
    setSelected(a.id)
  }

  return (
    <div>
      <PageHeader eyebrow={today} title={name ? `Welcome back, ${name}` : 'Welcome'}>
        <p className="page-sub">Your deadlines and results for the term.</p>
      </PageHeader>

      <div className="stats">
        <StatCard value={summary.upcoming} label="Due soon" />
        <StatCard value={summary.overdue} label="Overdue" tone={summary.overdue ? 'danger' : undefined} />
        <StatCard value={summary.awaiting} label="Waiting for the instructor" />
        <StatCard value={summary.published} label="Results published" />
      </div>

      {!name && <p className="error" role="alert">Enter a student name in the box on the right to open an assignment.</p>}

      <div className="layout">
        <div className="main-col">
          <h2 className="section-title">Deadlines <span className="count">{todo.length}</span></h2>
          <StudentTimeline items={todo} onOpen={open} />

          <h2 className="section-title">Submitted work <span className="count">{submitted.length}</span></h2>
          {!submitted.length && <p className="empty">Nothing submitted yet.</p>}
          <div className="stack">
            {submitted.map(({ submission, assignment }) => (
              <SubmissionRow key={submission.id} submission={submission} assignment={assignment} actionLabel="View" onAction={() => open(assignment)} />
            ))}
          </div>
        </div>
        <aside className="aside">{nameBox}<MarkingRules /></aside>
      </div>
    </div>
  )
}
