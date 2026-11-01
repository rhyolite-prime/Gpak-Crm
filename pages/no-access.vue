
<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div class="flex justify-center">
        <div class="bg-red-100 p-4 rounded-full">
          <ShieldAlert class="w-16 h-16 text-red-600" />
        </div>
      </div>
      
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          You don't have the required permissions to view this page. If you believe this is a mistake, please contact your system administrator.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
        <button @click="router.back()" class="btn-secondary flex items-center space-x-2 w-full sm:w-auto justify-center">
          <ArrowLeft class="w-4 h-4" />
          <span>Go Back</span>
        </button>
        
        <NuxtLink to="/" class="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center">
          <Home class="w-4 h-4" />
          <span>Back to Dashboard</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert, ArrowLeft, Home } from 'lucide-vue-next';

definePageMeta({
  layout: 'default',
  // You can exclude this from the auth middleware or keep it so only logged-in users see it
  middleware: 'auth' 
})

const router = useRouter();

useHead({
  title: 'Access Denied'
})
</script>