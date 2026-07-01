<script setup lang="ts">
import { useAppStore } from '~/stores/app'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()

onMounted(() => {
  appStore.initTheme()
})
</script>

<template>
  <div style="min-height:100vh;background:var(--bg);padding:48px 32px;color:var(--text)">
    <!-- Top bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;max-width:960px;margin:0 auto 48px">
      <div style="display:flex;align-items:center;gap:10px">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >
          <rect
            width="12"
            height="12"
            rx="2.5"
            fill="currentColor"
          />
          <rect
            x="16"
            width="12"
            height="12"
            rx="2.5"
            fill="currentColor"
            opacity=".3"
          />
          <rect
            y="16"
            width="12"
            height="12"
            rx="2.5"
            fill="currentColor"
            opacity=".3"
          />
          <rect
            x="16"
            y="16"
            width="12"
            height="12"
            rx="2.5"
            fill="currentColor"
          />
        </svg>
        <div>
          <div style="font-size:18px;font-weight:700;letter-spacing:-.5px">
            everysource
          </div>
          <div style="font-size:11px;color:var(--text-3)">
            UI Design — All Screens
          </div>
        </div>
      </div>
      <button
        class="theme-btn"
        @click="appStore.toggleTheme()"
      >
        {{ appStore.dark ? '☀' : '☾' }} {{ appStore.dark ? 'Light mode' : 'Dark mode' }}
      </button>
    </div>

    <div style="max-width:960px;margin:0 auto">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <span style="font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;padding:4px 10px;background:var(--accent);color:var(--accent-fg);border-radius:99px">Tier 1 — Bespoke</span>
        <span style="font-size:12px;color:var(--text-3)">Custom design required · Multiple layout variants</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
        <NuxtLink
          to="/project-dashboard"
          class="card"
        >
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:8px">
              <div class="icon-box">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                  /><rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="7"
                    height="7"
                  /><rect
                    x="3"
                    y="14"
                    width="7"
                    height="7"
                  />
                </svg>
              </div>
              <div>
                <div style="font-size:14px;font-weight:700">Project Dashboard</div>
                <div style="font-size:11px;color:var(--text-3)">Document tree + sidebar</div>
              </div>
            </div>
            <span class="variant-badge">B selected</span>
          </div>
          <p style="font-size:12px;color:var(--text-2);line-height:1.5">Main app shell with sidebar nav, category/doc tree, search palette, and content area. Notion-wide style (Variant B).</p>
        </NuxtLink>

        <NuxtLink
          to="/document-editor"
          class="card"
        >
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:8px">
              <div class="icon-box">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <div>
                <div style="font-size:14px;font-weight:700">Document Editor</div>
                <div style="font-size:11px;color:var(--text-3)">Rich text + right panel</div>
              </div>
            </div>
            <span class="variant-badge">B selected</span>
          </div>
          <p style="font-size:12px;color:var(--text-2);line-height:1.5">Tiptap-style editor with formatting toolbar, right metadata panel, status badge, share modal. Variant B (Right panel).</p>
        </NuxtLink>

        <NuxtLink
          to="/roles"
          class="card"
        >
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:8px">
              <div class="icon-box">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                  />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <div style="font-size:14px;font-weight:700">Roles &amp; Permissions</div>
                <div style="font-size:11px;color:var(--text-3)">Permission matrix</div>
              </div>
            </div>
            <span class="variant-badge">A+B</span>
          </div>
          <p style="font-size:12px;color:var(--text-2);line-height:1.5">Role CRUD checkboxes grid + document-level overrides table. Variant A (Matrix table), B (Role cards). Includes add-role and add-override modals.</p>
        </NuxtLink>

        <NuxtLink
          to="/version-history"
          class="card"
        >
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:8px">
              <div class="icon-box">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-.28-5.51L23 10" />
                </svg>
              </div>
              <div>
                <div style="font-size:14px;font-weight:700">Version History</div>
                <div style="font-size:11px;color:var(--text-3)">Snapshots + restore</div>
              </div>
            </div>
            <span class="variant-badge">A+B</span>
          </div>
          <p style="font-size:12px;color:var(--text-2);line-height:1.5">Full snapshot per save with who/when metadata and restore action. Variant A (Timeline list), B (Split preview panel). Restore confirm modal included.</p>
        </NuxtLink>
      </div>

      <!-- Additional screens -->
      <div style="display:flex;align-items:center;gap:10px;margin-top:28px;margin-bottom:16px">
        <span style="font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;padding:4px 10px;background:var(--bg);border:1px solid var(--border);color:var(--text-2);border-radius:99px">More Screens</span>
        <span style="font-size:12px;color:var(--text-3)">Auth, projects list, members, share view</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
        <NuxtLink
          to="/login"
          class="card"
        >
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <div class="icon-box">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              ><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line
                x1="15"
                y1="12"
                x2="3"
                y2="12"
              /></svg>
            </div>
            <div>
              <div style="font-size:14px;font-weight:700">Login</div>
              <div style="font-size:11px;color:var(--text-3)">Sign in form + SSO</div>
            </div>
          </div>
          <p style="font-size:12px;color:var(--text-2);line-height:1.5">Email/password form with SSO option. Signs in to Projects list.</p>
        </NuxtLink>

        <NuxtLink
          to="/onboarding"
          class="card"
        >
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <div class="icon-box">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              ><circle
                cx="12"
                cy="12"
                r="10"
              /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <div>
              <div style="font-size:14px;font-weight:700">Onboarding</div>
              <div style="font-size:11px;color:var(--text-3)">3-step wizard</div>
            </div>
          </div>
          <p style="font-size:12px;color:var(--text-2);line-height:1.5">Create organization → admin account → done. Leads to Projects list.</p>
        </NuxtLink>

        <NuxtLink
          to="/projects"
          class="card"
        >
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <div class="icon-box">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              ><rect
                x="2"
                y="3"
                width="6"
                height="6"
                rx="1"
              /><rect
                x="9"
                y="3"
                width="6"
                height="6"
                rx="1"
              /><rect
                x="16"
                y="3"
                width="6"
                height="6"
                rx="1"
              /><rect
                x="2"
                y="10"
                width="6"
                height="6"
                rx="1"
              /><rect
                x="9"
                y="10"
                width="6"
                height="6"
                rx="1"
              /></svg>
            </div>
            <div>
              <div style="font-size:14px;font-weight:700">Projects List</div>
              <div style="font-size:11px;color:var(--text-3)">3-col project grid</div>
            </div>
          </div>
          <p style="font-size:12px;color:var(--text-2);line-height:1.5">Project cards with New Project modal. DevVault links to dashboard.</p>
        </NuxtLink>

        <NuxtLink
          to="/members"
          class="card"
        >
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <div class="icon-box">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              ><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle
                cx="9"
                cy="7"
                r="4"
              /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div>
              <div style="font-size:14px;font-weight:700">Members</div>
              <div style="font-size:11px;color:var(--text-3)">Team management</div>
            </div>
          </div>
          <p style="font-size:12px;color:var(--text-2);line-height:1.5">Member table with role selects, pending invite row, invite modal.</p>
        </NuxtLink>

        <NuxtLink
          to="/share/abc123"
          class="card"
        >
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <div class="icon-box">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              ><circle
                cx="18"
                cy="5"
                r="3"
              /><circle
                cx="6"
                cy="12"
                r="3"
              /><circle
                cx="18"
                cy="19"
                r="3"
              /><line
                x1="8.59"
                y1="13.51"
                x2="15.42"
                y2="17.49"
              /><line
                x1="15.41"
                y1="6.51"
                x2="8.59"
                y2="10.49"
              /></svg>
            </div>
            <div>
              <div style="font-size:14px;font-weight:700">Share View</div>
              <div style="font-size:11px;color:var(--text-3)">Public read-only</div>
            </div>
          </div>
          <p style="font-size:12px;color:var(--text-2);line-height:1.5">Read-only document view with shared-link banner. No auth required.</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 14px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: var(--surface); cursor: pointer; color: var(--text-2);
  font-family: inherit; font-size: 12px; font-weight: 500; transition: border-color .15s;
}
.theme-btn:hover { border-color: var(--text-3); }

.card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r);
  padding: 20px; text-decoration: none; color: var(--text);
  box-shadow: var(--shadow); transition: box-shadow .15s, border-color .15s; display: block;
}
.card:hover { box-shadow: var(--shadow-md); border-color: var(--text-3); }

.icon-box {
  width: 32px; height: 32px; border-radius: 7px;
  background: var(--bg); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
}

.variant-badge {
  font-size: 10px; font-weight: 600; padding: 3px 7px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 99px; color: var(--text-3);
}
</style>
