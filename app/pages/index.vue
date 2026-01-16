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
    <!-- Layout Toggle & Admin Link -->
    <div class="flex items-center justify-between">
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
    </div>
  </div>
</template>
