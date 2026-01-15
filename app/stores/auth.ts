import { defineStore } from 'pinia'
import { signIn, signOut, useSession } from '~/utils/auth-client'

export const useAuthStore = defineStore('auth', () => {
  const session = useSession()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const user = computed(() => session.value.data?.user ?? null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null
    try {
      const result = await signIn.email({
        email,
        password,
      })
      if (result.error) {
        error.value = result.error.message ?? 'Invalid credentials'
        throw new Error(error.value)
      }
      await navigateTo('/admin')
    } catch (e) {
      if (!error.value) {
        error.value = 'Invalid credentials'
      }
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      await signOut()
      await navigateTo('/admin/login')
    } finally {
      isLoading.value = false
    }
  }

  async function checkAuth() {
    await session.value.refetch()
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth,
  }
})
