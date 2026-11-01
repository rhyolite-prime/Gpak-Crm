<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Work Instruction Sheet</h1>
        <p class="text-sm text-gray-500 mt-1">Monitor and manage Job instructions</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search tickets..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 h-10"
          >
        </div>
        <NuxtLink 
          to="/production-planning/create-instruction-ticket"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>New Ticket</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Jobs</p>
            <p class="text-2xl font-black text-gray-900">124</p>
          </div>
          <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <ClipboardList class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">In Progress</p>
            <p class="text-2xl font-black text-gray-900 text-amber-600">42</p>
          </div>
          <div class="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
            <Settings class="w-6 h-6 text-amber-600 animate-spin-slow" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</p>
            <p class="text-2xl font-black text-gray-900 text-emerald-600">76</p>
          </div>
          <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
            <CheckCircle2 class="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Urgent</p>
            <p class="text-2xl font-black text-gray-900 text-rose-600">6</p>
          </div>
          <div class="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center">
            <AlertTriangle class="w-6 h-6 text-rose-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="overflow-x-auto min-h-[450px]">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-tighter">Ticket ID</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-tighter">Job Name</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-tighter">Customer</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-tighter">Quantity</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-tighter">Due Date</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-tighter text-center">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-tighter text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="ticket in tickets" :key="ticket.id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-blue-600">#{{ ticket.id }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-bold text-gray-900 uppercase truncate max-w-xs">{{ ticket.jobName }}</div>
                <div class="text-[10px] text-gray-400 font-medium tracking-wider">{{ ticket.category }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-700 font-medium">{{ ticket.customer }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 font-bold">{{ ticket.quantity.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ ticket.dueDate }}</div>
              </td>
              <td class="px-6 py-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm"
                  :class="getStatusClass(ticket.status)"
                >
                  {{ ticket.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="relative flex justify-end">
                  <button 
                    @click.stop="toggleMenu(ticket.id)"
                    class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <MoreVertical class="w-5 h-5" />
                  </button>

                  <!-- Actions Dropdown -->
                  <div 
                    v-if="activeMenuId === ticket.id"
                    ref="menuRef"
                    class="absolute right-0 mt-8 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1 origin-top-right transition-all transform scale-100 opacity-100 text-left"
                  >
                    <NuxtLink 
                      :to="`/production-planning/create-instruction-ticket`"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      <Eye class="w-4 h-4" />
                      <span>View Details</span>
                    </NuxtLink>

                    <button class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600">
                      <Edit3 class="w-4 h-4" />
                      <span>Edit Ticket</span>
                    </button>

                    <button class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                      <Printer class="w-4 h-4" />
                      <span>Print Ticket</span>
                    </button>

                    <div class="border-t border-gray-100 my-1"></div>

                    <button class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <Trash2 class="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Showing 1 to 10 of 124 entries
        </p>
        <div class="flex items-center gap-2">
            <button class="pagination-btn disabled">Previous</button>
            <button class="pagination-btn active">1</button>
            <button class="pagination-btn">2</button>
            <button class="pagination-btn">3</button>
            <span class="text-gray-400 px-2">...</span>
            <button class="pagination-btn">13</button>
            <button class="pagination-btn">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { 
  Search, Plus, ClipboardList, Settings, CheckCircle2, AlertTriangle, 
  Eye, Edit3, Printer, Trash2, MoreVertical
} from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';

definePageMeta({
  layout: 'default'
});

const searchQuery = ref('');
const activeMenuId = ref<string | null>(null);
const menuRef = ref(null);

onClickOutside(menuRef, () => {
  activeMenuId.value = null;
});

const toggleMenu = (id: string) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};

// Dummy Data
const tickets = ref([
  { id: 'WIT-151023', jobName: 'Practical Guide to Agriculture', customer: 'PLATINUM CONSULT', quantity: 700, dueDate: '2025-11-12', status: 'In Press', category: 'Booklet' },
  { id: 'WIT-151024', jobName: 'Annual Report 2024', customer: 'FINANCE HOUSE', quantity: 2000, dueDate: '2025-11-20', status: 'Draft', category: 'Corporate' },
  { id: 'WIT-151025', jobName: 'Monthly Newsletter', customer: 'GREEN WORLD NGO', quantity: 1500, dueDate: '2025-11-15', status: 'Finished', category: 'Newsletter' },
  { id: 'WIT-151026', jobName: 'Product Catalogue', customer: 'TECH SOLUTIONS', quantity: 500, dueDate: '2025-11-18', status: 'Repro', category: 'Catalogue' },
  { id: 'WIT-151027', jobName: 'Promotional Flyers', customer: 'EVENT PROMO', quantity: 10000, dueDate: '2025-11-10', status: 'Urgent', category: 'Marketing' },
  { id: 'WIT-151028', jobName: 'Training Manuals', customer: 'EDU SERVICE', quantity: 300, dueDate: '2025-11-25', status: 'Design', category: 'Training' },
  { id: 'WIT-151029', jobName: 'Event Branding', customer: 'CITY COUNCIL', quantity: 50, dueDate: '2025-11-14', status: 'In Press', category: 'Oversized' },
  { id: 'WIT-151030', jobName: 'Business Cards', customer: 'SOLO ARCHITECTS', quantity: 1000, dueDate: '2025-11-12', status: 'Finished', category: 'Stationery' },
  { id: 'WIT-151031', jobName: 'Coffee Table Book', customer: 'ART GALLERY', quantity: 150, dueDate: '2025-12-01', status: 'Design', category: 'Hardcover' },
  { id: 'WIT-151032', jobName: 'Election Posters', customer: 'D-VOTE PARTY', quantity: 50000, dueDate: '2025-11-08', status: 'Urgent', category: 'Posters' },
]);

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Draft': return 'bg-gray-100 text-gray-600 border border-gray-200';
    case 'Design': return 'bg-purple-50 text-purple-600 border border-purple-100';
    case 'Repro': return 'bg-blue-50 text-blue-600 border border-blue-100';
    case 'In Press': return 'bg-amber-50 text-amber-600 border border-amber-100';
    case 'Finished': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    case 'Urgent': return 'bg-rose-50 text-rose-600 border border-rose-100 ring-2 ring-rose-200 ring-offset-1 animate-pulse';
    default: return 'bg-gray-50 text-gray-500';
  }
};
</script>

<style scoped>
@reference "tailwindcss";
@config "~/tailwind.config.js";
.stat-card {
  @apply bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow;
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.pagination-btn {
    @apply px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600;
}

.pagination-btn.active {
    @apply bg-blue-600 text-white border-blue-600 hover:bg-blue-700;
}

.pagination-btn.disabled {
    @apply opacity-50 cursor-not-allowed hover:bg-transparent;
}
</style>