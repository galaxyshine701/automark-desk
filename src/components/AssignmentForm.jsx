import { useState } from 'react'
import { correctAnswerIsAnOption } from '../utils/checkMCQ.js'

const emptyQuestion = () => ({ text: '', options: ['', '', '', ''], correctAnswer: '', marks: 5 })
const emptyRubric = () => ({ criterion: '', marks: 5 })

export default function AssignmentForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [className, setClassName] = useState('CS-210 Web Development')
  const [type, setType] = useState('MCQ')
  const [dueDate, setDueDate] = useState('')
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [rubric, setRubric] = useState([{ criterion: 'Design', marks: 10 }, { criterion: 'Functionality', marks: 10 }, { criterion: 'Completeness', marks: 5 }])
  const [error, setError] = useState('')

  const totalMarks = type === 'MCQ'
    ? questions.reduce((s, q) => s + Number(q.marks || 0), 0)
    : rubric.reduce((s, r) => s + Number(r.marks || 0), 0)

  function submit(e) {
    e.preventDefault()
    if (!title.trim() || !dueDate) { setError('Title and due date are required.'); return }
    if (type === 'MCQ') {
      const bad = questions.some((q) => !q.text.trim() || !q.correctAnswer.trim() || q.options.some((o) => !o.trim()))
      if (bad) { setError('Every MCQ question needs text, four options and a correct answer.'); return }
      const badIndex = questions.findIndex((q) => !correctAnswerIsAnOption(q))
      if (badIndex !== -1) {
        setError(`Question ${badIndex + 1}: the correct answer "${questions[badIndex].correctAnswer.trim()}" does not match any of its four options. Fix it before saving.`)
        return
      }
    } else {
      const bad = rubric.some((r) => !r.criterion.trim() || !r.marks)
      if (bad) { setError('Every rubric row needs a criterion and marks.'); return }
    }
    setError('')
    onCreate({
      id: `a-${Date.now()}`,
      title: title.trim(),
      className,
      type,
      dueDate,
      totalMarks,
      latePenaltyPerDay: '5% of total marks per late day',
      questions: type === 'MCQ' ? questions : [],
      rubric: type === 'PROJECT' ? rubric : []
    })
    setTitle(''); setDueDate(''); setQuestions([emptyQuestion()])
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h3>Create assignment</h3>
      {error && <p className="error">{error}</p>}
      <label>Title <input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
      <label>Course <input value={className} onChange={(e) => setClassName(e.target.value)} /></label>
      <label>Type
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="MCQ">Quiz (MCQ)</option>
          <option value="PROJECT">Project</option>
        </select>
      </label>
      <label>Due date and time <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required /></label>
      <p className="muted">Late rule (fixed for this demo): 5% of total marks per late day. Total marks: {totalMarks}</p>

      {type === 'MCQ' ? (
        <>
          {questions.map((q, qi) => (
            <fieldset key={qi}>
              <legend>Question {qi + 1}</legend>
              <label>Question <input value={q.text} onChange={(e) => { const c = [...questions]; c[qi].text = e.target.value; setQuestions(c) }} /></label>
              {q.options.map((opt, oi) => (
                <label key={oi}>Option {oi + 1} <input value={opt} onChange={(e) => { const c = [...questions]; c[qi].options[oi] = e.target.value; setQuestions(c) }} /></label>
              ))}
              <label>Correct answer (must match one option exactly) <input value={q.correctAnswer} onChange={(e) => { const c = [...questions]; c[qi].correctAnswer = e.target.value; setQuestions(c) }} /></label>
              <label>Marks <input type="number" min="1" value={q.marks} onChange={(e) => { const c = [...questions]; c[qi].marks = Number(e.target.value); setQuestions(c) }} /></label>
            </fieldset>
          ))}
          <button type="button" onClick={() => setQuestions([...questions, emptyQuestion()])}>Add question</button>
        </>
      ) : (
        <>
          {rubric.map((r, ri) => (
            <div key={ri} className="row">
              <label>Criterion <input value={r.criterion} onChange={(e) => { const c = [...rubric]; c[ri].criterion = e.target.value; setRubric(c) }} /></label>
              <label>Marks <input type="number" min="1" value={r.marks} onChange={(e) => { const c = [...rubric]; c[ri].marks = Number(e.target.value); setRubric(c) }} /></label>
            </div>
          ))}
          <button type="button" onClick={() => setRubric([...rubric, emptyRubric()])}>Add rubric row</button>
        </>
      )}
      <button type="submit" className="primary">Create assignment</button>
    </form>
  )
}
