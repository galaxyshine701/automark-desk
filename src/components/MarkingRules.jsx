// The rules the app applies. Kept in one place so students and instructors read the same thing.
export default function MarkingRules() {
  return (
    <section className="panel" aria-labelledby="rules-title">
      <h2 id="rules-title">Marking rules</h2>
      <ul className="rules">
        <li><strong>Late penalty:</strong> 5% of the total marks for each late day. One minute late counts as one day.</li>
        <li><strong>Grades:</strong> A 90% and above, B 80–89%, C 70–79%, D 60–69%, below that Fail.</li>
        <li><strong>Status:</strong> Checked, then Reviewed, then Final. A result is official only when it is Final.</li>
      </ul>
    </section>
  )
}
