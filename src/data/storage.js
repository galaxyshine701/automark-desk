const KEY = 'atrm-v1'

// Returns the saved state, or null when nothing usable is saved
// (missing, broken JSON, wrong shape, or storage blocked/unavailable).
export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.assignments) || !Array.isArray(parsed.submissions)) return null
    return parsed
  } catch {
    return null
  }
}

// Returns true when saved, false on any error (full, blocked, unavailable).
export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function resetState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Storage blocked or unavailable: nothing to reset.
  }
}
