import Crest from './Crest.jsx'

export default function AppBar({ view, onView, onHome, courseName }) {
  return (
    <nav className="appbar" aria-label="Main">
      <div className="appbar-inner">
        <button className="brand-link" onClick={onHome} aria-label="AutoMark Desk, back to the welcome screen">
          <Crest />
          <span className="brand-text">
            <strong>AutoMark Desk</strong>
            <small>{courseName}</small>
          </span>
        </button>
        <div className="segmented" role="group" aria-label="Choose a view">
          <button aria-pressed={view === 'student'} onClick={() => onView('student')}>Student</button>
          <button aria-pressed={view === 'teacher'} onClick={() => onView('teacher')}>Instructor</button>
        </div>
      </div>
    </nav>
  )
}
