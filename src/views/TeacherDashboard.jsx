import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import AssignmentForm from '../components/AssignmentForm.jsx'
import AssignmentList from '../components/AssignmentList.jsx'
import SubmissionRow from '../components/SubmissionRow.jsx'
import ClassStats from '../components/ClassStats.jsx'
import MarkingRules from '../components/MarkingRules.jsx'
import { needsReview, averagePercentage } from '../utils/dashboard.js'

export default function TeacherDashboard({ assignments, submissions, onCreate, onReview, courseName }) {
  const [showForm, setShowForm] = useState(false)
  const queue = needsReview(submissions)
  const published = submissions.filter((s) => s.status === 'Final')
  const average = averagePercentage(submissions)
  const assignmentOf = (s) => assignments.find((a) => a.id === s.assignmentId)

  const createButton = (
    <button className="btn-light" onClick={() => setShowForm(!showForm)}>{showForm ? 'Hide form' : 'Create new assignment'}</button>
  )

  return (
    <div>
      <PageHeader eyebrow={courseName} title="Instructor dashboard" actions={createButton}>
        <p className="page-sub">Review incoming work and publish final results.</p>
      </PageHeader>

      <div className="stats">
        <StatCard value={assignments.length} label="Assignments" />
        <StatCard value={submissions.length} label="Submissions" />
        <StatCard value={queue.length} label="Need your review" tone={queue.length ? 'warn' : undefined} />
        <StatCard value={average === null ? '–' : `${average}%`} label="Class average" />
      </div>

      {showForm && <AssignmentForm onCreate={(a) => { onCreate(a); setShowForm(false) }} />}

      <div className="layout">
        <div className="main-col">
          <h2 className="section-title">Needs review <span className="count">{queue.length}</span></h2>
          {!queue.length && <p className="empty">Nothing to review. Every submission has been published.</p>}
          <div className="stack">
            {queue.map((s) => (
              <SubmissionRow key={s.id} who submission={s} assignment={assignmentOf(s)} actionLabel="Review" onAction={() => onReview(s)} />
            ))}
          </div>

          <h2 className="section-title">Published results <span className="count">{published.length}</span></h2>
          {!published.length && <p className="empty">No results published yet.</p>}
          <div className="stack">
            {published.map((s) => (
              <SubmissionRow key={s.id} who submission={s} assignment={assignmentOf(s)} actionLabel="View" onAction={() => onReview(s)} />
            ))}
          </div>

          <h2 className="section-title">Assignments <span className="count">{assignments.length}</span></h2>
          <AssignmentList assignments={assignments} />
        </div>
        <aside className="aside">
          <ClassStats assignments={assignments} submissions={submissions} />
          <MarkingRules />
        </aside>
      </div>
    </div>
  )
}
