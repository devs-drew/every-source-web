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
const { activeDoc, activeVersions, currentVersion } = storeToRefs(docsStore)
const canRestore = computed(() => can('update', activeDoc.value?.id))

const restoreModalOpen = ref(false)
const restoreTargetV = ref<number | null>(null)

onMounted(() => {
  appStore.initTheme()
})

function handleRestore() {
  if (restoreTargetV.value === null) return
  docsStore.restoreVersion(restoreTargetV.value)
  restoreModalOpen.value = false
  navigateTo('/document-editor')
}
</script>

<template>
  <div style="height:100vh;overflow:auto;background:var(--bg)">
    <!-- Header -->
    <header style="position:fixed;top:0;left:0;right:0;height:var(--hh);background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 24px;gap:10px;z-index:100">
      <NuxtLink
        to="/document-editor"
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
        {{ activeDoc?.title }}
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
      <span style="font-size:13px;font-weight:600">Version History</span>
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

    <!-- Timeline -->
    <div style="padding-top:var(--hh);overflow-y:auto">
      <div style="max-width:720px;margin:0 auto;padding:36px 32px">
        <div style="margin-bottom:28px">
          <h1 style="font-size:22px;font-weight:700;letter-spacing:-.5px;margin-bottom:4px">
            Version History
          </h1>
          <p style="font-size:13px;color:var(--text-2)">
            {{ activeDoc?.title }} · {{ activeVersions.length }} versions · All changes are saved automatically
          </p>
        </div>

        <ClientOnly>
          <div style="display:flex;flex-direction:column;gap:0">
            <div
              v-for="(ver, idx) in activeVersions"
              :key="ver.v"
              style="display:flex;gap:16px"
              :style="`padding-bottom:${idx < activeVersions.length - 1 ? '24px' : '0'};position:relative`"
            >
              <!-- Timeline dot + connector -->
              <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
                <div :style="`width:10px;height:10px;border-radius:50%;background:${ver.current ? 'var(--accent)' : 'var(--border-2)'};border:2px solid ${ver.current ? 'var(--accent)' : 'var(--border)'};margin-top:3px`" />
                <div
                  v-if="idx < activeVersions.length - 1"
                  style="width:1px;flex:1;background:var(--border);margin-top:4px"
                />
              </div>
              <!-- Version card -->
              <div style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px 18px;box-shadow:var(--shadow)">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                  <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-size:13px;font-weight:700">Version {{ ver.v }}</span>
                    <span
                      v-if="ver.current"
                      style="font-size:11px;font-weight:600;padding:2px 7px;background:#dcfce7;color:#15803d;border-radius:99px"
                    >Current</span>
                    <span
                      v-if="ver.original"
                      style="font-size:11px;font-weight:600;padding:2px 7px;background:var(--bg);border:1px solid var(--border);border-radius:99px;color:var(--text-3)"
                    >Original</span>
                  </div>
                  <span style="font-size:12px;color:var(--text-3)">{{ ver.time }}</span>
                </div>
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
                  <div :style="`width:20px;height:20px;border-radius:50%;background:${ver.color};color:${ver.fg};display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700`">
                    {{ ver.initials }}
                  </div>
                  <span style="font-size:12px;color:var(--text-2)">{{ ver.name }}</span>
                  <span style="font-size:12px;color:var(--text-3)">· {{ ver.note }}</span>
                </div>
                <div style="display:flex;gap:8px">
                  <button
                    style="padding:6px 12px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:12px;cursor:pointer;color:var(--text-2)"
                    @click="navigateTo('/snapshot-viewer?v=' + ver.v)"
                  >
                    View snapshot
                  </button>
                  <template v-if="ver.current">
                    <span style="font-size:12px;color:var(--text-3);display:flex;align-items:center">This is the current version</span>
                  </template>
                  <template v-else-if="canRestore">
                    <button
                      style="padding:6px 12px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:12px;font-weight:500;cursor:pointer"
                      @click="restoreTargetV = ver.v; restoreModalOpen = true"
                    >
                      Restore this version
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>

    <!-- Restore modal -->
    <Teleport to="body">
      <div
        v-if="restoreModalOpen"
        style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px"
        @click="restoreModalOpen = false"
      >
        <div
          style="background:var(--surface);border:1px solid var(--border);border-radius:12px;width:420px;padding:28px;box-shadow:var(--shadow-md)"
          @click.stop
        >
          <h2 style="font-size:16px;font-weight:700;margin-bottom:8px">
            Restore this version?
          </h2>
          <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:20px">
            Restoring v{{ restoreTargetV }} will replace the current version (v{{ currentVersion?.v }}). The current version will be saved to version history for auditing.
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
    </Teleport>
  </div>
</template>
