// Small logo mark for the top bar: a hall front with three columns.
export default function Crest() {
  return (
    <svg className="crest" viewBox="0 0 32 32" aria-hidden="true">
      <rect className="crest-bg" x="0" y="0" width="32" height="32" rx="8" />
      <polygon className="crest-roof" points="16,6 27,12.5 5,12.5" />
      <rect className="crest-col" x="8" y="14.5" width="3.4" height="9" rx="0.8" />
      <rect className="crest-col" x="14.3" y="14.5" width="3.4" height="9" rx="0.8" />
      <rect className="crest-col" x="20.6" y="14.5" width="3.4" height="9" rx="0.8" />
      <rect className="crest-base" x="6" y="25" width="20" height="2.6" rx="1.2" />
    </svg>
  )
}
