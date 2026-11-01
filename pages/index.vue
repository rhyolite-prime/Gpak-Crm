<template>
  <div class="space-y-6 pb-8">

    <!-- Welcome Banner -->
    <div class="welcome-banner rounded-2xl p-8 text-white animate-fade-in-up">
      <div class="relative z-10">
        <p class="text-red-200 text-sm font-medium tracking-wide uppercase">{{ formattedDate }}</p>
        <h1 class="text-3xl font-bold mt-1">{{ greeting }} 👋</h1>
        <p class="text-red-100 mt-2 text-sm max-w-lg">
          Here's what's happening with your production &amp; CRM today. Stay on top of your operations.
        </p>
      </div>
    </div>

    <!-- KPI Stat Cards -->
    <div v-if="isSummaryStatsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="i in 4" :key="i" class="rounded-xl p-6 bg-gray-200 animate-pulse h-32"></div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Production Requests -->
      <div class="dashboard-stat-card gradient-red" style="animation-delay: 0ms">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-100 text-xs font-medium uppercase tracking-wider">Production Requests</p>
            <p class="text-3xl font-bold mt-2">
              <client-only>
                <CountUp :end-val="dashboardSummaryStats?.totalAdRequests ?? 0" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
            <Package class="w-6 h-6 text-white" />
          </div>
        </div>
        <div class="mt-3 flex items-center">
          <span
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
              (dashboardSummaryStats?.adRequestsPercentChange ?? 0) > 0
                ? 'bg-green-500/20 text-green-100'
                : (dashboardSummaryStats?.adRequestsPercentChange ?? 0) < 0
                  ? 'bg-red-300/20 text-red-100'
                  : 'bg-white/15 text-white/80'
            ]"
          >
            <TrendingUp v-if="(dashboardSummaryStats?.adRequestsPercentChange ?? 0) > 0" class="w-3 h-3 mr-1" />
            <TrendingDown v-else-if="(dashboardSummaryStats?.adRequestsPercentChange ?? 0) < 0" class="w-3 h-3 mr-1" />
            <MinusCircle v-else class="w-3 h-3 mr-1" />
            {{ toAbs(dashboardSummaryStats?.adRequestsPercentChange ?? 0) }}% this month
          </span>
        </div>
      </div>

      <!-- Total Customers -->
      <div class="dashboard-stat-card gradient-blue" style="animation-delay: 80ms">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-xs font-medium uppercase tracking-wider">Total Customers</p>
            <p class="text-3xl font-bold mt-2">
              <client-only>
                <CountUp :end-val="dashboardSummaryStats?.totalCustomers ?? 0" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
            <Users class="w-6 h-6 text-white" />
          </div>
        </div>
        <div class="mt-3 flex items-center">
          <span
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
              (dashboardSummaryStats?.customersPercentChange ?? 0) > 0
                ? 'bg-green-500/20 text-green-100'
                : (dashboardSummaryStats?.customersPercentChange ?? 0) < 0
                  ? 'bg-red-300/20 text-red-100'
                  : 'bg-white/15 text-white/80'
            ]"
          >
            <TrendingUp v-if="(dashboardSummaryStats?.customersPercentChange ?? 0) > 0" class="w-3 h-3 mr-1" />
            <TrendingDown v-else-if="(dashboardSummaryStats?.customersPercentChange ?? 0) < 0" class="w-3 h-3 mr-1" />
            <MinusCircle v-else class="w-3 h-3 mr-1" />
            {{ toAbs(dashboardSummaryStats?.customersPercentChange ?? 0) }}% this month
          </span>
        </div>
      </div>

      <!-- Invoices Generated -->
      <div class="dashboard-stat-card gradient-emerald" style="animation-delay: 160ms">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-emerald-100 text-xs font-medium uppercase tracking-wider">Invoices Generated</p>
            <p class="text-3xl font-bold mt-2">
              <client-only>
                <CountUp :end-val="dashboardSummaryStats?.totalInvoices ?? 0" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
            <Receipt class="w-6 h-6 text-white" />
          </div>
        </div>
        <div class="mt-3 flex items-center">
          <span
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
              (dashboardSummaryStats?.invoicesPercentChange ?? 0) > 0
                ? 'bg-green-500/20 text-green-100'
                : (dashboardSummaryStats?.invoicesPercentChange ?? 0) < 0
                  ? 'bg-red-300/20 text-red-100'
                  : 'bg-white/15 text-white/80'
            ]"
          >
            <TrendingUp v-if="(dashboardSummaryStats?.invoicesPercentChange ?? 0) > 0" class="w-3 h-3 mr-1" />
            <TrendingDown v-else-if="(dashboardSummaryStats?.invoicesPercentChange ?? 0) < 0" class="w-3 h-3 mr-1" />
            <MinusCircle v-else class="w-3 h-3 mr-1" />
            {{ toAbs(dashboardSummaryStats?.invoicesPercentChange ?? 0) }}% this month
          </span>
        </div>
      </div>

      <!-- Payments -->
      <div class="dashboard-stat-card gradient-amber" style="animation-delay: 240ms">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-amber-100 text-xs font-medium uppercase tracking-wider">Payments</p>
            <p class="text-3xl font-bold mt-2">
              <client-only>
                <CountUp :end-val="dashboardSummaryStats?.totalPayments ?? 0" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
            <CreditCard class="w-6 h-6 text-white" />
          </div>
        </div>
        <div class="mt-3 flex items-center">
          <span
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
              (dashboardSummaryStats?.paymentsPercentChange ?? 0) > 0
                ? 'bg-green-500/20 text-green-100'
                : (dashboardSummaryStats?.paymentsPercentChange ?? 0) < 0
                  ? 'bg-red-300/20 text-red-100'
                  : 'bg-white/15 text-white/80'
            ]"
          >
            <TrendingUp v-if="(dashboardSummaryStats?.paymentsPercentChange ?? 0) > 0" class="w-3 h-3 mr-1" />
            <TrendingDown v-else-if="(dashboardSummaryStats?.paymentsPercentChange ?? 0) < 0" class="w-3 h-3 mr-1" />
            <MinusCircle v-else class="w-3 h-3 mr-1" />
            {{ toAbs(dashboardSummaryStats?.paymentsPercentChange ?? 0) }}% this month
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content: Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Left Column: Recent Production Requests (2/3 width) -->
      <div class="lg:col-span-2 dashboard-card p-6">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Recent Production Requests</h2>
            <p class="text-xs text-gray-500 mt-0.5">Latest requests from your pipeline</p>
          </div>
          <NuxtLink
            to="/production-requests"
            class="text-sm font-medium text-red-600 hover:text-red-700 flex items-center transition-colors"
          >
            View All
            <ArrowRight class="w-4 h-4 ml-1" />
          </NuxtLink>
        </div>

        <!-- Loading skeleton -->
        <div v-if="isProductionRequestsLoading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table v-if="recentProductionRequests.length > 0" class="w-full">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">Request #</th>
                <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">Customer</th>
                <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">Job</th>
                <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">Stage</th>
                <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(req, idx) in recentProductionRequests"
                :key="idx"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                @click="$router.push(`/production-requests`)"
              >
                <td class="py-3 pr-4">
                  <span class="text-sm font-semibold text-red-600">{{ req.requestNumber }}</span>
                </td>
                <td class="py-3 pr-4">
                  <span class="text-sm text-gray-700">{{ req.businessName || req.customerName || '—' }}</span>
                </td>
                <td class="py-3 pr-4">
                  <span class="text-sm text-gray-600">{{ req.jobName || '—' }}</span>
                </td>
                <td class="py-3 pr-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStageStyle(req.currentStageName)
                    ]"
                  >
                    {{ req.currentStageName || 'Pending' }}
                  </span>
                </td>
                <td class="py-3">
                  <span class="text-sm text-gray-500">{{ standardDateFormat(req.creationTime) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center py-12">
            <Package class="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p class="text-sm text-gray-500">No recent production requests</p>
          </div>
        </div>
      </div>

      <!-- Right Column: Quick Actions + Activity Timeline -->
      <div class="space-y-6">

        <!-- Quick Actions -->
        <div class="dashboard-card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 gap-3">
            <NuxtLink to="/production-requests" class="quick-action-card">
              <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center quick-action-icon">
                <Factory class="w-5 h-5 text-red-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900">Production Requests</p>
                <p class="text-xs text-gray-500 truncate">Manage requests</p>
              </div>
              <ArrowRight class="w-4 h-4 text-gray-400 flex-shrink-0" />
            </NuxtLink>

            <NuxtLink to="/customers" class="quick-action-card">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center quick-action-icon">
                <Users class="w-5 h-5 text-blue-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900">Customers</p>
                <p class="text-xs text-gray-500 truncate">View customer data</p>
              </div>
              <ArrowRight class="w-4 h-4 text-gray-400 flex-shrink-0" />
            </NuxtLink>

            <NuxtLink to="/invoices" class="quick-action-card">
              <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center quick-action-icon">
                <FileText class="w-5 h-5 text-emerald-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900">Invoices</p>
                <p class="text-xs text-gray-500 truncate">Manage invoices</p>
              </div>
              <ArrowRight class="w-4 h-4 text-gray-400 flex-shrink-0" />
            </NuxtLink>

            <NuxtLink to="/reports/overview" class="quick-action-card">
              <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center quick-action-icon">
                <BarChart3 class="w-5 h-5 text-amber-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900">Reports</p>
                <p class="text-xs text-gray-500 truncate">View analytics</p>
              </div>
              <ArrowRight class="w-4 h-4 text-gray-400 flex-shrink-0" />
            </NuxtLink>
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="dashboard-card p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mt-1">
                <Clock class="w-3 h-3 mr-1" />
                Past 7 days
              </span>
            </div>
          </div>

          <!-- Search -->
          <div class="relative mb-4">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search activities..."
              class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
            />
          </div>

          <!-- Loading skeleton -->
          <div v-if="isActivityLogsLoading" class="space-y-4">
            <div v-for="i in 4" :key="i" class="flex items-start space-x-3 animate-pulse">
              <div class="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
              <div class="flex-1 space-y-1.5">
                <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                <div class="h-2.5 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div v-else class="space-y-0">
            <template v-if="activityLogList.length > 0">
              <div
                v-for="(activityLog, index) in activityLogList.slice(0, 8)"
                :key="index"
                class="relative flex items-start space-x-3 pb-4 last:pb-0"
              >
                <!-- Timeline connector line -->
                <div
                  v-if="index < Math.min(activityLogList.length, 8) - 1"
                  class="timeline-line"
                ></div>

                <!-- Dot -->
                <div
                  :class="[
                    'timeline-dot mt-0.5',
                    activityLog.logType === 'Created' ? 'bg-green-500' :
                    activityLog.logType === 'Updated' ? 'bg-blue-500' :
                    'bg-amber-500'
                  ]"
                ></div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 leading-snug">{{ activityLog.title }}</p>
                  <p class="text-xs text-gray-500 mt-0.5 truncate">{{ activityLog.details }}</p>
                </div>
              </div>
            </template>
            <div v-else class="text-center py-8">
              <Clock class="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p class="text-sm text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import type { ActivityLog, DashboardSummaryStats, ProductionRequest } from "~/models";
const { $toast } = useNuxtApp();
import CountUp from 'vue-countup-v3'
import { toAbs, standardDateFormat } from "~/utils/filters";
import dayjs from 'dayjs';

import {
  Users,
  Package,
  Receipt,
  CreditCard,
  TrendingUp,
  TrendingDown,
  MinusCircle,
  BarChart3,
  FileText,
  ArrowRight,
  Search,
  Clock,
  Factory,
} from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Dashboard'
})

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// --- Greeting logic ---
const now = dayjs();
const formattedDate = now.format('dddd, DD MMMM YYYY');

const hour = now.hour();
const greetingPrefix = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

const userName = computed(() => userStore.user?.name || '');
const greeting = computed(() => `${greetingPrefix}, ${userName.value}`);

// --- Filters ---
const INT32_MAX = 2147483647;

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: INT32_MAX,
});

const searchTerm = ref('');
let debounceTimeout: NodeJS.Timeout;

watch(searchTerm, (newValue) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    filters.query = newValue;
    getPaginatedActivityLogs();
  }, 500);
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

// --- State ---
const isSummaryStatsLoading = ref(true);
const isActivityLogsLoading = ref(true);
const isProductionRequestsLoading = ref(true);

const dashboardSummaryStats = ref<DashboardSummaryStats>();
const activityLogList = ref<ActivityLog[]>([]);
const recentProductionRequests = ref<ProductionRequest[]>([]);

// --- Stage badge styling ---
const getStageStyle = (stageName: string | undefined): string => {
  if (!stageName) return 'bg-gray-100 text-gray-700';
  const lower = stageName.toLowerCase();
  if (lower.includes('approved') || lower.includes('complete')) return 'bg-green-100 text-green-700';
  if (lower.includes('reject') || lower.includes('cancel')) return 'bg-red-100 text-red-700';
  if (lower.includes('progress') || lower.includes('review')) return 'bg-blue-100 text-blue-700';
  if (lower.includes('pending') || lower.includes('draft')) return 'bg-amber-100 text-amber-700';
  if (lower.includes('publish') || lower.includes('schedul')) return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-700';
};

// --- Data fetching ---
const getDashboardSummaryData = async () => {
  isSummaryStatsLoading.value = true;
  try {
    let result = await getSummaryStats();
    dashboardSummaryStats.value = result;
  } catch (error) {
    $toast.error('Unable to fetch dashboard summary stats!');
  } finally {
    isSummaryStatsLoading.value = false;
  }
};

const getPaginatedActivityLogs = async () => {
  isActivityLogsLoading.value = true;
  try {
    let result = await getActivityLogs(filters);
    activityLogList.value = result.data;
    paginationParams.totalPages = result.totalPages;
    paginationParams.totalCount = result.totalCount;
    paginationParams.lowerBound = result.lowerBound;
    paginationParams.upperBound = result.upperBound;
  } catch (error) {
    $toast.error('Unable to fetch activity logs!');
  } finally {
    isActivityLogsLoading.value = false;
  }
};

const getRecentProductionRequests = async () => {
  isProductionRequestsLoading.value = true;
  try {
    let result = await getProductionRequest({ pageNo: 1, pageSize: 5 });
    recentProductionRequests.value = result.data;
  } catch (error) {
    $toast.error('Unable to fetch recent production requests!');
  } finally {
    isProductionRequestsLoading.value = false;
  }
};

onMounted(async () => {
  // Load user store if needed
  userStore.loadFromLocalStorage();

  // Fetch all dashboard data in parallel
  await Promise.allSettled([
    getDashboardSummaryData(),
    getPaginatedActivityLogs(),
    getRecentProductionRequests(),
  ]);
});
</script>