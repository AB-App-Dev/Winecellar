<script setup lang="ts">
import { countryOptions } from '~/utils/wineOptions'

const model = defineModel<string>()

defineProps<{
  placeholder?: string
}>()
</script>

<template>
  <USelect
    v-model="model"
    :items="countryOptions"
    :placeholder="placeholder"
    class="w-full"
  />
</template>
