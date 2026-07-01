<script setup lang="ts">
import { useAppStore } from '~/stores/app'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()
const variant = ref<'A' | 'B'>('A')
const restoreModalOpen = ref(false)

onMounted(() => {
  appStore.initTheme()
})

const versions = [
  { v: 5, current: true, time: '2 hours ago', initials: 'DF', color: 'var(--accent)', fg: 'var(--accent-fg)', name: 'Drew Ferrer', note: 'Updated token expiry section' },
  { v: 4, current: false, time: 'Yesterday, 4:30 PM', initials: 'MS', color: '#2563eb', fg: '#fff', name: 'Maria Santos', note: 'Added SSO section and code examples' },
  { v: 3, current: false, time: 'Jan 28, 2025', initials: 'DF', color: 'var(--accent)', fg: 'var(--accent-fg)', name: 'Drew Ferrer', note: 'Initial draft published' },
  { v: 2, current: false, time: 'Jan 25, 2025', initials: 'MS', color: '#2563eb', fg: '#fff', name: 'Maria Santos', note: 'Restructured overview section' },
  { v: 1, current: false, time: 'Jan 20, 2025', initials: 'DF', color: 'var(--accent)', fg: 'var(--accent-fg)', name: 'Drew Ferrer', note: 'Document created', original: true }
]
</script>

<template>
  <div :style="`height:100vh;overflow:${variant === 'B' ? 'hidden' : 'auto'};background:var(--bg)`">
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
        Authentication Guide
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
      <div style="display:flex;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);overflow:hidden">
        <button
          :style="`padding:5px 12px;border:none;background:${variant==='A' ? 'var(--accent)' : 'transparent'};color:${variant==='A' ? 'var(--accent-fg)' : 'var(--text-2)'};font-family:inherit;font-size:11px;font-weight:600;cursor:pointer`"
          @click="variant = 'A'"
        >
          A · Timeline
        </button>
        <button
          :style="`padding:5px 12px;border:none;background:${variant==='B' ? 'var(--accent)' : 'transparent'};color:${variant==='B' ? 'var(--accent-fg)' : 'var(--text-2)'};font-family:inherit;font-size:11px;font-weight:600;cursor:pointer;border-left:1px solid var(--border)`"
          @click="variant = 'B'"
        >
          B · Preview
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

    <!-- Variant A: Timeline -->
    <template v-if="variant === 'A'">
      <div style="padding-top:var(--hh);overflow-y:auto">
        <div style="max-width:720px;margin:0 auto;padding:36px 32px">
          <div style="margin-bottom:28px">
            <h1 style="font-size:22px;font-weight:700;letter-spacing:-.5px;margin-bottom:4px">
              Version History
            </h1>
            <p style="font-size:13px;color:var(--text-2)">
              Authentication Guide · 5 versions · All changes are saved automatically
            </p>
          </div>

          <div style="display:flex;flex-direction:column;gap:0">
            <div
              v-for="(ver, idx) in versions"
              :key="ver.v"
              style="display:flex;gap:16px"
              :style="`padding-bottom:${idx < versions.length - 1 ? '24px' : '0'};position:relative`"
            >
              <!-- Timeline dot + connector -->
              <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
                <div :style="`width:10px;height:10px;border-radius:50%;background:${ver.current ? 'var(--accent)' : 'var(--border-2)'};border:2px solid ${ver.current ? 'var(--accent)' : 'var(--border)'};margin-top:3px`" />
                <div
                  v-if="idx < versions.length - 1"
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
                  <button style="padding:6px 12px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:12px;cursor:pointer;color:var(--text-2)">
                    View snapshot
                  </button>
                  <template v-if="ver.current">
                    <span style="font-size:12px;color:var(--text-3);display:flex;align-items:center">This is the current version</span>
                  </template>
                  <template v-else>
                    <button
                      style="padding:6px 12px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:12px;font-weight:500;cursor:pointer"
                      @click="restoreModalOpen = true"
                    >
                      Restore this version
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Variant B: Split preview -->
    <template v-else>
      <div style="display:flex;height:100vh;padding-top:var(--hh);overflow:hidden">
        <!-- Version list panel -->
        <div style="width:300px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);overflow-y:auto">
          <div style="padding:14px 16px;border-bottom:1px solid var(--border)">
            <h2 style="font-size:13px;font-weight:700;margin-bottom:2px">
              5 versions
            </h2>
            <p style="font-size:11px;color:var(--text-3)">
              Click a version to preview
            </p>
          </div>
          <div>
            <div
              v-for="ver in versions"
              :key="ver.v"
              :style="`padding:12px 16px;border-bottom:1px solid var(--border);cursor:pointer;background:${ver.current ? 'var(--bg)' : 'transparent'}`"
            >
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="font-size:13px;font-weight:700">v{{ ver.v }}</span>
                  <span
                    v-if="ver.current"
                    style="font-size:10px;font-weight:600;padding:2px 6px;background:#dcfce7;color:#15803d;border-radius:99px"
                  >Current</span>
                </div>
                <span style="font-size:11px;color:var(--text-3)">{{ ver.current ? '2h ago' : ver.time.split(',')[0] }}</span>
              </div>
              <div style="display:flex;align-items:center;gap:5px;margin-bottom:6px">
                <div :style="`width:16px;height:16px;border-radius:50%;background:${ver.color};color:${ver.fg};display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700`">
                  {{ ver.initials }}
                </div>
                <span style="font-size:11px;color:var(--text-2)">{{ ver.name }}</span>
              </div>
              <button
                v-if="!ver.current"
                style="padding:4px 10px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:4px;font-family:inherit;font-size:11px;font-weight:500;cursor:pointer"
                @click="restoreModalOpen = true"
              >
                Restore
              </button>
            </div>
          </div>
        </div>

        <!-- Content preview -->
        <div style="flex:1;overflow-y:auto;background:var(--surface);padding:40px">
          <div style="max-width:600px;margin:0 auto">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
              <span style="font-size:11px;font-weight:600;padding:3px 8px;background:#dcfce7;color:#15803d;border-radius:99px">Current · v5</span>
              <span style="font-size:12px;color:var(--text-3)">Drew Ferrer · 2 hours ago</span>
            </div>
            <h1 style="font-size:28px;font-weight:700;letter-spacing:-.6px;margin-bottom:20px">
              Authentication Guide
            </h1>
            <h2 style="font-size:17px;font-weight:700;margin-bottom:10px">
              Overview
            </h2>
            <p style="font-size:14px;color:var(--text-2);line-height:1.8;margin-bottom:16px">
              The DevVault API uses token-based authentication via Laravel Sanctum. All authenticated endpoints require a valid Bearer token in the
              <code style="font-family:'JetBrains Mono',monospace;font-size:12px;background:var(--bg);padding:2px 5px;border-radius:3px">Authorization</code>
              header.
            </p>
            <h2 style="font-size:17px;font-weight:700;margin-bottom:10px">
              Obtaining a Token
            </h2>
            <p style="font-size:14px;color:var(--text-2);line-height:1.8">
              POST to
              <code style="font-family:'JetBrains Mono',monospace;font-size:12px;background:var(--bg);padding:2px 5px;border-radius:3px">/api/login</code>
              with valid credentials to receive a token.
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- Restore modal -->
    <Teleport to="body">
      <div
        v-if="restoreModalOpen"
        style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px"
        @click="restoreModalOpen = false"
      >
        <div
          style="background:var(--surface);border:1px solid var(--border);border-radius:12px;width:400px;padding:28px;box-shadow:var(--shadow-md)"
          @click.stop
        >
          <h2 style="font-size:16px;font-weight:700;margin-bottom:8px">
            Restore this version?
          </h2>
          <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:20px">
            The current version (v5) will be saved before restoring. You can always get it back from the version history.
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
              @click="restoreModalOpen = false"
            >
              Yes, restore this version
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
