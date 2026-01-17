<script setup lang="ts">
// Admin wines list page with CRUD operations
// Default sorting: production year
import { getCountryLabel } from '~/components/CountrySelect.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const filterArt = ref<string | undefined>(undefined)
const filterCountry = ref<string | undefined>(undefined)
const filterTaste = ref<string | undefined>(undefined)
const sortField = ref('year')

const sortOptions = [
  { label: 'Jahr', value: 'year' },
  { label: 'Name', value: 'name' },
  { label: 'Preis', value: 'price' },
  { label: 'Stück', value: 'bottlesAmount' },
]

const artLabels: Record<string, string> = {
  RED: 'Rot',
  WHITE: 'Weiß',
  ROSE: 'Rosé',
  ORANGE: 'Orange',
  SPARKLING: 'Schaumwein',
  DESSERT: 'Dessertwein',
}

const tasteLabels: Record<string, string> = {
  DRY: 'Trocken',
  SEMI_DRY: 'Halbtrocken',
  SEMI_SWEET: 'Lieblich',
  SWEET: 'Süß',
}

const isNewWineModalOpen = ref(false)
const expandedRows = ref<Set<string>>(new Set())

const wines = ref<any[]>([])
const isLoading = ref(false)

function toggleRow(id: string) {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
}

async function fetchWines() {
  isLoading.value = true
  try {
    wines.value = await $fetch('/api/wines', {
      query: {
        art: filterArt.value,
        taste: filterTaste.value,
        country: filterCountry.value,
        sortField: sortField.value,
      },
    })
  } finally {
    isLoading.value = false
  }
}

const hasActiveFilters = computed(() => {
  return filterArt.value || filterCountry.value || filterTaste.value || sortField.value !== 'year'
})

function clearFilters() {
  filterArt.value = undefined
  filterCountry.value = undefined
  filterTaste.value = undefined
  sortField.value = 'year'
  fetchWines()
}

onMounted(() => {
  fetchWines()
})

async function handleSaveNewWine(form: any) {
  await $fetch('/api/wines', {
    method: 'POST',
    body: form,
  })
  isNewWineModalOpen.value = false
  await fetchWines()
}

async function deleteWine(id: string) {
  if (!confirm('Möchten Sie diesen Wein wirklich löschen?')) return
  await $fetch(`/api/wines/${id}`, { method: 'DELETE' })
  await fetchWines()
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        Weine
      </h1>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        :ui="{ base: 'cursor-pointer' }"
        @click="isNewWineModalOpen = true"
      />
    </div>

    <!-- Filters Section -->
    <UCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UFormField label="Weinart">
          <WineArtSelect v-model="filterArt" placeholder="Alle" />
        </UFormField>

        <UFormField label="Land">
          <CountrySelect v-model="filterCountry" placeholder="Alle" />
        </UFormField>

        <UFormField label="Geschmack">
          <WineTasteSelect v-model="filterTaste" placeholder="Alle" />
        </UFormField>

        <UFormField label="Sortieren nach">
          <USelect
            v-model="sortField"
            :items="sortOptions"
            class="w-full"
          />
        </UFormField>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <UButton
          v-if="hasActiveFilters"
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          :ui="{ base: 'cursor-pointer' }"
          @click="clearFilters"
        >
          Zurücksetzen
        </UButton>
        <UButton
          color="primary"
          icon="i-lucide-filter"
          :ui="{ base: 'cursor-pointer' }"
          @click="fetchWines"
        />
      </div>
    </UCard>

    <!-- Wines Table -->
    <UCard>
      <div v-if="isLoading" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-primary" />
      </div>
      <div v-else-if="wines.length === 0" class="flex flex-col items-center justify-center py-12 text-muted">
        <UIcon name="i-lucide-wine-off" class="size-12 mb-4 opacity-50" />
        <p>Noch keine Weine hinzugefügt.</p>
        <UButton
          color="primary"
          variant="ghost"
          class="mt-4"
          :ui="{ base: 'cursor-pointer' }"
          @click="isNewWineModalOpen = true"
        >
          Ersten Wein hinzufügen
        </UButton>
      </div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="p-3 w-8"></th>
            <th class="text-left p-3">Name</th>
            <th class="text-left p-3">Jahr</th>
            <th class="text-left p-3">Art</th>
            <th class="text-left p-3">Geschmack</th>
            <th class="text-right p-3">Stück</th>
            <th class="text-right p-3">Preis</th>
            <th class="text-right p-3">Wert</th>
            <th class="p-3"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="wine in wines" :key="wine.id">
            <tr
              class="border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors"
              @click="toggleRow(wine.id)"
            >
              <td class="p-3">
                <UIcon
                  :name="expandedRows.has(wine.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                  class="size-4 text-muted"
                />
              </td>
              <td class="p-3">{{ wine.name }}</td>
              <td class="p-3">{{ wine.year }}</td>
              <td class="p-3">{{ artLabels[wine.art] || wine.art }}</td>
              <td class="p-3">{{ tasteLabels[wine.taste] || wine.taste }}</td>
              <td class="text-right p-3">{{ wine.bottlesAmount }}</td>
              <td class="text-right p-3">{{ Number(wine.price).toFixed(2) }} €</td>
              <td class="text-right p-3">{{ (wine.bottlesAmount * Number(wine.price)).toFixed(2) }} €</td>
              <td class="p-3" @click.stop>
                <div class="flex justify-end gap-2">
                  <UButton
                    :to="`/admin/wines/${wine.id}/edit`"
                    color="primary"
                    variant="ghost"
                    icon="i-lucide-pencil"
                    size="sm"
                    :ui="{ base: 'cursor-pointer' }"
                  />
                  <UButton
                    color="error"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    size="sm"
                    :ui="{ base: 'cursor-pointer' }"
                    @click="deleteWine(wine.id)"
                  />
                </div>
              </td>
            </tr>
            <tr v-if="expandedRows.has(wine.id)" class="bg-gray-800/30">
              <td colspan="9" class="p-4">
                <div class="flex gap-6">
                  <div v-if="wine.imageUrl" class="shrink-0">
                    <img
                      :src="wine.imageUrl"
                      :alt="wine.name"
                      class="w-24 h-32 object-cover rounded"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span class="text-muted">Weingut:</span>
                        <span class="ml-2">{{ wine.winery?.name || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-muted">Land:</span>
                        <span class="ml-2">{{ getCountryLabel(wine.land) }}</span>
                      </div>
                      <div>
                        <span class="text-muted">Region:</span>
                        <span class="ml-2">{{ wine.region || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-muted">Rebsorte:</span>
                        <span class="ml-2">{{ wine.wineVariety || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-muted">Sorten:</span>
                        <span class="ml-2">{{ wine.varieties || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-muted">Alkohol:</span>
                        <span class="ml-2">{{ wine.alcoholPercentage ? `${wine.alcoholPercentage}%` : '-' }}</span>
                      </div>
                      <div>
                        <span class="text-muted">Ausbau:</span>
                        <span class="ml-2">{{ wine.barrelType || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-muted">Menge:</span>
                        <span class="ml-2">{{ wine.amount || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-muted">Verfügbar ab:</span>
                        <span class="ml-2">{{ wine.availableAtYear || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-muted">Sichtbar:</span>
                        <span class="ml-2">{{ wine.hiddenForGuests ? 'Nur Admin' : 'Alle' }}</span>
                      </div>
                    </div>
                    <div class="mt-4">
                      <span class="text-muted">Beschreibung:</span>
                      <p class="mt-1 text-sm">{{ wine.description || '-' }}</p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </UCard>

    <AdminModalsNewWineModal
      v-model:open="isNewWineModalOpen"
      @save="handleSaveNewWine"
    />
  </div>
</template>
