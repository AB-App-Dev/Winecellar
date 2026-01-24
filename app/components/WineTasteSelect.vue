<script setup lang="ts">
import { tasteOptions, getTasteLabel } from '~/utils/wineOptions'

const model = defineModel<string>()

defineProps<{
  placeholder?: string
}>()

// Re-export for external use
defineExpose({ getTasteLabel })
</script>

<template>
  <USelect
    v-model="model"
    :items="tasteOptions"
    :placeholder="placeholder"
    class="w-full"
  />
</template>
