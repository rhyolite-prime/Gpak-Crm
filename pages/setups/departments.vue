<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Departments</h1>
        <p class="text-sm text-gray-500 mt-1"> Structured units & divisions that power your operations </p>
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
          <span>Create Department</span>
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
                Name
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="department in departmentList" 
              :key="department.id"
              class="hover:bg-gray-50 transition-colors"
            >
               
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ department.name }}</div>
              </td>

               
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                   
                  <button 
                    @click="initUpdate(department)"
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input 
                  v-model="departmentForm.name"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parent Department</label>
                 
                <select 
                  v-model="departmentForm.parentId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required>
                  <option value="">Select Parent Department</option>
                  <option 
                    v-for="department in departmentDropDownList" 
                    :key="department.id" 
                    :value="department.id">
                    {{ department.categoryHierarchy }}
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
                @click="saveDepartment"
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
      :item-name="'Department'"
      @close="closeDeleteModal"
      @confirm="delDepartment"
    />

    
  </div>
</template>

<script lang="ts" setup>
import type { Department } from "~/models";
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
const departmentForm = reactive({
  name: '',
  parentId: '',
});

//product form fields end
const departmentList = ref<Department[]>([])
const departmentDropDownList = ref<Department[]>([])
const selectedProductCategory = ref<Department>()
const id = ref('')
const modalTitle = ref('')
 
 
useHead({
  title: 'Department'
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
    await getPaginatedDepartments()
}

const buildDepartmentHierarchy = async (departments: Department[]) => {
  try {
    const departmentMap = new Map<string, Department>();
    departments.forEach(dept => departmentMap.set(dept.id, dept));

    const getHierarchy = (department: Department): string => {
      if (!department.parentId || department.parentCategoryId === '' || department.parentCategoryId === generateEmptyGuid()) {
        return department.name;
      }
      const parent = departmentMap.get(department.parentId);
      if (!parent) {
        return department.name;
      }
      return getHierarchy(parent) + '/' + department.name;
    };

    return departments.map(dept => ({
      ...dept,
      categoryHierarchy: getHierarchy(dept),
    }));
  } catch (error) {
    $toast.error('Error building department hierarchy');
    return departments;
  }
};

  const getAllDepartments = async () => {

    let result = await getDepartments({pageNo: 1, pageSize: 100000});

    const departmentsWithHierarchy = await buildDepartmentHierarchy(result.data);

    departmentDropDownList.value = departmentsWithHierarchy;
 
}

 const getPaginatedDepartments = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getDepartments(filters);

        //const categoriesWithHierarchy = await buildCategoryHierarchy(result.data);

        departmentList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch departments !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


const saveDepartment = async () => {

  let payload = { ...departmentForm, parentId: isEmpty(departmentForm.parentId) ? generateEmptyGuid() : departmentForm.parentId };

  isCreating.value = true;

  if (isEmpty(id.value)) {

    try {

      let isSuccessful = await createDepartment(payload);

      if (isSuccessful) {

        $toast.success('Product Category saved!');

        id.value = ''
        await getPaginatedDepartments();
        await getAllDepartments();


      }
      else {
        $toast.error('Unable to create department !');
      }

    } catch (error) {
      $toast.error('Unable to create department !');

    }
    finally {
      isCreating.value = false;
      showCreateModal.value = false
    }

  } else {

    try {

      let isSuccessful = await updateDepartment({ ...payload, id: id.value, });

      if (isSuccessful) {

        $toast.success('Product Category updated!');

        await getPaginatedDepartments();
        await getAllDepartments();

        id.value = '';

      }
      else {

        $toast.error('Unable to update department !');

      }

    } catch (error) {
      $toast.error('Unable to update department !');

    } finally {

      isCreating.value = false;
      showCreateModal.value = false
    }
  }


  }


const initUpdate = (department: Department) => {

  id.value = department.id;

  modalTitle.value = 'Update Department';

  showCreateModal.value = true;
}


const initDelete = (department: Department) => {

  id.value = department.id;

  modalTitle.value = 'Delete Department';

  showDeleteConfirmationModal.value = true;
}

 

  const delDepartment = async () => {

    isDeleting.value = true;

    try {
      let isSuccessful = await deleteDepartment(id.value);

      if (isSuccessful) {
        
        $toast.success('Department deleted !');

        await getPaginatedDepartments();
        await getAllDepartments();

      }
      else {
        $toast.error('Unable to delete department !');
      }
    } catch (error) {
      $toast.error('Unable to delete department !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }

  
 
  

const resetForm = () => { 

  showCreateModal.value = true
  departmentForm.name = '';
  departmentForm.parentId = '';
  
  id.value = ''
  modalTitle.value = 'Create Department'

}

  const closeModal = () => {
    showCreateModal.value = false
     
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedDepartments();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);


  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    await getPaginatedDepartments();
    await getAllDepartments();

  });



 
</script>