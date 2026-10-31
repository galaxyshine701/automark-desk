const STEPS = [
  { title: 'Create', text: 'The instructor sets a quiz or a project with a due date and marks.' },
  { title: 'Submit', text: 'Students answer the quiz, or share a live link and a GitHub link.' },
  { title: 'Mark', text: 'The app checks the work and applies the late penalty. The instructor reviews and publishes.' }
]

export default function Welcome({ onEnter }) {
  return (
    <div className="welcome">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Coursework portal</p>
          <h1>AutoMark Desk</h1>
          <p className="hero-lead">Assignments, submissions and results in one place. The same late-penalty rule is applied to every student.</p>
          <div className="hero-actions">
            <button className="btn-light" onClick={() => onEnter('student')}>Enter as student</button>
            <button className="btn-ghost" onClick={() => onEnter('teacher')}>Enter as instructor</button>
          </div>
          <p className="hero-note">Demo build: this is a view switch, not a login.</p>
        </div>
      </section>
      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <span className="step-no" aria-hidden="true">{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
