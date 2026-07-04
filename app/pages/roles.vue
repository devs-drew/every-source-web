<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useAuthStore } from '~/stores/auth'
import { useProjectsStore } from '~/stores/projects'
import { useRolesStore, type Perm, type Perms, type Override } from '~/stores/roles'
import { useDocumentsStore } from '~/stores/documents'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const rolesStore = useRolesStore()
const docsStore = useDocumentsStore()
const { can } = usePermissions()

const { currentUser } = storeToRefs(authStore)
const { activeProject } = storeToRefs(projectsStore)
const canManageRoles = computed(() => can('roles'))

onMounted(() => appStore.initTheme())

const pid = computed(() => activeProject.value?.id ?? '')
const roles = computed(() => rolesStore.projectRoles(pid.value))
const overrides = computed(() => rolesStore.projectOverrides(pid.value))
const projectDocs = computed(() => docsStore.docsForProject(pid.value))
const memberUsers = computed(() =>
  projectsStore.projectMembers(pid.value).map((m) => {
    const u = authStore.users.find(user => user.id === m.userId)
    return { userId: m.userId, name: u ? `${u.firstName} ${u.lastName}`.trim() : 'Unknown' }
  })
)

const permCols: { key: Perm, label: string }[] = [
  { key: 'create', label: 'Create' },
  { key: 'read', label: 'Read' },
  { key: 'update', label: 'Update' },
  { key: 'delete', label: 'Delete' },
  { key: 'members', label: 'Manage Members' },
  { key: 'roles', label: 'Manage Roles' }
]
const docPermCols = permCols.slice(0, 4)

function memberCount(roleId: string) {
  return projectsStore.projectMembers(pid.value).filter(m => m.roleId === roleId).length
}

function toggle(roleId: string, isSystem: boolean, key: Perm, value: boolean) {
  if (!canManageRoles.value || isSystem) return
  rolesStore.updateRolePerm(roleId, key, !value)
}

// New role modal
const roleName = ref('')
const rolePerms = reactive<Perms>({ create: false, read: true, update: false, delete: false, members: false, roles: false })
function openRole() {
  roleName.value = ''
  Object.assign(rolePerms, { create: false, read: true, update: false, delete: false, members: false, roles: false })
  appStore.openRoleModal()
}
function createRole() {
  if (!pid.value || !roleName.value.trim()) return
  rolesStore.createRole(pid.value, roleName.value, { ...rolePerms })
  appStore.closeRoleModal()
}

// Override modal
const ovDoc = ref('')
const ovSubject = ref('')
const ovPerm = ref<Perm>('read')
const ovEffect = ref<'allow' | 'deny'>('allow')
function openOverride() {
  ovDoc.value = projectDocs.value[0]?.id ?? ''
  ovSubject.value = ''
  ovPerm.value = 'read'
  ovEffect.value = 'allow'
  appStore.openOverrideModal()
}
function saveOverride() {
  if (!pid.value || !ovDoc.value || !ovSubject.value) return
  const [type, id] = ovSubject.value.split(':')
  rolesStore.addOverride(pid.value, ovDoc.value, type as 'role' | 'user', id ?? '', ovPerm.value, ovEffect.value)
  appStore.closeOverrideModal()
}

function docTitle(id: string) {
  return projectDocs.value.find(d => d.id === id)?.title ?? '—'
}
function subjectLabel(o: Override) {
  if (o.subjectType === 'role') return rolesStore.roles.find(r => r.id === o.subjectId)?.name ?? 'Role'
  const u = authStore.users.find(user => user.id === o.subjectId)
  return u ? `${u.firstName} ${u.lastName}`.trim() : 'User'
}
</script>

<template>
  <div style="min-height:100vh;background:var(--bg)">
    <!-- Header -->
    <header style="position:fixed;top:0;left:0;right:0;height:var(--hh);background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 24px;gap:10px;z-index:100">
      <NuxtLink
        to="/project-dashboard"
        style="display:flex;align-items:center;gap:6px;text-decoration:none;color:var(--text-2);font-size:12px"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        ><path d="m15 18-6-6 6-6" /></svg>
        {{ activeProject?.name }}
      </NuxtLink>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        style="color:var(--text-3)"
      ><path d="m9 18 6-6-6-6" /></svg>
      <span style="font-size:13px;font-weight:600">Roles &amp; Permissions</span>
      <div style="flex:1" />
      <button
        style="width:30px;height:30px;border-radius:var(--r-sm);border:1px solid var(--border);background:transparent;cursor:pointer;color:var(--text-2);font-size:12px;display:flex;align-items:center;justify-content:center"
        @click="appStore.toggleTheme()"
      >
        {{ appStore.dark ? '☀' : '☾' }}
      </button>
      <ClientOnly>
        <div style="width:30px;height:30px;border-radius:50%;background:var(--accent);color:var(--accent-fg);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700">
          {{ currentUser?.initials ?? '?' }}
        </div>
      </ClientOnly>
    </header>

    <!-- Body -->
    <div style="padding-top:var(--hh)">
      <div style="max-width:1100px;margin:0 auto;padding:36px 32px">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px">
          <div>
            <h1 style="font-size:22px;font-weight:700;letter-spacing:-.5px;margin-bottom:4px">
              Roles &amp; Permissions
            </h1>
            <p style="font-size:13px;color:var(--text-2)">
              Define custom roles and control what each role can do in this project.
            </p>
          </div>
          <button
            v-if="canManageRoles"
            id="new-role"
            name="new-role"
            style="display:flex;align-items:center;gap:7px;padding:9px 16px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;flex-shrink:0"
            @click="openRole"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            ><line
              x1="12"
              y1="5"
              x2="12"
              y2="19"
            /><line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
            /></svg>
            New Role
          </button>
        </div>

        <ClientOnly>
          <!-- Matrix -->
          <div>
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow);margin-bottom:24px">
              <div style="overflow-x:auto">
                <table style="width:100%;border-collapse:collapse">
                  <thead>
                    <tr style="border-bottom:1px solid var(--border)">
                      <th style="text-align:left;padding:14px 20px;font-size:12px;font-weight:600;color:var(--text-2);white-space:nowrap;min-width:160px;background:var(--bg)">
                        Role
                      </th>
                      <th
                        v-for="col in permCols"
                        :key="col.key"
                        style="padding:14px 16px;font-size:11px;font-weight:600;color:var(--text-3);letter-spacing:.4px;text-transform:uppercase;white-space:nowrap;background:var(--bg);text-align:center"
                      >
                        {{ col.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="role in roles"
                      :key="role.id"
                      style="border-bottom:1px solid var(--border)"
                    >
                      <td style="padding:14px 20px">
                        <div style="display:flex;align-items:center;gap:8px">
                          <div :style="`width:7px;height:7px;border-radius:50%;background:${role.color};flex-shrink:0`" />
                          <div>
                            <div style="font-size:13px;font-weight:600">
                              {{ role.name }}
                            </div>
                            <div style="font-size:11px;color:var(--text-3)">
                              {{ role.isSystem ? 'System default' : `${memberCount(role.id)} members` }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        v-for="col in permCols"
                        :key="col.key"
                        style="text-align:center;padding:14px 16px"
                      >
                        <span
                          v-if="role.isSystem"
                          :style="`font-size:16px;color:${role.perms[col.key] ? '#16a34a' : 'var(--text-3)'}`"
                        >{{ role.perms[col.key] ? '✓' : '—' }}</span>
                        <button
                          v-else
                          :style="`width:20px;height:20px;border-radius:4px;border:2px solid ${role.perms[col.key] ? 'var(--accent)' : 'var(--border-2)'};background:${role.perms[col.key] ? 'var(--accent)' : 'transparent'};cursor:${canManageRoles ? 'pointer' : 'not-allowed'};display:flex;align-items:center;justify-content:center;margin:0 auto`"
                          @click="toggle(role.id, role.isSystem, col.key, role.perms[col.key])"
                        >
                          <svg
                            v-if="role.perms[col.key]"
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--accent-fg)"
                            stroke-width="3"
                          ><polyline points="20 6 9 17 4 12" /></svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Document-level overrides -->
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow)">
              <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
                <div>
                  <h2 style="font-size:14px;font-weight:700;margin-bottom:2px">
                    Document-level overrides
                  </h2>
                  <p style="font-size:12px;color:var(--text-3)">
                    Grant or deny access on specific documents, overriding the role's default.
                  </p>
                </div>
                <button
                  v-if="canManageRoles"
                  id="add-override"
                  name="add-override"
                  style="padding:7px 12px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:12px;font-weight:500;cursor:pointer;color:var(--text-2)"
                  @click="openOverride"
                >
                  + Add override
                </button>
              </div>
              <div>
                <div style="display:grid;grid-template-columns:1fr 1fr 100px 100px 80px;align-items:center;padding:11px 20px;border-bottom:1px solid var(--border);font-size:11px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;color:var(--text-3)">
                  <span>Document</span><span>Role / User</span><span>Permission</span><span>Effect</span><span />
                </div>
                <div
                  v-if="overrides.length === 0"
                  style="padding:20px;text-align:center;font-size:12px;color:var(--text-3)"
                >
                  No overrides yet.
                </div>
                <div
                  v-for="o in overrides"
                  :key="o.id"
                  style="display:grid;grid-template-columns:1fr 1fr 100px 100px 80px;align-items:center;padding:12px 20px;border-bottom:1px solid var(--border)"
                >
                  <div>
                    <div style="font-size:13px;font-weight:500">
                      {{ docTitle(o.docId) }}
                    </div>
                    <div style="font-size:11px;color:var(--text-3)">
                      {{ o.subjectType === 'role' ? 'Role' : 'User' }}
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px">
                    <span style="font-size:13px">{{ subjectLabel(o) }}</span>
                  </div>
                  <span style="font-size:12px;font-weight:500;text-transform:capitalize">{{ o.perm }}</span>
                  <span
                    style="font-size:12px;font-weight:600"
                    :style="`color:${o.effect === 'allow' ? '#16a34a' : '#dc2626'}`"
                  >{{ o.effect === 'allow' ? '✓ Allow' : '✕ Deny' }}</span>
                  <button
                    v-if="canManageRoles"
                    :id="`remove-override-${o.id}`"
                    :name="`remove-override-${o.id}`"
                    style="font-size:12px;color:var(--text-3);background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px"
                    @click="rolesStore.removeOverride(o.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>

    <!-- New Role modal -->
    <Teleport to="body">
      <div
        v-if="appStore.roleModalOpen"
        style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px"
        @click="appStore.closeRoleModal()"
      >
        <div
          style="background:var(--surface);border:1px solid var(--border);border-radius:12px;width:480px;box-shadow:var(--shadow-md)"
          @click.stop
        >
          <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border)">
            <h2 style="font-size:15px;font-weight:700">
              New role
            </h2>
            <button
              style="width:26px;height:26px;border:none;background:var(--bg);border-radius:4px;cursor:pointer;color:var(--text-2);display:flex;align-items:center;justify-content:center;font-size:14px"
              @click="appStore.closeRoleModal()"
            >
              ✕
            </button>
          </div>
          <div style="padding:22px;display:flex;flex-direction:column;gap:16px">
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Role name</label>
              <input
                id="role-name"
                v-model="roleName"
                name="role-name"
                type="text"
                placeholder="e.g. Senior Developer"
                style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
              >
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">Document permissions</label>
              <div style="display:flex;flex-direction:column;gap:8px">
                <label
                  v-for="col in docPermCols"
                  :key="col.key"
                  style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px"
                >
                  <input
                    v-model="rolePerms[col.key]"
                    type="checkbox"
                    style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer"
                  >
                  {{ col.label }} documents
                </label>
              </div>
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">Project permissions</label>
              <div style="display:flex;flex-direction:column;gap:8px">
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px">
                  <input
                    v-model="rolePerms.members"
                    type="checkbox"
                    style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer"
                  >
                  Manage members
                </label>
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px">
                  <input
                    v-model="rolePerms.roles"
                    type="checkbox"
                    style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer"
                  >
                  Manage roles
                </label>
              </div>
            </div>
            <div style="display:flex;gap:10px;margin-top:4px">
              <button
                style="flex:1;padding:9px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:13px;cursor:pointer;color:var(--text)"
                @click="appStore.closeRoleModal()"
              >
                Cancel
              </button>
              <button
                id="create-role"
                name="create-role"
                style="flex:2;padding:9px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
                @click="createRole"
              >
                Create role
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Override modal -->
    <Teleport to="body">
      <div
        v-if="appStore.overrideModalOpen"
        style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px"
        @click="appStore.closeOverrideModal()"
      >
        <div
          style="background:var(--surface);border:1px solid var(--border);border-radius:12px;width:440px;box-shadow:var(--shadow-md)"
          @click.stop
        >
          <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border)">
            <h2 style="font-size:15px;font-weight:700">
              Add document override
            </h2>
            <button
              style="width:26px;height:26px;border:none;background:var(--bg);border-radius:4px;cursor:pointer;color:var(--text-2);display:flex;align-items:center;justify-content:center;font-size:14px"
              @click="appStore.closeOverrideModal()"
            >
              ✕
            </button>
          </div>
          <div style="padding:22px;display:flex;flex-direction:column;gap:14px">
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Document</label>
              <select
                id="override-doc"
                v-model="ovDoc"
                name="override-doc"
                style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;cursor:pointer"
              >
                <option
                  v-for="d in projectDocs"
                  :key="d.id"
                  :value="d.id"
                >
                  {{ d.title }}
                </option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Role or user</label>
              <select
                id="override-subject"
                v-model="ovSubject"
                name="override-subject"
                style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;cursor:pointer"
              >
                <option value="">
                  Select a role or user...
                </option>
                <option
                  v-for="r in roles"
                  :key="r.id"
                  :value="`role:${r.id}`"
                >
                  Role: {{ r.name }}
                </option>
                <option
                  v-for="u in memberUsers"
                  :key="u.userId"
                  :value="`user:${u.userId}`"
                >
                  User: {{ u.name }}
                </option>
              </select>
            </div>
            <div style="display:flex;gap:10px">
              <div style="flex:1">
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Permission</label>
                <select
                  id="override-perm"
                  v-model="ovPerm"
                  name="override-perm"
                  style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;cursor:pointer"
                >
                  <option
                    v-for="col in docPermCols"
                    :key="col.key"
                    :value="col.key"
                  >
                    {{ col.label }}
                  </option>
                </select>
              </div>
              <div style="flex:1">
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Effect</label>
                <select
                  id="override-effect"
                  v-model="ovEffect"
                  name="override-effect"
                  style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;cursor:pointer"
                >
                  <option value="allow">
                    Allow
                  </option>
                  <option value="deny">
                    Deny
                  </option>
                </select>
              </div>
            </div>
            <div style="display:flex;gap:10px;margin-top:4px">
              <button
                style="flex:1;padding:9px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:13px;cursor:pointer;color:var(--text)"
                @click="appStore.closeOverrideModal()"
              >
                Cancel
              </button>
              <button
                id="save-override"
                name="save-override"
                style="flex:2;padding:9px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
                @click="saveOverride"
              >
                Save override
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
