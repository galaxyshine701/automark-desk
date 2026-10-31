import { checkMCQ } from '../utils/checkMCQ.js'
import { calculateResult } from '../utils/calculateResult.js'

// Dates are worked out from today, so the demo always shows a believable mix of
// past, due-soon and overdue work, whenever the app is opened.
const pad = (n) => String(n).padStart(2, '0')
const stamp = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
function daysFromToday(days, hour = 17) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, 0, 0, 0)
  return d
}

function withResult(assignment, submission) {
  let raw = submission.rawMarks
  if (assignment.type === 'MCQ') {
    raw = checkMCQ(assignment, submission.answers).rawMarks
  }
  return { ...submission, ...calculateResult(assignment, { rawMarks: raw, submittedAt: submission.submittedAt }) }
}

export const COURSE = 'CS-210 Web Development'
const LATE_RULE = '5% of total marks per late day'

const quiz1Due = daysFromToday(-14)
const quiz2Due = daysFromToday(-10)

export const demoAssignments = [
  {
    id: 'a-mcq-1',
    title: 'Quiz 1 — HTML Fundamentals',
    className: COURSE,
    type: 'MCQ',
    dueDate: stamp(quiz1Due),
    totalMarks: 20,
    latePenaltyPerDay: LATE_RULE,
    questions: [
      { text: 'Which HTML tag creates the largest heading?', options: ['<h6>', '<head>', '<h1>', '<header>'], correctAnswer: '<h1>', marks: 5 },
      { text: 'Which attribute gives an image text for screen readers?', options: ['src', 'alt', 'title', 'href'], correctAnswer: 'alt', marks: 5 },
      { text: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], correctAnswer: 'Cascading Style Sheets', marks: 5 },
      { text: 'Which tag creates a hyperlink?', options: ['<a>', '<link>', '<href>', '<p>'], correctAnswer: '<a>', marks: 5 }
    ],
    rubric: []
  },
  {
    id: 'a-mcq-late',
    title: 'Quiz 2 — CSS Fundamentals',
    className: COURSE,
    type: 'MCQ',
    dueDate: stamp(quiz2Due),
    totalMarks: 20,
    latePenaltyPerDay: LATE_RULE,
    questions: [
      { text: 'Which CSS property changes the text colour?', options: ['color', 'font-color', 'text-color', 'foreground'], correctAnswer: 'color', marks: 5 },
      { text: 'Which property adds space inside an element, between its content and its border?', options: ['margin', 'padding', 'spacing', 'gap'], correctAnswer: 'padding', marks: 5 },
      { text: 'Which selector targets every element with the class "card"?', options: ['#card', '.card', 'card', '*card'], correctAnswer: '.card', marks: 5 },
      { text: 'Which declaration turns an element into a flex container?', options: ['display: flex', 'flex: display', 'layout: flex', 'position: flex'], correctAnswer: 'display: flex', marks: 5 }
    ],
    rubric: []
  },
  {
    id: 'a-mcq-3',
    title: 'Quiz 3 — JavaScript Basics',
    className: COURSE,
    type: 'MCQ',
    dueDate: stamp(daysFromToday(2)),
    totalMarks: 20,
    latePenaltyPerDay: LATE_RULE,
    questions: [
      { text: 'Which keyword declares a variable that cannot be reassigned?', options: ['var', 'let', 'const', 'set'], correctAnswer: 'const', marks: 5 },
      { text: 'What does the === operator compare?', options: ['Value only', 'Value and type', 'Type only', 'Memory address'], correctAnswer: 'Value and type', marks: 5 },
      { text: 'Which array method adds an item to the end?', options: ['push', 'pop', 'shift', 'slice'], correctAnswer: 'push', marks: 5 },
      { text: 'Which call writes a message to the browser console?', options: ['console.log()', 'print()', 'echo()', 'document.say()'], correctAnswer: 'console.log()', marks: 5 }
    ],
    rubric: []
  },
  {
    id: 'a-project-1',
    title: 'Course Project — Personal Portfolio Website',
    className: COURSE,
    type: 'PROJECT',
    dueDate: stamp(daysFromToday(12)),
    totalMarks: 25,
    latePenaltyPerDay: LATE_RULE,
    questions: [],
    rubric: [
      { criterion: 'Design and usability', marks: 10 },
      { criterion: 'Functionality', marks: 10 },
      { criterion: 'Documentation', marks: 5 }
    ]
  },
  {
    id: 'a-lab-1',
    title: 'Lab 1 — Git and GitHub Basics',
    className: COURSE,
    type: 'PROJECT',
    dueDate: stamp(daysFromToday(-2)),
    totalMarks: 25,
    latePenaltyPerDay: LATE_RULE,
    questions: [],
    rubric: [
      { criterion: 'Repository set up', marks: 10 },
      { criterion: 'Commit history', marks: 10 },
      { criterion: 'README', marks: 5 }
    ]
  }
]

const rawSubmissions = [
  {
    // On time, three of four correct, already published.
    id: 's-ontime',
    assignmentId: 'a-mcq-1',
    studentName: 'Demo Student',
    submittedAt: stamp(daysFromToday(-15, 10)),
    answers: ['<h1>', 'alt', 'Cascading Style Sheets', '<link>'],
    liveLink: '',
    githubLink: '',
    note: '',
    status: 'Final',
    feedback: 'Good work. Revise which tag creates a hyperlink.',
    overrideReason: ''
  },
  {
    // All correct but 36 hours after the due time: that counts as 2 late days.
    id: 's-late',
    assignmentId: 'a-mcq-late',
    studentName: 'Demo Student',
    submittedAt: stamp(new Date(quiz2Due.getTime() + 36 * 60 * 60 * 1000)),
    answers: ['color', 'padding', '.card', 'display: flex'],
    liveLink: '',
    githubLink: '',
    note: '',
    status: 'Checked',
    feedback: '',
    overrideReason: ''
  },
  {
    // Project handed in on time; marks stay Pending until the instructor scores the rubric.
    id: 's-project',
    assignmentId: 'a-project-1',
    studentName: 'Demo Student',
    submittedAt: stamp(daysFromToday(-1, 11)),
    answers: [],
    liveLink: 'https://example.com/demo-website',
    githubLink: 'https://github.com/example/demo-website',
    note: 'Portfolio site with About, Projects and Contact sections.',
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
