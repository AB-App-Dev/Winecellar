<script setup lang="ts">
import { forgetPassword } from '~/utils/auth-client'
import { translateAuthError } from '~/utils/auth-errors'

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
      error.value = translateAuthError(resetError)
    } else {
      isSubmitted.value = true
    }
  } catch (e: any) {
    error.value = e.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
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
            Passwort zurücksetzen
          </h2>
          <p class="mt-2 text-sm text-muted">
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
          </p>
        </div>
      </template>

      <div v-if="isSubmitted" class="text-center space-y-4">
        <UAlert
          color="success"
          variant="subtle"
          title="Falls ein Konto mit dieser E-Mail-Adresse existiert, erhalten Sie in Kürze einen Link zum Zurücksetzen des Passworts."
          icon="i-lucide-circle-check"
        />
        <NuxtLink
          to="/admin/login"
          class="text-sm text-primary hover:text-primary-600 inline-flex items-center gap-1"
        >
          <UIcon name="i-lucide-arrow-left" />
          Zurück zur Anmeldung
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

        <UFormField label="E-Mail-Adresse" class="w-full">
          <UInput
            v-model="email"
            type="email"
            placeholder="E-Mail-Adresse eingeben"
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
          {{ isSubmitting ? 'Wird gesendet...' : 'Link senden' }}
        </UButton>
      </form>

      <template v-if="!isSubmitted" #footer>
        <div class="text-center">
          <NuxtLink to="/admin/login" class="text-sm text-primary hover:text-primary-600 inline-flex items-center gap-1">
            <UIcon name="i-lucide-arrow-left" />
            Zurück zur Anmeldung
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>
