<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Estimate Templates</h1>
        <p class="text-sm text-gray-500 mt-1">Manage & Reuse Estimate Templates</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search templates..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button @click="openTypeSelectionModal" class="btn-primary flex items-center space-x-2">
            <Plus class="w-4 h-4" />
            <span>Create Template</span>
        </button>
         
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Templates</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="paginationParams.totalCount" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <FileText class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Estimate Table -->
    <div class="bg-white rounded-lg border border-gray-200">
      <!-- Loader -->
      <div v-if="isShimmerLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
      <div class="overflow-x-auto min-h-[450px]">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Name</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="estimate in estimateList" :key="estimate.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ estimate.jobName || estimate.businessName }}</div>
              </td>
               
               
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                <div class="relative flex justify-end">
                  <button @click.stop="toggleMenu(estimate.id)" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                  <div v-if="activeMenuId === estimate.id" ref="menuRef" class="absolute right-0 mt-8 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1 origin-top-right">
                    <button @click="viewEstimate(estimate)" class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      <Eye class="w-4 h-4" /> <span>View Details</span>
                    </button>
                    <button @click="initUpdateEstimate(estimate)" class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      <Edit class="w-4 h-4" /> <span>Edit Template</span>
                    </button>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button @click="initDelete(estimate)" class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <Trash2 class="w-4 h-4" /> <span>Delete</span>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <client-only>
        <base-pagination :lower-bound="paginationParams.lowerBound" :upper-bound="paginationParams.upperBound" @on-page-changed="onPageChange" :page-no="filters.pageNo" :total-pages="paginationParams.totalPages" :total-count="paginationParams.totalCount" :disabled="isShimmerLoading" />
      </client-only>
    </div>

    <!-- Modals (Reusing from index.vue) -->
    <UiDeleteConfirmationModal :is-open="showDeleteConfirmationModal" :isDeleting="isDeleting" :item-name="'Estimate Template'" @close="closeDeleteModal" @confirm="delEstimate" />
    
    <!-- Estimate Type Selection Modal -->
    <div v-if="showTypeSelectionModal" class="modal-overlay" @click="showTypeSelectionModal = false">
      <div class="modal-content max-w-md w-full" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Select Template Type</h2>
            <button @click="showTypeSelectionModal = false" class="text-gray-400 hover:text-gray-600"><X class="w-6 h-6" /></button>
          </div>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-500 mb-6">Choose an estimate type for the new template.</p>
          <div class="grid grid-cols-1 gap-4">
            <button v-for="type in estimateTypes" :key="type.id" @click="selectType(type.id)" class="flex items-center p-4 border rounded-xl hover:bg-gray-50 border-l-8 transition-all" :style="{ borderLeftColor: type.hexColour }">
              <div class="flex-1 font-bold">{{ type.name }}</div>
              <Plus class="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Estimation, RawMaterial, Staff, EstimateType } from "~/models";
import { isEmpty, debounce } from "lodash-es";
import CountUp from 'vue-countup-v3';
import { Search, History, FileText, CheckCircle, Clock, Eye, Edit, Trash2, X, Plus, MoreVertical } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';

const { $toast } = useNuxtApp();
const router = useRouter();
const route = useRoute();

definePageMeta({ layout: 'default', middleware: 'auth' });
useHead({ title: 'Estimate Templates' });

const isShimmerLoading = ref(true);
const isDeleting = ref(false);
const showDeleteConfirmationModal = ref(false);
const showTypeSelectionModal = ref(false);
const activeMenuId = ref<string | null>(null);
const menuRef = ref(null);
const estimateList = ref<Estimation[]>([]);
const estimateTypes = ref<EstimateType[]>([]);
const selectedEstimate = ref<Estimation | null>(null);

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,
  isTemplate: true // Key filter
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

onClickOutside(menuRef, () => activeMenuId.value = null);

const getPaginatedEstimates = async () => {
  isShimmerLoading.value = true;
  try {
    let result = await getProductionEstimates(filters);
    estimateList.value = result.data;
    paginationParams.totalPages = result.totalPages;
    paginationParams.totalCount = result.totalCount;
    paginationParams.lowerBound = result.lowerBound;
    paginationParams.upperBound = result.upperBound;
  } catch (error) {
    $toast.error('Unable to fetch templates!');
  } finally {
    isShimmerLoading.value = false;
  }
};

const onPageChange = async (pageNumber: number) => {
  filters.pageNo = pageNumber;
  await getPaginatedEstimates();
};

const toggleMenu = (id: string) => activeMenuId.value = activeMenuId.value === id ? null : id;
const openTypeSelectionModal = async () => {
  try {
    const result = await getEstimateTypes({ pageNo: 1, pageSize: 100 });
    estimateTypes.value = result.data;
    showTypeSelectionModal.value = true;
  } catch (error) {
    $toast.error('Failed to load estimate types');
  }
};

const selectType = (id: string) => {
  showTypeSelectionModal.value = false;
  router.push(`/estimates/create?estimateTypeId=${id}&isTemplate=true`);
};

const viewEstimate = (estimate: Estimation) => {
  // Navigation to view/edit could be added here
};

const initUpdateEstimate = (estimate: Estimation) => {
  // Navigation to edit could be added here
};

const initDelete = (estimate: Estimation) => {
  selectedEstimate.value = estimate;
  showDeleteConfirmationModal.value = true;
};

const closeDeleteModal = () => showDeleteConfirmationModal.value = false;
const delEstimate = async () => {
  if (!selectedEstimate.value) return;
  isDeleting.value = true;
  try {
    let isSuccessful = await deleteEstimate(selectedEstimate.value.id);
    if (isSuccessful) {
      $toast.success('Template deleted!');
      await getPaginatedEstimates();
    }
  } catch (error) {
    $toast.error('Unable to delete template!');
  } finally {
    isDeleting.value = false;
    closeDeleteModal();
  }
};

const getStatusColor = (status: any) => 'bg-blue-100 text-blue-800';

const debouncedSearch = debounce(() => {
  filters.pageNo = 1;
  getPaginatedEstimates();
}, 300);

watch(() => filters.query, debouncedSearch);

onMounted(async () => {
  await getPaginatedEstimates();
});
</script>

<style scoped>
.stat-card { @apply bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow; }
.status-badge { @apply px-2 py-1 rounded-full text-xs font-medium; }
</style>
