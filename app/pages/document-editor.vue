<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { useAppStore } from '~/stores/app'
import { useDocumentsStore } from '~/stores/documents'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()
const docsStore = useDocumentsStore()

onMounted(() => appStore.initTheme())

const statusOpen = ref(false)

const statusMap = {
  published: { label: 'Published', bg: '#dcfce7', fg: '#15803d' },
  draft: { label: 'Draft', bg: '#fef3c7', fg: '#92400e' },
  archived: { label: 'Archived', bg: 'var(--bg)', fg: 'var(--text-3)' }
}

const currentStatus = computed(() => statusMap[docsStore.activeStatus] || statusMap.draft)

const editorRef = useTemplateRef<{ editor: Editor | undefined, state: { bold: boolean, italic: boolean, underline: boolean, h1: boolean, h2: boolean, list: boolean, code: boolean } }>('editorRef')

const isBold = computed(() => editorRef.value?.state.bold ?? false)
const isItalic = computed(() => editorRef.value?.state.italic ?? false)
const isUnderline = computed(() => editorRef.value?.state.underline ?? false)
const isH1 = computed(() => editorRef.value?.state.h1 ?? false)
const isH2 = computed(() => editorRef.value?.state.h2 ?? false)
const isList = computed(() => editorRef.value?.state.list ?? false)
const isCode = computed(() => editorRef.value?.state.code ?? false)

function run(action: (e: Editor) => void) {
  const e = editorRef.value?.editor
  if (e) action(e)
}

const initialContent = `<h1>Authentication Guide</h1><h2>Overview</h2><p>The DevVault API uses token-based authentication via Laravel Sanctum. All authenticated endpoints require a valid Bearer token in the <code>Authorization</code> header.</p><h2>Obtaining a Token</h2><p>POST to <code>/api/login</code> with credentials to receive a token.</p><pre><code>POST /api/login\n{"email": "user@acme.com", "password": "..."}</code></pre>`
</script>

<template>
  <div style="height:100vh;overflow:hidden;background:var(--bg);color:var(--text)">
    <!-- Fixed Header -->
    <header class="app-header">
      <NuxtLink
        to="/project-dashboard"
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
      <span style="font-size:12px;color:var(--text-3)">API Documentation</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        style="color:var(--text-3)"
      ><path d="m9 18 6-6-6-6" /></svg>
      <span style="font-size:13px;font-weight:600">Authentication Guide</span>
      <div style="flex:1" />

      <!-- Status badge -->
      <div style="position:relative">
        <button
          class="status-badge"
          :style="{ background: currentStatus.bg, color: currentStatus.fg }"
          @click="statusOpen = !statusOpen"
        >
          {{ currentStatus.label }}
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          ><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div
          v-if="statusOpen"
          class="status-dropdown"
        >
          <button
            v-for="(val, key) in statusMap"
            :key="key"
            class="status-option"
            @click="docsStore.setStatus(key as 'draft' | 'published' | 'archived'); statusOpen = false"
          >
            <span
              class="status-dot-sm"
              :style="{ background: key === 'published' ? '#16a34a' : key === 'draft' ? '#d97706' : '#6b7280' }"
            />
            {{ val.label }}
          </button>
        </div>
      </div>

      <a
        href="#"
        class="version-badge"
      >v5</a>
      <button
        class="hdr-btn"
        @click="appStore.openShare()"
      >
        <svg
          width="11"
          height="11"
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
        Share
      </button>
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

    <!-- Editor + panel -->
    <div style="display:flex;height:100vh;padding-top:var(--hh);overflow:hidden">
      <!-- Editor column -->
      <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
        <!-- Toolbar -->
        <div class="toolbar">
          <button id="tb-bold" name="tb-bold" class="tb-btn" :class="{ active: isBold }" @mousedown.prevent @click="run(e => e.chain().focus().toggleBold().run())">B</button>
          <button id="tb-italic" name="tb-italic" class="tb-btn italic-btn" :class="{ active: isItalic }" @mousedown.prevent @click="run(e => e.chain().focus().toggleItalic().run())">I</button>
          <button id="tb-underline" name="tb-underline" class="tb-btn underline-btn" :class="{ active: isUnderline }" @mousedown.prevent @click="run(e => e.chain().focus().toggleUnderline().run())">U</button>
          <div class="tb-divider" />
          <button id="tb-h1" name="tb-h1" class="tb-btn" style="font-size:11px;font-weight:700" :class="{ active: isH1 }" @mousedown.prevent @click="run(e => e.chain().focus().toggleHeading({ level: 1 }).run())">H1</button>
          <button id="tb-h2" name="tb-h2" class="tb-btn" style="font-size:11px;font-weight:700" :class="{ active: isH2 }" @mousedown.prevent @click="run(e => e.chain().focus().toggleHeading({ level: 2 }).run())">H2</button>
          <div class="tb-divider" />
          <button id="tb-list" name="tb-list" class="tb-btn" :class="{ active: isList }" @mousedown.prevent @click="run(e => e.chain().focus().toggleBulletList().run())">≡</button>
          <button id="tb-code" name="tb-code" class="tb-btn" style="font-size:11px;font-weight:600" :class="{ active: isCode }" @mousedown.prevent @click="run(e => e.chain().focus().toggleCodeBlock().run())">&lt;/&gt;</button>
          <div style="flex:1" />
          <span style="font-size:11px;color:var(--text-3)">Auto-saved · v5</span>
        </div>

        <!-- Content -->
        <ClientOnly>
          <ShadTiptapEditor ref="editorRef" :content="initialContent" style="flex:1;overflow-y:auto" />
          <template #fallback>
            <div style="flex:1;overflow-y:auto;padding:40px;opacity:.4;font-size:14px">Loading editor…</div>
          </template>
        </ClientOnly>
      </div>

      <!-- Right metadata panel -->
      <aside class="meta-panel">
        <h3 class="meta-header">
          Document details
        </h3>
        <div style="display:flex;flex-direction:column;gap:14px">
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
          <div>
            <div class="meta-label">
              Category
            </div>
            <span style="font-size:13px">API Documentation</span>
          </div>
          <div>
            <div class="meta-label">
              Created by
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:20px;height:20px;border-radius:50%;background:var(--accent);color:var(--accent-fg);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700">
                DF
              </div>
              <span style="font-size:13px">Drew Ferrer</span>
            </div>
          </div>
          <div>
            <div class="meta-label">
              Last edited
            </div>
            <span style="font-size:13px">2 hours ago</span>
          </div>
          <div>
            <div class="meta-label">
              Version
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:13px;font-weight:600">v5</span>
              <NuxtLink
                to="/version-history"
                class="meta-link"
              >View all →</NuxtLink>
            </div>
          </div>

          <div style="border-top:1px solid var(--border);padding-top:14px">
            <div class="meta-section-header">
              Permissions
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:12px;color:var(--text-2)">Developer</span>
                <span class="perm-badge">Read, Edit</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:12px;color:var(--text-2)">QA</span>
                <span class="perm-badge">Read only</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div style="display:flex;align-items:center;gap:4px">
                  <span style="font-size:12px;color:var(--text-2)">PM</span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d97706"
                    stroke-width="2"
                  ><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line
                    x1="12"
                    y1="9"
                    x2="12"
                    y2="13"
                  /><line
                    x1="12"
                    y1="17"
                    x2="12.01"
                    y2="17"
                  /></svg>
                </div>
                <span class="perm-badge override">Override</span>
              </div>
            </div>
            <a
              href="#"
              class="meta-link"
              style="display:block;margin-top:10px"
            >Manage overrides →</a>
          </div>

          <div style="border-top:1px solid var(--border);padding-top:14px">
            <button
              class="share-btn"
              @click="appStore.openShare()"
            >
              <svg
                width="12"
                height="12"
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
              Share document
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Share modal -->
    <Teleport to="body">
      <div
        v-if="appStore.shareOpen"
        class="overlay"
        @click="appStore.closeShare()"
      >
        <div
          class="modal-box"
          @click.stop
        >
          <div class="modal-header">
            <div>
              <h2 style="font-size:15px;font-weight:700">
                Share this document
              </h2>
              <p style="font-size:12px;color:var(--text-3);margin-top:2px">
                Anyone with the link can view this document
              </p>
            </div>
            <button
              class="modal-close"
              @click="appStore.closeShare()"
            >
              ✕
            </button>
          </div>
          <div style="padding:22px;display:flex;flex-direction:column;gap:16px">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r)">
              <div>
                <div style="font-size:13px;font-weight:600;margin-bottom:2px">
                  Public share link
                </div>
                <div style="font-size:12px;color:var(--text-3)">
                  Read-only · No account required
                </div>
              </div>
              <div
                class="toggle"
                :class="{ 'toggle--on': appStore.shareEnabled }"
                @click="appStore.toggleShareLink()"
              >
                <div
                  class="toggle-thumb"
                  :class="{ 'toggle-thumb--on': appStore.shareEnabled }"
                />
              </div>
            </div>

            <template v-if="appStore.shareEnabled">
              <div>
                <label class="field-label">Share link</label>
                <div style="display:flex;gap:8px">
                  <input
                    value="https://acme.everysource.app/share/xK8mP2qR..."
                    readonly
                    class="text-input"
                  >
                  <button class="btn-primary-sm">
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <label class="field-label">Expires</label>
                <select class="select-input">
                  <option>Never</option>
                  <option>In 7 days</option>
                  <option>In 30 days</option>
                  <option>Custom date...</option>
                </select>
              </div>
            </template>

            <div style="padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);font-size:12px;color:var(--text-3);line-height:1.6">
              Anyone with this link can <strong style="color:var(--text-2)">read</strong> this document. They cannot edit, comment, or see other project documents.
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
.hdr-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 10px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: transparent; font-family: inherit; font-size: 11px; font-weight: 500; cursor: pointer; color: var(--text-2);
}
.hdr-btn:hover { border-color: var(--text-3); }
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

.status-badge {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 10px; border: none; border-radius: 99px;
  font-family: inherit; font-size: 11px; font-weight: 600; cursor: pointer;
}
.status-badge:hover { opacity: .8; }
.status-dropdown {
  position: absolute; top: calc(100% + 6px); right: 0;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r);
  min-width: 140px; box-shadow: var(--shadow-md); z-index: 10;
}
.status-option {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 9px 12px; border: none; background: transparent;
  cursor: pointer; font-family: inherit; font-size: 13px; color: var(--text); text-align: left;
}
.status-option:hover { background: var(--bg); }
.status-dot-sm { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

.version-badge {
  padding: 5px 10px; border: 1px solid var(--border); border-radius: var(--r-sm);
  font-size: 11px; color: var(--text-2); text-decoration: none; font-weight: 500;
}
.version-badge:hover { border-color: var(--text-3); }

.toolbar {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: 0 16px; height: var(--th);
  display: flex; align-items: center; gap: 2px; flex-shrink: 0;
}
.tb-btn {
  padding: 4px 8px; border: none; border-radius: 4px;
  background: transparent; font-family: inherit; font-weight: 700; font-size: 13px;
  cursor: pointer; color: var(--text-2);
}
.tb-btn:hover { background: var(--bg); }
.tb-btn.active { background: var(--accent); color: var(--accent-fg); }
.italic-btn { font-style: italic; }
.underline-btn { text-decoration: underline; }
.tb-divider { width: 1px; height: 18px; background: var(--border); margin: 0 4px; }

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
.meta-section-header {
  font-size: 11px; font-weight: 700; letter-spacing: .4px;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 10px;
}
.perm-badge {
  font-size: 11px; color: var(--text-3); background: var(--bg);
  padding: 2px 7px; border-radius: 99px; border: 1px solid var(--border);
}
.perm-badge.override {
  color: #92400e; background: #fef3c7; border-color: #fde68a;
}
.share-btn {
  width: 100%; padding: 8px; background: transparent; border: 1px solid var(--border);
  border-radius: var(--r-sm); font-family: inherit; font-size: 12px; font-weight: 500;
  cursor: pointer; color: var(--text-2); display: flex; align-items: center; justify-content: center; gap: 6px;
}
.share-btn:hover { background: var(--bg); }

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

.toggle {
  width: 40px; height: 22px; border-radius: 11px;
  background: var(--bg); cursor: pointer; position: relative;
  transition: background .2s; border: 1px solid var(--border-2);
}
.toggle--on { background: var(--accent); }
.toggle-thumb {
  width: 18px; height: 18px; border-radius: 9px;
  background: var(--surface); position: absolute; top: 1px; left: 1px;
  transition: left .2s; box-shadow: 0 1px 3px rgba(0,0,0,.15);
}
.toggle-thumb--on { left: 19px; }

.field-label {
  display: block; font-size: 11px; font-weight: 600; letter-spacing: .5px;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 6px;
}
.text-input {
  flex: 1; padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: var(--bg); color: var(--text-2); font-family: inherit; font-size: 12px; outline: none;
}
.btn-primary-sm {
  padding: 9px 14px; background: var(--accent); color: var(--accent-fg);
  border: none; border-radius: var(--r-sm); font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
}
.btn-primary-sm:hover { opacity: .85; }
.select-input {
  width: 100%; padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--r-sm);
  background: var(--bg); color: var(--text); font-family: inherit; font-size: 13px; outline: none; cursor: pointer;
}
</style>
