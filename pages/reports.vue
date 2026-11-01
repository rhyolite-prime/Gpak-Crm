<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
        <p class="text-sm text-gray-500 mt-1">Generate and view business reports</p>
      </div>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
        <Plus class="w-4 h-4" />
        <span>Generate Report</span>
      </button>
    </div>

    <!-- Report Types -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="stat-card group cursor-pointer">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Sales Report</h3>
            <p class="text-sm text-gray-500 mt-1">Monthly sales performance</p>
            <p class="text-xs text-gray-400 mt-2">Last generated: 2 days ago</p>
          </div>
          <FileText class="w-8 h-8 text-indigo-600 group-hover:text-indigo-700" />
        </div>
      </div>

      <div class="stat-card group cursor-pointer">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Customer Report</h3>
            <p class="text-sm text-gray-500 mt-1">Customer analytics and insights</p>
            <p class="text-xs text-gray-400 mt-2">Last generated: 1 week ago</p>
          </div>
          <Users class="w-8 h-8 text-indigo-600 group-hover:text-indigo-700" />
        </div>
      </div>

      <div class="stat-card group cursor-pointer">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Financial Report</h3>
            <p class="text-sm text-gray-500 mt-1">Revenue and expense analysis</p>
            <p class="text-xs text-gray-400 mt-2">Last generated: 3 days ago</p>
          </div>
          <DollarSign class="w-8 h-8 text-indigo-600 group-hover:text-indigo-700" />
        </div>
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Recent Reports</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Generated
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ report.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ report.type }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ report.generated }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="status-badge"
                  :class="report.status === 'Ready' ? 'status-active' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ report.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3">
                  <Download class="w-4 h-4" />
                </button>
                <button class="text-gray-600 hover:text-gray-900">
                  <Eye class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Plus, 
  FileText, 
  Users, 
  DollarSign, 
  Download, 
  Eye 
} from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const reports = ref([
  {
    id: 1,
    name: 'Monthly Sales Report - December 2024',
    type: 'Sales',
    generated: 'Dec 15, 2024',
    status: 'Ready'
  },
  {
    id: 2,
    name: 'Customer Analytics Q4 2024',
    type: 'Customer',
    generated: 'Dec 10, 2024',
    status: 'Ready'
  },
  {
    id: 3,
    name: 'Financial Summary November 2024',
    type: 'Financial',
    generated: 'Dec 1, 2024',
    status: 'Ready'
  },
  {
    id: 4,
    name: 'Weekly Performance Report',
    type: 'Performance',
    generated: 'Dec 17, 2024',
    status: 'Processing'
  }
])
</script>