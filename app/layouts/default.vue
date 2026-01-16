<script setup lang="ts">

const route = useRoute()
</script>

<template>
  <UPage class="bg-default">
    <!-- Guest Header -->
    <UHeader
      :ui="{
        root: 'fixed top-0 left-0 right-0 z-50 bg-default/10 backdrop-blur-sm'
      }"
    >
    <template #title>
      <img src="/logo.png" alt="WineCellar" class="h-10 w-auto" />
    </template>

    <template #right>
      <UTooltip text="Theme">
        <UColorModeButton
          :ui="{
            base: 'bg-transparent hover:bg-transparent text-white hover:text-primary cursor-pointer'
          }"
        />
      </UTooltip>

      <UTooltip text="Login">
        <UButton
          variant="ghost"
          to="/admin/login"
          icon="i-lucide-log-in"
          aria-label="Login"
          :ui="{
            base: 'bg-transparent hover:bg-transparent text-white hover:text-primary'
          }"
        />
      </UTooltip>
    </template>
  </UHeader>

  <UPageHero
    title="Jede Flasche erzählt ihre eigene Geschichte"
    description="sorgfältig ausgewählt für anspruchsvolle Genießer"
    :ui="{
      root: 'bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black/60',
      container: 'relative z-10',
      title: 'text-white',
      description: 'text-white'
    }"
    :style="{ backgroundImage: 'url(/hero_bg.jpg)' }"
  />

    <!-- Main Content -->
    <main class="py-8">
      <UContainer>
        <slot />
      </UContainer>
    </main>

    <!-- Footer -->
    <footer class="border-t border-default">
      <UContainer>
        <p class="text-center text-muted text-sm py-4">
          &copy; {{ new Date().getFullYear() }} WineCellar
        </p>
      </UContainer>
    </footer>
  </UPage>
</template>
