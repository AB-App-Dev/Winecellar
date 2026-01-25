<script setup lang="ts">
import { getCountryLabel } from '~/utils/wineOptions'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface Supplier {
  id: string
  name: string
  address: string | null
  post: string | null
  city: string | null
  land: string | null
  phone: string | null
  email: string | null
  website: string | null
}

const suppliers = ref<Supplier[]>([])
const isLoading = ref(false)
const toast = useToast()

const isNewSupplierModalOpen = ref(false)
const isEditSupplierModalOpen = ref(false)
const isDeleteSupplierModalOpen = ref(false)
const editingSupplier = ref<Supplier | null>(null)
const deletingSupplier = ref<Supplier | null>(null)
const expandedRows = ref<Set<string>>(new Set())

function toggleRow(id: string) {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
}

async function fetchSuppliers() {
  isLoading.value = true
  try {
    suppliers.value = await $fetch('/api/suppliers')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSuppliers()
})

async function handleSupplierCreated() {
  await fetchSuppliers()
}

function openEditModal(supplier: Supplier) {
  editingSupplier.value = supplier
  isEditSupplierModalOpen.value = true
}

async function handleSupplierUpdated() {
  await fetchSuppliers()
}

function openDeleteModal(supplier: Supplier) {
  deletingSupplier.value = supplier
  isDeleteSupplierModalOpen.value = true
}

async function handleDeleteConfirmed() {
  if (!deletingSupplier.value) return

  const supplierName = deletingSupplier.value.name
  try {
    await $fetch(`/api/suppliers/${deletingSupplier.value.id}`, { method: 'DELETE' })
    toast.add({
      title: 'Lieferant gelöscht',
      description: `"${supplierName}" wurde erfolgreich gelöscht.`,
      color: 'success',
    })
    deletingSupplier.value = null
    await fetchSuppliers()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fehler beim Löschen des Lieferanten'
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
        Lieferanten
      </h1>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        :ui="{ base: 'cursor-pointer' }"
        @click="isNewSupplierModalOpen = true"
      />
    </div>

    <!-- Suppliers Table -->
    <UCard>
      <div v-if="isLoading" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-primary" />
      </div>
      <div v-else-if="suppliers.length === 0" class="flex flex-col items-center justify-center py-12 text-muted">
        <UIcon name="i-lucide-truck" class="size-12 mb-4 opacity-50" />
        <p>Noch keine Lieferanten hinzugefügt.</p>
        <UButton
          color="primary"
          variant="ghost"
          class="mt-4"
          :ui="{ base: 'cursor-pointer' }"
          @click="isNewSupplierModalOpen = true"
        >
          Ersten Lieferanten hinzufügen
        </UButton>
      </div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="p-3 w-8"></th>
            <th class="text-left p-3">Name</th>
            <th class="text-left p-3">Stadt</th>
            <th class="text-left p-3">Land</th>
            <th class="text-left p-3">Telefon</th>
            <th class="p-3"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="supplier in suppliers" :key="supplier.id">
            <tr
              class="border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors"
              @click="toggleRow(supplier.id)"
            >
              <td class="p-3">
                <UIcon
                  :name="expandedRows.has(supplier.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                  class="size-4 text-muted"
                />
              </td>
              <td class="p-3">{{ supplier.name }}</td>
              <td class="p-3">{{ supplier.city || '-' }}</td>
              <td class="p-3">{{ supplier.land ? getCountryLabel(supplier.land) : '-' }}</td>
              <td class="p-3">{{ supplier.phone || '-' }}</td>
              <td class="p-3" @click.stop>
                <div class="flex justify-end gap-2">
                  <UButton
                    color="primary"
                    variant="ghost"
                    icon="i-lucide-pencil"
                    size="sm"
                    :ui="{ base: 'cursor-pointer' }"
                    @click="openEditModal(supplier)"
                  />
                  <UButton
                    color="error"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    size="sm"
                    :ui="{ base: 'cursor-pointer' }"
                    @click="openDeleteModal(supplier)"
                  />
                </div>
              </td>
            </tr>
            <tr v-if="expandedRows.has(supplier.id)" class="bg-gray-800/30">
              <td colspan="6" class="p-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="text-muted">Adresse:</span>
                    <span class="ml-2">{{ supplier.address || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-muted">PLZ:</span>
                    <span class="ml-2">{{ supplier.post || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-muted">Stadt:</span>
                    <span class="ml-2">{{ supplier.city || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-muted">Land:</span>
                    <span class="ml-2">{{ supplier.land ? getCountryLabel(supplier.land) : '-' }}</span>
                  </div>
                  <div>
                    <span class="text-muted">Telefon:</span>
                    <span class="ml-2">{{ supplier.phone || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-muted">E-Mail:</span>
                    <span class="ml-2">
                      <a v-if="supplier.email" :href="`mailto:${supplier.email}`" class="text-primary hover:underline">
                        {{ supplier.email }}
                      </a>
                      <template v-else>-</template>
                    </span>
                  </div>
                  <div class="col-span-2">
                    <span class="text-muted">Website:</span>
                    <span class="ml-2">
                      <a v-if="supplier.website" :href="supplier.website" target="_blank" class="text-primary hover:underline">
                        {{ supplier.website }}
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

    <!-- New Supplier Modal -->
    <AdminModalsNewSupplierModal
      v-model:open="isNewSupplierModalOpen"
      @created="handleSupplierCreated"
    />

    <!-- Edit Supplier Modal -->
    <AdminModalsEditSupplierModal
      v-model:open="isEditSupplierModalOpen"
      :supplier="editingSupplier"
      @updated="handleSupplierUpdated"
    />

    <!-- Delete Supplier Modal -->
    <AdminModalsDeleteSupplierModal
      v-model:open="isDeleteSupplierModalOpen"
      :supplier-name="deletingSupplier?.name"
      @confirmed="handleDeleteConfirmed"
    />
  </div>
</template>
