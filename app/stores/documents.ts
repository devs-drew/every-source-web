import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useProjectsStore } from '~/stores/projects'

export interface Version {
  v: number
  docId: string
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

export interface Doc {
  id: string
  categoryId: string
  title: string
  status: 'draft' | 'published' | 'archived'
  author: string
  authorId: string
  updatedAt: string
  version: number
  content: string
}

export interface Category {
  id: string
  projectId: string
  name: string
  open: boolean
  docs: Doc[]
}

type Status = 'draft' | 'published' | 'archived'

export const useDocumentsStore = defineStore('documents', {
  state: () => ({
    categories: [] as Category[],
    activeDocId: null as string | null,
    versions: [] as Version[]
  }),
  getters: {
    activeDoc(state): Doc | null {
      for (const cat of state.categories) {
        const doc = cat.docs.find(d => d.id === state.activeDocId)
        if (doc) return doc
      }
      return null
    },
    // Categories belonging to the currently active project.
    activeCategories(state): Category[] {
      const projects = useProjectsStore()
      return state.categories.filter(c => c.projectId === projects.activeProjectId)
    },
    activeVersions(state): Version[] {
      return state.versions.filter(v => v.docId === state.activeDocId).sort((a, b) => b.v - a.v)
    },
    currentVersion(): Version | null {
      return this.activeVersions.find(v => v.current) ?? null
    },
    activeContent(): string {
      return this.currentVersion?.content ?? this.activeDoc?.content ?? ''
    },
    activeStatus(): Status {
      return this.activeDoc?.status ?? 'draft'
    }
  },
  actions: {
    docsForProject(projectId: string): Doc[] {
      return this.categories.filter(c => c.projectId === projectId).flatMap(c => c.docs)
    },
    toggleCategory(id: string) {
      const cat = this.categories.find(c => c.id === id)
      if (cat) cat.open = !cat.open
    },
    setActiveDoc(id: string) {
      this.activeDocId = id
    },
    setStatus(status: Status) {
      const doc = this.activeDoc
      if (doc) {
        doc.status = status
        doc.updatedAt = 'Just now'
      }
    },
    createCategory(projectId: string, name: string): Category {
      const cat: Category = { id: crypto.randomUUID(), projectId, name: name.trim(), open: true, docs: [] }
      this.categories.push(cat)
      return cat
    },
    createDoc(categoryId: string, title: string): Doc | null {
      const cat = this.categories.find(c => c.id === categoryId)
      if (!cat) return null
      const auth = useAuthStore()
      const user = auth.currentUser
      const doc: Doc = {
        id: crypto.randomUUID(),
        categoryId,
        title: title.trim() || 'Untitled',
        status: 'draft',
        author: user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown',
        authorId: user?.id ?? '',
        updatedAt: 'Just now',
        version: 1,
        content: `<h1>${title.trim() || 'Untitled'}</h1><p>Start writing…</p>`
      }
      cat.docs.push(doc)
      cat.open = true
      this.activeDocId = doc.id
      this.pushVersion(doc.id, doc.content, 'Document created', true)
      return doc
    },
    updateDoc(id: string, patch: Partial<Pick<Doc, 'title' | 'status' | 'content'>>) {
      const doc = this.categories.flatMap(c => c.docs).find(d => d.id === id)
      if (!doc) return
      if (patch.title !== undefined) doc.title = patch.title
      if (patch.status !== undefined) doc.status = patch.status
      doc.updatedAt = 'Just now'
      if (patch.content !== undefined && patch.content !== doc.content) {
        doc.content = patch.content
        doc.version += 1
        this.pushVersion(id, patch.content, `Edited v${doc.version}`)
      }
    },
    deleteDoc(id: string) {
      for (const cat of this.categories) {
        const idx = cat.docs.findIndex(d => d.id === id)
        if (idx !== -1) cat.docs.splice(idx, 1)
      }
      this.versions = this.versions.filter(v => v.docId !== id)
      if (this.activeDocId === id) {
        this.activeDocId = this.categories.flatMap(c => c.docs)[0]?.id ?? null
      }
    },
    // Adds a new version entry for a doc and marks it current.
    pushVersion(docId: string, content: string, note: string, original = false) {
      const auth = useAuthStore()
      const user = auth.currentUser
      for (const v of this.versions) {
        if (v.docId === docId) v.current = false
      }
      const nextV = Math.max(0, ...this.versions.filter(v => v.docId === docId).map(v => v.v)) + 1
      this.versions.unshift({
        v: nextV,
        docId,
        current: true,
        time: 'Just now',
        initials: user?.initials ?? '?',
        color: user?.color ?? 'var(--accent)',
        fg: user?.fg ?? 'var(--accent-fg)',
        name: user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown',
        note,
        original,
        content
      })
    },
    restoreVersion(v: number) {
      const docId = this.activeDocId
      if (!docId) return
      const target = this.versions.find(ver => ver.docId === docId && ver.v === v)
      if (!target) return
      this.pushVersion(docId, target.content, `Restored from v${v}`)
      const doc = this.activeDoc
      if (doc) {
        doc.content = target.content
        doc.version = this.versions.find(ver => ver.docId === docId && ver.current)?.v ?? doc.version
        doc.updatedAt = 'Just now'
      }
    }
  }
})
