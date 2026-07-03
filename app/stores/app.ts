import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    dark: true,
    searchOpen: false,
    categoryModalOpen: false,
    shareOpen: false,
    shareEnabled: false,
    inviteModalOpen: false,
    roleModalOpen: false,
    overrideModalOpen: false,
    newProjectModalOpen: false
  }),
  actions: {
    initTheme() {
      if (import.meta.client) {
        const saved = localStorage.getItem('es-theme') || 'dark'
        document.documentElement.setAttribute('data-theme', saved)
        this.dark = saved === 'dark'
      }
    },
    toggleTheme() {
      this.dark = !this.dark
      if (import.meta.client) {
        document.documentElement.setAttribute('data-theme', this.dark ? 'dark' : 'light')
        localStorage.setItem('es-theme', this.dark ? 'dark' : 'light')
      }
    },
    openSearch() { this.searchOpen = true },
    closeSearch() { this.searchOpen = false },
    openCategoryModal() { this.categoryModalOpen = true },
    closeCategoryModal() { this.categoryModalOpen = false },
    openShare() { this.shareOpen = true },
    closeShare() { this.shareOpen = false },
    toggleShareLink() { this.shareEnabled = !this.shareEnabled },
    openInviteModal() { this.inviteModalOpen = true },
    closeInviteModal() { this.inviteModalOpen = false },
    openRoleModal() { this.roleModalOpen = true },
    closeRoleModal() { this.roleModalOpen = false },
    openOverrideModal() { this.overrideModalOpen = true },
    closeOverrideModal() { this.overrideModalOpen = false },
    openNewProject() { this.newProjectModalOpen = true },
    closeNewProject() { this.newProjectModalOpen = false }
  }
})
