<template>
  <div class="min-h-screen flex flex-col bg-white">
    <WebsiteNavbar />
    
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <WebsiteFooter />
  </div>
</template>

<script setup lang="ts">
// Website Layout
</script>

<style>
/* Global styles for website can go here */
html {
  scroll-behavior: smooth;
}
</style>
