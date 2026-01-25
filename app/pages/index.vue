<script setup lang="ts">
// Guest wine listing page
// Default sorting: price ascending (cheapest first)

import type { Wine } from '~/types'

definePageMeta({
  layout: 'default'
})

const favoritesStore = useFavoritesStore()
const toast = useToast()

// Layout state
const layoutView = ref<'grid' | 'list'>('grid')
const showFilter = ref(false)

// Filter state
const filterArt = ref<string>()
const filterCountry = ref<string>()
const filterTaste = ref<string>()

// Wine data
const wines = ref<Wine[]>([])
const allFavoriteWines = ref<Wine[]>([])
const isLoading = ref(false)

// Computed
const hasActiveFilters = computed(() => {
  return filterArt.value || filterCountry.value || filterTaste.value
})

// Favorites are always shown unfiltered
const favoriteWines = computed(() => {
  return allFavoriteWines.value.filter(w => favoritesStore.isFavorite(w.id))
})

const nonFavoriteWines = computed(() => {
  return wines.value.filter(w => !favoritesStore.isFavorite(w.id))
})

// Functions
async function fetchWines() {
  isLoading.value = true
  try {
    wines.value = await $fetch<Wine[]>('/api/guest/wines', {
      query: {
        art: filterArt.value,
        taste: filterTaste.value,
        country: filterCountry.value,
      },
    })
  } finally {
    isLoading.value = false
  }
}

async function fetchAllFavoriteWines() {
  // Fetch all wines without filters, then filter by favorites client-side
  const allWines = await $fetch<Wine[]>('/api/guest/wines')
  allFavoriteWines.value = allWines.filter(w => favoritesStore.isFavorite(w.id))
}

function clearFilters() {
  filterArt.value = undefined
  filterCountry.value = undefined
  filterTaste.value = undefined
  fetchWines()
}

async function handleRemoveAllFavorites() {
  const count = favoriteWines.value.length
  await favoritesStore.removeAllFavorites()
  toast.add({
    title: 'Alle Favoriten entfernt',
    description: `${count} Weine wurden aus den Favoriten entfernt.`,
    icon: 'i-lucide-trash-2',
    color: 'neutral',
  })
}

// Initialization
onMounted(async () => {
  favoritesStore.initGuestKey()
  await favoritesStore.fetchFavorites()
  await Promise.all([
    fetchWines(),
    fetchAllFavoriteWines(),
  ])
})

// Re-fetch favorite wines when favorites change
watch(() => favoritesStore.favorites, fetchAllFavoriteWines, { deep: true })
</script>

<template>
  <div>
    <!-- Filter Row -->
    <UCard v-show="showFilter" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <UFormField label="Weinart">
          <WineArtSelect v-model="filterArt" placeholder="Alle" />
        </UFormField>
        <UFormField label="Land">
          <CountrySelect v-model="filterCountry" placeholder="Alle" />
        </UFormField>
        <UFormField label="Geschmack">
          <WineTasteSelect v-model="filterTaste" placeholder="Alle" />
        </UFormField>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <UButton
          v-if="hasActiveFilters"
          variant="ghost"
          icon="i-lucide-x"
          @click="clearFilters"
        >
          Zurücksetzen
        </UButton>
        <UButton
          color="primary"
          icon="i-lucide-filter"
          @click="fetchWines"
        >
          Filter
        </UButton>
      </div>
    </UCard>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-muted" />
    </div>

    <template v-else>
      <!-- Favorites Section (accordion, closed by default) -->
      <UAccordion
        v-if="favoriteWines.length > 0"
        class="mb-8"
        :items="[{
          label: `Meine Favoriten (${favoriteWines.length})`,
          icon: 'i-lucide-heart',
          slot: 'favorites'
        }]"
      >
        <template #favorites>
          <div class="pt-4">
            <div class="flex justify-end mb-2">
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-lucide-trash-2"
                :ui="{ base: 'cursor-pointer' }"
                @click="handleRemoveAllFavorites"
              >
                Alle entfernen
              </UButton>
            </div>
            <div class="space-y-2">
              <GuestFavoriteCard
                v-for="wine in favoriteWines"
                :key="wine.id"
                :wine="wine"
              />
            </div>
          </div>
        </template>
      </UAccordion>

      <!-- Layout Toggle & Filter Button -->
      <div class="flex items-center justify-between mb-6">
        <UButtonGroup>
          <UButton
            :variant="layoutView === 'grid' ? 'solid' : 'ghost'"
            color="primary"
            icon="i-heroicons-squares-2x2"
            aria-label="Grid view"
            :ui="{ base: 'cursor-pointer' }"
            @click="layoutView = 'grid'"
          />
          <UButton
            :variant="layoutView === 'list' ? 'solid' : 'ghost'"
            color="primary"
            icon="i-heroicons-list-bullet"
            aria-label="List view"
            :ui="{ base: 'cursor-pointer' }"
            @click="layoutView = 'list'"
          />
        </UButtonGroup>
        <UButton
          variant="ghost"
          icon="i-lucide-filter"
          aria-label="Toggle filter"
          @click="showFilter = !showFilter"
        />
      </div>

      <!-- All Wines Section -->
      <section>
        <!-- Empty State -->
        <div v-if="wines.length === 0" class="text-center py-12">
          <UIcon name="i-lucide-wine-off" class="size-16 text-muted mb-4" />
          <p class="text-muted">Keine Weine gefunden.</p>
          <UButton
            v-if="hasActiveFilters"
            variant="link"
            class="mt-2"
            @click="clearFilters"
          >
            Filter zurücksetzen
          </UButton>
        </div>

        <!-- Wine Grid/List -->
        <div
          v-else
          :class="layoutView === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'"
        >
          <GuestWineCard
            v-for="wine in nonFavoriteWines"
            :key="wine.id"
            :wine="wine"
            :view-mode="layoutView"
          />
        </div>
      </section>
    </template>
  </div>
</template>
