<template>
  <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/home" class="flex items-center gap-3">
            <img class="h-10 w-auto" src="~/assets/img/gpak.jpeg" alt="G-Pak Limited" />
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/home" class="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Home
          </NuxtLink>
          <a href="#services" class="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Services
          </a>
          <a href="#about" class="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            About Us
          </a>
        </nav>

        <!-- CTA Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <NuxtLink to="/account/login" class="text-gray-500 hover:text-primary text-sm font-medium transition-colors flex items-center gap-1">
            <User class="w-4 h-4" /> CRM Login
          </NuxtLink>
          <NuxtLink to="/requests" class="bg-primary text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm">
            Place Request
          </NuxtLink>
        </div>

        <!-- Mobile menu button -->
        <div class="flex md:hidden items-center">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" class="text-gray-500 hover:text-primary focus:outline-none">
            <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-100">
      <div class="px-4 pt-2 pb-4 space-y-1 sm:px-3">
        <NuxtLink @click="isMobileMenuOpen = false" to="/home" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">
          Home
        </NuxtLink>
        <a @click="isMobileMenuOpen = false" href="#services" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">
          Services
        </a>
        <a @click="isMobileMenuOpen = false" href="#about" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">
          About Us
        </a>
        <div class="pt-4 border-t border-gray-100 flex flex-col gap-3">
          <NuxtLink to="/account/login" class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-primary">
            CRM Login
          </NuxtLink>
          <NuxtLink to="/requests" class="block w-full text-center bg-primary text-white px-5 py-3 rounded-md text-base font-semibold hover:bg-red-700">
            Place Request
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, User } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

* {
  font-family: 'Sora', sans-serif;
}
</style>
