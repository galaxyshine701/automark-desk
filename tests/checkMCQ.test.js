import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkMCQ, correctAnswerIsAnOption } from '../src/utils/checkMCQ.js'

const make = (correctAnswer, marks = 2) => ({
  questions: [{ text: 'Q1', correctAnswer, marks }],
})

test('checkMCQ: correct answer gets the question marks', () => {
  const r = checkMCQ(make('Paris', 3), ['Paris'])
  assert.equal(r.rawMarks, 3)
  assert.equal(r.details[0].correct, true)
})

test('checkMCQ: wrong answer gets 0', () => {
  const r = checkMCQ(make('Paris', 3), ['London'])
  assert.equal(r.rawMarks, 0)
  assert.equal(r.details[0].correct, false)
})

test('checkMCQ: capital letters do not matter (both directions)', () => {
  assert.equal(checkMCQ(make('paris'), ['PARIS']).rawMarks, 2)
  assert.equal(checkMCQ(make('PARIS'), ['paris']).rawMarks, 2)
  assert.equal(checkMCQ(make('Paris'), ['pArIs']).rawMarks, 2)
})

test('checkMCQ: spaces at start and end are ignored', () => {
  assert.equal(checkMCQ(make('paris'), ['   paris   ']).rawMarks, 2)
  assert.equal(checkMCQ(make('  paris  '), ['paris']).rawMarks, 2)
})

test('checkMCQ: repeated spaces in the middle are collapsed', () => {
  const a = make('cascading style sheets')
  assert.equal(checkMCQ(a, ['cascading   style   sheets']).rawMarks, 2)
  assert.equal(checkMCQ(make('cascading   style   sheets'), ['cascading style sheets']).rawMarks, 2)
})

test('checkMCQ: different words in the middle are still wrong', () => {
  assert.equal(checkMCQ(make('cascading style sheets'), ['cascading  style  sheet']).rawMarks, 0)
})

test('checkMCQ: undefined stored answer never gives marks', () => {
  for (const given of ['', 'undefined', 'null', undefined, 'anything']) {
    const r = checkMCQ(make(undefined), [given])
    assert.equal(r.rawMarks, 0, `given ${JSON.stringify(given)}`)
    assert.equal(r.details[0].correct, false)
  }
})

test('checkMCQ: null stored answer never gives marks', () => {
  for (const given of ['', 'undefined', 'null', undefined, 'anything']) {
    const r = checkMCQ(make(null), [given])
    assert.equal(r.rawMarks, 0, `given ${JSON.stringify(given)}`)
    assert.equal(r.details[0].correct, false)
  }
})

test('checkMCQ: empty-string stored answer never gives marks', () => {
  for (const given of ['', '   ', 'undefined', 'null', undefined]) {
    const r = checkMCQ(make(''), [given])
    assert.equal(r.rawMarks, 0, `given ${JSON.stringify(given)}`)
    assert.equal(r.details[0].correct, false)
  }
})

test('checkMCQ: marks add up across questions', () => {
  const a = {
    questions: [
      { text: 'A', correctAnswer: 'x', marks: 2 },
      { text: 'B', correctAnswer: 'y', marks: 3 },
      { text: 'C', correctAnswer: undefined, marks: 5 },
    ],
  }
  // 2 (correct) + 0 (wrong) + 0 (no stored answer)
  assert.equal(checkMCQ(a, ['X', 'z', 'undefined']).rawMarks, 2)
})

const opts = ['Paris', 'London', 'Cascading Style Sheets', 'Rome']

test('correctAnswerIsAnOption: exact option is accepted', () => {
  assert.equal(correctAnswerIsAnOption({ options: opts, correctAnswer: 'Paris' }), true)
})

test('correctAnswerIsAnOption: capitals and spaces are ignored, as in grading', () => {
  assert.equal(correctAnswerIsAnOption({ options: opts, correctAnswer: '  paris ' }), true)
  assert.equal(correctAnswerIsAnOption({ options: opts, correctAnswer: 'cascading   style   sheets' }), true)
})

test('correctAnswerIsAnOption: a typing mistake is refused', () => {
  assert.equal(correctAnswerIsAnOption({ options: opts, correctAnswer: 'Pariss' }), false)
  assert.equal(correctAnswerIsAnOption({ options: opts, correctAnswer: 'Berlin' }), false)
})

test('correctAnswerIsAnOption: missing or blank answer is refused', () => {
  for (const correctAnswer of [undefined, null, '', '   ']) {
    assert.equal(correctAnswerIsAnOption({ options: opts, correctAnswer }), false)
  }
})

test('correctAnswerIsAnOption: blank answer is refused even if an option is blank', () => {
  assert.equal(correctAnswerIsAnOption({ options: ['', 'a', 'b', 'c'], correctAnswer: '' }), false)
})

test('correctAnswerIsAnOption: question without options is refused', () => {
  assert.equal(correctAnswerIsAnOption({ correctAnswer: 'Paris' }), false)
  assert.equal(correctAnswerIsAnOption(undefined), false)
})
