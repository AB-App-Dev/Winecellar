<script setup lang="ts">
interface Winery {
  id: string
  name: string
  address: string | null
  post: string | null
  city: string | null
  land: string | null
  phone: string | null
  email: string | null
  website: string | null
}

const props = defineProps<{
  winery: Winery | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  updated: []
}>()

const toast = useToast()
const isSaving = ref(false)

const form = reactive({
  name: '',
  address: '',
  post: '',
  city: '',
  land: '',
  phone: '',
  email: '',
  website: '',
})

const errors = reactive({
  name: '',
  email: '',
  website: '',
})

function clearErrors() {
  errors.name = ''
  errors.email = ''
  errors.website = ''
}

function validate(): boolean {
  clearErrors()
  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Name ist erforderlich'
    isValid = false
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ungültige E-Mail-Adresse'
    isValid = false
  }

  if (form.website && !/^https?:\/\/.+/.test(form.website)) {
    errors.website = 'Website muss mit http:// oder https:// beginnen'
    isValid = false
  }

  return isValid
}

function populateForm(winery: Winery) {
  form.name = winery.name
  form.address = winery.address || ''
  form.post = winery.post || ''
  form.city = winery.city || ''
  form.land = winery.land || ''
  form.phone = winery.phone || ''
  form.email = winery.email || ''
  form.website = winery.website || ''
  clearErrors()
}

watch(() => props.winery, (winery) => {
  if (winery) {
    populateForm(winery)
  }
}, { immediate: true })

function close() {
  open.value = false
}

async function save() {
  if (!props.winery || !validate()) {
    return
  }

  isSaving.value = true

  try {
    await $fetch(`/api/wineries/${props.winery.id}`, {
      method: 'PUT',
      body: {
        name: form.name,
        address: form.address || undefined,
        post: form.post || undefined,
        city: form.city || undefined,
        land: form.land || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
      },
    })

    toast.add({
      title: 'Weingut aktualisiert',
      description: `"${form.name}" wurde erfolgreich gespeichert.`,
      color: 'success',
    })

    emit('updated')
    close()
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Weinguts'
    toast.add({
      title: 'Fehler',
      description: message,
      color: 'error',
    })
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCard class="w-150 max-w-full">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Weingut bearbeiten</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              size="sm"
              :ui="{ base: 'cursor-pointer' }"
              @click="close"
            />
          </div>
        </template>

        <div class="space-y-4 max-h-[70vh] overflow-y-auto">
          <!-- Name -->
          <UFormField label="Name" required :error="errors.name || undefined">
            <UInput
              v-model="form.name"
              class="w-full"
            />
          </UFormField>

          <!-- Address -->
          <UFormField label="Adresse">
            <UInput
              v-model="form.address"
              class="w-full"
            />
          </UFormField>

          <!-- Post & City -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="PLZ">
              <UInput
                v-model="form.post"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Stadt">
              <UInput
                v-model="form.city"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Country -->
          <UFormField label="Land">
            <CountrySelect v-model="form.land" />
          </UFormField>

          <!-- Contact Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Telefon">
              <UInput
                v-model="form.phone"
                type="tel"
                class="w-full"
              />
            </UFormField>

            <UFormField label="E-Mail" :error="errors.email || undefined">
              <UInput
                v-model="form.email"
                type="email"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Website -->
          <UFormField label="Website" :error="errors.website || undefined">
            <UInput
              v-model="form.website"
              placeholder="https://"
              class="w-full"
            />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="outline"
              :ui="{ base: 'cursor-pointer' }"
              @click="close"
            >
              Abbrechen
            </UButton>
            <UButton
              color="primary"
              :ui="{ base: 'cursor-pointer' }"
              :loading="isSaving"
              :disabled="isSaving"
              @click="save"
            >
              Speichern
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
