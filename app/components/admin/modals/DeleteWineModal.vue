<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  wineName?: string
}>()

const emit = defineEmits<{
  confirmed: []
}>()

const isConfirmed = ref(false)

function close() {
  open.value = false
  isConfirmed.value = false
}

function confirmDelete() {
  emit('confirmed')
  close()
}
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCard class="max-w-full">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Wein löschen</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              size="sm"
              :ui="{ base: 'cursor-pointer' }"
              @click="close"
            />
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-sm">
            Möchten Sie Wein{{ props.wineName ? ` "${props.wineName}"` : '' }} wirklich löschen?<br/> Diese Aktion kann nicht rückgängig gemacht werden.
          </p>

          <UCheckbox
            v-model="isConfirmed"
            label="Ja, diesen Wein löschen"
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="outline"
              :ui="{ base: 'cursor-pointer' }"
              @click="close"
            >
              Abbrechen
            </UButton>
            <UButton
              color="error"
              :ui="{ base: 'cursor-pointer' }"
              :disabled="!isConfirmed"
              @click="confirmDelete"
            >
              Löschen
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
