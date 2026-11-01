<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gray-50 overflow-hidden">
      <!-- Background Decorative Elements -->
      <div class="absolute inset-y-0 right-0 w-1/2 bg-red-50 rounded-l-full transform translate-x-1/3 -translate-y-1/4 opacity-50"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            Premium <span class="text-primary">Printing & Packaging</span> Solutions
          </h1>
          <p class="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            G-Pak Limited, a subsidiary of the Graphic Communications Group, delivers world-class commercial printing and packaging services tailored to elevate your brand.
          </p>
          <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
            <NuxtLink to="/requests" class="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Place a Request
            </NuxtLink>
            <a href="#services" class="w-full sm:w-auto bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
              Explore Services
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
            From high-volume commercial printing to bespoke packaging designs, we bring your vision to life with precision and quality.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Service 1 -->
          <div class="group p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Printer class="w-7 h-7 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Commercial Printing</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Magazines, annual reports, brochures, calendars, and flyers printed with vibrant colors and crisp details.
            </p>
          </div>

          <!-- Service 2 -->
          <div class="group p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Package class="w-7 h-7 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Packaging Solutions</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Custom boxes, folding cartons, labels, and product packaging designed to make your products stand out on the shelf.
            </p>
          </div>

          <!-- Service 3 -->
          <div class="group p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Image class="w-7 h-7 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Large Format</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Banners, posters, billboards, and signage printed on durable materials for maximum impact and visibility.
            </p>
          </div>

          <!-- Service 4 -->
          <div class="group p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers class="w-7 h-7 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Finishing Services</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Binding, lamination, die-cutting, foiling, and embossing to give your prints that premium, professional touch.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-24 bg-gray-50 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="lg:w-1/2">
            <div class="relative">
              <div class="absolute inset-0 bg-primary rounded-2xl transform translate-x-4 translate-y-4 opacity-20"></div>
              <img src="https://images.unsplash.com/photo-1620021966591-628d0113f8d8?auto=format&fit=crop&w=800&q=80" alt="Printing Press" class="rounded-2xl relative z-10 shadow-lg object-cover h-[400px] w-full" />
            </div>
          </div>
          <div class="lg:w-1/2">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Trusted by Brands Nationwide</h2>
            <p class="text-gray-600 mb-6 text-lg leading-relaxed">
              As a proud subsidiary of the Graphic Communications Group Limited, G-Pak inherits a legacy of excellence, reliability, and unparalleled quality in the printing industry.
            </p>
            <p class="text-gray-600 mb-8 leading-relaxed">
              We leverage state-of-the-art technology and a team of dedicated professionals to process your estimates, quotations, and production jobs with speed and precision. Our commitment is to ensure your complete satisfaction at every step.
            </p>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <p class="text-3xl font-bold text-primary mb-1">20+</p>
                <p class="text-sm font-medium text-gray-700">Years Experience</p>
              </div>
              <div>
                <p class="text-3xl font-bold text-primary mb-1">10k+</p>
                <p class="text-sm font-medium text-gray-700">Projects Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="bg-primary py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
        <p class="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
          Submit your requirements through our seamless request system and let our team provide you with a fast, accurate estimate.
        </p>
        <NuxtLink to="/requests" class="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-md text-lg font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Place a Request Now <ArrowRight class="w-5 h-5" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Printer, Package, Image, Layers, ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'website',
  middleware: [] // ensure auth middleware doesn't trigger if globally applied
})

useHead({
  title: 'Home | G-Pak Limited - Premium Printing & Packaging',
  meta: [
    { name: 'description', content: 'G-Pak Limited provides premium printing and packaging solutions.' }
  ]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Sora', sans-serif;
}
</style>
