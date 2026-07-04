import type { Pinia, PiniaPluginContext } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useProjectsStore } from '~/stores/projects'
import { useRolesStore } from '~/stores/roles'
import { useDocumentsStore, type Doc } from '~/stores/documents'

// Only these domain stores persist; `app` keeps its own theme key.
const PERSIST_IDS = ['auth', 'projects', 'roles', 'documents']

const v5Content = `<h1>Authentication Guide</h1><h2>Overview</h2><p>The DevVault API uses token-based authentication via Laravel Sanctum. All authenticated endpoints require a valid Bearer token in the <code>Authorization</code> header.</p><h2>Obtaining a Token</h2><p>POST to <code>/api/login</code> with credentials to receive a token.</p>`
const v4Content = `<h1>Authentication Guide</h1><h2>Overview</h2><p>The DevVault API uses token-based authentication via Laravel Sanctum.</p><h2>Single Sign-On</h2><p>SSO is supported via SAML 2.0. Token lifetime is 8 hours by default.</p>`
const v3Content = `<h1>Authentication Guide</h1><h2>Overview</h2><p>The DevVault API uses token-based authentication. Tokens expire after 24 hours.</p>`
const v2Content = `<h1>Authentication Guide</h1><h2>Introduction</h2><p>Clients must obtain a Bearer token before calling any protected endpoint.</p>`
const v1Content = `<h1>Authentication Guide</h1><p>All API requests must include a Bearer token in the Authorization header.</p>`

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia

  // Load + save each domain store to localStorage.
  pinia.use(({ store }: PiniaPluginContext) => {
    if (!PERSIST_IDS.includes(store.$id)) return
    const key = `es-store-${store.$id}`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        store.$patch(JSON.parse(saved))
      } catch {
        // Corrupt/old payload — ignore and let it re-save.
      }
    }
    store.$subscribe((_m, state) => {
      localStorage.setItem(key, JSON.stringify(state))
    })
  })

  if (!localStorage.getItem('es-seeded')) {
    seed()
    localStorage.setItem('es-seeded', '1')
  }

  if (import.meta.dev) selfCheck()
})

// Seed the original DevVault demo so the app isn't empty on first run.
function seed() {
  const auth = useAuthStore()
  const projects = useProjectsStore()
  const roles = useRolesStore()
  const documents = useDocumentsStore()

  const drew = auth.addUser({ id: 'u-drew', firstName: 'Drew', lastName: 'Ferrer', email: 'drew@acme.com', password: 'password', orgName: 'Acme Inc.', color: 'var(--accent)', fg: 'var(--accent-fg)' })
  const maria = auth.addUser({ id: 'u-maria', firstName: 'Maria', lastName: 'Santos', email: 'maria@acme.com', password: 'password', orgName: 'Acme Inc.' })
  const jake = auth.addUser({ id: 'u-jake', firstName: 'Jake', lastName: 'Liu', email: 'jake@acme.com', password: 'password', orgName: 'Acme Inc.' })
  const alex = auth.addUser({ id: 'u-alex', firstName: 'Alex', lastName: 'Kim', email: 'alex@acme.com', password: 'password', orgName: 'Acme Inc.' })

  const pid = 'p-devvault'
  projects.projects.push({ id: pid, name: 'DevVault Backend API', description: 'Backend API documentation and architecture', emoji: '🔧', ownerId: drew.id, createdAt: 'Jan 12, 2025' })

  roles.seedPresetRoles(pid)
  const roleId = (name: string) => roles.projectRoles(pid).find(r => r.name === name)?.id ?? ''

  projects.members.push(
    { id: 'm-drew', projectId: pid, userId: drew.id, roleId: roleId('Admin'), title: 'Owner', joinedAt: 'Jan 12, 2025' },
    { id: 'm-maria', projectId: pid, userId: maria.id, roleId: roleId('Developer'), title: 'Senior Developer', joinedAt: 'Jan 14, 2025' },
    { id: 'm-jake', projectId: pid, userId: jake.id, roleId: roleId('QA'), title: 'QA Engineer', joinedAt: 'Feb 3, 2025' },
    { id: 'm-alex', projectId: pid, userId: alex.id, roleId: roleId('PM'), title: 'Product Manager', joinedAt: 'Feb 10, 2025' }
  )

  const doc = (id: string, categoryId: string, title: string, status: Doc['status'], updatedAt: string, version: number, content?: string): Doc => ({
    id, categoryId, title, status, author: 'Drew Ferrer', authorId: drew.id, updatedAt, version, content: content ?? `<h1>${title}</h1><p></p>`
  })

  documents.categories.push(
    { id: 'cat-1', projectId: pid, name: 'API Documentation', open: true, docs: [
      doc('doc-1', 'cat-1', 'Authentication Guide', 'published', '2h ago', 5, v5Content),
      doc('doc-2', 'cat-1', 'REST Endpoints', 'published', '1d ago', 3),
      doc('doc-3', 'cat-1', 'Error Codes', 'draft', '3d ago', 1)
    ] },
    { id: 'cat-2', projectId: pid, name: 'Engineering Guidelines', open: false, docs: [
      doc('doc-4', 'cat-2', 'Git Branching Strategy', 'published', '5d ago', 2),
      doc('doc-5', 'cat-2', 'Code Review Process', 'draft', '2h ago', 3),
      doc('doc-6', 'cat-2', 'Testing Standards', 'published', '1w ago', 1)
    ] },
    { id: 'cat-3', projectId: pid, name: 'Deployment', open: false, docs: [
      doc('doc-7', 'cat-3', 'Docker Setup', 'published', '2w ago', 4),
      doc('doc-8', 'cat-3', 'CI/CD Pipeline', 'draft', '4d ago', 2)
    ] }
  )

  documents.versions.push(
    { v: 5, docId: 'doc-1', current: true, time: '2 hours ago', initials: 'DF', color: 'var(--accent)', fg: 'var(--accent-fg)', name: 'Drew Ferrer', note: 'Updated token expiry section', content: v5Content },
    { v: 4, docId: 'doc-1', current: false, time: 'Yesterday, 4:30 PM', initials: 'MS', color: '#2563eb', fg: '#fff', name: 'Maria Santos', note: 'Added SSO section and code examples', content: v4Content },
    { v: 3, docId: 'doc-1', current: false, time: 'Jan 28, 2025', initials: 'DF', color: 'var(--accent)', fg: 'var(--accent-fg)', name: 'Drew Ferrer', note: 'Initial draft published', content: v3Content },
    { v: 2, docId: 'doc-1', current: false, time: 'Jan 25, 2025', initials: 'MS', color: '#2563eb', fg: '#fff', name: 'Maria Santos', note: 'Restructured overview section', content: v2Content },
    { v: 1, docId: 'doc-1', current: false, time: 'Jan 20, 2025', initials: 'DF', color: 'var(--accent)', fg: 'var(--accent-fg)', name: 'Drew Ferrer', note: 'Document created', original: true, content: v1Content }
  )

  projects.activeProjectId = pid
  documents.activeDocId = 'doc-1'
}

// Dev-only assertions on the permission resolver — logs, never throws.
function selfCheck() {
  const roles = useRolesStore()
  const projects = useProjectsStore()
  const pid = projects.projects[0]?.id
  if (!pid) return

  const ok = (label: string, actual: boolean, expected: boolean) => {
    if (actual !== expected) console.error(`[perm self-check] FAIL: ${label} → got ${actual}, expected ${expected}`)
  }

  ok('owner can delete', roles.can('u-drew', pid, 'delete'), true)
  ok('developer can create', roles.can('u-maria', pid, 'create'), true)
  ok('developer cannot delete', roles.can('u-maria', pid, 'delete'), false)
  ok('QA cannot update', roles.can('u-jake', pid, 'update'), false)
  ok('non-member cannot read', roles.can('nobody', pid, 'read'), false)

  // Override: deny read on doc-1 for QA's role beats the role's base read=true.
  const qaRoleId = roles.projectRoles(pid).find(r => r.name === 'QA')?.id ?? ''
  const o = roles.addOverride(pid, 'doc-1', 'role', qaRoleId, 'read', 'deny')
  ok('override deny beats role allow', roles.can('u-jake', pid, 'read', 'doc-1'), false)
  roles.removeOverride(o.id)
}
