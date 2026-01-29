<script setup lang="ts">
import { countryOptions } from '~/utils/wineOptions'

// Admin Dashboard page

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface WineTypeStats {
  count: number
  bottles: number
  value: number
}

interface LandStats {
  land: string
  count: number
  bottles: number
  value: number
}

interface WineStats {
  byType: {
    RED: WineTypeStats
    WHITE: WineTypeStats
    ROSE: WineTypeStats
    ORANGE: WineTypeStats
    SPARKLING: WineTypeStats
    DESSERT: WineTypeStats
  }
  byTaste: {
    DRY: WineTypeStats
    SEMI_DRY: WineTypeStats
    SEMI_SWEET: WineTypeStats
    SWEET: WineTypeStats
  }
  byLand: LandStats[]
  totals: {
    count: number
    bottles: number
    value: number
  }
}

const { data: stats, status } = await useFetch<WineStats>('/api/stats/wines')

const wineTypes = [
  { key: 'RED', label: 'Rot', icon: 'i-lucide-wine', color: 'text-red-500', bgColor: 'bg-red-500/10', hex: '#ef4444' },
  { key: 'WHITE', label: 'Weiß', icon: 'i-lucide-wine', color: 'text-amber-300', bgColor: 'bg-amber-300/10', hex: '#fcd34d' },
  { key: 'ROSE', label: 'Rosé', icon: 'i-lucide-wine', color: 'text-pink-400', bgColor: 'bg-pink-400/10', hex: '#f472b6' },
  { key: 'ORANGE', label: 'Orange', icon: 'i-lucide-wine', color: 'text-orange-500', bgColor: 'bg-orange-500/10', hex: '#f97316' },
  { key: 'SPARKLING', label: 'Schaumwein', icon: 'i-lucide-sparkles', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', hex: '#facc15' },
  { key: 'DESSERT', label: 'Dessertwein', icon: 'i-lucide-candy', color: 'text-amber-600', bgColor: 'bg-amber-600/10', hex: '#d97706' },
] as const

const wineTastes = [
  { key: 'DRY', label: 'Trocken', hex: '#3b82f6' },
  { key: 'SEMI_DRY', label: 'Halbtrocken', hex: '#22c55e' },
  { key: 'SEMI_SWEET', label: 'Lieblich', hex: '#a855f7' },
  { key: 'SWEET', label: 'Süß', hex: '#ec4899' },
] as const

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function getTypeStat(key: string): WineTypeStats {
  if (!stats.value) return { count: 0, bottles: 0, value: 0 }
  return stats.value.byType[key as keyof typeof stats.value.byType]
}

function getTasteStat(key: string): WineTypeStats {
  if (!stats.value) return { count: 0, bottles: 0, value: 0 }
  return stats.value.byTaste[key as keyof typeof stats.value.byTaste]
}

// Pie chart computed
const pieChartStyle = computed(() => {
  if (!stats.value || stats.value.totals.count === 0) {
    return { background: 'var(--ui-bg-elevated)' }
  }

  const segments: string[] = []
  let currentAngle = 0

  for (const type of wineTypes) {
    const count = getTypeStat(type.key).count
    if (count === 0) continue

    const percentage = (count / stats.value.totals.count) * 100
    const endAngle = currentAngle + (percentage * 3.6) // 3.6 = 360/100

    segments.push(`${type.hex} ${currentAngle}deg ${endAngle}deg`)
    currentAngle = endAngle
  }

  return {
    background: segments.length > 0
      ? `conic-gradient(${segments.join(', ')})`
      : 'var(--ui-bg-elevated)'
  }
})

// Filter wine types with count > 0 for legend
const activeWineTypes = computed(() => {
  if (!stats.value) return []
  return wineTypes.filter(t => getTypeStat(t.key).count > 0)
})

// Pie chart hover state
const hoveredSegment = ref<typeof wineTypes[number] | null>(null)
const tooltipPosition = ref({ x: 0, y: 0 })

function handlePieHover(event: MouseEvent) {
  if (!stats.value || stats.value.totals.count === 0) return

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const x = event.offsetX - centerX
  const y = event.offsetY - centerY

  // Calculate angle (0° at top, clockwise)
  let angle = Math.atan2(x, -y) * (180 / Math.PI)
  if (angle < 0) angle += 360

  // Find which segment this angle falls into
  let currentAngle = 0
  for (const type of wineTypes) {
    const count = getTypeStat(type.key).count
    if (count === 0) continue

    const segmentAngle = (count / stats.value.totals.count) * 360
    if (angle >= currentAngle && angle < currentAngle + segmentAngle) {
      hoveredSegment.value = type
      tooltipPosition.value = { x: event.clientX, y: event.clientY }
      return
    }
    currentAngle += segmentAngle
  }
}

function handlePieLeave() {
  hoveredSegment.value = null
}

// Taste pie chart computed
const tastePieChartStyle = computed(() => {
  if (!stats.value || stats.value.totals.count === 0) {
    return { background: 'var(--ui-bg-elevated)' }
  }

  const segments: string[] = []
  let currentAngle = 0

  for (const taste of wineTastes) {
    const count = getTasteStat(taste.key).count
    if (count === 0) continue

    const percentage = (count / stats.value.totals.count) * 100
    const endAngle = currentAngle + (percentage * 3.6)

    segments.push(`${taste.hex} ${currentAngle}deg ${endAngle}deg`)
    currentAngle = endAngle
  }

  return {
    background: segments.length > 0
      ? `conic-gradient(${segments.join(', ')})`
      : 'var(--ui-bg-elevated)'
  }
})

// Filter wine tastes with count > 0 for legend
const activeWineTastes = computed(() => {
  if (!stats.value) return []
  return wineTastes.filter(t => getTasteStat(t.key).count > 0)
})

// Taste pie chart hover state
const hoveredTasteSegment = ref<typeof wineTastes[number] | null>(null)
const tasteTooltipPosition = ref({ x: 0, y: 0 })

function handleTastePieHover(event: MouseEvent) {
  if (!stats.value || stats.value.totals.count === 0) return

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const x = event.offsetX - centerX
  const y = event.offsetY - centerY

  let angle = Math.atan2(x, -y) * (180 / Math.PI)
  if (angle < 0) angle += 360

  let currentAngle = 0
  for (const taste of wineTastes) {
    const count = getTasteStat(taste.key).count
    if (count === 0) continue

    const segmentAngle = (count / stats.value.totals.count) * 360
    if (angle >= currentAngle && angle < currentAngle + segmentAngle) {
      hoveredTasteSegment.value = taste
      tasteTooltipPosition.value = { x: event.clientX, y: event.clientY }
      return
    }
    currentAngle += segmentAngle
  }
}

function handleTastePieLeave() {
  hoveredTasteSegment.value = null
}

// Bar chart for countries
const maxLandCount = computed(() => {
  if (!stats.value || stats.value.byLand.length === 0) return 1
  return stats.value.byLand[0].count
})

// Get short country/region label for chart display
function getCountryName(code: string): string {
  const option = countryOptions.find(o => o.value === code)
  if (!option) return code
  // For Austrian regions, show just the region name
  if (option.label.includes(' - ')) {
    return option.label.split(' - ')[1]
  }
  return option.label
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-highlighted mb-6">
      Übersicht
    </h1>

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-muted" />
    </div>

    <template v-else-if="stats">
      <!-- Totals Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted">Weine gesamt</p>
              <p class="text-3xl font-bold text-highlighted mt-2">{{ stats.totals.count }}</p>
            </div>
            <div class="p-3 bg-primary/10 rounded-lg">
              <UIcon name="i-lucide-wine" class="size-6 text-primary" />
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted">Flaschen gesamt</p>
              <p class="text-3xl font-bold text-highlighted mt-2">{{ stats.totals.bottles }}</p>
            </div>
            <div class="p-3 bg-blue-500/10 rounded-lg">
              <UIcon name="i-lucide-package" class="size-6 text-blue-500" />
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted">Gesamtwert</p>
              <p class="text-3xl font-bold text-highlighted mt-2">{{ formatCurrency(stats.totals.value) }}</p>
            </div>
            <div class="p-3 bg-emerald-500/10 rounded-lg">
              <UIcon name="i-lucide-euro" class="size-6 text-emerald-500" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Stats by Wine Type -->
      <h2 class="text-lg font-semibold text-highlighted mb-4">Nach Weinart</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <UCard v-for="type in wineTypes" :key="type.key">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg" :class="type.bgColor">
                <UIcon :name="type.icon" class="size-5" :class="type.color" />
              </div>
              <span class="font-semibold text-highlighted">{{ type.label }}</span>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-muted">Weine</span>
                <span class="font-medium text-highlighted">{{ getTypeStat(type.key).count }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">Flaschen</span>
                <span class="font-medium text-highlighted">{{ getTypeStat(type.key).bottles }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">Wert</span>
                <span class="font-medium text-highlighted">{{ formatCurrency(getTypeStat(type.key).value) }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weine nach Art -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-highlighted">
              Weine nach Art
            </h3>
          </template>
          <div class="flex flex-col items-center gap-4 py-2">
            <!-- Legend (horizontal, above chart) -->
            <div class="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <UTooltip
                v-for="type in activeWineTypes"
                :key="type.key"
                :text="`${getTypeStat(type.key).count} Weine`"
              >
                <div class="flex items-center gap-1.5 cursor-default">
                  <span
                    class="size-2.5 rounded-full"
                    :style="{ backgroundColor: type.hex }"
                  />
                  <span class="text-sm text-muted">{{ type.label }}</span>
                </div>
              </UTooltip>
            </div>
            <!-- Pie Chart -->
            <div
              class="size-56 rounded-full cursor-default"
              :style="pieChartStyle"
              @mousemove="handlePieHover"
              @mouseleave="handlePieLeave"
            />
            <!-- Tooltip -->
            <Teleport to="body">
              <div
                v-if="hoveredSegment"
                class="fixed z-50 px-2.5 py-1.5 text-sm bg-elevated rounded-md shadow-lg border border-default pointer-events-none"
                :style="{
                  left: `${tooltipPosition.x + 12}px`,
                  top: `${tooltipPosition.y - 12}px`
                }"
              >
                <span class="font-medium text-highlighted">{{ hoveredSegment.label }}:</span>
                <span class="text-muted ml-1">{{ getTypeStat(hoveredSegment.key).count }} Weine</span>
              </div>
            </Teleport>
          </div>
        </UCard>

        <!-- Weine nach Geschmack -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-highlighted">
              Weine nach Geschmack
            </h3>
          </template>
          <div class="flex flex-col items-center gap-4 py-2">
            <!-- Legend (horizontal, above chart) -->
            <div class="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <UTooltip
                v-for="taste in activeWineTastes"
                :key="taste.key"
                :text="`${getTasteStat(taste.key).count} Weine`"
              >
                <div class="flex items-center gap-1.5 cursor-default">
                  <span
                    class="size-2.5 rounded-full"
                    :style="{ backgroundColor: taste.hex }"
                  />
                  <span class="text-sm text-muted">{{ taste.label }}</span>
                </div>
              </UTooltip>
            </div>
            <!-- Pie Chart -->
            <div
              class="size-56 rounded-full cursor-default"
              :style="tastePieChartStyle"
              @mousemove="handleTastePieHover"
              @mouseleave="handleTastePieLeave"
            />
            <!-- Tooltip -->
            <Teleport to="body">
              <div
                v-if="hoveredTasteSegment"
                class="fixed z-50 px-2.5 py-1.5 text-sm bg-elevated rounded-md shadow-lg border border-default pointer-events-none"
                :style="{
                  left: `${tasteTooltipPosition.x + 12}px`,
                  top: `${tasteTooltipPosition.y - 12}px`
                }"
              >
                <span class="font-medium text-highlighted">{{ hoveredTasteSegment.label }}:</span>
                <span class="text-muted ml-1">{{ getTasteStat(hoveredTasteSegment.key).count }} Weine</span>
              </div>
            </Teleport>
          </div>
        </UCard>

        <!-- Weine nach Land -->
        <UCard class="lg:col-span-2">
          <template #header>
            <h3 class="text-lg font-semibold text-highlighted">
              Weine nach Land
            </h3>
          </template>
          <div v-if="stats.byLand.length > 0" class="py-2">
            <div class="flex items-end gap-2 h-48">
              <div
                v-for="landStat in stats.byLand"
                :key="landStat.land"
                class="flex-1 flex flex-col items-center h-full"
              >
                <span class="text-xs font-medium text-highlighted mb-1">{{ landStat.count }}</span>
                <div class="w-full flex-1 flex flex-col justify-end">
                  <div
                    class="w-full bg-primary rounded-t-md transition-all duration-300 min-h-1"
                    :style="{ height: `${(landStat.count / maxLandCount) * 100}%` }"
                  />
                </div>
                <span class="text-xs text-muted text-center truncate w-full mt-2">{{ getCountryName(landStat.land) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="h-64 flex items-center justify-center text-muted">
            <div class="text-center">
              <UIcon name="i-lucide-globe" class="size-12 mb-2 opacity-50" />
              <p>Keine Daten vorhanden</p>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </div>
</template>
