import { defineStore } from 'pinia'
import { useProjectsStore } from '~/stores/projects'

export type Perm = 'create' | 'read' | 'update' | 'delete' | 'members' | 'roles'
export const PERM_KEYS: Perm[] = ['create', 'read', 'update', 'delete', 'members', 'roles']

export type Perms = Record<Perm, boolean>

export interface Role {
  id: string
  projectId: string
  name: string
  color: string
  isSystem: boolean
  perms: Perms
}

export interface Override {
  id: string
  projectId: string
  docId: string
  subjectType: 'role' | 'user'
  subjectId: string
  perm: Perm
  effect: 'allow' | 'deny'
}

function perms(create: boolean, read: boolean, update: boolean, del: boolean, members: boolean, roles: boolean): Perms {
  return { create, read, update, delete: del, members, roles }
}

// Preset roles seeded into every new project. Matches the original roles.vue mockup.
const PRESETS: { name: string, color: string, isSystem: boolean, perms: Perms }[] = [
  { name: 'Admin', color: '#0c0c0c', isSystem: true, perms: perms(true, true, true, true, true, true) },
  { name: 'Developer', color: '#2563eb', isSystem: false, perms: perms(true, true, true, false, false, false) },
  { name: 'QA', color: '#16a34a', isSystem: false, perms: perms(false, true, false, false, false, false) },
  { name: 'PM', color: '#9333ea', isSystem: false, perms: perms(false, true, false, false, true, false) }
]

// Resolve the net effect of overrides for one subject: deny beats allow, null if none match.
function overrideEffect(
  overrides: Override[],
  docId: string,
  perm: Perm,
  subjectType: 'role' | 'user',
  subjectId: string
): 'allow' | 'deny' | null {
  const matches = overrides.filter(
    o => o.docId === docId && o.perm === perm && o.subjectType === subjectType && o.subjectId === subjectId
  )
  if (matches.length === 0) return null
  return matches.some(o => o.effect === 'deny') ? 'deny' : 'allow'
}

export const useRolesStore = defineStore('roles', {
  state: () => ({
    roles: [] as Role[],
    overrides: [] as Override[]
  }),
  actions: {
    projectRoles(projectId: string): Role[] {
      return this.roles.filter(r => r.projectId === projectId)
    },
    projectOverrides(projectId: string): Override[] {
      return this.overrides.filter(o => o.projectId === projectId)
    },
    seedPresetRoles(projectId: string) {
      if (this.projectRoles(projectId).length > 0) return
      for (const p of PRESETS) {
        this.roles.push({
          id: crypto.randomUUID(),
          projectId,
          name: p.name,
          color: p.color,
          isSystem: p.isSystem,
          perms: { ...p.perms }
        })
      }
    },
    createRole(projectId: string, name: string, rolePerms: Perms, color = '#64748b'): Role {
      const role: Role = { id: crypto.randomUUID(), projectId, name: name.trim(), color, isSystem: false, perms: { ...rolePerms } }
      this.roles.push(role)
      return role
    },
    updateRolePerm(roleId: string, perm: Perm, value: boolean) {
      const role = this.roles.find(r => r.id === roleId)
      if (role) role.perms[perm] = value
    },
    addOverride(projectId: string, docId: string, subjectType: 'role' | 'user', subjectId: string, perm: Perm, effect: 'allow' | 'deny'): Override {
      const o: Override = { id: crypto.randomUUID(), projectId, docId, subjectType, subjectId, perm, effect }
      this.overrides.push(o)
      return o
    },
    removeOverride(id: string) {
      this.overrides = this.overrides.filter(o => o.id !== id)
    },
    // Core permission resolver. Owner > per-user override > per-role override > role perm > false.
    can(userId: string | null, projectId: string | null, perm: Perm, docId?: string): boolean {
      if (!userId || !projectId) return false
      const projects = useProjectsStore()
      const project = projects.projects.find(p => p.id === projectId)
      if (!project) return false
      if (project.ownerId === userId) return true

      const member = projects.memberFor(userId, projectId)
      if (!member) return false

      if (docId) {
        const userEffect = overrideEffect(this.overrides, docId, perm, 'user', userId)
        if (userEffect) return userEffect === 'allow'
        const roleEffect = overrideEffect(this.overrides, docId, perm, 'role', member.roleId)
        if (roleEffect) return roleEffect === 'allow'
      }

      const role = this.roles.find(r => r.id === member.roleId)
      return role?.perms[perm] ?? false
    }
  }
})
