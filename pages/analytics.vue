<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Track your business performance</p>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900">$847,392</p>
            <p class="text-sm text-red-600 flex items-center mt-1">
              <TrendingUp class="w-3 h-3 mr-1" />
              +12.5% from last month
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">New Customers</p>
            <p class="text-2xl font-bold text-gray-900">1,247</p>
            <p class="text-sm text-red-600 flex items-center mt-1">
              <TrendingUp class="w-3 h-3 mr-1" />
              +8.2% from last month
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <UserPlus class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Conversion Rate</p>
            <p class="text-2xl font-bold text-gray-900">3.24%</p>
            <p class="text-sm text-red-600 flex items-center mt-1">
              <TrendingDown class="w-3 h-3 mr-1" />
              -2.1% from last month
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Target class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Avg. Order Value</p>
            <p class="text-2xl font-bold text-gray-900">$156.32</p>
            <p class="text-sm text-red-600 flex items-center mt-1">
              <TrendingUp class="w-3 h-3 mr-1" />
              +5.7% from last month
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <ShoppingCart class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <BarChart3 class="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">Revenue chart visualization</p>
            <p class="text-sm text-gray-400">Chart component would be integrated here</p>
          </div>
        </div>
      </div>

      <!-- Customer Growth -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h3>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <LineChart class="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">Customer growth chart</p>
            <p class="text-sm text-gray-400">Chart component would be integrated here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity class="w-8 h-8 text-red-600" />
          </div>
          <h4 class="text-lg font-semibold text-gray-900">Website Traffic</h4>
          <p class="text-3xl font-bold text-red-600 mt-2">124,592</p>
          <p class="text-sm text-gray-500">Unique visitors this month</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle class="w-8 h-8 text-green-600" />
          </div>
          <h4 class="text-lg font-semibold text-gray-900">Completed Orders</h4>
          <p class="text-3xl font-bold text-green-600 mt-2">5,423</p>
          <p class="text-sm text-gray-500">Orders fulfilled this month</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle class="w-8 h-8 text-red-600" />
          </div>
          <h4 class="text-lg font-semibold text-gray-900">Pending Issues</h4>
          <p class="text-3xl font-bold text-red-600 mt-2">23</p>
          <p class="text-sm text-gray-500">Issues requiring attention</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  UserPlus, 
  Target, 
  ShoppingCart,
  BarChart3,
  LineChart,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>