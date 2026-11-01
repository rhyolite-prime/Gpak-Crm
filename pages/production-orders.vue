<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Production Orders</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your production orders</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search production orders..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <!-- <button 
          @click="showCreateModal = true"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Invoice</span>
        </button> -->
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Orders</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="productionOrderStatsData?.totalInvoices" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <FileText class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Scheduled</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="toNumber(productionOrderStatsData?.paidInvoices)" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">In Progress</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
               <CountUp :end-val="toNumber(productionOrderStatsData?.pending)" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Completed</p>
            <p class="text-2xl font-bold text-gray-900">  
              <client-only>
              <CountUp :end-val="productionOrderStatsData?.totalAmount" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-2xl font-bold">₵</span>
          </div>
        </div>
      </div>
    </div>

    
     <!-- Production Orders Table -->
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
              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order No#
              </th>

              <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th> -->

              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Product
              </th>

              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>

              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>

              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimated Budget
              </th>

              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>

              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            
            <template v-for="productionOrder in productionOrderList" :key="productionOrder.id">
              <!-- Main Row -->
              <tr 
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                @click="toggleExpand(productionOrder.id)"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <component 
                    :is="expandedWorkflowIds.includes(productionOrder.id) ? ChevronDown : ChevronRight"
                    class="w-4 h-4 text-gray-500 inline-block"
                  />
                </td>
                <td class="px-1 py-4 whitespace-nowrap text-sm text-gray-900">{{ productionOrder.orderNumber }}</td>
                <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ productionOrder.title }}</td> -->
                <td class="px-1 py-4 whitespace-nowrap text-sm text-gray-900">{{ productionOrder.productName }}</td>
                <td class="px-1 py-4 whitespace-nowrap text-sm text-gray-900">{{ productionOrder.plannedStartDate }}</td>
                <td class="px-1 py-4 whitespace-nowrap text-sm text-gray-900">{{ productionOrder.plannedEndDate }}</td>
                <td class="px-1 py-4 whitespace-nowrap text-sm text-gray-900">{{ productionOrder.estimatedBudget }}</td>
                <td class="px-1 py-4 whitespace-nowrap text-sm text-gray-900">{{ productionOrder.plannedQuantity }}</td>
                <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ productionOrder.operationalStages?.length }}</td> -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <!-- <button @click.stop="initUpdate(productionOrder)" class="text-green-600 hover:text-green-900">
                      <Edit class="w-4 h-4" />
                    </button> -->
                    <button @click.stop="initUpdateStatus(productionOrder)" class="text-green-600 hover:text-green-900">
                      <CheckCheck class="w-4 h-4" />
                    </button>
                    <!-- <button @click.stop="initDelete(productionOrder)" class="text-red-600 hover:text-red-900">
                      <Trash2 class="w-4 h-4" />
                    </button> -->
                  </div>
                </td>
              </tr>

              <!-- Expanded Operational Stages -->
               
             <tr v-if="expandedWorkflowIds.includes(productionOrder.id)" class="bg-gray-50">
                <td colspan="4" class="px-6 py-4">
                  <div>
                    <h3 class="text-sm font-semibold text-gray-700 mb-2">Operational Stages Workflow</h3>
                    <table class="w-full border border-gray-200 rounded-lg text-sm">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-3 py-2 text-left font-medium text-gray-600 w-[40px]">#</th>
                          <th class="px-3 py-2 text-left font-medium text-gray-600 min-w-[220px]">Operational Task</th>
                          <th class="px-3 py-2 text-left font-medium text-gray-600 min-w-[180px]">Work Center</th>
                          <th class="px-3 py-2 text-left font-medium text-gray-600 w-[130px]">Duration (hrs)</th>
                          <th class="px-4 py-2 text-left font-medium text-gray-600 w-[120px]">Mandatory?</th>
                          <th class="px-5 py-2 text-left font-medium text-gray-600 w-[120px]">Completed?</th>
                          <th class="px-3 py-2 text-left font-medium text-gray-600 min-w-[160px]">Start Date</th>
                          <th class="px-3 py-2 text-left font-medium text-gray-600 min-w-[160px]">End Date</th>
                          <th class="px-3 py-2 text-left font-medium text-gray-600 min-w-[160px]">Manager</th>
                           <th class="px-3 py-2 text-left font-medium text-gray-600 w-[80px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="operationalStage in productionOrder.operationalStages" 
                          :key="operationalStage.id" 
                          class="border-t border-gray-200"
                        >
                          <td class="px-3 py-2 text-gray-700">{{ operationalStage.sequenceNumber }}</td>
                          <td class="px-3 py-2 text-gray-700">{{ operationalStage.name }}</td>
                          <td class="px-3 py-2 text-gray-700">{{ operationalStage.workCenterName }}</td>
                          <td class="px-3 py-2 text-gray-700">{{ operationalStage.estimatedDurationInHours }}</td>

                           <td class="px-3 py-2 text-gray-700">
                            <span 
                              :class="operationalStage.isMandatory ? 'text-green-600 font-semibold' : 'text-gray-400'"
                            >
                              {{ operationalStage.isMandatory ? 'Yes' : 'No' }}
                            </span>
                          </td>

                          <td class="px-3 py-2 text-gray-700">
                            <span 
                              :class="operationalStage.isCompleted ? 'text-green-600 font-semibold' : 'text-gray-400'"
                            >
                              {{ operationalStage.isCompleted ? 'Yes' : 'No' }}
                            </span>
                          </td>


                          <td class="px-3 py-2 text-gray-700">{{ standardDateFormat(operationalStage.startDate) }}</td>
                          <td class="px-3 py-2 text-gray-700">{{ standardDateFormat(operationalStage.endDate) }}</td>

                          <td class="px-3 py-2 text-gray-700">
                            <div>
                              <div class="font-medium">{{ operationalStage.managerName }}</div>
                              <div class="text-xs text-gray-500">{{ operationalStage.managerDepartment }}</div>
                              <div class="text-xs text-gray-400">{{ operationalStage.managerEmail }}</div>
                            </div>
                          </td>

                          <td class="px-3 py-2 text-gray-700">
                            <button @click.stop="editOperationalStage(operationalStage)" class="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                              <Edit class="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                          </td>

                        </tr>
                        <tr v-if="productionOrder.operationalStages.length === 0">
                          <td colspan="6" class="text-center text-gray-400 py-3">No steps available</td>
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

    <UiActionVerificationModal
        :isOpen="showStatusUpdateVerificationModal"
        :isProcessing="isUpdatingStatus"
        actionTitle="Update Status"
        message="You are about to change the status of this Production Order. Do you want to proceed ?"
        :requireConfirmationText="true"
        confirmationWord="CONFIRM"
        confirmButtonText="Update"
        infoNote="This change will notify the customer and cannot be undone."
        @close="showStatusUpdateVerificationModal = false"
        @confirm="handleStatusUpdate"
      />
     
      <!-- Status Update Modal -->
    <div v-if="showStatusUpdateModal" class="modal-overlay" @click="closeStatusUpdateModal">
      <div class="modal-content" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h2>
            <button @click="closeStatusUpdateModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <form class="space-y-4">

            <div class="grid grid-cols-1 md:grid-cols-1 gap-2">

              <div>

                <label class="block text-sm font-medium text-gray-700 mb-1">Select Status</label>
                
                <select v-model="productionOrderStatusUpdateForm.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="Draft" :disabled="selectedProductionOrder?.status === 'Draft'">Draft</option>
                  <option value="Approved" :disabled="selectedProductionOrder?.status === 'Approved'">Approve</option>
                  <option value="Rejected" :disabled="selectedProductionOrder?.status === 'Rejected'">Reject</option>
                  <option value="Planned" :disabled="selectedProductionOrder?.status === 'Planned'">Planned</option>
                  <option value="Scheduled" :disabled="selectedProductionOrder?.status === 'Scheduled'">Scheduled</option>
                  <option value="InProgress" :disabled="selectedProductionOrder?.status === 'InProgress'">In Progress</option>
                  <option value="Completed" :disabled="selectedProductionOrder?.status === 'Completed'">Completed</option>
                  <option value="Cancelled" :disabled="selectedProductionOrder?.status === 'Cancelled'">Cancelled</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">
                  <strong>Note: Approving this quotation automatically enables assigns the operational tasks associated with this production order</strong>
                </p>

              </div>

            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeStatusUpdateModal" class="btn-secondary">
                Cancel
              </button>
              <button 
                type="button" 
                @click="confirmEstimateStatusUpdate"
                :disabled="!productionOrderStatusUpdateForm.status"
                :class="[
                  'btn-primary flex items-center space-x-2',
                  !productionOrderStatusUpdateForm.status ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                <span>Update Status</span>
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

import type { ProductionOrder, ProductionOrderStats } from "~/models";
import { isEmpty, debounce } from "lodash-es";
import CountUp from 'vue-countup-v3';
const { $toast } = useNuxtApp();

import { 
  Search, 
  Plus, 
  FileText, 
  CheckCircle, 
  CheckCheck,
  Clock, 
  Eye,
  ChevronDown,
  ChevronRight,
  Edit,
  Download,
  Trash2,
  X
} from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const showStatusUpdateModal = ref(false)
const showViewModal = ref(false)
const selectedInvoice = ref(null)
const modalTitle = ref('')
const isUpdatingStatus = ref(false)
const showStatusUpdateVerificationModal = ref(false);
const isInvoiceLoading = ref(false)


// Instead of a single value
const expandedWorkflowIds = ref<string[]>([]);

const toggleExpand = (workflowId: string) => {
  const index = expandedWorkflowIds.value.indexOf(workflowId)
  if (index > -1) {
    // Collapse if already expanded
    expandedWorkflowIds.value.splice(index, 1)
  } else {
    // Expand if not yet expanded
    expandedWorkflowIds.value.push(workflowId)
  }
}


useHead({
  title: 'Production Orders'
})

const router = useRouter();
const route = useRoute();

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,

});

const productionOrderStatusUpdateForm = reactive({
  id: '',
  status: '',
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const isShimmerLoading = ref(true);
 const productionOrderList =  ref<ProductionOrder[]>([])
const selectedProductionOrder = ref<ProductionOrder>(null)
const productionOrderStatsData = ref<ProductionOrderStats>();
 

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
  await getPaginatedProductionOrders();
}
 

 const getPaginatedProductionOrders = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getProductionOrders(filters);

        productionOrderList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch production orders !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


 const getProductionOrderSummaryData = async () => {

    
    try {
    
      let result = await getProductionRequestStats();
      productionOrderStatsData.value = result;
        

    } catch (error) {
        $toast.error('Unable to fetch production order summary!');
    } finally {
        isShimmerLoading.value = false;
    }

}


const initUpdateStatus = (productionOrder: ProductionOrder) => {

  selectedProductionOrder.value = productionOrder;
  productionOrderStatusUpdateForm.id = productionOrder.id;   
 
  showStatusUpdateModal.value = true;
  showViewModal.value = false;
  modalTitle.value = 'Update Production Order Status';
   
};

const handleStatusUpdate = async () => {

  isUpdatingStatus.value = true;

   try {

      let isSuccessful = await updateProductionOrderStatus(productionOrderStatusUpdateForm);

      if (isSuccessful) {

        $toast.success('Production order status updated !');

        productionOrderStatusUpdateForm.id = '';
        productionOrderStatusUpdateForm.status = '';
         
        await getPaginatedProductionOrders();

      }
      else {
        $toast.error('Unable to update production order status !');
      }

    } catch (error) {
       $toast.error('Unable to update production order status !');
    }
   finally {
      
      isUpdatingStatus.value = false;
      showStatusUpdateModal.value = false
      showStatusUpdateVerificationModal.value = false;
    } 

 }

 const closeStatusUpdateModal = () => {
   showStatusUpdateModal.value = false;
 }

 const confirmEstimateStatusUpdate = () => {
  
   showStatusUpdateVerificationModal.value = true;
   showStatusUpdateModal.value = false;

}

const debouncedSearch = debounce(() => {
  filters.pageNo = 1; // Reset to first page for new search
  getPaginatedProductionOrders();
}, 300); // 300ms delay
   
watch(() => filters.query, debouncedSearch);
 
onMounted(async () => {
  if (!isEmpty(route.query)) {
    filters.pageNo = parseInt(route.query.pageNo as string);
  }
  await getProductionOrderSummaryData();
  await getPaginatedProductionOrders();
  
});

 

const getStatusColor = (status) => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-800'
    case 'Pending': return 'bg-yellow-100 text-yellow-800'
    case 'Overdue': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const calculateTotalTax = (taxes) => {
  if (!taxes || !taxes.length) return 0;
  return taxes.reduce((sum, tax) => sum + (tax.taxAmount || 0), 0);
}


 


const downloadInvoice = async (invoice: ProductionOrder) => {
  if (import.meta.server) return; // Skip if somehow triggered on server

  const html2pdf = (await import('html2pdf.js')).default;

  const invoiceContent = document.getElementById('invoice-content');
  if (!invoiceContent) return;

  const opt = {
    margin: 0.5,
    filename: `Invoice-${invoice.invoiceNumber || 'invoice'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: true,
      allowTaint: true,
    },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  try {
    $toast.info('Preparing invoice for download...');
    await html2pdf().from(invoiceContent).set(opt).save();
    $toast.success('Invoice downloaded successfully');
  } catch (error) {
    console.error('Error downloading invoice:', error);
    $toast.error('Failed to download invoice');
  }
};


 

const closeViewModal = () => {
  showViewModal.value = false
  selectedInvoice.value = null
}

const addItem = () => {
  newInvoice.value.items.push({ description: '', quantity: 1, price: 0 })
}

 

 
</script>