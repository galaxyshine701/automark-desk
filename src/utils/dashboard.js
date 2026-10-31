// Logic behind the dashboards. Kept out of the components so it can be tested.
// "now" is always passed in, so tests do not depend on today's date.

const DAY = 24 * 60 * 60 * 1000
const GRADES = ['A', 'B', 'C', 'D', 'Fail']

export function sortByDueDate(assignments) {
  return [...assignments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
}

// Deadline state of one assignment for one student.
// state: 'submitted' | 'overdue' | 'today' | 'soon' | 'later'
// A submitted assignment never shows as overdue: its lateness is already in the penalty.
export function deadlineInfo(assignment, submission, now = new Date()) {
  if (submission) return { state: 'submitted', label: 'Submitted', days: 0 }
  const due = new Date(assignment.dueDate).getTime()
  if (!due) return { state: 'later', label: 'No due date', days: 0 }
  const diff = due - new Date(now).getTime()
  // Exactly at the due time is still on time (same rule as the late penalty).
  if (diff < 0) {
    const days = Math.ceil(-diff / DAY)
    return { state: 'overdue', label: `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`, days }
  }
  if (diff < DAY) return { state: 'today', label: 'Due today', days: 0 }
  const days = Math.ceil(diff / DAY)
  return { state: days <= 3 ? 'soon' : 'later', label: `Due in ${days} days`, days }
}

export function studentSummary(assignments, submissions, studentName, now = new Date()) {
  const mine = submissions.filter((s) => s.studentName === studentName)
  const summary = { upcoming: 0, overdue: 0, awaiting: 0, published: 0 }
  for (const a of assignments) {
    const s = mine.find((x) => x.assignmentId === a.id)
    const info = deadlineInfo(a, s, now)
    if (info.state === 'overdue') summary.overdue += 1
    else if (info.state !== 'submitted') summary.upcoming += 1
  }
  for (const s of mine) {
    if (s.status === 'Final') summary.published += 1
    else summary.awaiting += 1
  }
  return summary
}

// Submissions the instructor still has to deal with, oldest first.
export function needsReview(submissions) {
  return submissions
    .filter((s) => s.status !== 'Final')
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
}

function hasMarks(s) {
  return s.obtainedMarks !== null && s.obtainedMarks !== undefined && typeof s.percentage === 'number'
}

// Submissions without marks yet (a project waiting for rubric scores) are left out, not counted as 0.
export function gradeDistribution(submissions) {
  const counts = Object.fromEntries(GRADES.map((g) => [g, 0]))
  for (const s of submissions) {
    if (hasMarks(s) && counts[s.grade] !== undefined) counts[s.grade] += 1
  }
  return counts
}

export function averagePercentage(submissions) {
  const scored = submissions.filter(hasMarks)
  if (!scored.length) return null
  const sum = scored.reduce((t, s) => t + s.percentage, 0)
  return Math.round((sum / scored.length) * 10) / 10
}

export function assignmentStats(assignments, submissions) {
  return assignments.map((a) => {
    const subs = submissions.filter((s) => s.assignmentId === a.id)
    return { assignment: a, submitted: subs.length, average: averagePercentage(subs) }
  })
}
