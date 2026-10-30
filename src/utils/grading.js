export function getGrade(percentage) {
  if (percentage === null || percentage === undefined) return 'Pending'
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'Fail'
}
