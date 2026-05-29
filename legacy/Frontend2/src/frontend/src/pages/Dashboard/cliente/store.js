const STORE_KEY = "trustbook_shared_v1";

export function getShared() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setShared(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
}
