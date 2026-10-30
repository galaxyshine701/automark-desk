// Exact match against the teacher's stored correct answer. No AI is involved.
export function checkMCQ(assignment, answers) {
  let rawMarks = 0
  const details = (assignment.questions || []).map((q, i) => {
    const given = answers ? answers[i] : undefined
    const correct = given !== undefined && given !== '' && String(given).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
    if (correct) rawMarks += Number(q.marks || 0)
    return { question: q.text, given: given ?? '', correctAnswer: q.correctAnswer, marks: q.marks, correct }
  })
  return { rawMarks, details }
}
