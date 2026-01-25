<script setup lang="ts">
import { getCountryLabel } from '~/utils/wineOptions'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface Winery {
  id: string
  name: string
  address: string | null
  post: string | null
  city: string | null
  land: string | null
  phone: string | null
  email: string | null
  website: string | null
  _count: {
    wines: number
  }
}

const wineries = ref<Winery[]>([])
const isLoading = ref(false)
const toast = useToast()

const isNewWineryModalOpen = ref(false)
const isEditWineryModalOpen = ref(false)
const isDeleteWineryModalOpen = ref(false)
const editingWinery = ref<Winery | null>(null)
const deletingWinery = ref<Winery | null>(null)
const expandedRows = ref<Set<string>>(new Set())

function toggleRow(id: string) {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
}

async function fetchWineries() {
  isLoading.value = true
  try {
    wineries.value = await $fetch('/api/wineries')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchWineries()
})

async function handleWineryCreated() {
  await fetchWineries()
}

function openEditModal(winery: Winery) {
  editingWinery.value = winery
  isEditWineryModalOpen.value = true
}

async function handleWineryUpdated() {
  await fetchWineries()
}

function openDeleteModal(winery: Winery) {
  deletingWinery.value = winery
  isDeleteWineryModalOpen.value = true
}

async function handleDeleteConfirmed() {
  if (!deletingWinery.value) return

  const wineryName = deletingWinery.value.name
  try {
    await $fetch(`/api/wineries/${deletingWinery.value.id}`, { method: 'DELETE' })
    toast.add({
      title: 'Weingut gelöscht',
      description: `"${wineryName}" wurde erfolgreich gelöscht.`,
      color: 'success',
    })
    deletingWinery.value = null
    await fetchWineries()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fehler beim Löschen des Weinguts'
    toast.add({
      title: 'Fehler',
      description: message,
      color: 'error',
    })
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        Weingüter
      </h1>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        :ui="{ base: 'cursor-pointer' }"
        @click="isNewWineryModalOpen = true"
      />
    </div>

    <!-- Wineries Table -->
    <UCard>
      <div v-if="isLoading" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-primary" />
      </div>
      <div v-else-if="wineries.length === 0" class="flex flex-col items-center justify-center py-12 text-muted">
        <UIcon name="i-lucide-grape" class="size-12 mb-4 opacity-50" />
        <p>Noch keine Weingüter hinzugefügt.</p>
        <UButton
          color="primary"
          variant="ghost"
          class="mt-4"
          :ui="{ base: 'cursor-pointer' }"
          @click="isNewWineryModalOpen = true"
        >
          Erstes Weingut hinzufügen
        </UButton>
      </div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="p-3 w-8"></th>
            <th class="text-left p-3">Name</th>
            <th class="text-left p-3">Stadt</th>
            <th class="text-left p-3">Land</th>
            <th class="text-right p-3">Weine</th>
            <th class="p-3"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="winery in wineries" :key="winery.id">
            <tr
              class="border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors"
              @click="toggleRow(winery.id)"
            >
              <td class="p-3">
                <UIcon
                  :name="expandedRows.has(winery.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                  class="size-4 text-muted"
                />
              </td>
              <td class="p-3">{{ winery.name }}</td>
              <td class="p-3">{{ winery.city || '-' }}</td>
              <td class="p-3">{{ winery.land ? getCountryLabel(winery.land) : '-' }}</td>
              <td class="text-right p-3">{{ winery._count.wines }}</td>
              <td class="p-3" @click.stop>
                <div class="flex justify-end gap-2">
                  <UButton
                    color="primary"
                    variant="ghost"
                    icon="i-lucide-pencil"
                    size="sm"
                    :ui="{ base: 'cursor-pointer' }"
                    @click="openEditModal(winery)"
                  />
                  <UButton
                    color="error"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    size="sm"
                    :ui="{ base: 'cursor-pointer' }"
                    @click="openDeleteModal(winery)"
                  />
                </div>
              </td>
            </tr>
            <tr v-if="expandedRows.has(winery.id)" class="bg-gray-800/30">
              <td colspan="6" class="p-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="text-muted">Adresse:</span>
                    <span class="ml-2">{{ winery.address || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-muted">PLZ:</span>
                    <span class="ml-2">{{ winery.post || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-muted">Stadt:</span>
                    <span class="ml-2">{{ winery.city || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-muted">Land:</span>
                    <span class="ml-2">{{ winery.land ? getCountryLabel(winery.land) : '-' }}</span>
                  </div>
                  <div>
                    <span class="text-muted">Telefon:</span>
                    <span class="ml-2">{{ winery.phone || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-muted">E-Mail:</span>
                    <span class="ml-2">
                      <a v-if="winery.email" :href="`mailto:${winery.email}`" class="text-primary hover:underline">
                        {{ winery.email }}
                      </a>
                      <template v-else>-</template>
                    </span>
                  </div>
                  <div class="col-span-2">
                    <span class="text-muted">Website:</span>
                    <span class="ml-2">
                      <a v-if="winery.website" :href="winery.website" target="_blank" class="text-primary hover:underline">
                        {{ winery.website }}
                      </a>
                      <template v-else>-</template>
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </UCard>

    <!-- New Winery Modal -->
    <AdminModalsNewWineryModal
      v-model:open="isNewWineryModalOpen"
      @created="handleWineryCreated"
    />

    <!-- Edit Winery Modal -->
    <AdminModalsEditWineryModal
      v-model:open="isEditWineryModalOpen"
      :winery="editingWinery"
      @updated="handleWineryUpdated"
    />

    <!-- Delete Winery Modal -->
    <AdminModalsDeleteWineryModal
      v-model:open="isDeleteWineryModalOpen"
      :winery-name="deletingWinery?.name"
      :wine-count="deletingWinery?._count.wines"
      @confirmed="handleDeleteConfirmed"
    />
  </div>
</template>
