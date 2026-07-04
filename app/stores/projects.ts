import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useRolesStore } from '~/stores/roles'
import { useDocumentsStore } from '~/stores/documents'

export interface Project {
  id: string
  name: string
  description: string
  emoji: string
  ownerId: string
  createdAt: string
}

export interface Member {
  id: string
  projectId: string
  userId: string
  roleId: string
  title: string
  joinedAt: string
}

function today(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    members: [] as Member[],
    activeProjectId: null as string | null
  }),
  getters: {
    activeProject(state): Project | null {
      return state.projects.find(p => p.id === state.activeProjectId) ?? null
    },
    // Projects the current user owns or is a member of.
    myProjects(state): Project[] {
      const auth = useAuthStore()
      const uid = auth.currentUserId
      if (!uid) return []
      const memberOf = new Set(state.members.filter(m => m.userId === uid).map(m => m.projectId))
      return state.projects.filter(p => p.ownerId === uid || memberOf.has(p.id))
    }
  },
  actions: {
    projectMembers(projectId: string): Member[] {
      return this.members.filter(m => m.projectId === projectId)
    },
    memberFor(userId: string, projectId: string): Member | undefined {
      return this.members.find(m => m.userId === userId && m.projectId === projectId)
    },
    setActiveProject(id: string) {
      this.activeProjectId = id
    },
    createProject(name: string, description = '', emoji = '📁'): Project {
      const auth = useAuthStore()
      const roles = useRolesStore()
      const documents = useDocumentsStore()
      const ownerId = auth.currentUserId
      if (!ownerId) throw new Error('Must be signed in to create a project')

      const project: Project = {
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        emoji,
        ownerId,
        createdAt: today()
      }
      this.projects.push(project)

      // Seed the preset roles for this project, then add the owner as an Admin member.
      roles.seedPresetRoles(project.id)
      const admin = roles.projectRoles(project.id).find(r => r.name === 'Admin')
      this.members.push({
        id: crypto.randomUUID(),
        projectId: project.id,
        userId: ownerId,
        roleId: admin?.id ?? '',
        title: 'Owner',
        joinedAt: today()
      })

      // Give the project a starter category so the dashboard isn't empty.
      documents.createCategory(project.id, 'Getting Started')

      this.activeProjectId = project.id
      return project
    },
    // Sim invite: creates the user (default password) if new, then adds an active member. No email.
    invite(email: string, roleId: string, title = 'Member'): { ok: boolean, error?: string } {
      const auth = useAuthStore()
      const projectId = this.activeProjectId
      if (!projectId) return { ok: false, error: 'No active project.' }

      const local = email.split('@')[0] ?? 'new'
      const [first = local, last = ''] = local.split(/[.\-_]/)
      const user = auth.addUser({
        firstName: first.charAt(0).toUpperCase() + first.slice(1),
        lastName: last.charAt(0).toUpperCase() + last.slice(1),
        email,
        password: 'password',
        orgName: auth.currentUser?.orgName ?? ''
      })

      if (this.memberFor(user.id, projectId)) return { ok: false, error: 'Already a member of this project.' }
      this.members.push({
        id: crypto.randomUUID(),
        projectId,
        userId: user.id,
        roleId,
        title,
        joinedAt: today()
      })
      return { ok: true }
    },
    updateMemberRole(memberId: string, roleId: string) {
      const member = this.members.find(m => m.id === memberId)
      if (member) member.roleId = roleId
    },
    removeMember(memberId: string) {
      this.members = this.members.filter(m => m.id !== memberId)
    }
  }
})
