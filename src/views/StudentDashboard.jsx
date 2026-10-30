import { useState } from 'react'
import AssignmentList from '../components/AssignmentList.jsx'
import SubmissionForm from '../components/SubmissionForm.jsx'
import ResultCard from '../components/ResultCard.jsx'

export default function StudentDashboard({ assignments, submissions, studentName, setStudentName, onSubmit }) {
  const [selected, setSelected] = useState(null)
  const selectedAssignment = assignments.find((a) => a.id === selected)
  const mySubmission = selectedAssignment ? submissions.find((s) => s.assignmentId === selected && s.studentName === studentName) : null

  return (
    <div>
      <h2>Student dashboard</h2>
      <label className="inline">Student name <input value={studentName} onChange={(e) => setStudentName(e.target.value)} /></label>
      <p className="muted">Demo note: this is a view toggle, not a real login. Anyone using this browser sees the same local data.</p>
      {!selectedAssignment ? (
        <>
          <p>Click an assignment to submit it, or to see your result.</p>
          <AssignmentList assignments={assignments} onSelect={(a) => setSelected(a.id)} />
          <h3>My results</h3>
          {!submissions.filter((s) => s.studentName === studentName).length && <p>No submissions yet.</p>}
          {submissions.filter((s) => s.studentName === studentName).map((s) => (
            <ResultCard key={s.id} submission={s} assignment={assignments.find((a) => a.id === s.assignmentId)} />
          ))}
        </>
      ) : (
        <>
          <button onClick={() => setSelected(null)}>Back to assignments</button>
          {mySubmission && mySubmission.status === 'Final' ? (
            <ResultCard submission={mySubmission} assignment={selectedAssignment} />
          ) : (
            <>
              <SubmissionForm assignment={selectedAssignment} existing={mySubmission} studentName={studentName} onSubmit={(data) => { onSubmit(selectedAssignment, mySubmission, data); }} />
              {mySubmission && <ResultCard submission={mySubmission} assignment={selectedAssignment} />}
            </>
          )}
        </>
      )}
    </div>
  )
}
