<script setup lang="ts">
import { useAppStore } from '~/stores/app'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()

onMounted(() => {
  appStore.initTheme()
})

const members = [
  { initials: 'DF', color: 'var(--accent)', fg: 'var(--accent-fg)', name: 'Drew Ferrer', title: 'Owner', email: 'drew@acme.com', role: 'Admin', joined: 'Jan 12, 2025', owner: true },
  { initials: 'MS', color: '#2563eb', fg: '#fff', name: 'Maria Santos', title: 'Senior Developer', email: 'maria@acme.com', role: 'Developer', joined: 'Jan 14, 2025', owner: false },
  { initials: 'JL', color: '#16a34a', fg: '#fff', name: 'Jake Liu', title: 'QA Engineer', email: 'jake@acme.com', role: 'QA', joined: 'Feb 3, 2025', owner: false },
  { initials: 'AK', color: '#9333ea', fg: '#fff', name: 'Alex Kim', title: 'Product Manager', email: 'alex@acme.com', role: 'PM', joined: 'Feb 10, 2025', owner: false }
]
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
      <span style="font-size:13px;font-weight:600">Members</span>
      <div style="flex:1" />
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
      <div style="max-width:900px;margin:0 auto;padding:36px 32px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px">
          <div>
            <h1 style="font-size:22px;font-weight:700;letter-spacing:-.5px;margin-bottom:4px">
              Members
            </h1>
            <p style="font-size:13px;color:var(--text-2)">
              5 members with access to DevVault Backend API
            </p>
          </div>
          <button
            style="display:flex;align-items:center;gap:7px;padding:9px 16px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
            @click="appStore.openInviteModal()"
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
          <div
            v-for="m in members"
            :key="m.email"
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
                v-if="m.owner"
                style="font-size:11px;font-weight:600;padding:3px 8px;background:var(--bg);border:1px solid var(--border);border-radius:99px;color:var(--text-2)"
              >Admin</span>
              <select
                v-else
                style="padding:4px 8px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:12px;outline:none;cursor:pointer"
                @click.stop
              >
                <option :selected="m.role === 'Developer'">
                  Developer
                </option>
                <option :selected="m.role === 'QA'">
                  QA
                </option>
                <option :selected="m.role === 'PM'">
                  PM
                </option>
                <option :selected="m.role === 'Admin'">
                  Admin
                </option>
              </select>
            </div>
            <span style="font-size:12px;color:var(--text-3)">{{ m.joined }}</span>
            <span
              v-if="m.owner"
              style="font-size:12px;color:var(--text-3)"
            >—</span>
            <button
              v-else
              style="font-size:12px;color:#dc2626;background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-family:inherit"
            >
              Remove
            </button>
          </div>

          <!-- Pending invite -->
          <div
            class="row-grid"
            style="padding:14px 20px;align-items:center"
          >
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:34px;height:34px;border-radius:50%;background:var(--bg);border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;color:var(--text-3)">
                ?
              </div>
              <div>
                <div style="font-size:13px;font-weight:500;color:var(--text-2)">
                  Pending invite
                </div>
                <div style="font-size:11px;color:var(--text-3)">
                  Sent 1d ago
                </div>
              </div>
            </div>
            <span style="font-size:12px;color:var(--text-3)">sam@acme.com</span>
            <div><span style="font-size:11px;font-weight:600;padding:3px 8px;background:#fef3c7;color:#92400e;border-radius:99px">Pending</span></div>
            <span style="font-size:12px;color:var(--text-3)">—</span>
            <button style="font-size:12px;color:var(--text-2);background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;font-family:inherit">
              Resend
            </button>
          </div>
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
                type="email"
                placeholder="colleague@acme.com"
                style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
              >
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Assign role</label>
              <select style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;cursor:pointer">
                <option>Developer</option><option>QA</option><option>PM</option><option>Admin</option>
              </select>
            </div>
            <div style="padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);font-size:12px;color:var(--text-3);line-height:1.6">
              The invited member will have <strong style="color:var(--text-2)">Developer</strong> permissions by default. You can change this at any time from the members list.
            </div>
            <div style="display:flex;gap:10px;margin-top:4px">
              <button
                style="flex:1;padding:9px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:13px;cursor:pointer;color:var(--text)"
                @click="appStore.closeInviteModal()"
              >
                Cancel
              </button>
              <button
                style="flex:2;padding:9px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
                @click="appStore.closeInviteModal()"
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
