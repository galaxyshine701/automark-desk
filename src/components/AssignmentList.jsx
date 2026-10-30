export default function AssignmentList({ assignments, onSelect }) {
  if (!assignments.length) return <p>No assignments yet. Create one from the Teacher view.</p>
  return (
    <div className="list">
      {assignments.map((a) => (
        <div key={a.id} className="card" onClick={() => onSelect && onSelect(a)} role={onSelect ? 'button' : undefined}>
          <h3>{a.title}</h3>
          <p>{a.className} — {a.type === 'MCQ' ? 'MCQ / Fill-in' : 'Project / Website'} — {a.totalMarks} marks</p>
          <p>Due: {new Date(a.dueDate).toLocaleString()}</p>
          <p className="muted">Late rule: {a.latePenaltyPerDay}</p>
        </div>
      ))}
    </div>
  )
}
