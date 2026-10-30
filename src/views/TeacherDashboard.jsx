import { useState } from 'react'
import AssignmentForm from '../components/AssignmentForm.jsx'
import AssignmentList from '../components/AssignmentList.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

export default function TeacherDashboard({ assignments, submissions, onCreate, onReview }) {
  const [showForm, setShowForm] = useState(false)
  return (
    <div>
      <h2>Teacher dashboard</h2>
      <button onClick={() => setShowForm(!showForm)} className="primary">{showForm ? 'Hide form' : 'Create new assignment'}</button>
      {showForm && <AssignmentForm onCreate={(a) => { onCreate(a); setShowForm(false) }} />}
      <h3>Assignments</h3>
      <AssignmentList assignments={assignments} />
      <h3>Submissions to review</h3>
      {!submissions.length && <p>No submissions yet.</p>}
      <div className="list">
        {submissions.map((s) => {
          const a = assignments.find((x) => x.id === s.assignmentId)
          return (
            <div key={s.id} className="card">
              <h3>{a ? a.title : 'Unknown assignment'}</h3>
              <p>{s.studentName} — submitted {new Date(s.submittedAt).toLocaleString()}</p>
              <p><StatusBadge status={s.status} /> {s.obtainedMarks !== null ? `${s.obtainedMarks} / ${a?.totalMarks} — ${s.percentage}% — Grade ${s.grade}` : 'Awaiting rubric scoring'}</p>
              <button onClick={() => onReview(s)}>Review submission</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
