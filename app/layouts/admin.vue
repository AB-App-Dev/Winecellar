<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// Admin layout with sidebar navigation

const authStore = useAuthStore()

const navItems: NavigationMenuItem[] = [
  { label: 'Dashboard', to: '/admin', icon: 'i-lucide-layout-dashboard', exact: true },
  { label: 'Weine', to: '/admin/wines', icon: 'i-lucide-wine' },
  { label: 'Weingüter', to: '/admin/wineries', icon: 'i-lucide-warehouse' },
  { label: 'Lieferanten', to: '/admin/suppliers', icon: 'i-lucide-truck' },
]
</script>

<template>
  <div class="min-h-screen bg-default">
    <!-- Admin Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 z-40 bg-elevated border-r border-default">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 border-b border-default">
          <NuxtLink to="/admin" class="text-xl font-bold text-highlighted">
            Weinkeller Admin
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-6">
          <UNavigationMenu
            :items="navItems"
            orientation="vertical"
            highlight
            class="w-full mb-4"
            :ui="{ item: 'mb-3' }"
          />
        </nav>
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
          <UPopover
            :content="{
              align: 'end',
              side: 'bottom',
              sideOffset: 8
            }"
          >
            <UAvatar icon="i-lucide-circle-user-round" class="text-lg cursor-pointer" />
            <template #content>
              <div class="p-2 min-w-48">
                <div v-if="authStore.user" class="px-2 py-1.5 text-sm font-medium text-highlighted">
                  <UAvatar icon="i-lucide-circle-user-round" class="text-lg" /> {{ authStore.user.name }}
                </div>
                <USeparator class="my-2" />
                <NuxtLink
                  to="/_swagger"
                  target="_blank"
                  class="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-muted hover:text-highlighted cursor-pointer"
                >
                  <UIcon name="i-lucide-file-code" />
                  Swagger UI
                </NuxtLink>
                <NuxtLink
                  to="/_openapi.json"
                  target="_blank"
                  class="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-muted hover:text-highlighted cursor-pointer"
                >
                  <UIcon name="i-lucide-braces" />
                  OpenAPI JSON
                </NuxtLink>
                <USeparator class="my-2" />
                <ULink
                  class="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-muted hover:text-highlighted cursor-pointer focus:outline-none focus-visible:outline-none"
                  :inactive-class="'no-underline'"
                  @click="authStore.logout"
                >
                  <UIcon name="i-lucide-circle-arrow-out-up-right" />
                  Logout
                </ULink>
              </div>
            </template>
          </UPopover>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
