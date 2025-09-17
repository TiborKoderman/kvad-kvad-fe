// auth-manager.ts
type Listener = (token: string | null) => void;

class AuthManager {
  private token: string | null;
  private listeners = new Set<Listener>();

  constructor(private storageKey = 'token') {
    this.token = (typeof window !== 'undefined')
      ? localStorage.getItem(storageKey)
      : null;

    // Cross-tab sync
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.storageKey) {
          this.token = e.newValue;
          this.emit();
        }
      });
    }
  }

  getToken() { return this.token; }

  setToken(tok: string | null) {
    this.token = tok;
    if (typeof window !== 'undefined') {
      if (tok) localStorage.setItem(this.storageKey, tok);
      else localStorage.removeItem(this.storageKey);
    }
    this.emit();
  }

  clear() { this.setToken(null); }

  subscribe(fn: Listener) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  private emit() { for (const fn of this.listeners) fn(this.token); }
}

export const authManager = new AuthManager();
