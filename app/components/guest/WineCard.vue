<script setup lang="ts">
import type { Wine } from '~/types'
import { getCountryLabel } from '~/components/CountrySelect.vue'

const props = defineProps<{
  wine: Wine
  viewMode?: 'grid' | 'list'
}>()

const emit = defineEmits<{
  toggleFavorite: [wine: Wine]
}>()

const isComingSoon = computed(() => {
  if (!props.wine.availableAtYear) return false
  return props.wine.availableAtYear > new Date().getFullYear()
})

const canFavorite = computed(() => {
  return !props.wine.hiddenForGuests && !isComingSoon.value
})

// TODO: Get from favorites store
const isFavorite = ref(false)

function handleToggleFavorite() {
  if (canFavorite.value) {
    emit('toggleFavorite', props.wine)
  }
}
</script>

<template>
  <div
    :class="[
      'bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-opacity',
      isComingSoon ? 'opacity-60' : '',
      viewMode === 'list' ? 'flex' : ''
    ]"
  >
    <!-- Wine Image -->
    <div :class="viewMode === 'list' ? 'w-32 flex-shrink-0' : 'aspect-w-3 aspect-h-4'">
      <img
        v-if="wine.imageUrl"
        :src="wine.imageUrl"
        :alt="wine.name"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
      >
        <span class="text-gray-400">No image</span>
      </div>
    </div>

    <!-- Wine Info -->
    <div class="p-4 flex-1">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ wine.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ wine.grower?.name || 'Unknown winery' }}
          </p>
        </div>

        <!-- Favorite Button -->
        <button
          v-if="canFavorite"
          @click="handleToggleFavorite"
          :class="[
            'p-2 rounded-full transition-colors',
            isFavorite
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          ]"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              :fill-rule="isFavorite ? 'nonzero' : 'evenodd'"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Coming Soon Badge -->
      <div v-if="isComingSoon" class="mt-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          Available at: {{ wine.availableAtYear }}
        </span>
      </div>

      <!-- Wine Details -->
      <div class="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <div class="flex justify-between">
          <span>Year:</span>
          <span>{{ wine.year }}</span>
        </div>
        <div class="flex justify-between">
          <span>Art:</span>
          <span class="capitalize">{{ wine.art }}</span>
        </div>
        <div class="flex justify-between">
          <span>Taste:</span>
          <span class="capitalize">{{ wine.taste }}</span>
        </div>
        <div v-if="wine.barrelType" class="flex justify-between">
          <span>Barrel:</span>
          <span>{{ wine.barrelType }}</span>
        </div>
        <div v-if="wine.amount" class="flex justify-between">
          <span>Amount:</span>
          <span>{{ wine.amount }}</span>
        </div>
        <div v-if="wine.alcoholPercentage" class="flex justify-between">
          <span>Alcohol:</span>
          <span>{{ wine.alcoholPercentage }}%</span>
        </div>
        <div class="flex justify-between">
          <span>Country:</span>
          <span>{{ getCountryLabel(wine.land) }}</span>
        </div>
        <div v-if="wine.region" class="flex justify-between">
          <span>Region:</span>
          <span>{{ wine.region }}</span>
        </div>
      </div>

      <!-- Price -->
      <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <span class="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          {{ wine.price.toFixed(2) }} &euro;
        </span>
      </div>
    </div>
  </div>
</template>
