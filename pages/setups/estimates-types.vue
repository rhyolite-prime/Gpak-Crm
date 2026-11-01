<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Estimate Types</h1>
        <p class="text-sm text-gray-500 mt-1"> Manage Estimate Types </p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Estimate Type..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button 
          @click="resetForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Estimate Type</span>
        </button>
      </div>
    </div>

    <!-- Estimate Types Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <!-- Loader -->
      <div v-if="isShimmerLoading" class="absolute inset-0 bg-white/75 flex items-center justify-center z-10 rounded-lg">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hex Colour
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="estimateType in estimateTypeList" 
              :key="estimateType.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ estimateType.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-6 h-6 rounded border border-gray-200" 
                    :style="{ backgroundColor: estimateType.hexColour || '#ffffff' }"
                  ></div>
                  <span class="text-sm text-gray-900">{{ estimateType.hexColour }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="initUpdate(estimateType)"
                    class="text-green-600 hover:text-green-900">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button 
                    @click="initDelete(estimateType)"
                    class="text-red-600 hover:text-red-900">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <client-only>
        <base-pagination 
          :lower-bound="paginationParams.lowerBound" 
          :upper-bound="paginationParams.upperBound"
          @on-page-changed="onPageChange"
          :page-no="filters.pageNo " 
          :total-pages="paginationParams.totalPages"
          :total-count="paginationParams.totalCount" 
          :disabled="isShimmerLoading" 
        />
      </client-only>
    </div>

    <!-- Create/Update Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <form class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> Name</label>
                <input 
                  v-model="estimateTypeForm.name"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> Hex Colour</label>
                <div class="flex items-center space-x-2">
                  <input 
                    v-model="estimateTypeForm.hexColour"
                    type="color" 
                    class="h-10 w-10 border rounded cursor-pointer"
                  >
                  <input 
                    v-model="estimateTypeForm.hexColour"
                    type="text" 
                    placeholder="#000000"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button 
                type="button" 
                @click="saveEstimateType"
                class="btn-primary flex items-center space-x-2"
                :disabled="isCreating"
              >
                <div v-if="isCreating" class="loader"></div>
                <span>{{ isCreating ? 'Saving...' : 'Save' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UiDeleteConfirmationModal
      :is-open="showDeleteConfirmationModal"
      :isDeleting="isDeleting"
      :item-name="'Estimate Type'"
      @close="closeDeleteModal"
      @confirm="delEstimateType"
    />
  </div>
</template>

<script lang="ts" setup>
import type { EstimateType } from "~/models";
import { isEmpty, debounce } from "lodash-es";
const { $toast } = useNuxtApp();

import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  X
} from 'lucide-vue-next'
 
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const showCreateModal = ref(false)
const showDeleteConfirmationModal = ref(false)
const isCreating = ref(false)
const isDeleting = ref(false)
const isShimmerLoading = ref(true);

const estimateTypeForm = reactive({
  name: '',
  hexColour: '#000000',
});

const estimateTypeList = ref<EstimateType[]>([])
const id = ref('')
const modalTitle = ref('')
 
useHead({
  title: 'Estimate Types'
})

const router = useRouter();
const route = useRoute();

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const onPageChange = async (pageNumber: number) => {
	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
  await getPaginatedEstimateTypes()
}

const getPaginatedEstimateTypes = async () => {
  isShimmerLoading.value = true;

  try {
    let result = await getEstimateTypes(filters);

    estimateTypeList.value = result.data;

    paginationParams.totalPages = result.totalPages;
    paginationParams.totalCount = result.totalCount;
    paginationParams.lowerBound = result.lowerBound;
    paginationParams.upperBound = result.upperBound;
  } catch (error) {
    $toast.error('Unable to fetch estimate types!');
  } finally {
    isShimmerLoading.value = false;
  }
}

const saveEstimateType = async () => {
  let payload = { ...estimateTypeForm };

  isCreating.value = true;

  if (isEmpty(id.value)) {
    try {
      let isSuccessful = await createEstimateType(payload);

      if (isSuccessful) {
        $toast.success('Estimate Type saved!');
        id.value = ''
        await getPaginatedEstimateTypes();
      }
      else {
        $toast.error('Unable to create estimate type!');
      }
    } catch (error) {
      $toast.error('Unable to create estimate type!');
    } finally {
      isCreating.value = false;
      showCreateModal.value = false
    }
  } else {
    try {
      let isSuccessful = await updateEstimateType({ ...payload, id: id.value });

      if (isSuccessful) {
        $toast.success('Estimate Type updated!');
        await getPaginatedEstimateTypes();
        id.value = '';
      }
      else {
        $toast.error('Unable to update estimate type!');
      }
    } catch (error) {
      $toast.error('Unable to update estimate type!');
    } finally {
      isCreating.value = false;
      showCreateModal.value = false
    }
  }
}

const initUpdate = (estimateType: EstimateType) => {
  estimateTypeForm.name = estimateType.name;
  estimateTypeForm.hexColour = estimateType.hexColour || '#000000';
  id.value = estimateType.id;
  modalTitle.value = 'Update Estimate Type';
  showCreateModal.value = true;
}

const initDelete = (estimateType: EstimateType) => {
  id.value = estimateType.id;
  modalTitle.value = 'Delete Estimate Type';
  showDeleteConfirmationModal.value = true;
}

const delEstimateType = async () => {
  isDeleting.value = true;
    
  try {
    let isSuccessful = await deleteEstimateType(id.value);
    if (isSuccessful) {
      $toast.success('Estimate Type deleted!');
      await getPaginatedEstimateTypes();
    }
    else {
      $toast.error('Unable to delete estimate type!');
    }
  } catch (error) {
    $toast.error('Unable to delete estimate type!');
  } finally {
    isDeleting.value = false;
    closeDeleteModal();
  }
}

const resetForm = () => { 
  showCreateModal.value = true
  estimateTypeForm.name = '';
  estimateTypeForm.hexColour = '#000000';
  id.value = ''
  modalTitle.value = 'Create Estimate Type'
}

const closeModal = () => {
  showCreateModal.value = false
}

const closeDeleteModal = () => {
  showDeleteConfirmationModal.value = false
}

const debouncedSearch = debounce(() => {
  filters.pageNo = 1; // Reset to first page for new search
  getPaginatedEstimateTypes();
}, 300); // 300ms delay

watch(() => filters.query, debouncedSearch);

onMounted(async () => {
  if (!isEmpty(route.query)) {
    filters.pageNo = parseInt(route.query.pageNo as string);
  }
  
  await getPaginatedEstimateTypes();
});
</script>
