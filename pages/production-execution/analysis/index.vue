<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Post Production Analysis</h1>
      <div class="flex space-x-2">
        <!-- Optional filters can go here -->
      </div>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                <th class="p-4">Work Order #</th>
                <th class="p-4">Customer</th>
                <th class="p-4">Job Name</th>
                <th class="p-4">Date Completed</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 text-sm">
                <tr v-for="order in completedOrders" :key="order.id" class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-medium text-gray-900">{{ order.id }}</td>
                <td class="p-4 text-gray-600">{{ order.customer }}</td>
                <td class="p-4 text-gray-600">{{ order.jobName }}</td>
                <td class="p-4 text-gray-600">{{ order.dateCompleted }}</td>
                <td class="p-4">
                    <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="order.status === 'Analyzed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'"
                    >
                    {{ order.status }}
                    </span>
                </td>
                <td class="p-4 text-right">
                    <NuxtLink 
                    :to="`/production-execution/analysis/${order.id}`"
                    class="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-all"
                    >
                    {{ order.status === 'Analyzed' ? 'View Analysis' : 'Start Analysis' }}
                    </NuxtLink>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="completedOrders.length === 0" class="p-12 text-center text-gray-500">
            <PackageCheck class="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No completed work orders found for analysis.</p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { PackageCheck } from 'lucide-vue-next';

// Mock Data - Replace with actual API call
const completedOrders = ref([
  { id: 'WO-2024-001', customer: 'Daily Graphic', jobName: 'Annual Report 2023', dateCompleted: '2024-01-20', status: 'Pending Analysis' },
  { id: 'WO-2024-002', customer: 'Ministry of Health', jobName: 'Poster Campaign', dateCompleted: '2024-01-22', status: 'Pending Analysis' },
  { id: 'WO-2024-003', customer: 'G-Pak Internal', jobName: 'Business Cards Batch', dateCompleted: '2024-01-18', status: 'Analyzed' },
]);
</script>
