<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Inventory Items</h1>
        <p class="text-sm text-gray-500 mt-1"> Essential inputs for production and quality output. </p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Products or Service..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button 
          @click="initItemForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Add Item</span>
        </button>

        <button 
          @click="initServiceForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>
    </div>


    <!-- Product Categories Table -->
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
                SKU
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Stock
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variants
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Cost Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Selling Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active ?
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="rawMaterial in rawMaterialList" 
              :key="rawMaterial.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ rawMaterial.sku }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ rawMaterial.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ rawMaterial.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ rawMaterial.unitOfMeasure }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ rawMaterial.currentStock }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  <span v-if="(rawMaterial as any).variants?.length" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {{ (rawMaterial as any).variants.length }} variant(s)
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ rawMaterial.standardCost }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ rawMaterial.sellingPrice }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="rawMaterial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ rawMaterial.isActive ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="initUpdate(rawMaterial)"
                    class="text-green-600 hover:text-green-900">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button 
                    @click="initDelete(rawMaterial)"
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
      <div class="modal-content overflow-y-auto max-h-[90vh]" style="max-width: 800px; width: 100%;" @click.stop>
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
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- SKU -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                      <input 
                        v-model="rawMaterialForm.sku"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      >
                    </div>

                    <!-- Name -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        v-model="rawMaterialForm.name"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      >
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        v-model="rawMaterialForm.description"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      ></textarea>
                    </div>

                    <!-- Unit of Measure -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                      <select 
                        v-model="rawMaterialForm.unitOfMeasureId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option disabled value="">Select Unit of Measure</option>
                        <option 
                          v-for="uom in uomList" 
                          :key="uom.id" 
                          :value="uom.id"
                        >
                          {{ uom.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Current Stock -->
                    <div v-if="!isServiceMode">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                      <input v-model="rawMaterialForm.currentStock" type="number" step="0.01" :disabled="isServiceMode" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                    </div>


                    <!-- Standard Cost -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Standard Cost</label>
                      <input 
                        v-model="rawMaterialForm.standardCost"
                        type="number"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                    </div>

                    <!-- Selling Price -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                      <input 
                        v-model="rawMaterialForm.sellingPrice"
                        type="number"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                    </div>

                    <!-- Active & Is Service Toggles (shared row) -->
                    <div class="flex items-center justify-start space-x-6 md:col-span-2">
                      <div class="flex items-center space-x-2">
                        <input 
                          v-model="rawMaterialForm.isActive"
                          type="checkbox"
                          class="h-4 w-4 text-red-600 border-gray-300 rounded"
                        >
                        <label class="text-sm font-medium text-gray-700">Is Active</label>
                      </div>

                      <div 
                        class="flex items-center space-x-2"
                        v-if="isServiceMode"
                      >
                        <input 
                          v-model="rawMaterialForm.isService"
                          type="checkbox"
                          class="h-4 w-4 text-red-600 border-gray-300 rounded"
                        >
                        <label class="text-sm font-medium text-gray-700">Is Service</label>
                      </div>
                    </div>

                    <!-- Variants Section -->
                    <div class="md:col-span-2 mt-4 border-t pt-4">
                      <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900">Variants & Options</h3>
                        <button type="button" @click="addVariant" class="text-sm text-red-600 hover:text-red-800 flex items-center font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                          <Plus class="w-4 h-4 mr-1" /> Add Variant
                        </button>
                      </div>
                      
                      <div v-if="rawMaterialForm.variants.length === 0" class="text-sm text-gray-500 italic p-6 bg-gray-50 rounded-lg text-center border border-dashed border-gray-300">
                        No variants added. This item does not have any variants.
                      </div>

                      <div v-for="(variant, vIndex) in rawMaterialForm.variants" :key="vIndex" class="mb-4 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden shadow-sm">
                        <div class="p-4 border-b border-gray-200 bg-white flex justify-between items-start gap-4">
                          <div class="flex-1 grid grid-cols-2 gap-4">
                            <div>
                              <label class="block text-xs font-medium text-gray-700 mb-1">Variant Name (e.g., 60 GSM) <span class="text-red-500">*</span></label>
                              <input v-model="variant.name" type="text" class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-red-500 focus:border-red-500" placeholder="Variant name" required>
                            </div>
                            <div>
                              <label class="block text-xs font-medium text-gray-700 mb-1">Base Cost <span class="text-red-500">*</span></label>
                              <input v-model.number="variant.baseCost" type="number" step="0.01" class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-red-500 focus:border-red-500" placeholder="Base cost" required>
                            </div>
                          </div>
                          <button type="button" @click="removeVariant(vIndex)" class="text-gray-400 hover:text-red-600 mt-6" title="Remove Variant">
                            <Trash2 class="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div class="p-4 bg-gray-50">
                          <div class="flex justify-between items-center mb-3">
                            <label class="block text-sm font-medium text-gray-700">Options (e.g., Sizes)</label>
                            <button type="button" @click="addOption(vIndex)" class="text-xs text-red-600 hover:text-red-800 font-medium bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">+ Add Option</button>
                          </div>
                          
                          <div v-if="variant.options.length === 0" class="text-xs text-gray-500 italic mb-2">No options for this variant.</div>
                          
                          <div class="space-y-2">
                            <div v-for="(option, oIndex) in variant.options" :key="oIndex" class="flex items-center gap-3 bg-white p-2 rounded border border-gray-200">
                              <div class="flex-1">
                                <input v-model="option.name" type="text" class="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-red-500 focus:border-red-500" placeholder="Option name (e.g. 30x40)" required>
                              </div>
                              <div class="flex-1">
                                <input v-model.number="option.costImpact" type="number" step="0.01" class="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-red-500 focus:border-red-500" placeholder="Cost impact" required>
                              </div>
                              <button type="button" @click="removeOption(vIndex, oIndex)" class="text-gray-400 hover:text-red-600">
                                <X class="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" @click="closeModal" class="btn-secondary">
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      @click="saveRawMaterial"
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
      :item-name="'Raw Material'"
      @close="closeDeleteModal"
      @confirm="delRawMaterial"
    />

    
  </div>
</template>

<script lang="ts" setup>
import type { RawMaterial, Uom } from "~/models";
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
import { initCustomFormatter } from "vue";

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const showCreateModal = ref(false)
const showDeleteConfirmationModal = ref(false)
const isCreating = ref(false)
const isDeleting = ref(false)
const isShimmerLoading = ref(true);
//product form fields

const rawMaterialForm = reactive({
  sku: '',
  name: '',
  description: '',
  unitOfMeasure: '',
  unitOfMeasureId: '',
  currentStock: null as number | null,
  costingMethod: 'FIFO',
  standardCost: null as number | null,
  sellingPrice: null as number | null,
  isActive: true,
  isService: false,
  variants: [] as any[]
});

//product form fields end
const rawMaterialList = ref<RawMaterial[]>([]);
const selectedRawMaterial = ref<RawMaterial>()
const uomList = ref<Uom[]>([])
const id = ref('')
const modalTitle = ref('');
const isServiceMode = ref(false);
 
 
useHead({
  title: 'Inventory Items'
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
    await getPaginatedRawMaterials()
}


const getAllUom = async () => {

    let result = await getUnitOfMeasures({pageNo: 1, pageSize: 100000});

    uomList.value = result.data;
 
}

 const getPaginatedRawMaterials = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getRawMaterials(filters);

        rawMaterialList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch raw materials !');
    } finally {

      isShimmerLoading.value = false;
      
    }

 }


const saveRawMaterial = async () => {

  //use the unit of measure id to get the unit of measure name

  rawMaterialForm.unitOfMeasure = uomList.value.find(uom => uom.id === rawMaterialForm.unitOfMeasureId)?.name;

  let payload = { ...rawMaterialForm };

  isCreating.value = true;

  if (isEmpty(id.value)) {


    try {

      let isSuccessful = await createRawMaterial(payload);

      if (isSuccessful) {

        $toast.success('Raw Material saved!');

        id.value = ''
        await getPaginatedRawMaterials();

      }
      else {
        $toast.error('Unable to create inventory item !');
      }

    } catch (error) {
      $toast.error('Unable to create inventory item !');

    }
    finally {
      isCreating.value = false;
      showCreateModal.value = false
    }

  } else {

    try {

      let isSuccessful = await updateRawMaterial({ ...payload, id: id.value, });

      if (isSuccessful) {

        $toast.success('Raw Material updated!');

        await getPaginatedRawMaterials();

        id.value = '';

      }
      else {

        $toast.error('Unable to update raw material !');

      }

    } catch (error) {
      $toast.error('Unable to update raw material !');

    } finally {

      isCreating.value = false;
      showCreateModal.value = false
    }
  }


  }

	 

const initUpdate = (rawMaterial: RawMaterial) => {


  rawMaterialForm.sku = rawMaterial.sku || '';
  rawMaterialForm.name = rawMaterial.name;
  rawMaterialForm.description = rawMaterial.description;
  rawMaterialForm.unitOfMeasureId = rawMaterial.unitOfMeasureId;
  rawMaterialForm.currentStock = rawMaterial.currentStock;
  rawMaterialForm.costingMethod = rawMaterial.costingMethod || 'FIFO';
  rawMaterialForm.standardCost = rawMaterial.standardCost;
  rawMaterialForm.sellingPrice = rawMaterial.sellingPrice;
  rawMaterialForm.isActive = rawMaterial.isActive;
  rawMaterialForm.variants = (rawMaterial as any).variants ? JSON.parse(JSON.stringify((rawMaterial as any).variants)) : [];
  

  id.value =  rawMaterial.id;
 

  modalTitle.value = 'Update Raw Material';

  showCreateModal.value = true;
}


const initDelete = (rawMaterial: RawMaterial) => {
   

  id.value = rawMaterial.id;

  modalTitle.value = 'Delete Raw Material';

  showDeleteConfirmationModal.value = true;
}

 

const delRawMaterial = async () => {
    
  isDeleting.value = true;
    
    try {
      let isSuccessful = await deleteRawMaterial(id.value);
      if (isSuccessful) {

        $toast.success('Raw Material deleted !');

        await getPaginatedRawMaterials();
      }
      else {
        $toast.error('Unable to delete raw material !');
      }
    } catch (error) {
      $toast.error('Unable to delete raw material !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }

  
 
  

const initItemForm = () => { 
  isServiceMode.value = false
  showCreateModal.value = true
  rawMaterialForm.sku = ''
  rawMaterialForm.name = ''
  rawMaterialForm.description = ''
  rawMaterialForm.unitOfMeasureId = ''
  rawMaterialForm.currentStock = 0
  rawMaterialForm.costingMethod = 'FIFO'
  rawMaterialForm.standardCost = 0
  rawMaterialForm.sellingPrice = 0
  rawMaterialForm.isActive = true
  rawMaterialForm.isService = false;
  rawMaterialForm.variants = [];

  id.value = ''
  modalTitle.value = 'Create New Item'

}

const initServiceForm = () => { 

  isServiceMode.value = true;
  showCreateModal.value = true
  rawMaterialForm.sku = ''
  rawMaterialForm.name = ''
  rawMaterialForm.description = ''
  rawMaterialForm.unitOfMeasureId = ''
  rawMaterialForm.currentStock = 0
  rawMaterialForm.costingMethod = 'FIFO'
  rawMaterialForm.standardCost = 0
  rawMaterialForm.sellingPrice = 0
  rawMaterialForm.isActive = true
  rawMaterialForm.isService = true
  rawMaterialForm.variants = [];


  id.value = ''
  modalTitle.value = 'Create New Service'

}

  const addVariant = () => {
    rawMaterialForm.variants.push({
      name: '',
      baseCost: 0,
      options: []
    });
  };

  const removeVariant = (index: number) => {
    rawMaterialForm.variants.splice(index, 1);
  };

  const addOption = (variantIndex: number) => {
    rawMaterialForm.variants[variantIndex].options.push({
      name: '',
      costImpact: 0
    });
  };

  const removeOption = (variantIndex: number, optionIndex: number) => {
    rawMaterialForm.variants[variantIndex].options.splice(optionIndex, 1);
  };

  const closeModal = () => {
    showCreateModal.value = false
     
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedRawMaterials();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);


  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    await getPaginatedRawMaterials();
    await getAllUom();

  });



 
</script>