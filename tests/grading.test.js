import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getGrade } from '../src/utils/grading.js'

test('getGrade: exact cut-offs', () => {
  assert.equal(getGrade(90), 'A')
  assert.equal(getGrade(80), 'B')
  assert.equal(getGrade(70), 'C')
  assert.equal(getGrade(60), 'D')
})

test('getGrade: just below each cut-off drops a grade', () => {
  assert.equal(getGrade(89.9), 'B')
  assert.equal(getGrade(79.9), 'C')
  assert.equal(getGrade(69.9), 'D')
  assert.equal(getGrade(59.9), 'Fail')
})

test('getGrade: extremes', () => {
  assert.equal(getGrade(0), 'Fail') // 0% is a real score, not Pending
  assert.equal(getGrade(100), 'A')
})

test('getGrade: null/undefined is Pending, not Fail', () => {
  assert.equal(getGrade(null), 'Pending')
  assert.equal(getGrade(undefined), 'Pending')
})
