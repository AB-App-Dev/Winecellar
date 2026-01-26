<script setup lang="ts">
import type { Wine } from '~/types'
import { getTasteLabel, getArtLabel, getWineIconColor, getCountryFlag, getCountryLabel } from '~/utils/wineOptions'

const props = defineProps<{
  wine: Wine
  viewMode?: 'grid' | 'list'
}>()

const favoritesStore = useFavoritesStore()
const toast = useToast()

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
    const wasFavorite = isFavorite.value
    await favoritesStore.toggleFavorite(props.wine)

    toast.add({
      title: wasFavorite ? 'Aus Favoriten entfernt' : 'Zu Favoriten hinzugefügt',
      description: props.wine.name,
      icon: wasFavorite ? 'i-lucide-heart-off' : 'i-lucide-heart',
      color: wasFavorite ? 'neutral' : 'success',
    })
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
        :class="viewMode === 'list' ? 'w-[150px] h-[150px] shrink-0' : ''"
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
          :ui="{ base: 'p-1.5' }"
          @click.stop="handleToggleFavorite"
        >
          <UIcon
            name="i-lucide-heart"
            class="size-5"
            :class="isFavorite ? 'text-red-500' : ''"
          />
        </UButton>
      </div>

      <!-- Wine Info -->
      <div
        class="p-4 flex-1"
        :class="viewMode === 'list' ? 'flex items-center gap-4 flex-wrap' : ''"
      >
        <!-- Name & Winery -->
        <div :class="viewMode === 'list' ? '' : 'text-center'">
          <h3 class="text-lg font-semibold text-highlighted">
            {{ wine.name }}
          </h3>
          <p class="text-sm text-muted">
            {{ wine.winery?.name || 'Unbekanntes Weingut' }}
          </p>
        </div>

        <!-- Year, Taste, BarrelType Badges -->
        <div :class="viewMode === 'list' ? 'flex gap-2' : 'mt-4 flex justify-center gap-2 flex-wrap'">
          <UBadge class="rounded-full" color="neutral" variant="subtle">{{ wine.year }}</UBadge>
          <UBadge class="rounded-full" color="neutral" variant="subtle">{{ getTasteLabel(wine.taste) }}</UBadge>
          <UBadge v-if="wine.barrelType" class="rounded-full" color="neutral" variant="subtle">{{ wine.barrelType }}</UBadge>
        </div>

        <!-- Coming Soon Badge -->
        <div v-if="isComingSoon" :class="viewMode === 'list' ? 'flex' : 'mt-4 flex justify-center'">
          <UBadge color="warning" variant="subtle">
            Verfügbar ab: {{ wine.availableAtYear }}
          </UBadge>
        </div>

        <!-- Wine Details -->
        <div :class="viewMode === 'list' ? 'flex gap-2 text-sm text-muted' : 'mt-4 text-sm text-muted flex flex-wrap justify-center gap-x-2 gap-y-1'">
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

        <!-- Country Flag -->
        <div v-if="countryFlag" :class="viewMode === 'list' ? 'flex items-center' : 'mt-4 text-sm text-muted flex items-center justify-center gap-2'">
          <UTooltip :text="getCountryLabel(wine.land)">
            <img
              :src="countryFlag"
              :alt="getCountryLabel(wine.land)"
              class="size-5 rounded-sm object-cover cursor-default"
            />
          </UTooltip>
        </div>

        <!-- Region -->
        <div :class="viewMode === 'list' ? 'flex items-center' : 'mt-4 text-sm text-muted flex items-center justify-center gap-2'">
          <UBadge class="rounded-full" color="neutral" variant="subtle">{{ wine.region }}</UBadge>
        </div>

      </div>
    </div>
  </UCard>
</template>
