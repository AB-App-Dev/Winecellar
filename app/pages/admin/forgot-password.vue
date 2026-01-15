<script setup lang="ts">
import { forgetPassword } from '~/utils/auth-client'

// Admin forgot password page

definePageMeta({
  layout: false
})

const email = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  isSubmitting.value = true

  try {
    const { error: resetError } = await forgetPassword({
      email: email.value,
      redirectTo: '/admin/reset-password',
    })

    if (resetError) {
      error.value = resetError.message || 'An error occurred. Please try again.'
    } else {
      isSubmitted.value = true
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
          Reset Password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div v-if="isSubmitted" class="text-center space-y-4">
        <div class="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded">
          If an account exists with that email, you will receive a password reset link shortly.
        </div>
        <NuxtLink
          to="/admin/login"
          class="inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Back to login
        </NuxtLink>
      </div>

      <form v-else class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded text-sm">
          {{ error }}
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="admin@example.com"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Sending...' : 'Send reset link' }}
        </button>
      </form>

      <div v-if="!isSubmitted" class="text-center">
        <NuxtLink to="/admin/login" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
