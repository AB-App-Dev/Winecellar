<script setup lang="ts">
import { resetPassword } from '~/utils/auth-client'

// Admin reset password page - handles password reset from email link

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()

const newPassword = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)
const error = ref('')

const token = computed(() => route.query.token as string)

async function handleSubmit() {
  error.value = ''

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (newPassword.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  isSubmitting.value = true

  try {
    const { error: resetError } = await resetPassword({
      newPassword: newPassword.value,
      token: token.value,
    })

    if (resetError) {
      error.value = resetError.message || 'Failed to reset password. The link may have expired.'
    } else {
      isSuccess.value = true
      setTimeout(() => {
        router.push('/admin/login')
      }, 3000)
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div>
        <h2 class="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Set New Password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below.
        </p>
      </div>

      <div v-if="!token" class="text-center space-y-4">
        <div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded">
          Invalid or missing reset token. Please request a new password reset link.
        </div>
        <NuxtLink
          to="/admin/forgot-password"
          class="inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Request new link
        </NuxtLink>
      </div>

      <div v-else-if="isSuccess" class="text-center space-y-4">
        <div class="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded">
          Your password has been reset successfully. Redirecting to login...
        </div>
        <NuxtLink
          to="/admin/login"
          class="inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Go to login now
        </NuxtLink>
      </div>

      <form v-else class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded text-sm">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              required
              minlength="8"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              minlength="8"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Re-enter your password"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <div v-if="token && !isSuccess" class="text-center">
        <NuxtLink to="/admin/login" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
