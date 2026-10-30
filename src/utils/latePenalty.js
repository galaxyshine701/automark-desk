export function getLateDays(dueDate, submittedAt) {
  const due = new Date(dueDate).getTime()
  const submitted = new Date(submittedAt).getTime()
  if (!due || !submitted || submitted <= due) return 0
  return Math.ceil((submitted - due) / (1000 * 60 * 60 * 24))
}

// Penalty rule, as approved: 5% of the assignment total marks per late day.
export function getPenaltyMarks(totalMarks, lateDays, ratePerDay = 0.05) {
  if (!totalMarks || !lateDays) return 0
  return Math.round(totalMarks * ratePerDay * lateDays * 100) / 100
}
