<script setup lang="ts">
import type { Wine } from '~/generated/prisma'

const props = defineProps<{
  wine: Wine | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  updated: []
}>()

const toast = useToast()
const isSaving = ref(false)

const wineryOptions = ref<{ label: string; value: string }[]>([])

async function fetchWineries() {
  try {
    const wineries = await $fetch<{ id: string; name: string }[]>('/api/wineries')
    wineryOptions.value = wineries.map(w => ({ label: w.name, value: w.id }))
  } catch {
    wineryOptions.value = []
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    fetchWineries()
  }
})

const form = reactive({
  name: '',
  wineryId: '',
  art: undefined as string | undefined,
  taste: undefined as string | undefined,
  year: new Date().getFullYear(),
  barrelType: '',
  alcoholPercentage: undefined as number | undefined,
  amount: '',
  wineVariety: '',
  varieties: '',
  land: '',
  region: '',
  price: undefined as number | undefined,
  bottlesAmount: undefined as number | undefined,
  availableAtYear: undefined as number | undefined,
  imageUrl: '',
  description: '',
  hiddenForGuests: false,
})

const imageFile = ref<File | null>(null)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)

const TARGET_SIZE = 600
const MAX_FILE_SIZE = 500 * 1024 // 500KB

async function processImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = async () => {
      URL.revokeObjectURL(url)

      const canvas = document.createElement('canvas')
      canvas.width = TARGET_SIZE
      canvas.height = TARGET_SIZE
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Canvas context nicht verfügbar'))
        return
      }

      // Crop to center square
      const size = Math.min(img.width, img.height)
      const sx = (img.width - size) / 2
      const sy = (img.height - size) / 2

      ctx.drawImage(img, sx, sy, size, size, 0, 0, TARGET_SIZE, TARGET_SIZE)

      // Compress with decreasing quality until under max size
      let quality = 0.9
      let blob: Blob | null = null

      while (quality > 0.1) {
        blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', quality))
        if (blob && blob.size <= MAX_FILE_SIZE) break
        quality -= 0.1
      }

      if (!blob) {
        reject(new Error('Bildkomprimierung fehlgeschlagen'))
        return
      }

      const processedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
        type: 'image/jpeg',
      })
      resolve(processedFile)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Bild konnte nicht geladen werden'))
    }

    img.src = url
  })
}

const errors = reactive({
  name: '',
  art: '',
  taste: '',
  year: '',
  alcoholPercentage: '',
  amount: '',
  land: '',
  region: '',
  price: '',
  bottlesAmount: '',
  imageUrl: '',
})

function clearErrors() {
  errors.name = ''
  errors.art = ''
  errors.taste = ''
  errors.year = ''
  errors.alcoholPercentage = ''
  errors.amount = ''
  errors.land = ''
  errors.region = ''
  errors.price = ''
  errors.bottlesAmount = ''
  errors.imageUrl = ''
}

function validate(): boolean {
  clearErrors()
  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Name ist erforderlich'
    isValid = false
  }
  if (!form.art) {
    errors.art = 'Art ist erforderlich'
    isValid = false
  }
  if (!form.taste) {
    errors.taste = 'Geschmack ist erforderlich'
    isValid = false
  }
  if (!form.year) {
    errors.year = 'Jahrgang ist erforderlich'
    isValid = false
  }
  if (form.alcoholPercentage === undefined || form.alcoholPercentage === null) {
    errors.alcoholPercentage = 'Vol.Alk. ist erforderlich'
    isValid = false
  }
  if (!form.amount.trim()) {
    errors.amount = 'Inhalt ist erforderlich'
    isValid = false
  }
  if (!form.land.trim()) {
    errors.land = 'Land ist erforderlich'
    isValid = false
  }
  if (!form.region.trim()) {
    errors.region = 'Region ist erforderlich'
    isValid = false
  }
  if (form.price === undefined || form.price === null) {
    errors.price = 'Preis ist erforderlich'
    isValid = false
  }
  if (form.bottlesAmount === undefined || form.bottlesAmount === null) {
    errors.bottlesAmount = 'Stück ist erforderlich'
    isValid = false
  }
  if (!form.imageUrl.trim()) {
    errors.imageUrl = 'Bild ist erforderlich'
    isValid = false
  }

  return isValid
}

async function uploadImage(file: File) {
  isUploading.value = true
  uploadError.value = null

  try {
    const processedFile = await processImage(file)

    const formData = new FormData()
    formData.append('file', processedFile)

    const response = await $fetch<{ url: string }>('/api/upload/image', {
      method: 'POST',
      body: formData,
    })

    form.imageUrl = response.url
  }
  catch (error: unknown) {
    uploadError.value = error instanceof Error ? error.message : 'Upload fehlgeschlagen'
    imageFile.value = null
  }
  finally {
    isUploading.value = false
  }
}

watch(imageFile, async (file) => {
  if (file) {
    await uploadImage(file)
  }
})

function populateForm(wine: Wine) {
  form.name = wine.name
  form.wineryId = wine.wineryId || ''
  form.art = wine.art
  form.taste = wine.taste
  form.year = wine.year
  form.barrelType = wine.barrelType || ''
  form.alcoholPercentage = wine.alcoholPercentage
  form.amount = wine.amount || ''
  form.wineVariety = wine.wineVariety || ''
  form.varieties = wine.varieties || ''
  form.land = wine.land
  form.region = wine.region || ''
  form.price = wine.price
  form.bottlesAmount = wine.bottlesAmount
  form.availableAtYear = wine.availableAtYear || undefined
  form.imageUrl = wine.imageUrl || ''
  form.description = wine.description || ''
  form.hiddenForGuests = wine.hiddenForGuests
  imageFile.value = null
  uploadError.value = null
  clearErrors()
}

watch(() => props.wine, (wine) => {
  if (wine) {
    populateForm(wine)
  }
}, { immediate: true })

function close() {
  open.value = false
}

async function save() {
  if (!props.wine || !validate()) {
    return
  }

  isSaving.value = true

  try {
    await $fetch(`/api/wines/${props.wine.id}`, {
      method: 'PUT',
      body: {
        name: form.name,
        wineryId: form.wineryId || undefined,
        art: form.art,
        taste: form.taste,
        year: form.year,
        barrelType: form.barrelType || undefined,
        alcoholPercentage: form.alcoholPercentage,
        amount: form.amount || undefined,
        wineVariety: form.wineVariety || undefined,
        varieties: form.varieties || undefined,
        land: form.land,
        region: form.region || undefined,
        price: form.price,
        bottlesAmount: form.bottlesAmount,
        availableAtYear: form.availableAtYear || undefined,
        imageUrl: form.imageUrl || undefined,
        description: form.description || undefined,
        hiddenForGuests: form.hiddenForGuests,
      },
    })

    toast.add({
      title: 'Wein aktualisiert',
      description: `"${form.name}" wurde erfolgreich gespeichert.`,
      color: 'success',
    })

    emit('updated')
    close()
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Weins'
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
      <UCard class="w-200 max-w-full">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Wein bearbeiten</h3>
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

        <div class="space-y-6 max-h-[70vh] overflow-y-auto">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Name" required :error="errors.name || undefined">
              <UInput
                v-model="form.name"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Weingut">
              <USelect
                v-model="form.wineryId"
                :items="wineryOptions"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Wine Characteristics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormField label="Art" required :error="errors.art || undefined">
              <WineArtSelect v-model="form.art" />
            </UFormField>

            <UFormField label="Geschmack" required :error="errors.taste || undefined">
              <WineTasteSelect v-model="form.taste" />
            </UFormField>

            <UFormField label="Jahrgang" required :error="errors.year || undefined">
              <UInput
                v-model="form.year"
                type="number"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Year & Production -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormField label="Ausbau">
              <UInput
                v-model="form.barrelType"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Vol.Alk." required :error="errors.alcoholPercentage || undefined">
              <UInput
                v-model="form.alcoholPercentage"
                type="number"
                step="0.1"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Inhalt" required :error="errors.amount || undefined">
              <UInput
                v-model="form.amount"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Location -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Rebsorte">
              <UInput
                v-model="form.wineVariety"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Sorten">
              <UInput
                v-model="form.varieties"
                class="w-full"
              />
            </UFormField>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Land" required :error="errors.land || undefined">
              <CountrySelect v-model="form.land" />
            </UFormField>

            <UFormField label="Region" required :error="errors.region || undefined">
              <UInput
                v-model="form.region"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Price & Inventory -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormField label="Preis" required :error="errors.price || undefined">
              <UInput
                v-model="form.price"
                type="number"
                step="0.01"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Stück" required :error="errors.bottlesAmount || undefined">
              <UInput
                v-model="form.bottlesAmount"
                type="number"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Verfügbar ab">
              <UInput
                v-model="form.availableAtYear"
                type="number"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Image -->
          <UFormField label="Bild" :error="uploadError || errors.imageUrl || undefined" required>
            <UFileUpload
              v-model="imageFile"
              accept="image/jpeg,image/png,image/webp,image/gif"
              icon="i-lucide-image"
              label="Bild hierher ziehen"
              description="JPG, PNG, WebP oder GIF (wird auf 600x600 zugeschnitten)"
              class="w-full min-h-32"
              :disabled="isUploading"
            />
            <div v-if="isUploading" class="mt-2 flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-loader-2" class="animate-spin" />
              Bild wird verarbeitet und hochgeladen...
            </div>
            <div v-else-if="form.imageUrl" class="mt-2">
              <img
                :src="form.imageUrl"
                alt="Vorschau"
                class="h-24 w-auto rounded border border-default object-cover"
              />
            </div>
          </UFormField>

          <!-- Description -->
          <UFormField label="Beschreibung">
            <UTextarea
              v-model="form.description"
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <!-- Visibility -->
          <UFormField>
            <UCheckbox
              v-model="form.hiddenForGuests"
              label="Auf der Startseite verstecken"
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
