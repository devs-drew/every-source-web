<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

onMounted(() => {
  appStore.initTheme()
})

function handleSignIn() {
  const res = authStore.login(email.value, password.value)
  if (res.ok) navigateTo('/')
  else error.value = res.error ?? 'Sign in failed.'
}
</script>

<template>
  <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:var(--bg)">
    <button
      style="position:fixed;top:16px;right:16px;width:34px;height:34px;border-radius:var(--r-sm);border:1px solid var(--border);background:var(--surface);cursor:pointer;color:var(--text-2);font-size:14px;display:flex;align-items:center;justify-content:center"
      @click="appStore.toggleTheme()"
    >
      {{ appStore.dark ? '☀' : '☾' }}
    </button>

    <div style="width:100%;max-width:380px">
      <div style="display:flex;justify-content:center;margin-bottom:36px">
        <NuxtLink
          to="/"
          style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;color:var(--text)"
        >
          <svg
            width="22"
            height="22"
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
          <span style="font-size:16px;font-weight:700;letter-spacing:-.5px">everysource</span>
        </NuxtLink>
      </div>

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:36px;box-shadow:var(--shadow-md)">
        <h2 style="font-size:20px;font-weight:700;letter-spacing:-.4px;margin-bottom:4px">
          Sign in to EverySource
        </h2>
        <p style="font-size:13px;color:var(--text-2);margin-bottom:28px">
          Welcome back. Enter your credentials to continue.
        </p>

        <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:20px">
          <div>
            <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Email address</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              placeholder="drew@acme.com"
              style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
              @keyup.enter="handleSignIn"
            >
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              placeholder="••••••••"
              style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
              @keyup.enter="handleSignIn"
            >
          </div>
          <p
            v-if="error"
            style="font-size:12px;color:#dc2626;margin-top:-4px"
          >
            {{ error }}
          </p>
        </div>

        <button
          id="sign-in"
          name="sign-in"
          style="width:100%;padding:11px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:opacity .15s;margin-bottom:16px"
          @click="handleSignIn"
        >
          Sign in →
        </button>

        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="flex:1;height:1px;background:var(--border)" />
          <span style="font-size:12px;color:var(--text-3)">or continue with</span>
          <div style="flex:1;height:1px;background:var(--border)" />
        </div>

        <button style="width:100%;padding:11px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;color:var(--text)">
          Continue with SSO
        </button>
      </div>

      <p style="text-align:center;font-size:13px;color:var(--text-2);margin-top:24px">
        Don't have an account?
        <NuxtLink
          to="/onboarding"
          style="color:var(--text);font-weight:600;text-decoration:none"
        >Create an organization →</NuxtLink>
      </p>
    </div>
  </div>
</template>
