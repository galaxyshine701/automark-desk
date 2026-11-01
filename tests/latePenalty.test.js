import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getLateDays, getPenaltyMarks } from '../src/utils/latePenalty.js'

const DUE = '2026-07-10T12:00:00'

test('getLateDays: on time or early is 0', () => {
  assert.equal(getLateDays(DUE, '2026-07-10T11:00:00'), 0)
  assert.equal(getLateDays(DUE, '2026-07-01T12:00:00'), 0)
})

test('getLateDays: exactly at due time is 0', () => {
  assert.equal(getLateDays(DUE, '2026-07-10T12:00:00'), 0)
})

test('getLateDays: 1 minute late is 1 day (rounds up)', () => {
  assert.equal(getLateDays(DUE, '2026-07-10T12:01:00'), 1) // ceil(1/1440) = 1
})

test('getLateDays: exactly 24 hours late is 1 day', () => {
  assert.equal(getLateDays(DUE, '2026-07-11T12:00:00'), 1) // 24h / 24h = 1
})

test('getLateDays: 24 hours + 1 minute is 2 days', () => {
  assert.equal(getLateDays(DUE, '2026-07-11T12:01:00'), 2) // ceil(1.0007) = 2
})

test('getLateDays: exactly 48 hours late is 2 days', () => {
  assert.equal(getLateDays(DUE, '2026-07-12T12:00:00'), 2) // 48h / 24h = 2
})

test('getLateDays: broken or missing dates give 0', () => {
  assert.equal(getLateDays(DUE, 'not a date'), 0)
  assert.equal(getLateDays('garbage', '2026-07-12T12:00:00'), 0)
  assert.equal(getLateDays(DUE, undefined), 0)
  assert.equal(getLateDays(DUE, null), 0)
  assert.equal(getLateDays(undefined, '2026-07-12T12:00:00'), 0)
  assert.equal(getLateDays(null, '2026-07-12T12:00:00'), 0)
  assert.equal(getLateDays('', ''), 0)
})

test('getPenaltyMarks: 5% of total per late day', () => {
  assert.equal(getPenaltyMarks(20, 1), 1) // 20 * 0.05 * 1
  assert.equal(getPenaltyMarks(20, 2), 2) // 20 * 0.05 * 2
  assert.equal(getPenaltyMarks(100, 3), 15) // 100 * 0.05 * 3
  assert.equal(getPenaltyMarks(30, 1), 1.5) // 30 * 0.05
})

test('getPenaltyMarks: zero when not late or no total', () => {
  assert.equal(getPenaltyMarks(20, 0), 0)
  assert.equal(getPenaltyMarks(0, 3), 0)
  assert.equal(getPenaltyMarks(undefined, 3), 0)
})

test('getPenaltyMarks: custom rate', () => {
  assert.equal(getPenaltyMarks(20, 2, 0.1), 4) // 20 * 0.1 * 2
})
