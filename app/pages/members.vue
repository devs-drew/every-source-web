<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useAuthStore } from '~/stores/auth'
import { useProjectsStore } from '~/stores/projects'
import { useRolesStore } from '~/stores/roles'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const rolesStore = useRolesStore()
const { can } = usePermissions()

const { currentUser } = storeToRefs(authStore)
const { activeProject } = storeToRefs(projectsStore)
const canManage = computed(() => can('members'))

const projectRoles = computed(() =>
  activeProject.value ? rolesStore.projectRoles(activeProject.value.id) : []
)

const members = computed(() => {
  if (!activeProject.value) return []
  return projectsStore.projectMembers(activeProject.value.id).map((m) => {
    const user = authStore.users.find(u => u.id === m.userId)
    const role = rolesStore.roles.find(r => r.id === m.roleId)
    return {
      id: m.id,
      initials: user?.initials ?? '?',
      color: user?.color ?? 'var(--bg)',
      fg: user?.fg ?? 'var(--text)',
      name: user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown',
      title: m.title,
      email: user?.email ?? '',
      roleId: m.roleId,
      roleName: role?.name ?? '',
      joined: m.joinedAt,
      owner: activeProject.value?.ownerId === m.userId
    }
  })
})

const inviteEmail = ref('')
const inviteRoleId = ref('')
const inviteError = ref('')

function openInvite() {
  inviteError.value = ''
  inviteEmail.value = ''
  inviteRoleId.value = projectRoles.value.find(r => r.name === 'Developer')?.id ?? projectRoles.value[0]?.id ?? ''
  appStore.openInviteModal()
}

function sendInvite() {
  const res = projectsStore.invite(inviteEmail.value, inviteRoleId.value)
  if (res.ok) appStore.closeInviteModal()
  else inviteError.value = res.error ?? 'Could not send invite.'
}

onMounted(() => {
  appStore.initTheme()
})
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
      <span style="font-size:13px;font-weight:600">Members</span>
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
      <div style="max-width:900px;margin:0 auto;padding:36px 32px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px">
          <div>
            <h1 style="font-size:22px;font-weight:700;letter-spacing:-.5px;margin-bottom:4px">
              Members
            </h1>
            <p style="font-size:13px;color:var(--text-2)">
              {{ members.length }} members with access to {{ activeProject?.name }}
            </p>
          </div>
          <button
            v-if="canManage"
            id="invite-member"
            name="invite-member"
            style="display:flex;align-items:center;gap:7px;padding:9px 16px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
            @click="openInvite"
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
            Invite member
          </button>
        </div>

        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow)">
          <!-- Table header -->
          <div
            class="row-grid"
            style="padding:11px 20px;border-bottom:1px solid var(--border);font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3)"
          >
            <span>Member</span><span>Email</span><span>Role</span><span>Joined</span><span />
          </div>

          <!-- Member rows -->
          <ClientOnly>
            <div
              v-for="m in members"
              :key="m.id"
              class="row-grid"
              style="padding:14px 20px;border-bottom:1px solid var(--border);align-items:center"
            >
              <div style="display:flex;align-items:center;gap:10px">
                <div :style="`width:34px;height:34px;border-radius:50%;background:${m.color};color:${m.fg};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0`">
                  {{ m.initials }}
                </div>
                <div>
                  <div style="font-size:13px;font-weight:600">
                    {{ m.name }}
                  </div>
                  <div style="font-size:11px;color:var(--text-3)">
                    {{ m.title }}
                  </div>
                </div>
              </div>
              <span style="font-size:12px;color:var(--text-2)">{{ m.email }}</span>
              <div>
                <span
                  v-if="m.owner || !canManage"
                  style="font-size:11px;font-weight:600;padding:3px 8px;background:var(--bg);border:1px solid var(--border);border-radius:99px;color:var(--text-2)"
                >{{ m.roleName }}</span>
                <select
                  v-else
                  :id="`role-${m.id}`"
                  :name="`role-${m.id}`"
                  :value="m.roleId"
                  style="padding:4px 8px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:12px;outline:none;cursor:pointer"
                  @click.stop
                  @change="projectsStore.updateMemberRole(m.id, ($event.target as HTMLSelectElement).value)"
                >
                  <option
                    v-for="r in projectRoles"
                    :key="r.id"
                    :value="r.id"
                  >
                    {{ r.name }}
                  </option>
                </select>
              </div>
              <span style="font-size:12px;color:var(--text-3)">{{ m.joined }}</span>
              <span
                v-if="m.owner || !canManage"
                style="font-size:12px;color:var(--text-3)"
              >—</span>
              <button
                v-else
                :id="`remove-${m.id}`"
                :name="`remove-${m.id}`"
                style="font-size:12px;color:#dc2626;background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-family:inherit"
                @click="projectsStore.removeMember(m.id)"
              >
                Remove
              </button>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Invite modal -->
    <Teleport to="body">
      <div
        v-if="appStore.inviteModalOpen"
        style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px"
        @click="appStore.closeInviteModal()"
      >
        <div
          style="background:var(--surface);border:1px solid var(--border);border-radius:12px;width:440px;box-shadow:var(--shadow-md)"
          @click.stop
        >
          <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border)">
            <div>
              <h2 style="font-size:15px;font-weight:700">
                Invite member
              </h2>
              <p style="font-size:12px;color:var(--text-3);margin-top:2px">
                They'll receive an email to join this project.
              </p>
            </div>
            <button
              style="width:26px;height:26px;border:none;background:var(--bg);border-radius:4px;cursor:pointer;color:var(--text-2);display:flex;align-items:center;justify-content:center;font-size:14px"
              @click="appStore.closeInviteModal()"
            >
              ✕
            </button>
          </div>
          <div style="padding:22px;display:flex;flex-direction:column;gap:14px">
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Email address</label>
              <input
                id="invite-email"
                v-model="inviteEmail"
                name="invite-email"
                type="email"
                placeholder="colleague@acme.com"
                style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
              >
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Assign role</label>
              <select
                id="invite-role"
                v-model="inviteRoleId"
                name="invite-role"
                style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;cursor:pointer"
              >
                <option
                  v-for="r in projectRoles"
                  :key="r.id"
                  :value="r.id"
                >
                  {{ r.name }}
                </option>
              </select>
            </div>
            <div style="padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);font-size:12px;color:var(--text-3);line-height:1.6">
              The invited member can sign in with this email and the password <strong style="color:var(--text-2)">password</strong>. You can change their role at any time from the members list.
            </div>
            <p
              v-if="inviteError"
              style="font-size:12px;color:#dc2626"
            >
              {{ inviteError }}
            </p>
            <div style="display:flex;gap:10px;margin-top:4px">
              <button
                id="cancel-invite"
                name="cancel-invite"
                style="flex:1;padding:9px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:13px;cursor:pointer;color:var(--text)"
                @click="appStore.closeInviteModal()"
              >
                Cancel
              </button>
              <button
                id="send-invite"
                name="send-invite"
                style="flex:2;padding:9px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
                @click="sendInvite"
              >
                Send invite
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.row-grid {
  display: grid;
  grid-template-columns: 1fr 180px 140px 120px 80px;
  align-items: center;
}
</style>
