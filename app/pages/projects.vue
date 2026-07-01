<script setup lang="ts">
import { useAppStore } from '~/stores/app'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()

onMounted(() => {
  appStore.initTheme()
})

const projects = [
  { emoji: '🔧', name: 'DevVault Backend API', desc: 'Backend API documentation and architecture', docs: 8, members: 4, updated: '2h ago', link: '/project-dashboard' },
  { emoji: '🛒', name: 'Acme Storefront', desc: 'E-commerce platform docs and runbooks', docs: 5, members: 3, updated: '1d ago', link: '#' },
  { emoji: '📊', name: 'DataPipeline Docs', desc: 'Data ingestion pipeline documentation', docs: 3, members: 2, updated: '3d ago', link: '#' },
  { emoji: '📱', name: 'Mobile App v2', desc: 'iOS & Android release documentation', docs: 6, members: 5, updated: '5d ago', link: '#' },
  { emoji: '📋', name: 'Internal Ops Wiki', desc: 'Team processes and internal guides', docs: 12, members: 8, updated: '1w ago', link: '#' }
]
</script>

<template>
  <div style="min-height:100vh;background:var(--bg)">
    <!-- Header -->
    <header style="position:fixed;top:0;left:0;right:0;height:var(--hh);background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 24px;gap:12px;z-index:100">
      <NuxtLink
        to="/"
        style="display:flex;align-items:center;gap:7px;text-decoration:none;color:var(--text)"
      >
        <svg
          width="20"
          height="20"
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
        <span style="font-size:14px;font-weight:700;letter-spacing:-.4px">everysource</span>
      </NuxtLink>
      <div style="width:1px;height:16px;background:var(--border)" />
      <span style="font-size:13px;font-weight:600">Projects</span>
      <div style="flex:1" />
      <button
        style="display:flex;align-items:center;gap:7px;padding:7px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);cursor:pointer;color:var(--text-2);font-family:inherit;font-size:12px"
        @click="appStore.openSearch()"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        ><circle
          cx="11"
          cy="11"
          r="8"
        /><line
          x1="21"
          y1="21"
          x2="16.65"
          y2="16.65"
        /></svg>
        Search
        <kbd style="padding:1px 5px;background:var(--surface);border:1px solid var(--border);border-radius:3px;font-size:10px;color:var(--text-3)">⌘K</kbd>
      </button>
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
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px">
          <div>
            <h1 style="font-size:22px;font-weight:700;letter-spacing:-.5px;margin-bottom:4px">
              Your projects
            </h1>
            <p style="font-size:13px;color:var(--text-2)">
              {{ projects.length }} projects · All spaces
            </p>
          </div>
          <button
            style="display:flex;align-items:center;gap:7px;padding:9px 16px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
            @click="appStore.openNewProject()"
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
            New project
          </button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
          <NuxtLink
            v-for="p in projects"
            :key="p.name"
            :to="p.link"
            class="proj-card"
          >
            <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
              <div style="width:40px;height:40px;border-radius:var(--r);background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">{{ p.emoji }}</div>
              <div>
                <div style="font-size:14px;font-weight:700;margin-bottom:3px">{{ p.name }}</div>
                <p style="font-size:12px;color:var(--text-2);line-height:1.4">{{ p.desc }}</p>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;font-size:11px;color:var(--text-3);padding-top:12px;border-top:1px solid var(--border)">
              <span>{{ p.docs }} docs</span>
              <span>·</span>
              <span>{{ p.members }} members</span>
              <span>·</span>
              <span>{{ p.updated }}</span>
            </div>
          </NuxtLink>

          <!-- New project dashed card -->
          <button
            class="proj-card-new"
            @click="appStore.openNewProject()"
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
            <span style="font-size:13px;font-weight:600">New project</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Search modal -->
    <Teleport to="body">
      <div
        v-if="appStore.searchOpen"
        style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding:80px 24px"
        @click="appStore.closeSearch()"
      >
        <div
          style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);width:100%;max-width:560px;box-shadow:var(--shadow-md);overflow:hidden"
          @click.stop
        >
          <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--border)">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              style="color:var(--text-3);flex-shrink:0"
            ><circle
              cx="11"
              cy="11"
              r="8"
            /><line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            /></svg>
            <input
              placeholder="Search projects and documents..."
              style="flex:1;border:none;background:transparent;font-family:inherit;font-size:14px;color:var(--text);outline:none"
            >
            <kbd style="padding:2px 6px;background:var(--bg);border:1px solid var(--border);border-radius:4px;font-size:11px;color:var(--text-3)">Esc</kbd>
          </div>
          <div style="padding:8px">
            <div style="padding:6px 10px;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3)">
              Projects
            </div>
            <div
              v-for="p in projects.slice(0, 3)"
              :key="p.name"
              style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--r-sm);cursor:pointer"
            >
              <span style="font-size:15px">{{ p.emoji }}</span>
              <span style="font-size:13px;font-weight:500">{{ p.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- New Project modal -->
    <Teleport to="body">
      <div
        v-if="appStore.newProjectModalOpen"
        style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px"
        @click="appStore.closeNewProject()"
      >
        <div
          style="background:var(--surface);border:1px solid var(--border);border-radius:12px;width:460px;box-shadow:var(--shadow-md)"
          @click.stop
        >
          <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border)">
            <div>
              <h2 style="font-size:15px;font-weight:700">
                New project
              </h2>
              <p style="font-size:12px;color:var(--text-3);margin-top:2px">
                Create a new documentation workspace.
              </p>
            </div>
            <button
              style="width:26px;height:26px;border:none;background:var(--bg);border-radius:4px;cursor:pointer;color:var(--text-2);display:flex;align-items:center;justify-content:center;font-size:14px"
              @click="appStore.closeNewProject()"
            >
              ✕
            </button>
          </div>
          <div style="padding:22px;display:flex;flex-direction:column;gap:14px">
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Project name</label>
              <input
                type="text"
                placeholder="e.g. DevVault Backend API"
                style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
              >
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Description <span style="text-transform:none;font-weight:400;letter-spacing:0">(optional)</span></label>
              <textarea
                placeholder="What is this project about?"
                rows="3"
                style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:13px;outline:none;resize:none"
              />
            </div>
            <div style="display:flex;gap:10px;margin-top:4px">
              <button
                style="flex:1;padding:9px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:13px;cursor:pointer;color:var(--text)"
                @click="appStore.closeNewProject()"
              >
                Cancel
              </button>
              <button
                style="flex:2;padding:9px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
                @click="appStore.closeNewProject()"
              >
                Create project
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.proj-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 20px;
  text-decoration: none;
  color: var(--text);
  box-shadow: var(--shadow);
  transition: box-shadow .15s, border-color .15s;
  display: block;
}
.proj-card:hover { box-shadow: var(--shadow-md); border-color: var(--text-3); }

.proj-card-new {
  background: transparent;
  border: 2px dashed var(--border);
  border-radius: var(--r);
  padding: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  color: var(--text-3);
  min-height: 140px;
  transition: border-color .15s, color .15s;
}
.proj-card-new:hover { border-color: var(--text-3); color: var(--text-2); }
</style>
