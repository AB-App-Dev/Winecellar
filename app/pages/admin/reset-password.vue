<script setup lang="ts">
import { resetPassword } from '~/utils/auth-client'
import { translateAuthError } from '~/utils/auth-errors'

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
    error.value = 'Die Passwörter stimmen nicht überein'
    return
  }

  if (newPassword.value.length < 8) {
    error.value = 'Das Passwort muss mindestens 8 Zeichen lang sein'
    return
  }

  isSubmitting.value = true

  try {
    const { error: resetError } = await resetPassword({
      newPassword: newPassword.value,
      token: token.value,
    })

    if (resetError) {
      error.value = translateAuthError(resetError)
    } else {
      isSuccess.value = true
      setTimeout(() => {
        router.push('/admin/login')
      }, 3000)
    }
  } catch (e: any) {
    error.value = e.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
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
          Neues Passwort festlegen
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Geben Sie unten Ihr neues Passwort ein.
        </p>
      </div>

      <div v-if="!token" class="text-center space-y-4">
        <div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded">
          Ungültiger oder fehlender Link. Bitte fordern Sie einen neuen Link zum Zurücksetzen des Passworts an.
        </div>
        <NuxtLink
          to="/admin/forgot-password"
          class="inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Neuen Link anfordern
        </NuxtLink>
      </div>

      <div v-else-if="isSuccess" class="text-center space-y-4">
        <div class="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded">
          Ihr Passwort wurde erfolgreich zurückgesetzt. Weiterleitung zur Anmeldung...
        </div>
        <NuxtLink
          to="/admin/login"
          class="inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Jetzt zur Anmeldung
        </NuxtLink>
      </div>

      <form v-else class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded text-sm">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Neues Passwort
            </label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              required
              minlength="8"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Mindestens 8 Zeichen"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Passwort bestätigen
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              minlength="8"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Passwort erneut eingeben"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Wird zurückgesetzt...' : 'Passwort zurücksetzen' }}
        </button>
      </form>

      <div v-if="token && !isSuccess" class="text-center">
        <NuxtLink to="/admin/login" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Zurück zur Anmeldung
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
