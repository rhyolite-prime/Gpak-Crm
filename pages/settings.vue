<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      <p class="text-sm text-gray-500 mt-1">Manage your account and application preferences</p>
    </div>

    <!-- Settings Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <nav class="space-y-1">
            <button 
              v-for="section in settingSections" 
              :key="section.id"
              @click="activeSection = section.id"
              class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="activeSection === section.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'"
            >
              <component :is="section.icon" class="w-4 h-4 inline mr-2" />
              {{ section.name }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-2">
        <!-- Profile Settings -->
        <div v-if="activeSection === 'profile' && userInfo && tenantInfo" class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div class="space-y-4">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  v-model="userInfo.name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  v-model="userInfo.surname"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
            </div>


            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="text" 
                  v-model="userInfo.emailAddress"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Account</label>
                <input 
                  type="text" 
                  readonly
                  v-model="tenantInfo.name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
            </div>

            
            <button class="btn-primary">
              Save Changes
            </button>
          </div>
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeSection === 'notifications'" class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p class="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Push Notifications</h4>
                <p class="text-sm text-gray-500">Receive push notifications in browser</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">SMS Notifications</h4>
                <p class="text-sm text-gray-500">Receive notifications via SMS</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeSection === 'security'" class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input 
                type="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                type="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
            </div>
            <button class="btn-primary">
              Update Password
            </button>
          </div>
        </div>

        <!-- Preferences Settings -->
        <div v-if="activeSection === 'preferences'" class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Application Preferences</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                <option>English</option>
                <option>Spanish</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+1 (Central European Time)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quotation Signatures</label>
              <VueMultiselect
								   v-model="signatureInfo"
								   :close-on-select="false"
								   :clear-on-select="false"
								   :hide-selected="true"
								   :preserve-search="true"
								   placeholder="Select Staff"
								   label="displayName"
								   track-by="displayName"
								   :multiple="true"
								   :options="staffListWithDisplayName">
								 </VueMultiselect>
            </div>
            <button class="btn-primary">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UserInfo, Tenant } from "~/models";
import VueMultiselect from 'vue-multiselect'
import type { Staff } from "~/models";
 
import { 
  User, 
  Bell, 
  Shield, 
  Settings as SettingsIcon 
} from 'lucide-vue-next'

const userStore = useUserStore()

const userInfo = ref<UserInfo>(null);
const tenantInfo = ref<Tenant>(null);
const { $toast } = useNuxtApp();


definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Settings'
})

const activeSection = ref('profile')

const settingSections = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'preferences', name: 'Preferences', icon: SettingsIcon }
]

const staffList = ref<Staff[]>([]);
const staffListWithDisplayName = computed(() => {
  return staffList.value.map(staff => ({
    ...staff,
    displayName: [staff.firstName, staff.otherName, staff.lastName]
      .filter(name => name && name.trim() !== '')
      .join(' ')
  }));
});
const signatureInfo = ref<[]>([]);

const getAllStaffs = async () => {

    let result = await getStaffs({pageNo: 1, pageSize: 1000});

    staffList.value = result.data;
}

const getUserAccount = async () => {

  try {
    let result = await getUserAccountDetails();

    // Save in Pinia + localStorage
    userStore.setUser(result.user);
    userStore.setTenant(result.tenant);

    // Also set in refs for display
    userInfo.value = result.user;
    tenantInfo.value = result.tenant;
    

  } catch (error) {
    $toast.error('Unable to fetch user details!');
  }
}

onMounted(async () => {

  await getAllStaffs();

  userStore.loadFromLocalStorage();
  
  if (!userStore.user || !userStore.tenant) {
    await getUserAccount();
  } else {

    userInfo.value = userStore.user;
    tenantInfo.value = userStore.tenant;

  }
});
</script>


<style src="vue-multiselect/dist/vue-multiselect.css"></style>