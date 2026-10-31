// The slim banner at the top of each dashboard. It uses the same photo as the welcome screen.
export default function PageHeader({ eyebrow, title, children, actions }) {
  return (
    <header className="page-head">
      <div className="page-head-text">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children}
        {actions && <div className="page-head-actions">{actions}</div>}
      </div>
    </header>
  )
}
