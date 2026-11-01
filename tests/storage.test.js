import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { loadState, saveState, resetState } from '../src/data/storage.js'

const KEY = 'atrm-v1'
const hadStorage = Object.prototype.hasOwnProperty.call(globalThis, 'localStorage')
const originalStorage = globalThis.localStorage

let data

function makeStorage(overrides = {}) {
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v) },
    removeItem: (k) => { delete data[k] },
    ...overrides,
  }
}

function domError(name) {
  const e = new Error(name)
  e.name = name
  return e
}

beforeEach(() => {
  data = {}
  globalThis.localStorage = makeStorage()
})

afterEach(() => {
  if (hadStorage) globalThis.localStorage = originalStorage
  else delete globalThis.localStorage
})

test('loadState: returns null when nothing is saved', () => {
  assert.equal(loadState(), null)
})

test('saveState/loadState: round trip returns true and the same data', () => {
  const state = {
    assignments: [{ id: 'a1', title: 'Quiz 1' }],
    submissions: [{ id: 's1', assignmentId: 'a1', answers: ['Paris'] }],
  }
  assert.equal(saveState(state), true)
  assert.deepEqual(loadState(), state)
})

test('loadState: corrupted JSON gives null', () => {
  data[KEY] = '{not valid json'
  assert.equal(loadState(), null)
})

const wrongShapes = [
  ['plain string', '"abc"'],
  ['null', 'null'],
  ['array', '[]'],
  ['assignments not a list', '{"assignments":"abc","submissions":[]}'],
  ['submissions missing', '{"assignments":[]}'],
  ['submissions an object', '{"assignments":[],"submissions":{}}'],
]
for (const [name, raw] of wrongShapes) {
  test(`loadState: wrong shape (${name}) gives null`, () => {
    data[KEY] = raw
    assert.equal(loadState(), null)
  })
}

test('loadState: blocked read (getItem throws) gives null and does not throw', () => {
  globalThis.localStorage = makeStorage({
    getItem: () => { throw domError('SecurityError') },
  })
  assert.doesNotThrow(() => loadState())
  assert.equal(loadState(), null)
})

test('saveState: full storage (QuotaExceededError) returns false and does not throw', () => {
  globalThis.localStorage = makeStorage({
    setItem: () => { throw domError('QuotaExceededError') },
  })
  let result
  assert.doesNotThrow(() => { result = saveState({ assignments: [], submissions: [] }) })
  assert.equal(result, false)
})

test('saveState: blocked write (SecurityError) returns false and does not throw', () => {
  globalThis.localStorage = makeStorage({
    setItem: () => { throw domError('SecurityError') },
  })
  let result
  assert.doesNotThrow(() => { result = saveState({ assignments: [], submissions: [] }) })
  assert.equal(result, false)
})

test('resetState: blocked reset (removeItem throws) does not throw', () => {
  globalThis.localStorage = makeStorage({
    removeItem: () => { throw domError('SecurityError') },
  })
  assert.doesNotThrow(() => resetState())
})

test('no localStorage at all: loadState null, saveState false, resetState does not throw', () => {
  delete globalThis.localStorage
  assert.equal(loadState(), null)
  assert.equal(saveState({ assignments: [], submissions: [] }), false)
  assert.doesNotThrow(() => resetState())
})
