<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useAuthStore } from '~/stores/auth'
import { useDocumentsStore } from '~/stores/documents'
import { storeToRefs } from 'pinia'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()
const authStore = useAuthStore()
const docsStore = useDocumentsStore()
const { can } = usePermissions()
const { currentUser } = storeToRefs(authStore)
const { activeDoc, activeVersions } = storeToRefs(docsStore)
const canRestore = computed(() => can('update', activeDoc.value?.id))
const route = useRoute()

onMounted(() => {
  appStore.initTheme()
  const vParam = Number(route.query.v)
  if (!vParam || !activeVersions.value.find(ver => ver.v === vParam)) {
    navigateTo('/version-history')
  }
})

const vParam = computed(() => Number(route.query.v))
const snapshot = computed(() => activeVersions.value.find(ver => ver.v === vParam.value) ?? null)
const currentVer = computed(() => activeVersions.value.find(ver => ver.current) ?? null)

const restoreModalOpen = ref(false)

const statusMap = {
  published: { label: 'Published', bg: '#dcfce7', fg: '#15803d' },
  draft: { label: 'Draft', bg: '#fef3c7', fg: '#92400e' },
  archived: { label: 'Archived', bg: 'var(--bg)', fg: 'var(--text-3)' }
}

const currentStatus = computed(() => statusMap[docsStore.activeStatus] || statusMap.draft)

function handleRestore() {
  if (!snapshot.value) return
  docsStore.restoreVersion(snapshot.value.v)
  restoreModalOpen.value = false
  navigateTo('/document-editor')
}
</script>

<template>
  <div style="height:100vh;overflow:hidden;background:var(--bg);color:var(--text)">
    <!-- Fixed Header -->
    <header class="app-header">
      <NuxtLink
        to="/version-history"
        class="back-link"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        ><path d="m15 18-6-6 6-6" /></svg>
        Version History
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
      <span style="font-size:13px;font-weight:600">Snapshot v{{ snapshot?.v }}</span>
      <div style="flex:1" />
      <button
        class="theme-icon-btn"
        @click="appStore.toggleTheme()"
      >
        {{ appStore.dark ? '☀' : '☾' }}
      </button>
      <ClientOnly>
        <div class="avatar">
          {{ currentUser?.initials ?? '?' }}
        </div>
      </ClientOnly>
    </header>

    <!-- Editor + panel -->
    <div
      v-if="snapshot"
      style="display:flex;height:100vh;padding-top:var(--hh);overflow:hidden"
    >
      <!-- Editor column (no toolbar) -->
      <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
        <ClientOnly>
          <ShadTiptapEditor
            :content="snapshot.content"
            :readonly="true"
            style="flex:1;overflow-y:auto"
          />
          <template #fallback>
            <div style="flex:1;overflow-y:auto;padding:40px;opacity:.4;font-size:14px">
              Loading editor…
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Right metadata panel -->
      <aside class="meta-panel">
        <h3 class="meta-header">
          Snapshot details
        </h3>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div>
            <div class="meta-label">
              Version
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:13px;font-weight:600">v{{ snapshot.v }}</span>
              <span
                v-if="snapshot.current"
                style="font-size:11px;font-weight:600;padding:2px 7px;background:#dcfce7;color:#15803d;border-radius:99px"
              >Current</span>
            </div>
          </div>
          <div>
            <div class="meta-label">
              Saved by
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <div :style="`width:20px;height:20px;border-radius:50%;background:${snapshot.color};color:${snapshot.fg};display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700`">
                {{ snapshot.initials }}
              </div>
              <span style="font-size:13px">{{ snapshot.name }}</span>
            </div>
          </div>
          <div>
            <div class="meta-label">
              Saved
            </div>
            <span style="font-size:13px">{{ snapshot.time }}</span>
          </div>
          <div>
            <div class="meta-label">
              Category
            </div>
            <span style="font-size:13px">API Documentation</span>
          </div>
          <div>
            <div class="meta-label">
              Status
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <span
                class="status-dot-sm"
                :style="{ background: docsStore.activeStatus === 'published' ? '#16a34a' : docsStore.activeStatus === 'draft' ? '#d97706' : '#6b7280' }"
              />
              <span style="font-size:13px;font-weight:600">{{ currentStatus.label }}</span>
            </div>
          </div>

          <div
            v-if="!snapshot.current && canRestore"
            style="border-top:1px solid var(--border);padding-top:14px"
          >
            <button
              class="restore-btn"
              @click="restoreModalOpen = true"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              ><path d="M3 7v6h6" /><path d="M3 13C5.5 7 11 4 17 5.5a9 9 0 0 1 5 9" /></svg>
              Restore this version
            </button>
          </div>

          <div style="border-top:1px solid var(--border);padding-top:14px">
            <NuxtLink
              to="/version-history"
              class="meta-link"
            >
              ← View all versions
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>

    <!-- Restore modal -->
    <Teleport to="body">
      <div
        v-if="restoreModalOpen"
        class="overlay"
        @click="restoreModalOpen = false"
      >
        <div
          class="modal-box"
          style="width:420px"
          @click.stop
        >
          <div class="modal-header">
            <div>
              <h2 style="font-size:15px;font-weight:700">
                Restore this version?
              </h2>
              <p style="font-size:12px;color:var(--text-3);margin-top:2px">
                This action will update the live document.
              </p>
            </div>
            <button
              class="modal-close"
              @click="restoreModalOpen = false"
            >
              ✕
            </button>
          </div>
          <div style="padding:20px 22px;display:flex;flex-direction:column;gap:16px">
            <p style="font-size:13px;color:var(--text-2);line-height:1.6">
              Restoring <strong>v{{ snapshot?.v }}</strong> will replace the current version (<strong>v{{ currentVer?.v }}</strong>). The current version will be saved to version history for auditing.
            </p>
            <div style="display:flex;gap:10px">
              <button
                style="flex:1;padding:9px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:13px;cursor:pointer;color:var(--text)"
                @click="restoreModalOpen = false"
              >
                Cancel
              </button>
              <button
                style="flex:2;padding:9px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer"
                @click="handleRestore"
              >
                Yes, restore this version
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
.back-link {
  display: flex; align-items: center; gap: 5px;
  text-decoration: none; color: var(--text-2); font-size: 12px;
}
.back-link:hover { color: var(--text); }
.theme-icon-btn {
  width: 30px; height: 30px; border-radius: var(--r-sm); border: 1px solid var(--border);
  background: transparent; cursor: pointer; color: var(--text-2); font-size: 12px;
  display: flex; align-items: center; justify-content: center;
}
.theme-icon-btn:hover { border-color: var(--text-3); }
.avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--accent); color: var(--accent-fg);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; cursor: pointer;
}
.meta-panel {
  width: 260px; flex-shrink: 0;
  background: var(--surface); border-left: 1px solid var(--border);
  overflow-y: auto; padding: 20px;
}
.meta-header {
  font-size: 12px; font-weight: 700; letter-spacing: .4px;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 16px;
}
.meta-label { font-size: 11px; color: var(--text-3); margin-bottom: 4px; }
.meta-link { font-size: 11px; color: var(--text-2); text-decoration: none; }
.meta-link:hover { color: var(--text); }
.status-dot-sm { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.restore-btn {
  width: 100%; padding: 8px; background: var(--accent); color: var(--accent-fg);
  border: none; border-radius: var(--r-sm); font-family: inherit; font-size: 12px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
}
.restore-btn:hover { opacity: .85; }
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.modal-box {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  width: 460px; box-shadow: var(--shadow-md);
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
</style>
