import { defineStore } from 'pinia'

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
    activeStatus: 'draft' as 'draft' | 'published' | 'archived'
  }),
  getters: {
    activeDoc(state): Doc | null {
      for (const cat of state.categories) {
        const doc = cat.docs.find(d => d.id === state.activeDocId)
        if (doc) return doc
      }
      return null
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
    }
  }
})
