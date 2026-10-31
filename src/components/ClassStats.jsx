import { gradeDistribution, averagePercentage, assignmentStats } from '../utils/dashboard.js'

const GRADES = ['A', 'B', 'C', 'D', 'Fail']

// Grade distribution and per-assignment averages. Submissions without marks yet
// (a project waiting for rubric scores) are left out, not counted as zero.
export default function ClassStats({ assignments, submissions }) {
  const dist = gradeDistribution(submissions)
  const scored = Math.max(1, GRADES.reduce((t, g) => t + dist[g], 0))
  const average = averagePercentage(submissions)
  const rows = assignmentStats(assignments, submissions)

  return (
    <section className="panel" aria-labelledby="class-stats-title">
      <h2 id="class-stats-title">Class statistics</h2>
      <p className="panel-figure">
        <span className="big">{average === null ? '–' : `${average}%`}</span>
        <span className="meta">average of submissions that have marks</span>
      </p>

      <h3 className="panel-sub">Grade distribution (share of marked work)</h3>
      <ul className="bars">
        {GRADES.map((g) => (
          <li key={g}>
            <span className="bar-label">{g}</span>
            <span className="bar-track"><span className="bar-fill" style={{ width: `${(dist[g] / scored) * 100}%` }} /></span>
            <span className="bar-count">{dist[g]}</span>
          </li>
        ))}
      </ul>

      <h3 className="panel-sub">By assignment</h3>
      <table className="mini-table">
        <thead>
          <tr><th scope="col">Assignment</th><th scope="col">Handed in</th><th scope="col">Avg</th></tr>
        </thead>
        <tbody>
          {rows.map(({ assignment, submitted, average: avg }) => (
            <tr key={assignment.id}>
              <th scope="row">{assignment.title}</th>
              <td>{submitted}</td>
              <td>{avg === null ? '–' : `${avg}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
