<script setup lang="ts">
const model = defineModel<string>()

defineProps<{
  placeholder?: string
}>()

const artOptions = [
  { label: 'Rot', value: 'RED' },
  { label: 'Weiß', value: 'WHITE' },
  { label: 'Rosé', value: 'ROSE' },
  { label: 'Orange', value: 'ORANGE' },
  { label: 'Schaumwein', value: 'SPARKLING' },
  { label: 'Dessertwein', value: 'DESSERT' },
]
</script>

<template>
  <USelect
    v-model="model"
    :items="artOptions"
    :placeholder="placeholder"
    class="w-full"
  />
</template>
