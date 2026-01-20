<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  wineryName?: string
  wineCount?: number
}>()

const emit = defineEmits<{
  confirmed: []
}>()

const isConfirmed = ref(false)

const canDelete = computed(() => !props.wineCount || props.wineCount === 0)

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
            <h3 class="text-lg font-semibold">Weingut löschen</h3>
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
          <template v-if="canDelete">
            <p class="text-sm">
              Möchten Sie Weingut{{ props.wineryName ? ` "${props.wineryName}"` : '' }} wirklich löschen?<br />
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>

            <UCheckbox
              v-model="isConfirmed"
              label="Ja, dieses Weingut löschen"
            />
          </template>
          <template v-else>
            <p class="text-sm">
              Weingut{{ props.wineryName ? ` "${props.wineryName}"` : '' }} kann nicht gelöscht werden,
              da es noch {{ props.wineCount }} Wein(e) enthält.
            </p>
            <p class="text-sm text-muted">
              Bitte entfernen Sie zuerst alle Weine aus diesem Weingut.
            </p>
          </template>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="outline"
              :ui="{ base: 'cursor-pointer' }"
              @click="close"
            >
              {{ canDelete ? 'Abbrechen' : 'Schließen' }}
            </UButton>
            <UButton
              v-if="canDelete"
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
