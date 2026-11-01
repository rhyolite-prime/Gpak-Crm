<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Signatories</h1>
        <p class="text-sm text-gray-500 mt-1"> Manage authorized individuals responsible for approving and signing transactions. </p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Signatories..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button 
          @click="resetForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Signatory</span>
        </button>
      </div>
    </div>

  
    <!-- Signatories Table -->
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
                Designation
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone No
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="signatory in signatoryList" 
              :key="signatory.id"
              class="hover:bg-gray-50 transition-colors"
            >
               
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ signatory.name }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ signatory.designation }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ signatory.phoneNo }}</div>
              </td>
               
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                   
                  <button 
                    @click="initUpdate(signatory)"
                    class="text-green-600 hover:text-green-900">
                    <Edit class="w-4 h-4" />
                  </button>
                 
                  <button 
                    @click="initDelete(signatory)"
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

    <!-- Create Signatory -->
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
                <label class="block text-sm font-medium text-gray-700 mb-1"> Name</label>
                <input 
                  v-model="signatoryForm.name"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> Designation</label>
                <input 
                  v-model="signatoryForm.designation"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> Phone No</label>
                <input 
                  v-model="signatoryForm.phoneNo"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
              </div>

              <!-- <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> Signature Image URL</label>
                <input 
                  v-model="signatoryForm.signatureImageUrl"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
              </div> -->

            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button 
                type="button" 
                @click="saveSignatory"
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
      :item-name="'Signatory'"
      @close="closeDeleteModal"
      @confirm="delSignatory"
    />

    
  </div>
</template>

<script lang="ts" setup>
import type { Signatory } from "~/models";
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
const signatoryForm = reactive({
  name: '',
  designation: '',
  phoneNo: '',
  signatureImageUrl: '',
});

//product form fields end
const signatoryList = ref<Signatory[]>([])
const selectedSignatory = ref<Signatory>()
const id = ref('')
const modalTitle = ref('')
 
 
useHead({
  title: 'Signatories'
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
    await getPaginatedSignatory()
}



 const getPaginatedSignatory = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getSignatories(filters);

        signatoryList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch signatories !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


const saveSignatory = async () => {

  let payload = { ...signatoryForm };

  isCreating.value = true;

  if (isEmpty(id.value)) {

    try {

      let isSuccessful = await createSignatory(payload);

      if (isSuccessful) {

        $toast.success('Signatory saved!');

        id.value = ''

        await getPaginatedSignatory();

      }
      else {
        $toast.error('Unable to create signatory !');
      }

    } catch (error) {
      $toast.error('Unable to create signatory !');

    }
    finally {

      isCreating.value = false;
      showCreateModal.value = false
    }

  } else {

    try {

      let isSuccessful = await updateSignatory({ ...payload, id: id.value, });

      if (isSuccessful) {

        $toast.success('Signatory updated!');

        await getPaginatedSignatory();

        id.value = '';

      }
      else {

        $toast.error('Unable to update signatory !');

      }

    } catch (error) {
      $toast.error('Unable to update signatory !');

    } finally {

      isCreating.value = false;
      showCreateModal.value = false
    }
  }


}


const initUpdate = (signatory: Signatory) => {

  signatoryForm.name = signatory.name;
  signatoryForm.designation = signatory.designation;
  signatoryForm.phoneNo = signatory.phoneNo;
  signatoryForm.signatureImageUrl = signatory.signatureImageUrl;

  id.value = signatory.id;

  modalTitle.value = 'Update Signatory';

  showCreateModal.value = true;
}


const initDelete = (signatory: Signatory) => {

  id.value = signatory.id;

  modalTitle.value = 'Delete Signatory';

  showDeleteConfirmationModal.value = true;
}

 

const delSignatory = async () => {
    
  isDeleting.value = true;
    
    try {
      let isSuccessful = await deleteSignatory(id.value);
      if (isSuccessful) {

        $toast.success('Signatory deleted !');

        await getPaginatedSignatory();

      }
      else {
        $toast.error('Unable to delete signatory !');
      }
    } catch (error) {
      $toast.error('Unable to delete signatory !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }
 


const resetForm = () => { 

  showCreateModal.value = true
  signatoryForm.name = '';
  signatoryForm.designation = '';
  signatoryForm.phoneNo = '';
  signatoryForm.signatureImageUrl = '';
  
  id.value = ''
  modalTitle.value = 'Create Signatory'

}

  const closeModal = () => {
    showCreateModal.value = false
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedSignatory();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedSignatory();

  });



 
</script>