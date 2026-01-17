<script setup lang="ts">
const model = defineModel<string>()

defineProps<{
  placeholder?: string
}>()

const tasteOptions = [
  { label: 'Trocken', value: 'DRY' },
  { label: 'Halbtrocken', value: 'SEMI_DRY' },
  { label: 'Lieblich', value: 'SEMI_SWEET' },
  { label: 'Süß', value: 'SWEET' },
]
</script>

<template>
  <USelect
    v-model="model"
    :items="tasteOptions"
    class="w-full"
  />
</template>
