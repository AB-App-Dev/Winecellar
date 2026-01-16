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
      redirectTo: '/admin/login',
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
  <div class="min-h-screen flex items-center justify-center bg-default">
    <UCard class="max-w-md w-full">
      <template #header>
        <div class="text-center">
          <h2 class="text-3xl font-bold text-highlighted">
            Reset Password
          </h2>
          <p class="mt-2 text-sm text-muted">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </template>

      <div v-if="isSubmitted" class="text-center space-y-4">
        <UAlert
          color="success"
          variant="subtle"
          title="If an account exists with that email, you will receive a password reset link shortly."
          icon="i-lucide-circle-check"
        />
        <NuxtLink
          to="/admin/login"
          class="text-sm text-primary hover:text-primary-600 inline-flex items-center gap-1"
        >
          <UIcon name="i-lucide-arrow-left" />
          Back to login
        </NuxtLink>
      </div>

      <form v-else class="space-y-6" @submit.prevent="handleSubmit">
        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          :title="error"
          icon="i-lucide-circle-x"
        />

        <UFormField label="Email address" class="w-full">
          <UInput
            v-model="email"
            type="email"
            placeholder="Enter your email"
            icon="i-lucide-mail"
            required
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          color="primary"
          block
          :loading="isSubmitting"
          :ui="{ base: 'cursor-pointer' }"
        >
          {{ isSubmitting ? 'Sending...' : 'Send reset link' }}
        </UButton>
      </form>

      <template v-if="!isSubmitted" #footer>
        <div class="text-center">
          <NuxtLink to="/admin/login" class="text-sm text-primary hover:text-primary-600 inline-flex items-center gap-1">
            <UIcon name="i-lucide-arrow-left" />
            Back to login
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>
