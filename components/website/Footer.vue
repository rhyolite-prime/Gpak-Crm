<template>
  <footer class="bg-gray-900 text-white pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-1">
          <div class="bg-white p-2 rounded-md inline-block mb-4">
             <img class="h-8 w-auto" src="~/assets/img/gpak.jpeg" alt="G-Pak Limited" />
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">
            G-Pak Limited, a subsidiary of the Graphic Communications Group Limited, providing premium printing and packaging solutions for businesses of all sizes.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/home" class="text-gray-400 hover:text-primary transition-colors text-sm">Home</NuxtLink></li>
            <li><a href="/home#services" class="text-gray-400 hover:text-primary transition-colors text-sm">Our Services</a></li>
            <li><a href="/home#about" class="text-gray-400 hover:text-primary transition-colors text-sm">About Us</a></li>
            <li><NuxtLink to="/requests" class="text-gray-400 hover:text-primary transition-colors text-sm">Place a Request</NuxtLink></li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-white">Services</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li>Commercial Printing</li>
            <li>Packaging Solutions</li>
            <li>Digital & Large Format</li>
            <li>Finishing Options</li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-white">Contact Us</h4>
          <ul class="space-y-4">
            <li class="flex items-start gap-3 text-sm text-gray-400">
              <MapPin class="w-5 h-5 text-primary flex-shrink-0" />
              <span>Graphic Road, Accra, Ghana<br/>P.O. Box 742</span>
            </li>
            <li class="flex items-center gap-3 text-sm text-gray-400">
              <Phone class="w-5 h-5 text-primary flex-shrink-0" />
              <span>+233 (0) 302 684 001</span>
            </li>
            <li class="flex items-center gap-3 text-sm text-gray-400">
              <Mail class="w-5 h-5 text-primary flex-shrink-0" />
              <span>info@graphic.com.gh</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-500 text-center md:text-left mb-4 md:mb-0">
          &copy; {{ new Date().getFullYear() }} G-Pak Limited. All rights reserved.
        </p>
        <div class="flex space-x-4">
          <!-- Social Icons Placeholder -->
          <a href="#" class="text-gray-500 hover:text-white transition-colors">
            <Facebook class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-500 hover:text-white transition-colors">
            <Twitter class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-500 hover:text-white transition-colors">
            <Instagram class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-vue-next'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

* {
  font-family: 'Sora', sans-serif;
}
</style>
