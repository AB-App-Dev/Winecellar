<script setup lang="ts">
import type { Theme } from '~/types'

const themes: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
]

// TODO: Connect to UI store
const currentTheme = ref<Theme>('system')

function setTheme(theme: Theme) {
  currentTheme.value = theme
  // TODO: Call UI store action
}
</script>

<template>
  <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
    <button
      v-for="theme in themes"
      :key="theme.value"
      @click="setTheme(theme.value)"
      :class="[
        'px-3 py-1.5 text-sm rounded-md transition-colors',
        currentTheme === theme.value
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      ]"
    >
      {{ theme.label }}
    </button>
  </div>
</template>
