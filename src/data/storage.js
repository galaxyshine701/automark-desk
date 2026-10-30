const KEY = 'atrm-v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Demo storage only; a full disk should not crash the demo.
  }
}

export function resetState() {
  localStorage.removeItem(KEY)
}
