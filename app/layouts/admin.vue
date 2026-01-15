<script setup lang="ts">
// Admin layout with sidebar navigation

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Admin Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-gray-800 dark:bg-gray-950">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 bg-gray-900">
          <NuxtLink to="/admin" class="text-xl font-bold text-white">
            WineCellar Admin
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <NuxtLink
            to="/admin"
            class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/admin/wines"
            class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
          >
            Wines
          </NuxtLink>
          <NuxtLink
            to="/admin/wineries"
            class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
          >
            Wineries
          </NuxtLink>
          <NuxtLink
            to="/admin/suppliers"
            class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
          >
            Suppliers
          </NuxtLink>
        </nav>

        <!-- User Info & Logout -->
        <div class="px-4 py-4 border-t border-gray-700">
          <div v-if="authStore.user" class="mb-3 px-4 text-sm text-gray-400">
            {{ authStore.user.name }}
          </div>
          <button
            class="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
            @click="authStore.logout"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Bar -->
      <header class="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center px-6">
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
          Admin Panel
        </h1>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
