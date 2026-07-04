import { useAuthStore } from '~/stores/auth'
import { useProjectsStore } from '~/stores/projects'
import { useRolesStore, type Perm } from '~/stores/roles'

// Binds the permission resolver to the current user + active project.
export function usePermissions() {
  const auth = useAuthStore()
  const projects = useProjectsStore()
  const roles = useRolesStore()

  function can(perm: Perm, docId?: string): boolean {
    return roles.can(auth.currentUserId, projects.activeProjectId, perm, docId)
  }

  const isOwner = computed(() => {
    const p = projects.activeProject
    return !!p && !!auth.currentUserId && p.ownerId === auth.currentUserId
  })

  return { can, isOwner }
}
