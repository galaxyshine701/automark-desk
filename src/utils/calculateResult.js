import { getLateDays, getPenaltyMarks } from './latePenalty.js'
import { getGrade } from './grading.js'

// Single source of truth for results. Project work with no rubric scores yet
// returns pending marks (null) instead of a misleading 0.
export function calculateResult(assignment, { rawMarks, submittedAt }) {
  const totalMarks = Number(assignment.totalMarks || 0)
  const lateDays = getLateDays(assignment.dueDate, submittedAt)
  if (rawMarks === null || rawMarks === undefined) {
    return { rawMarks: null, penaltyMarks: 0, obtainedMarks: null, percentage: null, grade: 'Pending', lateDays }
  }
  const penaltyMarks = getPenaltyMarks(totalMarks, lateDays)
  const obtainedMarks = Math.max(0, Math.round((Number(rawMarks) - penaltyMarks) * 100) / 100)
  const percentage = totalMarks ? Math.round((obtainedMarks / totalMarks) * 1000) / 10 : 0
  return { rawMarks: Number(rawMarks), penaltyMarks, obtainedMarks, percentage, grade: getGrade(percentage), lateDays }
}
