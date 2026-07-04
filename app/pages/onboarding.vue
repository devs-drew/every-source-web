<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'plain' })

const appStore = useAppStore()
const authStore = useAuthStore()
const step = ref(1)

const orgName = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

onMounted(() => {
  appStore.initTheme()
})

function nextStep() {
  if (step.value < 3) step.value++
}
function prevStep() {
  if (step.value > 1) step.value--
}

function createAccount() {
  error.value = ''
  if (!firstName.value || !email.value || password.value.length < 8) {
    error.value = 'Enter your name, email, and a password of at least 8 characters.'
    return
  }
  const res = authStore.register(firstName.value, lastName.value, email.value, password.value, orgName.value || 'My Organization')
  if (res.ok) nextStep()
  else error.value = res.error ?? 'Could not create account.'
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

    <div style="width:100%;max-width:480px">
      <div style="display:flex;justify-content:center;margin-bottom:36px">
        <NuxtLink
          to="/login"
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

      <!-- Step indicator -->
      <div style="display:flex;align-items:center;justify-content:center;margin-bottom:32px">
        <div style="display:flex;align-items:center;gap:8px">
          <div :style="`width:28px;height:28px;border-radius:50%;background:var(--accent);color:var(--accent-fg);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700`">
            1
          </div>
          <span style="font-size:12px;font-weight:600;color:var(--text)">Organization</span>
        </div>
        <div style="width:40px;height:1px;background:var(--border);margin:0 12px" />
        <div style="display:flex;align-items:center;gap:8px">
          <div :style="`width:28px;height:28px;border-radius:50%;background:${step >= 2 ? 'var(--accent)' : 'transparent'};color:${step >= 2 ? 'var(--accent-fg)' : 'var(--text-3)'};border:${step >= 2 ? 'none' : '1px solid var(--border)'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700`">
            2
          </div>
          <span :style="`font-size:12px;font-weight:600;color:${step >= 2 ? 'var(--text)' : 'var(--text-3)'}`">Admin Account</span>
        </div>
        <div style="width:40px;height:1px;background:var(--border);margin:0 12px" />
        <div style="display:flex;align-items:center;gap:8px">
          <div :style="`width:28px;height:28px;border-radius:50%;background:${step >= 3 ? 'var(--accent)' : 'transparent'};color:${step >= 3 ? 'var(--accent-fg)' : 'var(--text-3)'};border:${step >= 3 ? 'none' : '1px solid var(--border)'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700`">
            3
          </div>
          <span :style="`font-size:12px;font-weight:600;color:${step >= 3 ? 'var(--text)' : 'var(--text-3)'}`">Done</span>
        </div>
      </div>

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:36px;box-shadow:var(--shadow-md)">
        <!-- Step 1 -->
        <div v-if="step === 1">
          <h2 style="font-size:20px;font-weight:700;letter-spacing:-.4px;margin-bottom:4px">
            Create your organization
          </h2>
          <p style="font-size:13px;color:var(--text-2);margin-bottom:28px">
            This will be your team's workspace on EverySource.
          </p>
          <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:24px">
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Organization name</label>
              <input
                id="org-name"
                v-model="orgName"
                name="org-name"
                type="text"
                placeholder="Acme Inc."
                style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
              >
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Workspace URL</label>
              <div style="display:flex;border:1px solid var(--border);border-radius:var(--r-sm);overflow:hidden;background:var(--bg)">
                <input
                  type="text"
                  placeholder="acme"
                  style="flex:1;padding:10px 12px;border:none;background:transparent;color:var(--text);font-family:inherit;font-size:14px;outline:none"
                >
                <div style="padding:10px 14px;background:var(--bg);border-left:1px solid var(--border);font-size:13px;color:var(--text-3);white-space:nowrap">
                  .everysource.app
                </div>
              </div>
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">
                Industry <span style="text-transform:none;font-weight:400;letter-spacing:0">(optional)</span>
              </label>
              <select style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none;cursor:pointer">
                <option>Select an industry</option>
                <option>Software / Technology</option>
                <option>Finance</option>
                <option>Healthcare</option>
                <option>E-commerce</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <button
            style="width:100%;padding:11px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:14px;font-weight:600;cursor:pointer"
            @click="nextStep"
          >
            Continue →
          </button>
        </div>

        <!-- Step 2 -->
        <div v-else-if="step === 2">
          <h2 style="font-size:20px;font-weight:700;letter-spacing:-.4px;margin-bottom:4px">
            Set up your admin account
          </h2>
          <p style="font-size:13px;color:var(--text-2);margin-bottom:28px">
            You'll be the owner and first admin of this organization.
          </p>
          <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:24px">
            <div style="display:flex;gap:12px">
              <div style="flex:1">
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">First name</label>
                <input
                  id="first-name"
                  v-model="firstName"
                  name="first-name"
                  type="text"
                  placeholder="Drew"
                  style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
                >
              </div>
              <div style="flex:1">
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Last name</label>
                <input
                  id="last-name"
                  v-model="lastName"
                  name="last-name"
                  type="text"
                  placeholder="Ferrer"
                  style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
                >
              </div>
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Work email</label>
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                placeholder="drew@acme.com"
                style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
              >
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Password</label>
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg);color:var(--text);font-family:inherit;font-size:14px;outline:none"
              >
            </div>
            <p
              v-if="error"
              style="font-size:12px;color:#dc2626"
            >
              {{ error }}
            </p>
          </div>
          <div style="display:flex;gap:10px">
            <button
              id="onboarding-back"
              name="onboarding-back"
              style="padding:11px 20px;background:transparent;border:1px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;color:var(--text)"
              @click="prevStep"
            >
              Back
            </button>
            <button
              id="create-account"
              name="create-account"
              style="flex:1;padding:11px;background:var(--accent);color:var(--accent-fg);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:14px;font-weight:600;cursor:pointer"
              @click="createAccount"
            >
              Create account →
            </button>
          </div>
        </div>

        <!-- Step 3 -->
        <div
          v-else
          style="text-align:center;padding:16px 0"
        >
          <div style="width:56px;height:56px;border-radius:50%;background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:24px">
            ✓
          </div>
          <h2 style="font-size:22px;font-weight:700;letter-spacing:-.4px;margin-bottom:8px">
            You're all set!
          </h2>
          <p style="font-size:13px;color:var(--text-2);margin-bottom:28px;line-height:1.6">
            Your organization has been created. Start by adding your first project and inviting your team.
          </p>
          <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:16px;text-align:left;margin-bottom:24px">
            <p style="font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">
              Your workspace URL
            </p>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:14px;font-weight:500">acme.everysource.app</span>
              <button style="padding:6px 12px;background:var(--surface);border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:12px;font-weight:500;cursor:pointer;color:var(--text-2)">
                Copy
              </button>
            </div>
          </div>
          <NuxtLink
            to="/projects"
            style="display:block;padding:11px;background:var(--accent);color:var(--accent-fg);border-radius:var(--r-sm);font-size:14px;font-weight:600;text-decoration:none"
          >
            Go to your workspace →
          </NuxtLink>
        </div>
      </div>

      <p style="text-align:center;font-size:13px;color:var(--text-2);margin-top:24px">
        Already have an account?
        <NuxtLink
          to="/login"
          style="color:var(--text);font-weight:600;text-decoration:none"
        >Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>
