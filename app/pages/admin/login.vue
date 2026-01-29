<script setup lang="ts">
// Admin login page - no registration, predefined users only

definePageMeta({
  layout: false
})

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value)
  } catch {
    // Error is handled in the store
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-default">
    <UCard class="max-w-md w-full">
      <template #header>
        <div class="text-center">
          <h2 class="text-3xl font-bold text-highlighted">
            WineCellar Admin
          </h2>
          <p class="mt-2 text-sm text-muted">
            Melden Sie sich an, um auf den Admin-Bereich zuzugreifen
          </p>
        </div>
      </template>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <UAlert
          v-if="authStore.error"
          color="error"
          variant="subtle"
          :title="authStore.error"
          icon="i-lucide-circle-x"
        />

        <UFormField label="E-Mail" class="w-full">
          <UInput
            v-model="email"
            type="email"
            placeholder="E-Mail-Adresse eingeben"
            icon="i-lucide-mail"
            required
            class="w-full"
          />
        </UFormField>

        <UFormField label="Passwort" class="w-full">
          <UInput
            v-model="password"
            type="password"
            placeholder="Passwort eingeben"
            icon="i-lucide-lock"
            required
            class="w-full"
          />
          <template #hint>
            <NuxtLink
              to="/admin/forgot-password"
              class="text-sm text-primary hover:text-primary-600"
            >
              Passwort vergessen?
            </NuxtLink>
          </template>
        </UFormField>

        <UButton
          type="submit"
          color="primary"
          block
          :loading="authStore.isLoading"
          :ui="{ base: 'cursor-pointer' }"
        >
          {{ authStore.isLoading ? 'Anmeldung...' : 'Anmelden' }}
        </UButton>
      </form>

      <template #footer>
        <div class="text-center">
          <NuxtLink to="/" class="text-sm text-primary hover:text-primary-600 inline-flex items-center gap-1">
            <UIcon name="i-lucide-arrow-left" />
            Zurück zur Weinkarte
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>
