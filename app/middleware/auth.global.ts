import { useAuthStore } from '~/stores/auth'

// Public routes reachable without a session. Everything else needs login.
const PUBLIC = ['/', '/login', '/onboarding']

export default defineNuxtRouteMiddleware((to) => {
  // Auth state is client-only (localStorage), so this guard is a no-op on the server.
  if (import.meta.server) return
  if (PUBLIC.includes(to.path) || to.path.startsWith('/share/')) return

  const auth = useAuthStore()
  if (!auth.currentUserId) {
    return navigateTo('/login')
  }
})
