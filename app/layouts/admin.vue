<script setup lang="ts">
// Admin layout with sidebar navigation

const authStore = useAuthStore()
const route = useRoute()

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: 'i-lucide-layout-dashboard' },
  { label: 'Wines', to: '/admin/wines', icon: 'i-lucide-wine' },
  { label: 'Wineries', to: '/admin/wineries', icon: 'i-lucide-warehouse' },
  { label: 'Suppliers', to: '/admin/suppliers', icon: 'i-lucide-truck' },
]

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-default">
    <!-- Admin Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 z-40 bg-elevated border-r border-default">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 border-b border-default">
          <NuxtLink to="/admin" class="text-xl font-bold text-highlighted">
            WineCellar Admin
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-6 space-y-1">
          <UButton
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            variant="ghost"
            block
            :ui="{
              base: `cursor-pointer justify-start ${isActive(item.to) ? 'bg-primary text-white hover:bg-primary-600' : 'text-muted hover:bg-accented hover:text-highlighted'}`
            }"
          >
            <template #leading>
              <UIcon :name="item.icon" class="size-5" />
            </template>
            {{ item.label }}
          </UButton>
        </nav>

        <!-- User Info & Logout -->
        <div class="px-3 py-4 border-t border-default">
          <div v-if="authStore.user" class="mb-3 px-4 flex items-center gap-2 text-sm text-muted">
            <UIcon name="i-lucide-user" class="size-4" />
            {{ authStore.user.name }}
          </div>
          <UButton
            block
            color="neutral"
            variant="ghost"
            icon="i-lucide-log-out"
            :ui="{ base: 'cursor-pointer justify-start' }"
            @click="authStore.logout"
          >
            Logout
          </UButton>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Bar -->
      <header class="bg-elevated shadow-sm h-16 flex items-center justify-between px-6">
        <h1 class="text-lg font-semibold text-highlighted">
          Admin Panel
        </h1>
        <div class="flex items-center gap-2">
          <UTooltip text="Theme">
            <UColorModeButton
              :ui="{
                base: 'bg-transparent hover:bg-transparent text-muted hover:text-primary cursor-pointer'
              }"
            />
          </UTooltip>
          <UTooltip text="View site">
            <UButton
              to="/"
              color="neutral"
              variant="ghost"
              icon="i-lucide-external-link"
              :ui="{ base: 'cursor-pointer' }"
            />
          </UTooltip>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
  </UApp>
</template>
