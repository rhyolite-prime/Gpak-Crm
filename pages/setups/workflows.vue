<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Workflows</h1>
        <p class="text-sm text-gray-500 mt-1"> Track every stage of workflow from order creation to final delivery. </p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Workflow..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button 
          @click="resetForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Workflow</span>
        </button>
      </div>
    </div>

   

    <!-- Prod. Workflow Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <!-- Loader -->
      <div v-if="isShimmerLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
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
                Estimate Type
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Stages
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Transitions
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="workflowList.length === 0 && !isShimmerLoading">
               <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                 No workflows found.
               </td>
            </tr>
            <tr 
              v-for="workflow in workflowList" 
              :key="workflow.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ workflow.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ workflow.estimateTypeName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ workflow.stages?.length ?? 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ workflow.transitions?.length ?? 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button @click.stop="goToDetails(workflow.id)" title="Manage Workflow Stages & Transitions" class="text-blue-600 hover:text-blue-900">
                    <Settings class="w-4 h-4" />
                  </button>
                  <button @click.stop="initUpdate(workflow)" title="Edit Workflow" class="text-green-600 hover:text-green-900">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button @click.stop="initDelete(workflow)" title="Delete Workflow" class="text-red-600 hover:text-red-900">
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
        <base-pagination :lower-bound="paginationParams.lowerBound" 
        :upper-bound="paginationParams.upperBound"
        @on-page-changed="onPageChange"
        :page-no="filters.pageNo " 
        :total-pages="paginationParams.totalPages"
        :total-count="paginationParams.totalCount" 
        :disabled="isShimmerLoading" />
      </client-only>

    </div>

    <!-- Create / Update Production Workflow Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content max-w-4xl" @click.stop>
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          <!-- Workflow Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Workflow Name</label>
              <input 
                v-model="pwfForm.name"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estimate Type</label>
              <select
                v-model="pwfForm.estimateTypeId"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Estimate Type</option>
                <option v-for="estimateType in estimateTypeList" :key="estimateType.id" :value="estimateType.id">
                  {{ estimateType.name }}
                </option>
              </select>
            </div>

            <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  v-model="pwfForm.description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>

            <div class="flex items-center space-x-2">
              <input 
                v-model="pwfForm.isDefault"
                type="checkbox"
                class="h-4 w-4 text-red-600 border-gray-300 rounded"
              >
              <label class="text-sm font-medium text-gray-700">Set as default workflow</label>
            </div>
          </div>

        <hr/>

          <!-- Submit -->
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
            <button 
              type="button" 
              @click="saveProductionWorkflow"
              class="btn-primary flex items-center space-x-2"
              :disabled="isCreating"
            >
              <div v-if="isCreating" class="loader"></div>
              <span>{{ isCreating ? 'Saving...' : 'Save Workflow' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

     <!-- Delete Confirmation Modal -->
    <UiDeleteConfirmationModal
      :is-open="showDeleteConfirmationModal"
      :isDeleting="isDeleting"
      :item-name="'Production Workflow'"
      @close="closeDeleteModal"
      @confirm="delProductionWorkflow"
    />
    
  </div>
</template>

<script lang="ts" setup>
import type { Workflow, Product, WorkCenter, Staff, EstimateType } from "~/models";
import { isEmpty, debounce } from "lodash-es";
const { $toast } = useNuxtApp();
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  X,
  Settings
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
const managers = ref([]);

const pwfForm = reactive<{
  name: string;
  description: string;
  isDefault: boolean;
  estimateTypeId: string;
  estimateTypeName: string;
  stages: any[];
  transitions: any[];
}>({
  name: '',
  description: '',
  isDefault: false,
  estimateTypeId: '',
  estimateTypeName: '',
  stages: [],
  transitions: []
});


const workflowList = ref<Workflow[]>([]);
const productList = ref<Product[]>([]);
const workCenterList = ref<WorkCenter[]>([]);
const staffList = ref<Staff[]>([]);
const selectedWorkflow = ref<Workflow>();
const estimateTypeList = ref<EstimateType>();
const id = ref('')
const modalTitle = ref('')
 
 
useHead({
  title: 'Workflow'
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
    await getPaginatedProductionWorkflows()
}


const getAllProducts = async () => {

    let result = await getProducts({pageNo: 1, pageSize: 10000});

    productList.value = result.data;
 
}

const getAllWorkCenters = async () => {

    let result = await getWorkCenters({pageNo: 1, pageSize: 10000});

    workCenterList.value = result.data;
 
}

const getAllManagers = async () => {

    let result = await getStaffs({pageNo: 1, pageSize: 10000});

    staffList.value = result.data;
 
}

const getAllEstimateTypes = async () => {
  try {
    const result = await getEstimateTypes({ pageNo: 1, pageSize: 100 });
    estimateTypeList.value = result.data;
     
  } catch (error) {
    $toast.error('Failed to load estimate types');
  }
};

 const getPaginatedProductionWorkflows = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getProductionWorkflows(filters);

        workflowList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch production workflows !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


const saveProductionWorkflow = async () => {

  // set estimateTypeName in pwfForm
  const selectedProduct = productList.value.find(p => p.id === pwfForm.estimateTypeId);
  if (selectedProduct) {
    pwfForm.estimateTypeName = selectedProduct.name;
  }

  let payload = { ...pwfForm };

  isCreating.value = true;

  if (isEmpty(id.value)) {

    try {

      let isSuccessful = await createProductionWorkflow(payload);

      if (isSuccessful) {

        $toast.success('Production Workflows saved!');

        id.value = ''

        await getPaginatedProductionWorkflows();

      }
      else {
        $toast.error('Unable to create production workflows !');
      }

    } catch (error) {
      $toast.error('Unable to create production workflows !');

    }
    finally {

      isCreating.value = false;
      showCreateModal.value = false
    }

  } else {

    try {

      let isSuccessful = await updateProductionWorkflow({ ...payload, id: id.value, });

      if (isSuccessful) {

        $toast.success('Production Workflows updated!');

        await getPaginatedProductionWorkflows();

        id.value = '';

      }
      else {

        $toast.error('Unable to update production workflows !');

      }

    } catch (error) {
      $toast.error('Unable to update production workflows !');

    } finally {

      isCreating.value = false;
      showCreateModal.value = false
    }
  }


}


const initUpdate = (workflow: Workflow) => {

  pwfForm.name = workflow.name;
  pwfForm.description = workflow.description;
  pwfForm.isDefault = workflow.isDefault === 'true' || workflow.isDefault === true; 
  pwfForm.estimateTypeId = workflow.estimateTypeId;
  pwfForm.estimateTypeName = workflow.estimateTypeName;
  pwfForm.stages = workflow.stages ?? [];
  pwfForm.transitions = workflow.transitions ?? [];

  id.value = workflow.id;

  modalTitle.value = 'Update Production Workflows';

  showCreateModal.value = true;
}


const initDelete = (workflow: Workflow) => {

  id.value = workflow.id;

  modalTitle.value = 'Delete Production Workflows';

  showDeleteConfirmationModal.value = true;
}

const goToDetails = (id: string) => {
  navigateTo(`/setups/workflow-details/${id}`);
}

 

const delProductionWorkflow = async () => {
    
  isDeleting.value = true;
    
    try {
      let isSuccessful = await deleteProductionWorkflow(id.value);
      if (isSuccessful) {

        $toast.success('Workflow deleted !');

        await getPaginatedProductionWorkflows();

      }
      else {
        $toast.error('Unable to delete QC Checklist !');
      }
    } catch (error) {
      $toast.error('Unable to delete QC Checklist !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }
 


const resetForm = () => { 

  showCreateModal.value = true
  pwfForm.name = '';
  pwfForm.description = '';
  pwfForm.isDefault = false;
  pwfForm.estimateTypeId = '';
  pwfForm.estimateTypeName = '';
  pwfForm.stages = [];
  pwfForm.transitions = [];
  
  id.value = ''
  modalTitle.value = 'Create Workflow'

}

  const closeModal = () => {
    showCreateModal.value = false
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedProductionWorkflows();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedProductionWorkflows();
    await getAllProducts();
    await getAllWorkCenters();
    await getAllManagers();
    await getAllEstimateTypes();

  });



 
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>