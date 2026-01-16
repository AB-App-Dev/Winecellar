<script setup lang="ts">
// Admin wines list page with CRUD operations
// Default sorting: production year

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const filterArt = ref('')
const filterCountry = ref('')
const filterTaste = ref('')
const sortField = ref('year')

const artOptions = [
  { label: 'All', value: '' },
  { label: 'Red', value: 'red' },
  { label: 'White', value: 'white' },
  { label: 'Rosé', value: 'rose' },
  { label: 'Sparkling', value: 'sparkling' },
  { label: 'Dessert', value: 'dessert' },
]

const countryOptions = [
  { label: 'All', value: '' },
]

const tasteOptions = [
  { label: 'All', value: '' },
  { label: 'Dry', value: 'dry' },
  { label: 'Semi-dry', value: 'semi-dry' },
  { label: 'Semi-sweet', value: 'semi-sweet' },
  { label: 'Sweet', value: 'sweet' },
]

const sortOptions = [
  { label: 'Production Year', value: 'year' },
  { label: 'Name', value: 'name' },
  { label: 'Price', value: 'price' },
  { label: 'Bottles Amount', value: 'bottlesAmount' },
]

const columns = [
  { id: 'name', header: 'Wine' },
  { id: 'art', header: 'Art' },
  { id: 'year', header: 'Year' },
  { id: 'price', header: 'Price' },
  { id: 'bottlesAmount', header: 'Bottles' },
  { id: 'status', header: 'Status' },
  { id: 'actions', header: 'Actions' },
]

const wines = ref<any[]>([])
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        Wines
      </h1>
      <UButton
        to="/admin/wines/new"
        color="primary"
        icon="i-lucide-plus"
        :ui="{ base: 'cursor-pointer' }"
      >
        Add Wine
      </UButton>
    </div>

    <!-- Filters Section -->
    <UCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UFormField label="Wine Art">
          <USelect
            v-model="filterArt"
            :items="artOptions"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Country">
          <USelect
            v-model="filterCountry"
            :items="countryOptions"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Taste">
          <USelect
            v-model="filterTaste"
            :items="tasteOptions"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Sort by">
          <USelect
            v-model="sortField"
            :items="sortOptions"
            class="w-full"
          />
        </UFormField>
      </div>
    </UCard>

    <!-- Wines Table -->
    <UCard :ui="{ body: 'p-0' }">
      <UTable :columns="columns" :data="wines">
        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-muted">
            <UIcon name="i-lucide-wine-off" class="size-12 mb-4 opacity-50" />
            <p>No wines added yet.</p>
            <UButton
              to="/admin/wines/new"
              color="primary"
              variant="ghost"
              class="mt-4"
              :ui="{ base: 'cursor-pointer' }"
            >
              Add your first wine
            </UButton>
          </div>
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end gap-2">
            <UTooltip text="Edit">
              <UButton
                :to="`/admin/wines/${row.original.id}/edit`"
                color="neutral"
                variant="ghost"
                icon="i-lucide-pencil"
                size="sm"
                :ui="{ base: 'cursor-pointer' }"
              />
            </UTooltip>
            <UTooltip text="Delete">
              <UButton
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                size="sm"
                :ui="{ base: 'cursor-pointer' }"
              />
            </UTooltip>
          </div>
        </template>

        <template #status="{ row }">
          <UBadge
            :color="row.original.hiddenForGuests ? 'warning' : 'success'"
            variant="subtle"
          >
            {{ row.original.hiddenForGuests ? 'Hidden' : 'Visible' }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
