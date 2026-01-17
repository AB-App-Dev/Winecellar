<script setup lang="ts">
const model = defineModel<string>()

defineProps<{
  placeholder?: string
}>()
</script>

<script lang="ts">
export const countryOptions = [
  { label: 'Österreich - Steiermark', value: '0' },
  { label: 'Österreich - Burgenland', value: '1' },
  { label: 'Österreich - Niederösterreich', value: '2' },
  { label: 'Italien', value: '3' },
  { label: 'Spanien', value: '4' },
  { label: 'Frankreich', value: '5' },
  { label: 'Portugal', value: '6' },
  { label: 'Slowenien', value: '7' },
  { label: 'Kroatien', value: '8' },
  { label: 'Serbien', value: '9' },
  { label: 'Argentinien', value: '10' },
  { label: 'Australien', value: '11' },
  { label: 'USA', value: '12' },
  { label: 'Mexico', value: '13' },
  { label: 'Chile', value: '14' },
  { label: 'Südafrika', value: '15' },
  { label: 'Deutschland', value: '16' },
]

export function getCountryLabel(value: string | null | undefined): string {
  if (!value) return '-'
  const option = countryOptions.find(o => o.value === value)
  return option?.label || value
}
</script>

<template>
  <USelect
    v-model="model"
    :items="countryOptions"
    class="w-full"
  />
</template>
