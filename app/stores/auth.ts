import { defineStore } from 'pinia'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  initials: string
  color: string
  fg: string
  orgName: string
}

// Avatar palette — owner gets the brand accent, others cycle these.
const PALETTE = [
  { color: '#2563eb', fg: '#fff' },
  { color: '#16a34a', fg: '#fff' },
  { color: '#9333ea', fg: '#fff' },
  { color: '#ea580c', fg: '#fff' },
  { color: '#0891b2', fg: '#fff' }
]

export function makeInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || '?'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: [] as User[],
    currentUserId: null as string | null
  }),
  getters: {
    currentUser(state): User | null {
      return state.users.find(u => u.id === state.currentUserId) ?? null
    }
  },
  actions: {
    findByEmail(email: string): User | undefined {
      const e = email.trim().toLowerCase()
      return this.users.find(u => u.email.toLowerCase() === e)
    },
    // Adds a user without logging in (used by invites + seed). Returns existing user if email taken.
    addUser(u: Omit<User, 'id' | 'initials' | 'color' | 'fg'> & { id?: string, color?: string, fg?: string }): User {
      const existing = this.findByEmail(u.email)
      if (existing) return existing
      const pick = PALETTE[this.users.length % PALETTE.length]!
      const user: User = {
        id: u.id ?? crypto.randomUUID(),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email.trim(),
        password: u.password,
        initials: makeInitials(u.firstName, u.lastName),
        color: u.color ?? pick.color,
        fg: u.fg ?? pick.fg,
        orgName: u.orgName
      }
      this.users.push(user)
      return user
    },
    register(firstName: string, lastName: string, email: string, password: string, orgName: string): { ok: boolean, error?: string } {
      if (this.findByEmail(email)) return { ok: false, error: 'An account with this email already exists.' }
      // Owner uses the brand accent avatar.
      const user = this.addUser({ firstName, lastName, email, password, orgName, color: 'var(--accent)', fg: 'var(--accent-fg)' })
      this.currentUserId = user.id
      return { ok: true }
    },
    login(email: string, password: string): { ok: boolean, error?: string } {
      const user = this.findByEmail(email)
      if (!user || user.password !== password) return { ok: false, error: 'Invalid email or password.' }
      this.currentUserId = user.id
      return { ok: true }
    },
    logout() {
      this.currentUserId = null
    }
  }
})
