<template>
  <div class="space-y-7 pb-10">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2 text-xs font-semibold text-[#8b9890]"><span class="h-2 w-2 rounded-full bg-[#75a481]"></span> YOUR WORKSPACE <span class="text-[#cbd1cc]">/</span> OVERVIEW</div><h1 class="text-[30px] font-bold tracking-[-0.04em] text-[#23312a]">Dashboard</h1><p class="mt-1 text-sm text-[#8b9690]">A clear view of your business, all in one place.</p></div>
      <div class="rounded-lg border border-[#e4e9e4] bg-white px-4 py-2.5 text-xs font-medium text-[#68776e]">{{ formattedDate }}</div>
    </div>

    <section class="hero relative overflow-hidden rounded-2xl bg-[#284b38] px-7 py-8 text-white md:px-9 md:py-9">
      <div class="relative z-10 max-w-xl"><p class="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b3cebb]">Your business at a glance</p><h2 class="text-2xl font-semibold tracking-[-0.03em] md:text-[30px]">{{ greeting }} <span class="text-[#b8d4bd]">.</span></h2><p class="mt-3 max-w-md text-sm leading-6 text-[#c9dbce]">From first request to final delivery, keep everything moving beautifully.</p><NuxtLink to="/production-requests" class="mt-6 inline-flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-xs font-bold text-[#355b40] transition hover:bg-[#e8f2e9]">View production requests <ArrowRight class="h-4 w-4" /></NuxtLink></div>
      <div class="hero-art pointer-events-none absolute -right-12 -top-24 hidden h-[360px] w-[460px] rotate-[-20deg] md:block"><div class="absolute inset-0 rounded-[70px] border border-white/10"></div><div class="absolute inset-8 rounded-[58px] border border-white/10"></div><div class="absolute inset-16 rounded-[46px] border border-white/10"></div><div class="absolute inset-24 rounded-[34px] border border-white/10 bg-white/5"></div></div>
      <div class="absolute bottom-5 right-7 hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 md:block">Made to make an impression</div>
    </section>

    <div class="flex items-end justify-between"><div><p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9aa69e]">THE BIG PICTURE</p><h2 class="mt-1 text-lg font-bold tracking-tight">Business overview</h2></div><span class="text-xs text-[#9aa69e]">All-time totals</span></div>
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="stat in stats" :key="stat.label" class="rounded-xl border border-[#e8ece8] bg-white p-5 shadow-[0_2px_12px_rgba(35,55,40,0.025)]">
        <div class="flex items-start justify-between"><div><p class="text-xs font-medium text-[#89958e]">{{ stat.label }}</p><p class="mt-3 text-[28px] font-bold leading-none tracking-[-0.04em] text-[#29382f]">{{ isSummaryStatsLoading ? '…' : (stat.value ?? '—') }}</p></div><div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="stat.iconBg"><component :is="stat.icon" class="h-[19px] w-[19px]" /></div></div>
        <div class="mt-5 border-t border-[#f0f2f0] pt-3 text-xs text-[#9aa49d]"><span v-if="stat.change != null" :class="stat.change >= 0 ? 'text-[#5c9870]' : 'text-[#bd6b62]'" class="font-bold">{{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%</span><span v-else>—</span> <span class="ml-1">vs. last month</span></div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div class="rounded-xl border border-[#e8ece8] bg-white shadow-[0_2px_12px_rgba(35,55,40,0.025)] xl:col-span-2">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0f2f0] px-6 py-5"><div><p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9ba79e]">YOUR PIPELINE</p><h2 class="mt-1 text-base font-bold">Recent production requests</h2><p class="mt-1 text-xs text-[#9aa59e]">Keep track of the latest jobs coming in.</p></div><NuxtLink to="/production-requests" class="flex items-center gap-2 rounded-lg border border-[#e6ebe6] px-3 py-2 text-xs font-semibold text-[#526b59] hover:bg-[#f5f8f5]">View all <ArrowRight class="h-3.5 w-3.5" /></NuxtLink></div>
        <div v-if="isProductionRequestsLoading" class="space-y-3 p-6"><div v-for="i in 4" :key="i" class="h-12 animate-pulse rounded-lg bg-gray-100"></div></div>
        <div v-else-if="recentProductionRequests.length" class="overflow-x-auto"><table class="w-full whitespace-nowrap text-left"><thead class="bg-[#fafbfa] text-[10px] font-bold uppercase tracking-[0.1em] text-[#a0aaa3]"><tr><th class="px-6 py-4">Request</th><th class="px-4 py-4">Customer</th><th class="px-4 py-4">Job</th><th class="px-4 py-4">Stage</th><th class="px-4 py-4">Date</th></tr></thead><tbody><tr v-for="(req, idx) in recentProductionRequests" :key="idx" class="border-t border-[#f1f3f1] text-xs hover:bg-[#fafcfa]"><td class="px-6 py-4 font-bold text-[#426c4f]">{{ req.requestNumber }}</td><td class="px-4 py-4 text-[#53625a]">{{ req.businessName || req.customerName || '—' }}</td><td class="px-4 py-4 text-[#78857d]">{{ req.jobName || '—' }}</td><td class="px-4 py-4"><span class="rounded-full px-2.5 py-1 font-medium" :class="getStageStyle(req.currentStageName)">{{ req.currentStageName || 'Pending' }}</span></td><td class="px-4 py-4 text-[#89958e]">{{ standardDateFormat(req.creationTime) }}</td></tr></tbody></table></div>
        <div v-else class="px-6 py-14 text-center"><div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2f6f2]"><Package class="h-5 w-5 text-[#8ba892]" /></div><p class="mt-3 text-sm font-semibold text-[#607067]">No recent requests</p><p class="mt-1 text-xs text-[#a0aaa3]">New production requests will appear here.</p></div>
      </div>
      <div class="rounded-xl border border-[#e8ece8] bg-white p-6 shadow-[0_2px_12px_rgba(35,55,40,0.025)]"><p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9ba79e]">GET THINGS DONE</p><h2 class="mt-1 text-base font-bold">Quick access</h2><p class="mt-1 text-xs text-[#9aa59e]">Pick up where you left off.</p><div class="mt-5 space-y-2"><NuxtLink v-for="action in actions" :key="action.label" :to="action.to" class="group flex items-center gap-3 rounded-lg border border-[#f0f2f0] p-3 transition hover:border-[#d8e6da] hover:bg-[#f8fbf8]"><div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="action.iconBg"><component :is="action.icon" class="h-[18px] w-[18px]" /></div><div class="min-w-0 flex-1"><p class="text-xs font-bold text-[#405047]">{{ action.label }}</p><p class="mt-1 text-[11px] text-[#9aa59e]">{{ action.description }}</p></div><ArrowRight class="h-4 w-4 text-[#b9c4bc] group-hover:text-[#497254]" /></NuxtLink></div></div>
    </section>
    <section class="rounded-xl border border-[#e8ece8] bg-white p-6"><div class="flex flex-wrap items-center justify-between gap-4"><div><p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9ba79e]">LATEST UPDATES</p><h2 class="mt-1 text-base font-bold">Recent activity</h2></div><div class="relative"><Search class="absolute left-3 top-2.5 h-4 w-4 text-[#a4b0a8]" /><input v-model="searchTerm" aria-label="Search activities" placeholder="Search activity..." class="w-full rounded-lg border border-[#e9ede9] bg-[#fafbfa] py-2 pl-9 pr-4 text-xs outline-none focus:border-[#8db297] sm:w-56" /></div></div><div v-if="isActivityLogsLoading" class="mt-5 h-12 animate-pulse rounded-lg bg-gray-100"></div><div v-else-if="activityLogList.length" class="mt-4 divide-y divide-[#f1f3f1]"><div v-for="(activity, index) in activityLogList.slice(0, 5)" :key="index" class="flex items-start gap-3 py-3"><span class="mt-1.5 h-2 w-2 rounded-full bg-[#83a88b]"></span><div><p class="text-xs font-semibold text-[#526057]">{{ activity.title }}</p><p class="mt-1 text-xs text-[#9aa59e]">{{ activity.details }}</p></div></div></div><p v-else class="py-8 text-center text-xs text-[#a0aaa3]">No recent activity to show.</p></section>
    <div class="flex justify-between text-[11px] text-[#a5afa8]"><span>© GPAK Limited · Print &amp; packaging</span><span>Made for better work.</span></div>
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
const greeting = computed(() => userName.value ? `${greetingPrefix}, ${userName.value}` : greetingPrefix);

const stats = computed(() => [
  { label: 'Production requests', value: dashboardSummaryStats.value?.totalAdRequests, change: dashboardSummaryStats.value?.adRequestsPercentChange, icon: Package, iconBg: 'bg-[#edf5ef] text-[#6c9b77]' },
  { label: 'Total customers', value: dashboardSummaryStats.value?.totalCustomers, change: dashboardSummaryStats.value?.customersPercentChange, icon: Users, iconBg: 'bg-[#f6f1e9] text-[#bb9866]' },
  { label: 'Invoices generated', value: dashboardSummaryStats.value?.totalInvoices, change: dashboardSummaryStats.value?.invoicesPercentChange, icon: Receipt, iconBg: 'bg-[#f3eff7] text-[#a48bb7]' },
  { label: 'Payments', value: dashboardSummaryStats.value?.totalPayments, change: dashboardSummaryStats.value?.paymentsPercentChange, icon: CreditCard, iconBg: 'bg-[#fbefec] text-[#c98c7d]' },
]);
const actions = [
  { label: 'Production requests', description: 'Manage your incoming jobs', to: '/production-requests', icon: Factory, iconBg: 'bg-[#edf5ef] text-[#6c9b77]' },
  { label: 'Customers', description: 'View and manage customers', to: '/customers', icon: Users, iconBg: 'bg-[#f6f1e9] text-[#bb9866]' },
  { label: 'Invoices', description: 'Stay on top of billing', to: '/invoices', icon: FileText, iconBg: 'bg-[#f3eff7] text-[#a48bb7]' },
  { label: 'Reports', description: 'Explore business insights', to: '/reports/overview', icon: BarChart3, iconBg: 'bg-[#fbefec] text-[#c98c7d]' },
];

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