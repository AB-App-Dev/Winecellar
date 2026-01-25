<script setup lang="ts">
import type { Wine } from '~/types'
import { getTasteLabel, getArtLabel, getWineIconColor, getCountryFlag, getCountryLabel } from '~/utils/wineOptions'

const props = defineProps<{
  wine: Wine
}>()

const favoritesStore = useFavoritesStore()
const toast = useToast()

const countryFlag = computed(() => getCountryFlag(props.wine.land))

async function handleRemoveFavorite() {
  await favoritesStore.toggleFavorite(props.wine)
  toast.add({
    title: 'Aus Favoriten entfernt',
    description: props.wine.name,
    icon: 'i-lucide-heart-off',
    color: 'neutral',
  })
}
</script>

<template>
  <UCard :ui="{ body: { padding: 'p-0' } }">
    <div class="flex items-center">
      <!-- Wine Image (300x300, displayed smaller) -->
      <div class="w-20 h-20 shrink-0">
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
          <UIcon name="i-lucide-wine" class="size-8 text-muted" />
        </div>
      </div>

      <!-- Wine Info (single line) -->
      <div class="flex-1 px-4 py-2 flex items-center gap-3 overflow-x-auto">
        <h3 class="font-semibold text-highlighted whitespace-nowrap">
          {{ wine.name }}
        </h3>
        <span class="text-sm text-muted whitespace-nowrap">
          {{ wine.winery?.name }}
        </span>
        <UBadge class="rounded-full shrink-0" color="neutral" variant="subtle">{{ wine.year }}</UBadge>
        <UBadge class="rounded-full shrink-0" color="neutral" variant="subtle">
          <template #leading>
            <UIcon name="i-lucide-wine" :class="getWineIconColor(wine.art)" />
          </template>
          {{ getArtLabel(wine.art) }}
        </UBadge>
        <UBadge class="rounded-full shrink-0" color="neutral" variant="subtle">{{ getTasteLabel(wine.taste) }}</UBadge>
        <UTooltip v-if="countryFlag" :text="getCountryLabel(wine.land)">
          <img
            :src="countryFlag"
            :alt="getCountryLabel(wine.land)"
            class="size-5 rounded-sm object-cover cursor-default shrink-0"
          />
        </UTooltip>
        <span class="text-sm text-muted whitespace-nowrap">{{ wine.region }}</span>
      </div>

      <!-- Remove Button -->
      <div class="pr-4">
        <UButton
          color="neutral"
          variant="ghost"
          :ui="{ base: 'p-2 cursor-pointer' }"
          @click="handleRemoveFavorite"
        >
          <UIcon name="i-lucide-x" class="size-5" />
        </UButton>
      </div>
    </div>
  </UCard>
</template>
