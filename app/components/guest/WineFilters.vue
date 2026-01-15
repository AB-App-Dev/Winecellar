<script setup lang="ts">
import type { WineArt, WineTaste, WineFilters } from '~/types'

const props = defineProps<{
  modelValue: WineFilters
  availableLands: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: WineFilters]
  'apply': []
  'clear': []
}>()

const wineArts: { value: WineArt; label: string }[] = [
  { value: 'red', label: 'Red' },
  { value: 'white', label: 'White' },
  { value: 'rose', label: 'Rose' },
  { value: 'sparkling', label: 'Sparkling' },
  { value: 'dessert', label: 'Dessert' }
]

const wineTastes: { value: WineTaste; label: string }[] = [
  { value: 'dry', label: 'Dry' },
  { value: 'semi-dry', label: 'Semi-dry' },
  { value: 'semi-sweet', label: 'Semi-sweet' },
  { value: 'sweet', label: 'Sweet' }
]

const localFilters = ref<WineFilters>({ ...props.modelValue })

watch(() => props.modelValue, (newVal) => {
  localFilters.value = { ...newVal }
}, { deep: true })

function toggleArt(art: WineArt) {
  const index = localFilters.value.art.indexOf(art)
  if (index === -1) {
    localFilters.value.art.push(art)
  } else {
    localFilters.value.art.splice(index, 1)
  }
}

function toggleLand(land: string) {
  const index = localFilters.value.land.indexOf(land)
  if (index === -1) {
    localFilters.value.land.push(land)
  } else {
    localFilters.value.land.splice(index, 1)
  }
}

function toggleTaste(taste: WineTaste) {
  const index = localFilters.value.taste.indexOf(taste)
  if (index === -1) {
    localFilters.value.taste.push(taste)
  } else {
    localFilters.value.taste.splice(index, 1)
  }
}

function applyFilters() {
  emit('update:modelValue', { ...localFilters.value })
  emit('apply')
}

function clearFilters() {
  localFilters.value = { art: [], land: [], taste: [] }
  emit('update:modelValue', localFilters.value)
  emit('clear')
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Filters
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Wine Art Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Wine Art
        </label>
        <div class="space-y-2">
          <label
            v-for="art in wineArts"
            :key="art.value"
            class="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="localFilters.art.includes(art.value)"
              @change="toggleArt(art.value)"
              class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {{ art.label }}
            </span>
          </label>
        </div>
      </div>

      <!-- Land Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Country
        </label>
        <div class="space-y-2 max-h-40 overflow-y-auto">
          <label
            v-for="land in availableLands"
            :key="land"
            class="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="localFilters.land.includes(land)"
              @change="toggleLand(land)"
              class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {{ land }}
            </span>
          </label>
          <p v-if="availableLands.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
            No countries available
          </p>
        </div>
      </div>

      <!-- Taste Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Taste
        </label>
        <div class="space-y-2">
          <label
            v-for="taste in wineTastes"
            :key="taste.value"
            class="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="localFilters.taste.includes(taste.value)"
              @change="toggleTaste(taste.value)"
              class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {{ taste.label }}
            </span>
          </label>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="clearFilters"
        class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        Clear all
      </button>
      <button
        @click="applyFilters"
        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Apply filters
      </button>
    </div>
  </div>
</template>
