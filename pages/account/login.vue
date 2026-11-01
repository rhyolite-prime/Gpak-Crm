<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
          <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Sign in to GPAK CRM
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Welcome ! Let’s get to work.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
        <form class="space-y-6">
         
         
         <!-- Account Name Field -->
          <div>
            <label for="accountName" class="block text-sm font-medium text-gray-700">
              Account ID:
            </label>
            <div class="mt-1 relative">
              <input
                id="accountName"
                readonly
                v-model="loginForm.accountName"
                name="accountName"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                :class="{ 'border-red-500': errors.accountName }"
                placeholder="Enter Account Name"
              >
              <div v-if="errors.accountName" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <AlertCircle class="h-5 w-5 text-red-500" />
              </div>
            </div>
            <p v-if="errors.accountName" class="mt-1 text-sm text-red-600">{{ errors.accountName }}</p>
          </div>

         
          <!-- Email Field -->
          <div>
            <label for="userNameOrEmailAddress" class="block text-sm font-medium text-gray-700">
              Username or Email:
            </label>
            <div class="mt-1 relative">
              <input
                id="userNameOrEmailAddress"
                v-model="loginForm.userNameOrEmailAddress"
                name="userNameOrEmailAddress"
                type="text"
                autocomplete="username"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                :class="{ 'border-red-500': errors.userNameOrEmailAddress }"
                placeholder="Enter username or email"
              >
              <div v-if="errors.userNameOrEmailAddress" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <AlertCircle class="h-5 w-5 text-red-500" />
              </div>
            </div>
            <p v-if="errors.userNameOrEmailAddress" class="mt-1 text-sm text-red-600">{{ errors.userNameOrEmailAddress }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="loginForm.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                :class="{ 'border-red-500': errors.password }"
                placeholder="Enter your password"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                <EyeOff v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="loginForm.rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-red-600 hover:text-red-500 transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Login Button -->
          <div>
            <button
              type="button" v-on:click="handleLogin"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span v-if="!isLoading" class="flex items-center">
                <LogIn class="w-4 h-4 mr-2" />
                Sign in
              </span>
              <span v-else class="flex items-center">
                <div class="loader mr-2"></div>
                Signing in...
              </span>
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="showError" class="rounded-lg bg-red-50 p-4 border border-red-200">
            <div class="flex">
              <div class="flex-shrink-0">
                <AlertCircle class="h-5 w-5 text-red-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Login Failed
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ errorMessage }}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
        
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

import { 
  LogIn, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from 'lucide-vue-next'


const { getBusinessAuth } = useAuth();

// Remove default layout for login page
definePageMeta({
  layout: false,
  middleware: []
})

// Reactive data
const showPassword = ref(false)
const isLoading = ref(false);
const showError = ref(false);
const errorMessage = ref('');


const loginForm = ref({
  accountName: 'GPAK',
  userNameOrEmailAddress: '',
  password: '',
  rememberMe: false
})

const errors = ref({
  userNameOrEmailAddress: '',
  password: ''
})

// Check if already authenticated
onMounted(() => {
   
})

// Validation function
const validateForm = () => {
  errors.value = { userNameOrEmailAddress: '', password: '' }
  let isValid = true

  if (!loginForm.value.userNameOrEmailAddress) {
    errors.value.userNameOrEmailAddress = 'Username or email is required'
    isValid = false
  } else if (loginForm.value.userNameOrEmailAddress.length < 3) {
    errors.value.userNameOrEmailAddress = 'Username must be at least 6 characters'
    isValid = false
  }

  if (!loginForm.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (loginForm.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

// Login handler
const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true;

  try {
        const loginResponse = await getBusinessAuth(loginForm.value);

        isLoading.value = false;

    } catch (error) {

      console.log(error)
      isLoading.value = false;
      showError.value = true;
      errorMessage.value = 'Invalid user name or password';


    }
    finally {
        isLoading.value = false;
     }
}
</script>