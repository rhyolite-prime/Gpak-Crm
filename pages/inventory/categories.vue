<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Categories/Print Types</h1>
        <p class="text-sm text-gray-500 mt-1">View and manage print type categories used across your production process</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Categories..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button 
          @click="resetForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Category</span>
        </button>
      </div>
    </div>

   

    <!-- Product Categories Table -->
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="category in productCategoryList" 
              :key="category.id"
              class="hover:bg-gray-50 transition-colors"
            >
               
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ category.name }}</div>
              </td>

               
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                   
                  <button 
                    @click="initUpdate(category)"
                    class="text-green-600 hover:text-green-900">
                    <Edit class="w-4 h-4" />
                  </button>
                 
                  <button 
                    @click="initDelete(category)"
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

           <div class="grid grid-cols-1 md:grid-cols-1 gap-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input 
                  v-model="productCategoryForm.name"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                 
                <select 
                  v-model="productCategoryForm.parentCategoryId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required>
                  <option value="">Select Parent Category</option>
                  <option 
                    v-for="category in categoryList" 
                    :key="category.id" 
                    :value="category.id">
                    {{ category.categoryHierarchy }}
                  </option>
                </select>
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
      :item-name="'Product Category'"
      @close="closeDeleteModal"
      @confirm="delProductCategory"
    />

    
  </div>
</template>

<script lang="ts" setup>
import type { ProductCategory } from "~/models";
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
const productCategoryForm = reactive({
  name: '',
  parentCategoryId: '',
});

//product form fields end
const productCategoryList = ref<ProductCategory[]>([])
const categoryList = ref<ProductCategory[]>([])
const selectedProductCategory = ref<ProductCategory>()
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
    await getPaginatedProductCategory()
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

 const getPaginatedProductCategory = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getProductCategories(filters);

        //const categoriesWithHierarchy = await buildCategoryHierarchy(result.data);

        productCategoryList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch product categories !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


const saveProduct = async () => {

  if (isEmpty(productCategoryForm.parentCategoryId)) {
    
    productCategoryForm.parentCategoryId = generateEmptyGuid();

  }

  let payload = { ...productCategoryForm };

  isCreating.value = true;

  if (isEmpty(id.value)) {

    try {

      let isSuccessful = await createProductCategory(payload);

      if (isSuccessful) {

        $toast.success('Product Category saved!');

        id.value = ''
        await getPaginatedProductCategory();
        await getAllProductCategories();


      }
      else {
        $toast.error('Unable to create product category !');
      }

    } catch (error) {
      $toast.error('Unable to create product category !');

    }
    finally {
      isCreating.value = false;
      showCreateModal.value = false
    }

  } else {

    try {

      let isSuccessful = await updateProductCategory({ ...payload, id: id.value, });

      if (isSuccessful) {

        $toast.success('Product Category updated!');

        await getPaginatedProductCategory();
        await getAllProductCategories();

        id.value = '';

      }
      else {

        $toast.error('Unable to update product ctaegory !');

      }

    } catch (error) {
      $toast.error('Unable to update product category !');

    } finally {

      isCreating.value = false;
      showCreateModal.value = false
    }
  }


  }


 

const initUpdate = (productCategory: ProductCategory) => {

  selectedProductCategory.value = productCategory;

  productCategoryForm.name = productCategory.name;
  productCategoryForm.parentCategoryId = productCategory.parentCategoryId;
  

  id.value = productCategory.id;

  modalTitle.value = 'Update Product Category';

  showCreateModal.value = true;
}


const initDelete = (productCategory: ProductCategory) => {
  selectedProductCategory.value = productCategory;

  id.value = productCategory.id;

  modalTitle.value = 'Delete Product Category';

  showDeleteConfirmationModal.value = true;
}

 

  const delProductCategory = async () => {
    isDeleting.value = true;
    try {
      let isSuccessful = await deleteProductCategory(id.value);
      if (isSuccessful) {
        $toast.success('Product Category deleted !');

        await getPaginatedProductCategory();
        await getAllProductCategories();

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
  productCategoryForm.name = '';
  productCategoryForm.parentCategoryId = '';
  
  id.value = ''
  modalTitle.value = 'Create Product Category'

}

  const closeModal = () => {
    showCreateModal.value = false
     
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedProductCategory();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);


  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    await getPaginatedProductCategory();
    await getAllProductCategories();

  });



 
</script>