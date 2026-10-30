import { checkMCQ } from '../utils/checkMCQ.js'
import { calculateResult } from '../utils/calculateResult.js'

function withResult(assignment, submission) {
  let raw = submission.rawMarks
  if (assignment.type === 'MCQ') {
    raw = checkMCQ(assignment, submission.answers).rawMarks
  }
  return { ...submission, ...calculateResult(assignment, { rawMarks: raw, submittedAt: submission.submittedAt }) }
}

export const demoAssignments = [
  {
    id: 'a-mcq-1',
    title: 'English Grammar — Tenses',
    className: 'Class 8',
    type: 'MCQ',
    dueDate: '2026-11-10T17:00',
    totalMarks: 20,
    latePenaltyPerDay: '5% of total marks per late day',
    questions: [
      { text: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 'goes', marks: 5 },
      { text: 'They ___ football yesterday.', options: ['play', 'plays', 'played', 'playing'], correctAnswer: 'played', marks: 5 },
      { text: 'I ___ my homework now.', options: ['do', 'am doing', 'did', 'done'], correctAnswer: 'am doing', marks: 5 },
      { text: 'He has ___ his lunch.', options: ['eat', 'eats', 'eaten', 'eating'], correctAnswer: 'eaten', marks: 5 }
    ],
    rubric: []
  },
  {
    id: 'a-mcq-late',
    title: 'English Grammar — Late Example (for testing)',
    className: 'Class 8',
    type: 'MCQ',
    dueDate: '2026-10-20T17:00',
    totalMarks: 20,
    latePenaltyPerDay: '5% of total marks per late day',
    questions: [
      { text: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 'goes', marks: 5 },
      { text: 'They ___ football yesterday.', options: ['play', 'plays', 'played', 'playing'], correctAnswer: 'played', marks: 5 },
      { text: 'I ___ my homework now.', options: ['do', 'am doing', 'did', 'done'], correctAnswer: 'am doing', marks: 5 },
      { text: 'He has ___ his lunch.', options: ['eat', 'eats', 'eaten', 'eating'], correctAnswer: 'eaten', marks: 5 }
    ],
    rubric: []
  },
  {
    id: 'a-project-1',
    title: 'My First Website — Project',
    className: 'Class 9',
    type: 'PROJECT',
    dueDate: '2026-11-12T17:00',
    totalMarks: 25,
    latePenaltyPerDay: '5% of total marks per late day',
    questions: [],
    rubric: [
      { criterion: 'Design', marks: 10 },
      { criterion: 'Functionality', marks: 10 },
      { criterion: 'Completeness', marks: 5 }
    ]
  }
]

const rawSubmissions = [
  {
    id: 's-ontime',
    assignmentId: 'a-mcq-1',
    studentName: 'Demo Student',
    submittedAt: '2026-10-28T10:00',
    answers: ['goes', 'played', 'am doing', 'eat'],
    liveLink: '',
    githubLink: '',
    note: '',
    status: 'Final',
    feedback: 'Good work. Revise the present perfect tense.',
    overrideReason: ''
  },
  {
    id: 's-late',
    assignmentId: 'a-mcq-late',
    studentName: 'Demo Student',
    submittedAt: '2026-10-22T17:00',
    answers: ['goes', 'played', 'am doing', 'eaten'],
    liveLink: '',
    githubLink: '',
    note: '',
    status: 'Checked',
    feedback: '',
    overrideReason: ''
  },
  {
    id: 's-project',
    assignmentId: 'a-project-1',
    studentName: 'Demo Student',
    submittedAt: '2026-10-28T11:00',
    answers: [],
    liveLink: 'https://example.com/demo-website',
    githubLink: 'https://github.com/example/demo-website',
    note: 'A simple homepage with three sections.',
    status: 'Checked',
    feedback: '',
    overrideReason: '',
    rubricScores: null
  }
]

export const demoSubmissions = rawSubmissions.map((s) => {
  const assignment = demoAssignments.find((a) => a.id === s.assignmentId)
  if (!assignment) return s
  if (assignment.type === 'PROJECT') {
    return { ...s, ...calculateResult(assignment, { rawMarks: null, submittedAt: s.submittedAt }) }
  }
  return withResult(assignment, s)
})
