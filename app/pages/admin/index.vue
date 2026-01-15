<script setup lang="ts">
// Admin Dashboard page

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Dashboard
    </h1>

    <!-- Stats Board -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Wines</h3>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Red Wines</h3>
        <p class="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">0</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">White Wines</h3>
        <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">0</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Wineries</h3>
        <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">0</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Wines by Art Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Wines by Art
        </h3>
        <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Chart placeholder - Add chart library
        </div>
      </div>

      <!-- Wines by Type Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Wines by Type
        </h3>
        <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Chart placeholder - Add chart library
        </div>
      </div>

      <!-- Wines per Country Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Wines per Country
        </h3>
        <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Chart placeholder - Add chart library
        </div>
      </div>
    </div>
  </div>
</template>
