<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useDocumentsStore } from '~/stores/documents'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()
const docsStore = useDocumentsStore()
const { activeDoc } = storeToRefs(docsStore)
const activeCategory = computed(() =>
  docsStore.categories.find(cat => cat.docs.some(d => d.id === docsStore.activeDocId))
)

onMounted(() => appStore.initTheme())

const statusColor = (status: string) =>
  status === 'published' ? '#16a34a' : status === 'draft' ? '#d97706' : '#6b7280'

const statusBadgeStyle = computed(() => {
  const s = activeDoc.value?.status
  return s === 'published' ? 'background:#dcfce7;color:#15803d' : s === 'draft' ? 'background:#fef3c7;color:#92400e' : 'background:#f3f4f6;color:#6b7280'
})

const searchItems = [
  { id: 1, title: 'Authentication Guide', crumb: 'API Documentation · DevVault Backend API', status: 'Published', style: 'background:#dcfce7;color:#15803d' },
  { id: 2, title: 'Code Review Process', crumb: 'Engineering Guidelines · DevVault Backend API', status: 'Draft', style: 'background:#fef3c7;color:#92400e' },
  { id: 3, title: 'Git Branching Strategy', crumb: 'Engineering Guidelines · DevVault Backend API', status: 'Published', style: 'background:#dcfce7;color:#15803d' }
]

const suggestions = ['API Documentation', 'Style Guide', 'User Manual', 'Engineering Guidelines', 'Deployment Runbooks']
</script>

<template>
  <div style="height:100vh;overflow:hidden;background:var(--bg);color:var(--text)">
    <!-- Fixed Header -->
    <header class="app-header">
      <NuxtLink
        to="/"
        class="logo-link"
      >
        <svg
          width="18"
          height="18"
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
        <span style="font-size:13px;font-weight:700;letter-spacing:-.4px">everysource</span>
      </NuxtLink>
      <div class="hdr-divider" />
      <NuxtLink
        to="/"
        class="breadcrumb-link"
      >Projects</NuxtLink>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        style="color:var(--text-3)"
      ><path d="m9 18 6-6-6-6" /></svg>
      <span style="font-size:12px;font-weight:600">DevVault Backend API</span>
      <div style="flex:1" />
      <button
        class="hdr-btn"
        @click="appStore.openSearch()"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        ><circle
          cx="11"
          cy="11"
          r="8"
        /><path d="m21 21-4.35-4.35" /></svg>
        ⌘K
      </button>
      <NuxtLink
        to="/members"
        class="hdr-link-btn"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        ><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle
          cx="9"
          cy="7"
          r="4"
        /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        Members
      </NuxtLink>
      <NuxtLink
        to="/roles"
        class="hdr-link-btn"
      >Roles</NuxtLink>
      <button
        class="theme-icon-btn"
        @click="appStore.toggleTheme()"
      >
        {{ appStore.dark ? '☀' : '☾' }}
      </button>
      <div class="avatar">
        DF
      </div>
    </header>

    <!-- Body -->
    <div style="display:flex;height:100vh;padding-top:var(--hh);overflow:hidden">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div style="padding:14px 16px 10px">
          <div style="font-size:13px;font-weight:700;letter-spacing:-.3px;margin-bottom:2px;display:flex;align-items:center;justify-content:space-between">
            DevVault Backend API
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              style="color:var(--text-3);cursor:pointer"
            ><circle
              cx="12"
              cy="12"
              r="1"
            /><circle
              cx="19"
              cy="12"
              r="1"
            /><circle
              cx="5"
              cy="12"
              r="1"
            /></svg>
          </div>
          <p style="font-size:11px;color:var(--text-3)">
            4 members · 8 documents
          </p>
        </div>

        <div style="padding:6px 8px 4px">
          <div style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:var(--r-sm);background:var(--surface);border:1px solid var(--border);color:var(--text-3)">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            ><circle
              cx="11"
              cy="11"
              r="8"
            /><path d="m21 21-4.35-4.35" /></svg>
            <span style="font-size:12px">Search...</span>
          </div>
        </div>

        <div style="flex:1;overflow-y:auto;padding:6px 8px">
          <div class="section-label">
            Documentation
          </div>

          <div
            v-for="cat in docsStore.categories"
            :key="cat.id"
            style="margin-bottom:2px"
          >
            <button
              class="cat-btn"
              @click="docsStore.toggleCategory(cat.id)"
            >
              <span
                style="font-size:10px;display:inline-block;transition:transform .15s"
                :style="{ transform: cat.open ? 'rotate(0deg)' : 'rotate(-90deg)' }"
              >▾</span>
              <span style="flex:1;text-align:left">{{ cat.name }}</span>
              <span style="font-size:10px;color:var(--text-3)">{{ cat.docs.length }}</span>
            </button>
            <div
              v-if="cat.open"
              style="padding:2px 0 2px 8px"
            >
              <button
                v-for="doc in cat.docs"
                :key="doc.id"
                type="button"
                class="doc-link"
                :class="{ 'doc-link--active': doc.id === docsStore.activeDocId }"
                @click="docsStore.setActiveDoc(doc.id)"
              >
                <span
                  class="status-dot"
                  :style="{ background: statusColor(doc.status) }"
                />
                {{ doc.title }}
              </button>
            </div>
          </div>

          <div
            class="section-label"
            style="margin-top:12px"
          >
            Settings
          </div>
          <NuxtLink
            to="/members"
            class="sidebar-link"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            ><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle
              cx="9"
              cy="7"
              r="4"
            /></svg>
            Members
          </NuxtLink>
          <NuxtLink
            to="/roles"
            class="sidebar-link"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            ><rect
              x="3"
              y="11"
              width="18"
              height="11"
              rx="2"
            /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Roles &amp; Permissions
          </NuxtLink>
        </div>

        <div style="padding:10px;border-top:1px solid var(--border)">
          <button
            class="new-cat-btn"
            @click="appStore.openCategoryModal()"
          >
            <svg
              width="10"
              height="10"
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
            New category
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main style="flex:1;overflow-y:auto;padding:40px;background:var(--surface)">
        <div style="max-width:680px;margin:0 auto">
          <div style="font-size:11px;color:var(--text-3);margin-bottom:16px">
            {{ activeCategory?.name }} › {{ activeDoc?.title }}
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
            <div>
              <h1 style="font-size:30px;font-weight:700;letter-spacing:-.7px;margin-bottom:8px">
                {{ activeDoc?.title }}
              </h1>
              <div style="display:flex;align-items:center;gap:8px">
                <span
                  style="font-size:11px;font-weight:600;padding:3px 8px;border-radius:99px;text-transform:capitalize"
                  :style="statusBadgeStyle"
                >{{ activeDoc?.status }}</span>
                <span style="font-size:12px;color:var(--text-3)">{{ activeDoc?.author }} · {{ activeDoc?.updatedAt }} · v{{ activeDoc?.version }}</span>
              </div>
            </div>
            <NuxtLink
              to="/document-editor"
              class="edit-btn"
            >Edit</NuxtLink>
          </div>
        </div>
      </main>
    </div>

    <!-- Search palette -->
    <Teleport to="body">
      <div
        v-if="appStore.searchOpen"
        class="overlay"
        @click="appStore.closeSearch()"
      >
        <div
          class="search-palette"
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
              style="color:var(--text-3)"
            ><circle
              cx="11"
              cy="11"
              r="8"
            /><path d="m21 21-4.35-4.35" /></svg>
            <input
              type="text"
              placeholder="Search documents, categories..."
              class="search-input"
              autofocus
            >
            <kbd class="kbd">Esc</kbd>
          </div>
          <div style="max-height:320px;overflow-y:auto">
            <div class="search-section-label">
              Recent
            </div>
            <NuxtLink
              v-for="item in searchItems"
              :key="item.id"
              to="/document-editor"
              class="search-item"
              @click="appStore.closeSearch()"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                style="color:var(--text-3);flex-shrink:0"
              ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:500">{{ item.title }}</div>
                <div style="font-size:11px;color:var(--text-3)">{{ item.crumb }}</div>
              </div>
              <span
                class="search-badge"
                :style="item.style"
              >{{ item.status }}</span>
            </NuxtLink>
          </div>
          <div style="padding:10px 14px;border-top:1px solid var(--border);display:flex;gap:12px;font-size:11px;color:var(--text-3)">
            <span>↵ Open</span><span>↑↓ Navigate</span><span>Esc Close</span>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Category modal -->
    <Teleport to="body">
      <div
        v-if="appStore.categoryModalOpen"
        class="overlay"
        @click="appStore.closeCategoryModal()"
      >
        <div
          class="modal-box"
          @click.stop
        >
          <div class="modal-header">
            <h2 style="font-size:15px;font-weight:700">
              New category
            </h2>
            <button
              class="modal-close"
              @click="appStore.closeCategoryModal()"
            >
              ✕
            </button>
          </div>
          <div style="padding:22px;display:flex;flex-direction:column;gap:14px">
            <div>
              <label class="field-label">Category name</label>
              <input
                type="text"
                placeholder="e.g. API Documentation"
                class="text-input"
              >
            </div>
            <div>
              <p class="field-label">
                Quick start suggestions
              </p>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                <button
                  v-for="s in suggestions"
                  :key="s"
                  class="chip"
                >
                  {{ s }}
                </button>
              </div>
            </div>
            <div style="display:flex;gap:8px">
              <button
                class="btn-cancel"
                @click="appStore.closeCategoryModal()"
              >
                Cancel
              </button>
              <button
                class="btn-primary"
                @click="appStore.closeCategoryModal()"
              >
                Create category
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.app-header {
  position: fixed; top: 0; left: 0; right: 0; height: var(--hh);
  background: var(--surface); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 16px; gap: 10px; z-index: 100;
}
.logo-link {
  display: flex; align-items: center; gap: 6px;
  text-decoration: none; color: var(--text); flex-shrink: 0;
}
.hdr-divider { height: 14px; width: 1px; background: var(--border); }
.breadcrumb-link { font-size: 12px; color: var(--text-2); text-decoration: none; }
.breadcrumb-link:hover { color: var(--text); }
.hdr-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 10px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: transparent; color: var(--text-2); font-family: inherit; font-size: 11px; cursor: pointer;
}
.hdr-btn:hover { border-color: var(--text-3); }
.hdr-link-btn {
  padding: 5px 10px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: transparent; color: var(--text-2); font-family: inherit; font-size: 11px;
  cursor: pointer; text-decoration: none; display: flex; align-items: center; gap: 5px;
}
.hdr-link-btn:hover { border-color: var(--text-3); }
.theme-icon-btn {
  width: 30px; height: 30px; border-radius: var(--r-sm);
  border: 1px solid var(--border); background: transparent;
  cursor: pointer; color: var(--text-2); font-size: 12px;
  display: flex; align-items: center; justify-content: center;
}
.theme-icon-btn:hover { border-color: var(--text-3); }
.avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--accent); color: var(--accent-fg);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; cursor: pointer;
}

.sidebar {
  width: 280px; flex-shrink: 0;
  background: var(--bg); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; overflow: hidden;
}
.section-label {
  font-size: 10px; font-weight: 600; letter-spacing: .6px;
  text-transform: uppercase; color: var(--text-3);
  padding: 6px 8px; margin-bottom: 2px;
}
.cat-btn {
  width: 100%; display: flex; align-items: center; gap: 5px;
  padding: 5px 8px; border: none; background: transparent;
  cursor: pointer; border-radius: 5px; color: var(--text-2);
  font-family: inherit; font-size: 12px; font-weight: 500;
}
.cat-btn:hover { background: var(--surface); }
.doc-link {
  display: flex; align-items: center; gap: 6px; width: 100%;
  padding: 4px 8px; border-radius: 4px; border: none; background: transparent;
  color: var(--text-2); font-size: 12px; font-family: inherit; cursor: pointer; text-align: left;
}
.doc-link:hover { background: var(--surface); }
.doc-link--active {
  background: var(--accent) !important; color: var(--accent-fg) !important;
}
.status-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }
.sidebar-link {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 8px; border-radius: 5px;
  text-decoration: none; color: var(--text-2); font-size: 12px;
}
.sidebar-link:hover { background: var(--surface); }
.new-cat-btn {
  width: 100%; display: flex; align-items: center; gap: 6px;
  padding: 7px 10px; border: 1px dashed var(--border); border-radius: var(--r-sm);
  background: transparent; cursor: pointer; color: var(--text-3);
  font-family: inherit; font-size: 12px; transition: border-color .15s;
}
.new-cat-btn:hover { border-color: var(--text-3); color: var(--text-2); }

.edit-btn {
  padding: 7px 14px; background: var(--accent); color: var(--accent-fg);
  border-radius: var(--r-sm); font-size: 12px; font-weight: 600; text-decoration: none;
}
.edit-btn:hover { opacity: .85; }

.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 200;
  display: flex; align-items: flex-start; justify-content: center; padding: 80px 24px 24px;
}
.search-palette {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  width: 100%; max-width: 560px; box-shadow: var(--shadow-md); overflow: hidden;
}
.search-input {
  flex: 1; border: none; background: transparent; color: var(--text);
  font-family: inherit; font-size: 14px; outline: none;
}
.kbd {
  font-size: 11px; color: var(--text-3); background: var(--bg);
  padding: 2px 6px; border-radius: 3px; border: 1px solid var(--border);
}
.search-section-label { padding: 6px 10px; font-size: 10px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; color: var(--text-3); }
.search-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 14px; text-decoration: none; color: var(--text);
}
.search-item:hover { background: var(--bg); }
.search-badge { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 99px; }

.modal-box {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  width: 420px; box-shadow: var(--shadow-md);
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px; border-bottom: 1px solid var(--border);
}
.modal-close {
  width: 26px; height: 26px; border: none; background: var(--bg); border-radius: 4px;
  cursor: pointer; color: var(--text-2); display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: var(--border); }
.field-label {
  display: block; font-size: 11px; font-weight: 600; letter-spacing: .5px;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 6px;
}
.text-input {
  width: 100%; padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: var(--bg); color: var(--text); font-family: inherit; font-size: 14px; outline: none;
}
.text-input:focus { border-color: var(--text-2); }
.chip {
  padding: 5px 10px; border: 1px solid var(--border); border-radius: 99px;
  background: transparent; font-family: inherit; font-size: 12px; cursor: pointer; color: var(--text-2);
}
.chip:hover { background: var(--bg); }
.btn-cancel {
  flex: 1; padding: 9px; background: transparent; border: 1px solid var(--border);
  border-radius: var(--r-sm); font-family: inherit; font-size: 13px; cursor: pointer; color: var(--text);
}
.btn-cancel:hover { background: var(--bg); }
.btn-primary {
  flex: 2; padding: 9px; background: var(--accent); color: var(--accent-fg);
  border: none; border-radius: var(--r-sm); font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
}
.btn-primary:hover { opacity: .85; }
</style>
