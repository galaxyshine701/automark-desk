import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateResult } from '../src/utils/calculateResult.js'

const assignment = { totalMarks: 20, dueDate: '2026-07-10T12:00:00' }
const ON_TIME = '2026-07-10T09:00:00'

test('calculateResult: fully correct, on time', () => {
  assert.deepEqual(calculateResult(assignment, { rawMarks: 20, submittedAt: ON_TIME }), {
    rawMarks: 20,
    penaltyMarks: 0,
    obtainedMarks: 20, // 20 - 0
    percentage: 100, // 20 / 20
    grade: 'A',
    lateDays: 0,
  })
})

test('calculateResult: partly correct, on time (3 x 5 = 15)', () => {
  assert.deepEqual(calculateResult(assignment, { rawMarks: 15, submittedAt: ON_TIME }), {
    rawMarks: 15,
    penaltyMarks: 0,
    obtainedMarks: 15,
    percentage: 75, // 15 / 20
    grade: 'C',
    lateDays: 0,
  })
})

test('calculateResult: 2 days late, full marks', () => {
  assert.deepEqual(
    calculateResult(assignment, { rawMarks: 20, submittedAt: '2026-07-12T12:00:00' }),
    {
      rawMarks: 20,
      penaltyMarks: 2, // 5% * 20 * 2
      obtainedMarks: 18, // 20 - 2
      percentage: 90, // 18 / 20
      grade: 'A',
      lateDays: 2,
    },
  )
})

test('calculateResult: penalty bigger than marks never goes negative', () => {
  // 25 days late: penalty = 20 * 0.05 * 25 = 25, raw 3 - 25 < 0 -> 0
  const r = calculateResult(assignment, { rawMarks: 3, submittedAt: '2026-08-04T12:00:00' })
  assert.equal(r.lateDays, 25)
  assert.equal(r.penaltyMarks, 25)
  assert.equal(r.obtainedMarks, 0)
  assert.equal(r.percentage, 0)
  assert.equal(r.grade, 'Fail')
})

test('calculateResult: project with no rubric scores is Pending', () => {
  for (const rawMarks of [null, undefined]) {
    assert.deepEqual(calculateResult(assignment, { rawMarks, submittedAt: ON_TIME }), {
      rawMarks: null,
      penaltyMarks: 0,
      obtainedMarks: null,
      percentage: null,
      grade: 'Pending',
      lateDays: 0,
    })
  }
})

test('calculateResult: Pending stays Pending even when late', () => {
  const r = calculateResult(assignment, { rawMarks: null, submittedAt: '2026-07-12T12:00:00' })
  assert.equal(r.grade, 'Pending')
  assert.equal(r.obtainedMarks, null)
  assert.equal(r.penaltyMarks, 0)
  assert.equal(r.lateDays, 2)
})

test('calculateResult: raw 0 is a real Fail, not Pending', () => {
  const r = calculateResult(assignment, { rawMarks: 0, submittedAt: ON_TIME })
  assert.equal(r.obtainedMarks, 0)
  assert.equal(r.percentage, 0)
  assert.equal(r.grade, 'Fail')
})
