<script setup lang="ts">
import { useAppStore } from '~/stores/app'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()
const variant = ref<'A' | 'B'>('A')

onMounted(() => {
  appStore.initTheme()
})

type PermKey = 'create' | 'read' | 'update' | 'delete' | 'members' | 'roles'
type RoleKey = 'Developer' | 'QA' | 'PM'

const perms = reactive({
  Developer: { create: true, read: true, update: true, delete: false, members: false, roles: false },
  QA: { create: false, read: true, update: false, delete: false, members: false, roles: false },
  PM: { create: false, read: true, update: false, delete: false, members: true, roles: false }
})

function togglePerm(role: RoleKey, key: PermKey) {
  perms[role][key] = !perms[role][key]
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
        DevVault Backend API
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
      <!-- Variant switcher -->
      <div style="display:flex;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);overflow:hidden">
        <button
          :style="`padding:5px 12px;border:none;background:${variant==='A' ? 'var(--accent)' : 'transparent'};color:${variant==='A' ? 'var(--accent-fg)' : 'var(--text-2)'};font-family:inherit;font-size:11px;font-weight:600;cursor:pointer`"
          @click="variant = 'A'"
        >
          A · Matrix
        </button>
        <button
          :style="`padding:5px 12px;border:none;background:${variant==='B' ? 'var(--accent)' : 'transparent'};color:${variant==='B' ? 'var(--accent-fg)' : 'var(--text-2)'};font-family:inherit;font-size:11px;font-weight:600;cursor:pointer;border-left:1px solid var(--border)`"
          @click="variant = 'B'"
        >
          B · Cards
        </button>
      </div>
      <button
        style="width:30px;height:30px;border-radius:var(--r-sm);border:1px solid var(--border);background:transparent;cursor:pointer;color:var(--text-2);font-size:12px;display:flex;align-items:center;justify-content:center"
        @click="appStore.toggleTheme()"
      >
        {{ appStore.dark ? '☀' : '☾' }}
      </button>
      <div style="width:30px;height:30px;border-radius:50%;background:var(--accent);color:var(--accent-fg);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700">
        DF
      </div>
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
            style="display:flex;align-items:center;gap:7px;padding:9px 16px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;flex-shrink:0"
            @click="appStore.openRoleModal()"
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

        <!-- Variant A: Matrix -->
        <template v-if="variant === 'A'">
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow);margin-bottom:24px">
            <div style="overflow-x:auto">
              <table style="width:100%;border-collapse:collapse">
                <thead>
                  <tr style="border-bottom:1px solid var(--border)">
                    <th style="text-align:left;padding:14px 20px;font-size:12px;font-weight:600;color:var(--text-2);white-space:nowrap;min-width:160px;background:var(--bg)">
                      Role
                    </th>
                    <th
                      v-for="col in ['Create', 'Read', 'Update', 'Delete', 'Manage Members', 'Manage Roles']"
                      :key="col"
                      style="padding:14px 16px;font-size:11px;font-weight:600;color:var(--text-3);letter-spacing:.4px;text-transform:uppercase;white-space:nowrap;background:var(--bg);text-align:center"
                    >
                      {{ col }}
                    </th>
                    <th style="padding:14px 16px;background:var(--bg)" />
                  </tr>
                </thead>
                <tbody>
                  <!-- Admin - read only -->
                  <tr style="border-bottom:1px solid var(--border)">
                    <td style="padding:14px 20px">
                      <div style="display:flex;align-items:center;gap:8px">
                        <div style="width:7px;height:7px;border-radius:50%;background:#0c0c0c;flex-shrink:0" />
                        <div>
                          <div style="font-size:13px;font-weight:600">
                            Admin
                          </div>
                          <div style="font-size:11px;color:var(--text-3)">
                            System default
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      v-for="i in 6"
                      :key="i"
                      style="text-align:center;padding:14px 16px"
                    >
                      <span style="color:#16a34a;font-size:16px">✓</span>
                    </td>
                    <td style="padding:14px 16px;text-align:right">
                      <span style="font-size:11px;color:var(--text-3)">System</span>
                    </td>
                  </tr>
                  <!-- Developer -->
                  <tr style="border-bottom:1px solid var(--border)">
                    <td style="padding:14px 20px">
                      <div style="display:flex;align-items:center;gap:8px">
                        <div style="width:7px;height:7px;border-radius:50%;background:#2563eb;flex-shrink:0" />
                        <div>
                          <div style="font-size:13px;font-weight:600">
                            Developer
                          </div>
                          <div style="font-size:11px;color:var(--text-3)">
                            3 members
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      v-for="key in (['create', 'read', 'update', 'delete', 'members', 'roles'] as PermKey[])"
                      :key="key"
                      style="text-align:center;padding:14px 16px"
                    >
                      <button
                        :style="`width:20px;height:20px;border-radius:4px;border:2px solid ${perms.Developer[key] ? 'var(--accent)' : 'var(--border-2)'};background:${perms.Developer[key] ? 'var(--accent)' : 'transparent'};cursor:pointer;display:flex;align-items:center;justify-content:center;margin:0 auto`"
                        @click="togglePerm('Developer', key)"
                      >
                        <svg
                          v-if="perms.Developer[key]"
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--accent-fg)"
                          stroke-width="3"
                        ><polyline points="20 6 9 17 4 12" /></svg>
                      </button>
                    </td>
                    <td style="padding:14px 16px;text-align:right">
                      <button style="font-size:12px;color:var(--text-2);background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px">
                        Edit
                      </button>
                    </td>
                  </tr>
                  <!-- QA -->
                  <tr style="border-bottom:1px solid var(--border)">
                    <td style="padding:14px 20px">
                      <div style="display:flex;align-items:center;gap:8px">
                        <div style="width:7px;height:7px;border-radius:50%;background:#16a34a;flex-shrink:0" />
                        <div>
                          <div style="font-size:13px;font-weight:600">
                            QA
                          </div>
                          <div style="font-size:11px;color:var(--text-3)">
                            1 member
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      v-for="key in (['create', 'read', 'update', 'delete', 'members', 'roles'] as PermKey[])"
                      :key="key"
                      style="text-align:center;padding:14px 16px"
                    >
                      <button
                        :style="`width:20px;height:20px;border-radius:4px;border:2px solid ${perms.QA[key] ? 'var(--accent)' : 'var(--border-2)'};background:${perms.QA[key] ? 'var(--accent)' : 'transparent'};cursor:pointer;display:flex;align-items:center;justify-content:center;margin:0 auto`"
                        @click="togglePerm('QA', key)"
                      >
                        <svg
                          v-if="perms.QA[key]"
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--accent-fg)"
                          stroke-width="3"
                        ><polyline points="20 6 9 17 4 12" /></svg>
                      </button>
                    </td>
                    <td style="padding:14px 16px;text-align:right">
                      <button style="font-size:12px;color:var(--text-2);background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px">
                        Edit
                      </button>
                    </td>
                  </tr>
                  <!-- PM -->
                  <tr>
                    <td style="padding:14px 20px">
                      <div style="display:flex;align-items:center;gap:8px">
                        <div style="width:7px;height:7px;border-radius:50%;background:#9333ea;flex-shrink:0" />
                        <div>
                          <div style="font-size:13px;font-weight:600">
                            PM
                          </div>
                          <div style="font-size:11px;color:var(--text-3)">
                            1 member
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      v-for="key in (['create', 'read', 'update', 'delete', 'members', 'roles'] as PermKey[])"
                      :key="key"
                      style="text-align:center;padding:14px 16px"
                    >
                      <button
                        :style="`width:20px;height:20px;border-radius:4px;border:2px solid ${perms.PM[key] ? 'var(--accent)' : 'var(--border-2)'};background:${perms.PM[key] ? 'var(--accent)' : 'transparent'};cursor:pointer;display:flex;align-items:center;justify-content:center;margin:0 auto`"
                        @click="togglePerm('PM', key)"
                      >
                        <svg
                          v-if="perms.PM[key]"
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--accent-fg)"
                          stroke-width="3"
                        ><polyline points="20 6 9 17 4 12" /></svg>
                      </button>
                    </td>
                    <td style="padding:14px 16px;text-align:right">
                      <button style="font-size:12px;color:var(--text-2);background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px">
                        Edit
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
                style="padding:7px 12px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:12px;font-weight:500;cursor:pointer;color:var(--text-2)"
                @click="appStore.openOverrideModal()"
              >
                + Add override
              </button>
            </div>
            <div>
              <div style="display:grid;grid-template-columns:1fr 1fr 100px 100px 80px;align-items:center;padding:11px 20px;border-bottom:1px solid var(--border);font-size:11px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;color:var(--text-3)">
                <span>Document</span><span>Role / User</span><span>Permission</span><span>Effect</span><span />
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr 100px 100px 80px;align-items:center;padding:12px 20px;border-bottom:1px solid var(--border)">
                <div>
                  <div style="font-size:13px;font-weight:500">
                    Authentication Guide
                  </div>
                  <div style="font-size:11px;color:var(--text-3)">
                    API Documentation
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:20px;height:20px;border-radius:50%;background:#9333ea;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:#fff">
                    PM
                  </div>
                  <span style="font-size:13px">PM</span>
                </div>
                <span style="font-size:12px;font-weight:500">Update</span>
                <span style="font-size:12px;font-weight:600;color:#dc2626">✕ Deny</span>
                <button style="font-size:12px;color:var(--text-3);background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px">
                  Remove
                </button>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr 100px 100px 80px;align-items:center;padding:12px 20px">
                <div>
                  <div style="font-size:13px;font-weight:500">
                    Error Codes
                  </div>
                  <div style="font-size:11px;color:var(--text-3)">
                    API Documentation
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:20px;height:20px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:var(--accent-fg)">
                    MS
                  </div>
                  <span style="font-size:13px">Maria Santos</span>
                </div>
                <span style="font-size:12px;font-weight:500">Delete</span>
                <span style="font-size:12px;font-weight:600;color:#16a34a">✓ Allow</span>
                <button style="font-size:12px;color:var(--text-3);background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Variant B: Role Cards -->
        <template v-else>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
            <div
              v-for="role in [
                { name: 'Admin', color: '#0c0c0c', count: 'System default · Owner', badge: true, perms: ['Create documents', 'Read documents', 'Update documents', 'Delete documents', 'Manage members', 'Manage roles'], have: [true, true, true, true, true, true] },
                { name: 'Developer', color: '#2563eb', count: 'Project role · 3 members', badge: false, perms: ['Create documents', 'Read documents', 'Update documents', 'Delete documents', 'Manage members', 'Manage roles'], have: [true, true, true, false, false, false] },
                { name: 'QA', color: '#16a34a', count: 'Project role · 1 member', badge: false, perms: ['Create documents', 'Read documents', 'Update documents', 'Delete documents', 'Manage members', 'Manage roles'], have: [false, true, false, false, false, false] },
                { name: 'PM', color: '#9333ea', count: 'Project role · 1 member', badge: false, perms: ['Create documents', 'Read documents', 'Update documents', 'Delete documents', 'Manage members', 'Manage roles'], have: [false, true, false, false, true, false] }
              ]"
              :key="role.name"
              style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:22px;box-shadow:var(--shadow)"
            >
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
                <div style="display:flex;align-items:center;gap:10px">
                  <div :style="`width:10px;height:10px;border-radius:50%;background:${role.color};flex-shrink:0`" />
                  <div>
                    <div style="font-size:15px;font-weight:700">
                      {{ role.name }}
                    </div>
                    <div style="font-size:11px;color:var(--text-3)">
                      {{ role.count }}
                    </div>
                  </div>
                </div>
                <span
                  v-if="role.badge"
                  style="font-size:11px;padding:3px 8px;background:var(--bg);border:1px solid var(--border);border-radius:99px;color:var(--text-3)"
                >System</span>
                <button
                  v-else
                  style="font-size:12px;color:var(--text-2);background:none;border:1px solid var(--border);border-radius:var(--r-sm);cursor:pointer;padding:4px 10px;font-family:inherit"
                >
                  Edit
                </button>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px">
                <div
                  v-for="(p, i) in role.perms"
                  :key="p"
                  style="display:flex;align-items:center;gap:7px;font-size:13px"
                  :style="`color:${role.have[i] ? 'var(--text-2)' : 'var(--text-3)'}`"
                >
                  <span :style="`font-weight:700;color:${role.have[i] ? '#16a34a' : 'var(--text-3)'}`">{{ role.have[i] ? '✓' : '—' }}</span>
                  {{ p }}
                </div>
              </div>
            </div>

            <!-- New role card -->
            <button
              style="background:transparent;border:2px dashed var(--border);border-radius:var(--r);padding:22px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;font-family:inherit;color:var(--text-3);min-height:180px"
              @click="appStore.openRoleModal()"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
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
              <span style="font-size:13px;font-weight:600">New role</span>
            </button>
          </div>
        </template>
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
                type="text"
                placeholder="e.g. Senior Developer"
                style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
              >
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">Document permissions</label>
              <div style="display:flex;flex-direction:column;gap:8px">
                <label
                  v-for="p in ['Create documents', 'Read documents', 'Update documents', 'Delete documents']"
                  :key="p"
                  style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px"
                >
                  <input
                    type="checkbox"
                    :checked="p === 'Read documents'"
                    style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer"
                  >
                  {{ p }}
                </label>
              </div>
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">Project permissions</label>
              <div style="display:flex;flex-direction:column;gap:8px">
                <label
                  v-for="p in ['Manage members', 'Manage roles']"
                  :key="p"
                  style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px"
                >
                  <input
                    type="checkbox"
                    style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer"
                  >
                  {{ p }}
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
                style="flex:2;padding:9px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
                @click="appStore.closeRoleModal()"
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
              <select style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;cursor:pointer">
                <option>Select a document...</option>
                <option>Authentication Guide</option><option>REST Endpoints</option><option>Error Codes</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Role or user</label>
              <select style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;cursor:pointer">
                <option>Select a role or user...</option>
                <option>Role: Developer</option><option>Role: QA</option><option>Role: PM</option><option>User: Maria Santos</option>
              </select>
            </div>
            <div style="display:flex;gap:10px">
              <div style="flex:1">
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Permission</label>
                <select style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;cursor:pointer">
                  <option>Read</option><option>Create</option><option>Update</option><option>Delete</option>
                </select>
              </div>
              <div style="flex:1">
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Effect</label>
                <select style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;cursor:pointer">
                  <option>Allow</option><option>Deny</option>
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
                style="flex:2;padding:9px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
                @click="appStore.closeOverrideModal()"
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
