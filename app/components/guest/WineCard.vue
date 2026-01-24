<script setup lang="ts">
import type { Wine } from '~/types'
import { getCountryLabel } from '~/components/CountrySelect.vue'
import { getTasteLabel, getArtLabel, getWineIconColor, getCountryFlag } from '~/utils/wineOptions'

const props = defineProps<{
  wine: Wine
  viewMode?: 'grid' | 'list'
}>()

const favoritesStore = useFavoritesStore()

const isComingSoon = computed(() => {
  if (!props.wine.availableAtYear) return false
  return props.wine.availableAtYear > new Date().getFullYear()
})

const canFavorite = computed(() => {
  return !props.wine.hiddenForGuests && !isComingSoon.value
})

const isFavorite = computed(() => favoritesStore.isFavorite(props.wine.id))

const countryFlag = computed(() => getCountryFlag(props.wine.land))

async function handleToggleFavorite() {
  if (canFavorite.value) {
    await favoritesStore.toggleFavorite(props.wine)
  }
}

</script>

<template>
  <UCard
    :class="[
      'overflow-hidden transition-opacity',
      isComingSoon ? 'opacity-60' : '',
    ]"
    :ui="{
      body: { padding: viewMode === 'list' ? 'p-0' : 'sm:p-4' },
    }"
  >
    <div :class="viewMode === 'list' ? 'flex' : ''">
      <!-- Wine Image with Favorite Button Overlay -->
      <div
        class="relative aspect-square"
        :class="viewMode === 'list' ? 'w-32 flex-shrink-0' : ''"
      >
        <img
          v-if="wine.imageUrl"
          :src="wine.imageUrl"
          :alt="wine.name"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full bg-muted/20 flex items-center justify-center"
        >
          <UIcon name="i-lucide-wine" class="size-12 text-muted" />
        </div>

        <!-- Favorite Button Overlay -->
        <UButton
          v-if="canFavorite"
          class="absolute top-2 right-2"
          color="neutral"
          variant="soft"
          size="sm"
          @click.stop="handleToggleFavorite"
        >
          <UIcon
            name="i-lucide-heart"
            :class="isFavorite ? 'text-red-500' : ''"
          />
        </UButton>
      </div>

      <!-- Wine Info -->
      <div class="p-4 flex-1">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-highlighted">
            {{ wine.name }}
          </h3>
          <p class="text-sm text-muted">
            {{ wine.winery?.name || 'Unbekanntes Weingut' }}
          </p>
        </div>

        <!-- Year, Art, BarrelType Badges -->
        <div class="mt-3 flex justify-center gap-2 flex-wrap">
          <UBadge class="rounded-full" color="neutral" variant="subtle">{{ wine.year }}</UBadge>
          <UBadge class="rounded-full" color="neutral" variant="subtle">{{ getTasteLabel(wine.taste) }}</UBadge>
          <UBadge v-if="wine.barrelType" class="rounded-full" color="neutral" variant="subtle">{{ wine.barrelType }}</UBadge>
        </div>

        <!-- Coming Soon Badge -->
        <div v-if="isComingSoon" class="mt-2 flex justify-center">
          <UBadge color="warning" variant="subtle">
            Verfügbar ab: {{ wine.availableAtYear }}
          </UBadge>
        </div>

        <!-- Wine Details -->
        <div class="mt-3 text-sm text-muted flex flex-wrap justify-center gap-x-2 gap-y-1">
          <UBadge class="rounded-full" color="neutral" variant="outline">
            <template #leading>
              <UIcon name="i-lucide-wine" :class="getWineIconColor(wine.art)" />
            </template>
            {{ getArtLabel(wine.art) }}
          </UBadge>
          <UBadge v-if="wine.amount" class="rounded-full" color="neutral" variant="outline">
            <template #leading>
              <UIcon name="i-lucide-bottle-wine" />
            </template>
            {{ wine.amount }}
          </UBadge>
          <UBadge v-if="wine.alcoholPercentage" class="rounded-full" color="neutral" variant="outline">
            <template #leading>
              <UIcon name="i-lucide-percent" />
            </template>
            {{ wine.alcoholPercentage }}
          </UBadge>
        </div>

        <!-- Country & Region -->
        <div class="mt-2 text-sm text-muted flex items-center justify-center gap-2">
          <img
            v-if="countryFlag"
            :src="countryFlag"
            :alt="getCountryLabel(wine.land)"
            class="size-5 rounded-sm object-cover"
          />
          <template v-if="wine.region">
            <span> · </span>
            <span class="text-highlighted">{{ wine.region }}</span>
          </template>
        </div>

      </div>
    </div>
  </UCard>
</template>
