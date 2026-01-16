<script setup lang="ts">
// Admin Dashboard page

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const stats = [
  { label: 'Total Wines', value: 0, icon: 'i-lucide-wine', color: 'text-primary' },
  { label: 'Red Wines', value: 0, icon: 'i-lucide-grape', color: 'text-red-500' },
  { label: 'White Wines', value: 0, icon: 'i-lucide-citrus', color: 'text-amber-400' },
  { label: 'Wineries', value: 0, icon: 'i-lucide-warehouse', color: 'text-blue-500' },
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-highlighted mb-6">
      Dashboard
    </h1>

    <!-- Stats Board -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted">{{ stat.label }}</p>
            <p class="text-3xl font-bold text-highlighted mt-2">{{ stat.value }}</p>
          </div>
          <div class="p-3 bg-muted rounded-lg">
            <UIcon :name="stat.icon" class="size-6" :class="stat.color" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Wines by Art Chart -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-highlighted">
            Wines by Art
          </h3>
        </template>
        <div class="h-64 flex items-center justify-center text-muted">
          <div class="text-center">
            <UIcon name="i-lucide-bar-chart-3" class="size-12 mb-2 opacity-50" />
            <p>Chart placeholder</p>
          </div>
        </div>
      </UCard>

      <!-- Wines by Type Chart -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-highlighted">
            Wines by Type
          </h3>
        </template>
        <div class="h-64 flex items-center justify-center text-muted">
          <div class="text-center">
            <UIcon name="i-lucide-pie-chart" class="size-12 mb-2 opacity-50" />
            <p>Chart placeholder</p>
          </div>
        </div>
      </UCard>

      <!-- Wines per Country Chart -->
      <UCard class="lg:col-span-2">
        <template #header>
          <h3 class="text-lg font-semibold text-highlighted">
            Wines per Country
          </h3>
        </template>
        <div class="h-64 flex items-center justify-center text-muted">
          <div class="text-center">
            <UIcon name="i-lucide-globe" class="size-12 mb-2 opacity-50" />
            <p>Chart placeholder</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
