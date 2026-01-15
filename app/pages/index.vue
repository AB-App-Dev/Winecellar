<script setup lang="ts">
// Guest wine listing page
// Default sorting: price ascending (cheapest first)

definePageMeta({
  layout: 'default'
})

const layoutView = ref<'grid' | 'list'>('grid')
</script>

<template>
  <div>

      <!-- Layout Toggle & Theme Options -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button
            :class="[
              'p-2 rounded',
              layoutView === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
            @click="layoutView = 'grid'"
          >
            Grid
          </button>
          <button
            :class="[
              'p-2 rounded',
              layoutView === 'list' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
            @click="layoutView = 'list'"
          >
            List
          </button>
        </div>

        <NuxtLink
          to="/admin/login"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Admin Login
        </NuxtLink>
      </div>
    
  </div>
</template>
