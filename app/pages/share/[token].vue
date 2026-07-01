<script setup lang="ts">
import { useAppStore } from '~/stores/app'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()

onMounted(() => {
  appStore.initTheme()
})
</script>

<template>
  <div style="min-height:100vh;background:var(--bg)">
    <!-- Shared-link banner -->
    <div style="background:var(--accent);color:var(--accent-fg);padding:10px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px">
      <div style="display:flex;align-items:center;gap:10px">
        <svg
          width="14"
          height="14"
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
        <span style="font-size:13px;font-weight:500">You're viewing a shared, <strong>read-only</strong> document — no account required.</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
        <span style="font-size:12px;opacity:.7">Expires: Never</span>
        <NuxtLink
          to="/login"
          style="padding:5px 12px;background:var(--accent-fg);color:var(--accent);border-radius:var(--r-sm);font-size:12px;font-weight:600;text-decoration:none"
        >Sign in to edit</NuxtLink>
        <button
          style="width:28px;height:28px;border-radius:var(--r-sm);border:1px solid rgba(255,255,255,.3);background:transparent;cursor:pointer;color:var(--accent-fg);font-size:12px;display:flex;align-items:center;justify-content:center"
          @click="appStore.toggleTheme()"
        >
          {{ appStore.dark ? '☀' : '☾' }}
        </button>
      </div>
    </div>

    <!-- Document content -->
    <div style="max-width:760px;margin:0 auto;padding:48px 32px">
      <!-- Breadcrumb -->
      <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-3);margin-bottom:20px;flex-wrap:wrap">
        <svg
          width="14"
          height="14"
          viewBox="0 0 28 28"
          fill="none"
          style="color:var(--text-3)"
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
        <span>acme.everysource.app</span>
        <span>›</span>
        <span>DevVault Backend API</span>
        <span>›</span>
        <span>API Documentation</span>
        <span>›</span>
        <span style="color:var(--text-2);font-weight:500">Authentication Guide</span>
      </div>

      <!-- Document header -->
      <div style="margin-bottom:32px">
        <h1 style="font-size:34px;font-weight:700;letter-spacing:-.8px;margin-bottom:12px;line-height:1.2">
          Authentication Guide
        </h1>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span style="font-size:11px;font-weight:600;padding:3px 9px;background:#dcfce7;color:#15803d;border-radius:99px">Published</span>
          <div style="display:flex;align-items:center;gap:6px">
            <div style="width:20px;height:20px;border-radius:50%;background:var(--accent);color:var(--accent-fg);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700">
              DF
            </div>
            <span style="font-size:12px;color:var(--text-2)">Drew Ferrer</span>
          </div>
          <span style="font-size:12px;color:var(--text-3)">Last updated 2 hours ago</span>
          <span style="font-size:12px;color:var(--text-3)">v5</span>
        </div>
      </div>

      <!-- Read-only notice -->
      <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);margin-bottom:32px;font-size:12px;color:var(--text-2)">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          style="flex-shrink:0;color:var(--text-3)"
        ><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        This document is <strong>read-only</strong>. To make changes, sign in with an authorized account.
      </div>

      <!-- Document body -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:36px;box-shadow:var(--shadow-md)">
        <h2 style="font-size:20px;font-weight:700;letter-spacing:-.4px;margin-bottom:14px">
          Overview
        </h2>
        <p style="font-size:15px;color:var(--text-2);line-height:1.8;margin-bottom:24px">
          The DevVault API uses token-based authentication via Laravel Sanctum. All authenticated endpoints require a valid Bearer token in the
          <code style="font-family:'JetBrains Mono',monospace;font-size:13px;background:var(--bg);padding:2px 6px;border-radius:3px">Authorization</code>
          header.
        </p>

        <h2 style="font-size:20px;font-weight:700;letter-spacing:-.4px;margin-bottom:14px">
          Obtaining a Token
        </h2>
        <p style="font-size:15px;color:var(--text-2);line-height:1.8;margin-bottom:14px">
          Send a POST request to
          <code style="font-family:'JetBrains Mono',monospace;font-size:13px;background:var(--bg);padding:2px 6px;border-radius:3px">/api/login</code>
          with your credentials:
        </p>
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);padding:16px 20px;font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text-2);margin-bottom:24px;line-height:1.7">
          <div style="color:var(--text-3);font-size:11px;margin-bottom:6px">
            POST /api/login
          </div>
          <div>Content-Type: application/json</div>
          <div style="margin-top:8px">
            {"email": "user@acme.com", "password": "..."}
          </div>
        </div>

        <h2 style="font-size:20px;font-weight:700;letter-spacing:-.4px;margin-bottom:14px">
          Using the Token
        </h2>
        <p style="font-size:15px;color:var(--text-2);line-height:1.8;margin-bottom:14px">
          Include the returned token in the
          <code style="font-family:'JetBrains Mono',monospace;font-size:13px;background:var(--bg);padding:2px 6px;border-radius:3px">Authorization</code>
          header of every subsequent request:
        </p>
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);padding:16px 20px;font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text-2);margin-bottom:24px;line-height:1.7">
          Authorization: Bearer {your_token_here}
        </div>

        <h2 style="font-size:20px;font-weight:700;letter-spacing:-.4px;margin-bottom:14px">
          Token Expiry
        </h2>
        <p style="font-size:15px;color:var(--text-2);line-height:1.8">
          Tokens do not expire by default in the development environment. In production, tokens expire after 30 days. Use
          <code style="font-family:'JetBrains Mono',monospace;font-size:13px;background:var(--bg);padding:2px 6px;border-radius:3px">POST /api/logout</code>
          to revoke a token manually.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid var(--border);padding:20px 32px;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--surface)">
      <NuxtLink
        to="/"
        style="display:flex;align-items:center;gap:6px;text-decoration:none;color:var(--text-3);font-size:12px"
      >
        <svg
          width="14"
          height="14"
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
        Powered by EverySource
      </NuxtLink>
      <span style="color:var(--border);font-size:12px">·</span>
      <NuxtLink
        to="/login"
        style="font-size:12px;color:var(--text-3);text-decoration:none"
      >Sign in to collaborate</NuxtLink>
    </div>
  </div>
</template>
