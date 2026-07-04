import { defineStore } from 'pinia'

export interface Version {
  v: number
  current: boolean
  time: string
  initials: string
  color: string
  fg: string
  name: string
  note: string
  original?: boolean
  content: string
}

interface Doc {
  id: string
  categoryId: string
  title: string
  status: 'draft' | 'published' | 'archived'
  author: string
  updatedAt: string
  version: number
}

interface Category {
  id: string
  name: string
  open: boolean
  docs: Doc[]
}

const v5Content = `<h1>Authentication Guide</h1><h2>Overview</h2><p>The DevVault API uses token-based authentication via Laravel Sanctum. All authenticated endpoints require a valid Bearer token in the <code>Authorization</code> header.</p><h2>Obtaining a Token</h2><p>POST to <code>/api/login</code> with credentials to receive a token.</p><pre><code>POST /api/login\n{"email": "user@acme.com", "password": "..."}</code></pre>`

const v4Content = `<h1>Authentication Guide</h1><h2>Overview</h2><p>The DevVault API uses token-based authentication via Laravel Sanctum. All authenticated endpoints require a valid Bearer token in the <code>Authorization</code> header.</p><h2>Obtaining a Token</h2><p>POST to <code>/api/login</code> with credentials to receive a token.</p><h2>Single Sign-On</h2><p>SSO is supported via SAML 2.0. Configure your identity provider to post assertions to <code>/api/sso/callback</code>. Token lifetime is 8 hours by default.</p>`

const v3Content = `<h1>Authentication Guide</h1><h2>Overview</h2><p>The DevVault API uses token-based authentication. All authenticated endpoints require a valid Bearer token in the <code>Authorization</code> header.</p><h2>Obtaining a Token</h2><p>POST to <code>/api/login</code> with valid credentials to receive a token. Tokens expire after 24 hours.</p>`

const v2Content = `<h1>Authentication Guide</h1><h2>Introduction</h2><p>This document describes authentication for the DevVault API. Clients must obtain a Bearer token before calling any protected endpoint.</p><h2>Token Request</h2><p>Send a POST request to <code>/api/login</code> with your email and password. A token will be returned in the response body.</p>`

const v1Content = `<h1>Authentication Guide</h1><p>All API requests must include a Bearer token in the Authorization header. Tokens are issued by POST to <code>/api/login</code>.</p>`

export const useDocumentsStore = defineStore('documents', {
  state: () => ({
    categories: [
      {
        id: 'cat-1',
        name: 'API Documentation',
        open: false,
        docs: [
          { id: 'doc-1', categoryId: 'cat-1', title: 'Authentication Guide', status: 'published' as const, author: 'Drew Ferrer', updatedAt: '2h ago', version: 5 },
          { id: 'doc-2', categoryId: 'cat-1', title: 'REST Endpoints', status: 'published' as const, author: 'Drew Ferrer', updatedAt: '1d ago', version: 3 },
          { id: 'doc-3', categoryId: 'cat-1', title: 'Error Codes', status: 'draft' as const, author: 'Drew Ferrer', updatedAt: '3d ago', version: 1 }
        ]
      },
      {
        id: 'cat-2',
        name: 'Engineering Guidelines',
        open: true,
        docs: [
          { id: 'doc-4', categoryId: 'cat-2', title: 'Git Branching Strategy', status: 'published' as const, author: 'Drew Ferrer', updatedAt: '5d ago', version: 2 },
          { id: 'doc-5', categoryId: 'cat-2', title: 'Code Review Process', status: 'draft' as const, author: 'Drew Ferrer', updatedAt: '2h ago', version: 3 },
          { id: 'doc-6', categoryId: 'cat-2', title: 'Testing Standards', status: 'published' as const, author: 'Drew Ferrer', updatedAt: '1w ago', version: 1 }
        ]
      },
      {
        id: 'cat-3',
        name: 'Deployment',
        open: false,
        docs: [
          { id: 'doc-7', categoryId: 'cat-3', title: 'Docker Setup', status: 'published' as const, author: 'Drew Ferrer', updatedAt: '2w ago', version: 4 },
          { id: 'doc-8', categoryId: 'cat-3', title: 'CI/CD Pipeline', status: 'draft' as const, author: 'Drew Ferrer', updatedAt: '4d ago', version: 2 }
        ]
      }
    ] as Category[],
    activeDocId: 'doc-5',
    activeStatus: 'draft' as 'draft' | 'published' | 'archived',
    versions: [
      { v: 5, current: true, time: '2 hours ago', initials: 'DF', color: 'var(--accent)', fg: 'var(--accent-fg)', name: 'Drew Ferrer', note: 'Updated token expiry section', content: v5Content },
      { v: 4, current: false, time: 'Yesterday, 4:30 PM', initials: 'MS', color: '#2563eb', fg: '#fff', name: 'Maria Santos', note: 'Added SSO section and code examples', content: v4Content },
      { v: 3, current: false, time: 'Jan 28, 2025', initials: 'DF', color: 'var(--accent)', fg: 'var(--accent-fg)', name: 'Drew Ferrer', note: 'Initial draft published', content: v3Content },
      { v: 2, current: false, time: 'Jan 25, 2025', initials: 'MS', color: '#2563eb', fg: '#fff', name: 'Maria Santos', note: 'Restructured overview section', content: v2Content },
      { v: 1, current: false, time: 'Jan 20, 2025', initials: 'DF', color: 'var(--accent)', fg: 'var(--accent-fg)', name: 'Drew Ferrer', note: 'Document created', original: true, content: v1Content }
    ] as Version[]
  }),
  getters: {
    activeDoc(state): Doc | null {
      for (const cat of state.categories) {
        const doc = cat.docs.find(d => d.id === state.activeDocId)
        if (doc) return doc
      }
      return null
    },
    activeContent(state): string {
      return state.versions.find(v => v.current)?.content ?? ''
    },
    currentVersion(state): Version | null {
      return state.versions.find(v => v.current) ?? null
    }
  },
  actions: {
    toggleCategory(id: string) {
      const cat = this.categories.find(c => c.id === id)
      if (cat) cat.open = !cat.open
    },
    setActiveDoc(id: string) {
      this.activeDocId = id
    },
    setStatus(status: 'draft' | 'published' | 'archived') {
      this.activeStatus = status
    },
    restoreVersion(v: number) {
      const target = this.versions.find(ver => ver.v === v)
      if (!target) return
      const cur = this.versions.find(ver => ver.current)
      if (cur) cur.current = false
      const newV = Math.max(...this.versions.map(ver => ver.v)) + 1
      this.versions.unshift({
        v: newV,
        current: true,
        time: 'Just now',
        initials: 'DF',
        color: 'var(--accent)',
        fg: 'var(--accent-fg)',
        name: 'Drew Ferrer',
        note: `Restored from v${v}`,
        content: target.content
      })
    }
  }
})
