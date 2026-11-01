<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <p class="text-sm text-gray-500 mt-1"> Configure and manage various product offerings</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Products..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button 
          @click="resetForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Product</span>
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
                Name
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Of Measurement
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Standard Cost
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Selling Price
              </th>
              
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="product in productList" 
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
               
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.name }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.category }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.unitOfMeasure }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.standardCost }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.sellingPrice }}</div>
              </td>
               
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                   
                  <button 
                    @click="initUpdate(product)"
                    class="text-green-600 hover:text-green-900">
                    <Edit class="w-4 h-4" />
                  </button>
                 
                  <button 
                    @click="initDelete(product)"
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

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  v-model="productForm.name"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                
                <select 
                  v-model="productForm.parentCategoryId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required>
                  <option value="">Select Category</option>
                  <option 
                    v-for="category in categoryList" 
                    :key="category.id" 
                    :value="category.categoryHierarchy">
                    {{ category.categoryHierarchy }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                 
                <select 
                    v-model="productForm.unitOfMeasureId"
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

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Order Quantity</label>
                <input 
                  v-model="productForm.minimumOrderQuantity"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Standard Cost</label>
                <input 
                  v-model="productForm.standardCost"
                  type="number"
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                <input 
                  v-model="productForm.sellingPrice"
                  type="number"
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
              </div>
              
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button 
                type="button" 
                @click="saveProduct"
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
      :item-name="'Product'"
      @close="closeDeleteModal"
      @confirm="delAdvertCategory"
    />

    
  </div>
</template>

<script lang="ts" setup>
import type { Product, Uom, ProductCategory } from "~/models";
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
//product form fields
const productForm = reactive({
  name: '',
  category: '',
  unitOfMeasureId: '',
  minimumOrderQuantity: '',
  standardCost: '',
  sellingPrice: ''
});
//product form fields end
const productList = ref<Product[]>([])
const uomList = ref<Uom[]>([])
const categoryList = ref<ProductCategory[]>([])
const selectedProduct = ref<Product>()
const id = ref('')
const modalTitle = ref('')
 
 
useHead({
  title: 'Products'
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
    await getPaginatedProducts()
}

const getAllUom = async () => {

    let result = await getUnitOfMeasures({pageNo: 1, pageSize: 100000});

    uomList.value = result.data;
 
}

const buildCategoryHierarchy = async (categories: ProductCategory[]) => {
  try {
    const categoryMap = new Map<string, ProductCategory>();
    categories.forEach(cat => categoryMap.set(cat.id, cat));

    const getHierarchy = (category: ProductCategory): string => {
      if (!category.parentCategoryId || category.parentCategoryId === '' || category.parentCategoryId === generateEmptyGuid()) {
        return category.name;
      }
      const parent = categoryMap.get(category.parentCategoryId);
      if (!parent) {
        return category.name;
      }
      return getHierarchy(parent) + '/' + category.name;
    };

    return categories.map(cat => ({
      ...cat,
      categoryHierarchy: getHierarchy(cat),
    }));
  } catch (error) {
    $toast.error('Error building category hierarchy');
    return categories;
  }
};

 const getAllProductCategories = async () => {

    let result = await getProductCategories({pageNo: 1, pageSize: 100000});

    const categoriesWithHierarchy = await buildCategoryHierarchy(result.data);

    categoryList.value = categoriesWithHierarchy;
 
}

 const getPaginatedProducts = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getProducts(filters);

        productList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch products !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


const saveProduct = async () => {

  productForm.unitOfMeasure = uomList.value.find(uom => uom.id === productForm.unitOfMeasureId)?.name;

  let payload = { ...productForm };

  isCreating.value = true;

  if (isEmpty(id.value)) {


    try {

      let isSuccessful = await createProduct(payload);

      if (isSuccessful) {

        $toast.success('Product saved!');

        id.value = ''
        await getPaginatedProducts();

      }
      else {
        $toast.error('Unable to create product !');
      }

    } catch (error) {
      $toast.error('Unable to create product !');

    }
    finally {
      isCreating.value = false;
      showCreateModal.value = false
    }

  } else {

    try {

      let isSuccessful = await updateProduct({ ...payload, id: id.value, });

      if (isSuccessful) {

        $toast.success('Product updated!');

        await getPaginatedProducts();
        id.value = '';

      }
      else {

        $toast.error('Unable to update product !');

      }

    } catch (error) {
      $toast.error('Unable to update product !');

    } finally {

      isCreating.value = false;
      showCreateModal.value = false
    }
  }


  }

	 

const initUpdate = (product: Product) => {

  selectedProduct.value = product;

  productForm.name = product.name;
  productForm.category = product.category;
  productForm.unitOfMeasureId = product.unitOfMeasureId;
  productForm.minimumOrderQuantity = product.minimumOrderQuantity;
  productForm.standardCost = product.standardCost;
  productForm.sellingPrice = product.sellingPrice;

  id.value = product.id;

  modalTitle.value = 'Update Product';

  showCreateModal.value = true;
}


const initDelete = (product: Product) => {
  selectedProduct.value = product;

  id.value = product.id;

  modalTitle.value = 'Delete Product';

  showDeleteConfirmationModal.value = true;
}

 

  const delProduct = async () => {
    isDeleting.value = true;
    try {
      let isSuccessful = await deleteProduct(id.value);
      if (isSuccessful) {
        $toast.success('Product deleted !');
        await getPaginatedProducts();
      }
      else {
        $toast.error('Unable to delete product !');
      }
    } catch (error) {
      $toast.error('Unable to delete product !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }

  
 
  

const resetForm = () => { 

  showCreateModal.value = true
  productForm.name = '';
  productForm.category = '';
  productForm.unitOfMeasureId = '';
  productForm.minimumOrderQuantity = '';
  productForm.standardCost = '';
  productForm.sellingPrice = '';
  id.value = ''
  modalTitle.value = 'Create Product'

}

  const closeModal = () => {
    showCreateModal.value = false
     
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedProducts();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);


  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    await getPaginatedProducts();
    await getAllUom();
    await getAllProductCategories();

  });



 
</script>