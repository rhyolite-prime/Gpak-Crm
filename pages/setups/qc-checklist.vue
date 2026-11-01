<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quality Control Checklist</h1>
        <p class="text-sm text-gray-500 mt-1">Ensuring every product meets the highest standards before delivery</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search QC Checklist..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button 
          @click="resetForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create QC checklist</span>
        </button>
      </div>
    </div>

   

    <!-- Prod. Workflow Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <!-- Loader -->
      <div v-if="isShimmerLoading" class="absolute inset-0 bg-white/75 flex items-center justify-center z-10 rounded-lg">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
                <th class="w-8"></th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No. Of Items
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            
            <template v-for="qcCheckInfo in qcCheckList" :key="qcCheckInfo.id">
              <!-- Main Row -->
              <tr 
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                @click="toggleExpand(qcCheckInfo.id)"
              >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <component 
                    :is="expandedQcCheckInfoIds.includes(qcCheckInfo.id) ? ChevronDown : ChevronRight"
                    class="w-4 h-4 text-gray-500 inline-block"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ qcCheckInfo.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ qcCheckInfo.productName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ qcCheckInfo.items?.length || 0 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button @click.stop="initUpdate(qcCheckInfo)" class="text-green-600 hover:text-green-900">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button @click.stop="initDelete(qcCheckInfo)" class="text-red-600 hover:text-red-900">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expanded Items Row -->
               <tr v-if="expandedQcCheckInfoIds.includes(qcCheckInfo.id)" class="bg-gray-50">
                <td colspan="4" class="px-6 py-4">
                  <div>
                    <h3 class="text-sm font-semibold text-gray-700 mb-2">Checklist Items</h3>
                    <table class="w-full border border-gray-200 rounded-lg text-sm">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-3 py-2 text-left font-medium text-gray-600">#</th>
                          <th class="px-3 py-2 text-left font-medium text-gray-600">Parameter</th>
                          <th class="px-3 py-2 text-left font-medium text-gray-600">Method</th>
                          <th class="px-3 py-2 text-left font-medium text-gray-600">Acceptance Criteria</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="item in qcCheckInfo.items" 
                          :key="item.id" 
                          class="border-t border-gray-200"
                        >
                          <td class="px-3 py-2 text-gray-700">{{ item.sequenceNumber }}</td>
                          <td class="px-3 py-2 text-gray-700">{{ item.parameter }}</td>
                          <td class="px-3 py-2 text-gray-700">{{ item.method }}</td>
                          <td class="px-3 py-2 text-gray-700">{{ item.acceptanceCriteria }}</td>
                        </tr>
                        <tr v-if="!qcCheckInfo.items || qcCheckInfo.items.length === 0">
                          <td colspan="4" class="text-center text-gray-400 py-3">No items available</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </template>
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
                v-model="qcForm.name"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                v-model="qcForm.productId"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select product</option>
                <option v-for="product in productList" :key="product.id" :value="product.id">
                  {{ product.name }}
                </option>
              </select>
            </div>

            <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  v-model="qcForm.description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>

          </div>

        <hr/>
        
          <!-- Checklist Items -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-800">Checklist Items</h3>
              <button @click="addItem" type="button" class="text-sm text-red-600 font-medium">+ Add Item</button>
            </div>
            <div v-if="qcForm.items.length === 0" class="text-gray-400 text-sm mb-3">No items added yet.</div>
            <draggable
              v-model="qcForm.items" 
              item-key="id" 
              handle=".drag-handle" 
              animation="200"
              @end="updateSequenceNumbers"
            >
              <template #item="{ element: item, index }">
                <div class="border border-gray-200 rounded-lg p-4 mb-4 space-y-2 bg-gray-50">
                  <div class="flex justify-between items-center mb-2">
                    <span class="drag-handle cursor-move text-gray-400 hover:text-gray-600">
                      <GripVertical class="w-4 h-4" />
                    </span>
                    <button @click="removeItem(index)" type="button" class="flex items-center text-xs text-gray-500 hover:text-red-600 space-x-1">
                      <Trash2 class="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label class="text-xs font-medium text-gray-600 mb-1">Parameter</label>
                      <input v-model="item.parameter" type="text" class="w-full px-2 py-1 border rounded-md">
                    </div>
                    <div>
                      <label class="text-xs font-medium text-gray-600 mb-1">Method</label>
                      <input v-model="item.method" type="text" class="w-full px-2 py-1 border rounded-md">
                    </div>
                    <div>
                      <label class="text-xs font-medium text-gray-600 mb-1">Acceptance Criteria</label>
                      <input v-model="item.acceptanceCriteria" type="text" class="w-full px-2 py-1 border rounded-md">
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
          </div>

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
      :item-name="'QC Checklist'"
      @close="closeDeleteModal"
      @confirm="delQcChecklist"
    />
    
  </div>
</template>

<script lang="ts" setup>
import type { QcChecklist, Product } from "~/models";
import { isEmpty, debounce } from "lodash-es";
import draggable from 'vuedraggable'
const { $toast } = useNuxtApp();

import { 
  Search,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Eye,
  Edit,
  Download,
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
const managers = ref([]);

const qcForm = reactive({
  name: '',
  description: '',
  productId: '',
  productName: '',
  items: []
});

const addItem = () => {
  qcForm.items.push({
    id: crypto.randomUUID(),
    sequenceNumber: qcForm.items.length + 1,
    parameter: '',
    method: '',
    acceptanceCriteria: ''
  });
};

const removeItem = (index: number) => {
  qcForm.items.splice(index, 1);
  qcForm.items.forEach((s, i) => s.sequenceNumber = i + 1);
};

const updateSequenceNumbers = () => {
  qcForm.items.forEach((item, index) => {
    item.sequenceNumber = index + 1;
  });
};
const qcCheckList = ref<QcChecklist[]>([]);
const productList = ref<Product[]>([]);

const selectedQcChecklist = ref<QcChecklist>()
const id = ref('')
const modalTitle = ref('')

// Instead of a single value...

const expandedQcCheckInfoIds = ref<string[]>([])

const toggleExpand = (workflowId: string) => {
  const index = expandedQcCheckInfoIds.value.indexOf(workflowId)
  if (index > -1) {
    // Collapse if already expanded
    expandedQcCheckInfoIds.value.splice(index, 1)
  } else {
    // Expand if not yet expanded
    expandedQcCheckInfoIds.value.push(workflowId)
  }
}
 
 
useHead({
  title: 'QC Checklist'
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
    await getPaginatedQcChecklists()
}


const getAllProducts = async () => {

    let result = await getProducts({pageNo: 1, pageSize: 10000});

    productList.value = result.data;
}


 const getPaginatedQcChecklists = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getQcChecklists(filters);

        qcCheckList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch QC Checklist !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


const saveProductionWorkflow = async () => {
  let payload = { ...qcForm };
  isCreating.value = true;
  if (isEmpty(id.value)) {
    try {
      let isSuccessful = await createQcChecklist(payload);
      if (isSuccessful) {
        $toast.success('QC Checklist saved!');
        id.value = ''
        await getPaginatedQcChecklists();
      }
      else {
        $toast.error('Unable to create QC Checklist !');
      }
    } catch (error) {
      $toast.error('Unable to create QC Checklist !');
    }
    finally {
      isCreating.value = false;
      showCreateModal.value = false
    }
  } else {
    try {
      let isSuccessful = await updateProductionWorkflow({ ...payload, id: id.value, });
      if (isSuccessful) {
        $toast.success('QC Checklist updated!');
        await getPaginatedQcChecklists();
        id.value = '';
      }
      else {
        $toast.error('Unable to update QC Checklist!');
      }
    } catch (error) {
      $toast.error('Unable to update QC Checklist !');
    } finally {
      isCreating.value = false;
      showCreateModal.value = false
    }
  }
}


const initUpdate = (qcChecklist: QcChecklist) => {
  qcForm.name = qcChecklist.name;
  qcForm.description = qcChecklist.description;
  qcForm.productId = qcChecklist.productId;
  qcForm.productName = qcChecklist.productName;
  qcForm.items = qcChecklist.items ? qcChecklist.items.map(item => ({ ...item })) : [];
  id.value = qcChecklist.id;
  modalTitle.value = 'QC Checklist Workflows';
  showCreateModal.value = true;
}


const initDelete = (qcChecklist: QcChecklist) => {

  id.value = qcChecklist.id;

  modalTitle.value = 'Delete QC Checklist';

  showDeleteConfirmationModal.value = true;
}

 

const delQcChecklist = async () => {
    
  isDeleting.value = true;
    
    try {
      let isSuccessful = await deleteQcChecklist(id.value);
      if (isSuccessful) {

        $toast.success('QC Checklist deleted !');

        await getPaginatedQcChecklists();

      }
      else {
        $toast.error('Unable to delete QC Checklist!');
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
  qcForm.name = '';
  qcForm.description = '';
  qcForm.productId = '';
  qcForm.productName = '';
  qcForm.items = [];
  id.value = ''
  modalTitle.value = 'Create QC Checklist'
}

  const closeModal = () => {
    showCreateModal.value = false
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedQcChecklists();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedQcChecklists();
    await getAllProducts();

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