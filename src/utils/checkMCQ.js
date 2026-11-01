// Exact match against the teacher's stored correct answer. No AI is involved.
// Capital letters and extra spaces (start, end or middle) do not matter.
function normalize(value) {
  if (value === undefined || value === null) return ''
  return String(value).trim().toLowerCase().replace(/\s+/g, ' ')
}

// True when the question's stored correct answer is one of its options.
export function correctAnswerIsAnOption(question) {
  const correct = normalize(question && question.correctAnswer)
  if (!correct) return false
  return (question.options || []).some((opt) => normalize(opt) === correct)
}

export function checkMCQ(assignment, answers) {
  let rawMarks = 0
  const details = (assignment.questions || []).map((q, i) => {
    const given = answers ? answers[i] : undefined
    const stored = normalize(q.correctAnswer)
    const correct = stored !== '' && normalize(given) === stored
    if (correct) rawMarks += Number(q.marks || 0)
    return { question: q.text, given: given ?? '', correctAnswer: q.correctAnswer, marks: q.marks, correct }
  })
  return { rawMarks, details }
}
