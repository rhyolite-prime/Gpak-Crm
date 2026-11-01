<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Taxes & Rates</h1>
        <p class="text-sm text-gray-500 mt-1">Define and manage tax rules, VAT percentages, and pricing rates for your services.</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Taxes..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button 
          @click="resetForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Tax</span>
        </button>
      </div>
    </div>

   

    <!-- Advert Categories Table -->
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
                Tax
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Is Percentage ?
              </th>

               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Is Active ?
              </th>
              
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="taxRate in taxRateList" 
              :key="taxRate.id"
              class="hover:bg-gray-50 transition-colors"
            >
               
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ taxRate.name }}</div>
              </td>
               
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {{ taxRate.rate }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
              <button 
                type="button"
                disabled
                :class="[
                  'relative inline-flex items-center h-5 rounded-full w-10 transition-colors',
                  taxRate.isPercentage ? 'bg-red-600' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform',
                    taxRate.isPercentage ? 'translate-x-5' : 'translate-x-1'
                  ]"
                />
              </button>
            </td>

          <td class="px-6 py-4 whitespace-nowrap">
            <button 
              type="button"
              disabled
              :class="[
                'relative inline-flex items-center h-5 rounded-full w-10 transition-colors',
                taxRate.isActive ? 'bg-red-600' : 'bg-gray-300'
              ]"
            >
              <span
                :class="[
                  'inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform',
                  taxRate.isActive ? 'translate-x-5' : 'translate-x-1'
                ]"
              />
            </button>
          </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                   
                  <button 
                    @click="initUpdate(taxRate)"
                    class="text-green-600 hover:text-green-900">
                    <Edit class="w-4 h-4" />
                  </button>
                 
                  <button 
                    @click="initDelete(taxRate)"
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
        <base-pagination :lower-bound="paginationParams.lowerBound" 
        :upper-bound="paginationParams.upperBound"
        @on-page-changed="onPageChange"
        :page-no="filters.pageNo " 
        :total-pages="paginationParams.totalPages"
        :total-count="paginationParams.totalCount" 
        :disabled="isShimmerLoading" />
      </client-only>

    </div>

    <!-- Create Advert Category Modal -->
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

            <div class="grid grid-cols-2 md:grid-cols-1 gap-2">

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tax Name</label>
                <input 
                  v-model="taxRateForm.name"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                <input 
                  v-model="taxRateForm.rate"
                  type="number"
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
              </div>
              
            </div>

          <div>

              <label class="block text-sm font-medium text-gray-700 mb-1">Is Percentage?</label>
              <button 
              type="button"
              @click="taxRateForm.isPercentage = !taxRateForm.isPercentage"
              :class="[
                'relative inline-flex items-center h-6 rounded-full w-11 transition-colors',
                taxRateForm.isPercentage ? 'bg-red-600' : 'bg-gray-300'
              ]"
            >
              <span
                :class="[
                  'inline-block w-4 h-4 transform bg-white rounded-full transition-transform',
                  taxRateForm.isPercentage ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
              </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Is Active?</label>
            <button 
              type="button"
              @click="taxRateForm.isActive = !taxRateForm.isActive"
              :class="[
                'relative inline-flex items-center h-6 rounded-full w-11 transition-colors',
                taxRateForm.isActive ? 'bg-red-600' : 'bg-gray-300'
              ]"
            >
              <span
                :class="[
                  'inline-block w-4 h-4 transform bg-white rounded-full transition-transform',
                  taxRateForm.isActive ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>

            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button 
                type="button" 
                @click="saveTaxRate"
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
      :item-name="'Tax & Rate'"
      @close="closeDeleteModal"
      @confirm="delTaxRate"
    />

    
  </div>
</template>

<script lang="ts" setup>
import type { TaxRate } from "~/models";
import { isEmpty, debounce } from "lodash-es";
const { $toast } = useNuxtApp();

import { 
  Search, 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
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
const taxRateList = ref<TaxRate[]>([])
const selectedTaxRate = ref<TaxRate>()
const id = ref('')
const modalTitle = ref('')
 
 
useHead({
  title: 'Taxes & Rates'
})

const router = useRouter();
const route = useRoute();

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,

});

const taxRateForm = reactive({
  name: '',
  rate: 0,
  isPercentage: false,
  isActive: false,

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
    await getPaginatedTaxRates()
}
 

 const getPaginatedTaxRates = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getTaxRates(filters);

        taxRateList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch tax rates !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


const saveTaxRate = async () => {

 
  isCreating.value = true;

  if (isEmpty(id.value)) {


    try {

      let isSuccessful = await createTaxRate(taxRateForm);

      if (isSuccessful) {

        $toast.success('Tax Rate saved!');

        id.value = ''
        await getPaginatedTaxRates();

      }
      else {
        $toast.error('Unable to create tax rate !');
      }

    } catch (error) {
      $toast.error('Unable to create tax rate !');

    }
    finally {
      isCreating.value = false;
      showCreateModal.value = false
    }

  } else {

    try {

      let isSuccessful = await updateTaxRate({ ...taxRateForm, id: id.value, });

      if (isSuccessful) {

        $toast.success('Tax Rate updated!');

        await getPaginatedTaxRates();
        id.value = '';

      }
      else {

        $toast.error('Unable to update tax rate !');

      }

    } catch (error) {
      $toast.error('Unable to update tax rate !');

    } finally {

      isCreating.value = false;
      showCreateModal.value = false
    }
  }


  }

	 

const initUpdate = (taxRate: TaxRate) => {

  taxRateForm.name = taxRate.name;
  taxRateForm.rate = taxRate.rate;
  taxRateForm.isPercentage = taxRate.isPercentage;
  taxRateForm.isActive = taxRate.isActive;

  id.value = taxRate.id;

  modalTitle.value = 'Update Tax Rate';

  showCreateModal.value = true;
}


const initDelete = (taxRate: TaxRate) => {

  id.value = taxRate.id;

  modalTitle.value = 'Delete Tax Rate';

  showDeleteConfirmationModal.value = true;
}

 

  const delTaxRate = async () => {
    isDeleting.value = true;
    try {
      let isSuccessful = await deleteTaxRate(id.value);
      if (isSuccessful) {
        $toast.success('Tax Rate deleted !');
        await getPaginatedTaxRates();
      }
      else {
        $toast.error('Unable to delete tax rate !');
      }
    } catch (error) {
      $toast.error('Unable to delete tax rate !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }


const resetForm = () => { 

  showCreateModal.value = true
  id.value = ''
  taxRateForm.name = ''
  taxRateForm.rate = 0
  taxRateForm.isPercentage = false
  taxRateForm.isActive = false

  modalTitle.value = 'Create Tax Rate'

}

  const closeModal = () => {
    showCreateModal.value = false
     
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedTaxRates();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);


  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    await getPaginatedTaxRates();

  });
 
</script>