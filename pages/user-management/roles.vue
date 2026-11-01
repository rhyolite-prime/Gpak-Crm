<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Roles</h1>
        <p class="text-sm text-gray-500 mt-1">Define and manage user roles and permissions</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Roles..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button 
          @click="resetForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Role</span>
        </button>
      </div>
    </div>

   

    <!-- Role Table -->
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
                Display Name
              </th>
              
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="role in roleList" 
              :key="role.id"
              class="hover:bg-gray-50 transition-colors">
               
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ role.name }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ role.displayName }}</div>
              </td>
               
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                   
                  <button 
                    @click="initUpdate(role)"
                    class="text-green-600 hover:text-green-900">
                    <Edit class="w-4 h-4" />
                  </button>
                 
                  <button 
                    @click="initDelete(role)"
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

    <!-- Create Role Modal -->
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

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  v-model="name"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input 
                  v-model="displayName"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
              </div>
              
            </div>

            <div class="grid grid-cols-1 md:grid-cols-1 gap-2">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="description" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"></textarea>

              </div>

            </div>

            <div class="grid grid-cols-1 md:grid-cols-1 gap-2">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Select Permissions:</label>
                
                <VueMultiselect
								   v-model="permissionInfo"
								   :close-on-select="false"
								   :clear-on-select="false"
								   :hide-selected="true"
								   :preserve-search="true"
								   placeholder="Select Permission"
								   label="displayName"
								   track-by="name"
								   :multiple="true"
								   :options="permissionList">
								 </VueMultiselect>

              </div>

            </div>


            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button 
                type="button" 
                @click="saveRole"
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
      :item-name="'Role'"
      @close="closeDeleteModal"
      @confirm="delRole"
    />

    
  </div>
</template>

<script lang="ts" setup>
import type { Role, RolePermision } from "~/models";
import { isEmpty, debounce } from "lodash-es";
import VueMultiselect from 'vue-multiselect'
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
const roleList = ref<Role[]>([])
const selectedRole= ref<Role>()
const id = ref('')
const modalTitle = ref('');
const name = ref("");
const displayName = ref("");
const description = ref("");
const grantedPermissions = ref<string[]>([]);
 const permissionList =  ref<RolePermision[]>([])
const permissionInfo = ref<RolePermision[]>([]);
 
useHead({
  title: 'Role'
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
    await getPaginatedRoles()
}
 

const getAllPermissions = async () => {

	let result = await getPermissions();

	permissionList.value = result;

}

 const getPaginatedRoles = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getRoles(filters);

        roleList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch roles !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


const saveRole = async () => {
  let payload = {
    name: name.value,
    description: description.value,
    displayName: displayName.value,
    grantedPermissions: grantedPermissions.value,
  }

  isCreating.value = true;

  // Use strict equality instead of lodash isEmpty to safely handle numeric IDs
  if (id.value === '') {
    try {
      let isSuccessful = await createRole(payload);
      if (isSuccessful) {
        $toast.success('Role saved!');
        id.value = ''
        await getPaginatedRoles();
      } else {
        $toast.error('Unable to create role !');
      }
    } catch (error) {
      $toast.error('Unable to create role !');
    } finally {
      isCreating.value = false;
      showCreateModal.value = false
    }

  } else {
    try {
      let isSuccessful = await updateRole({ ...payload, id: id.value });
      if (isSuccessful) {
        $toast.success('Role updated!');
        await getPaginatedRoles();
        id.value = '';
      } else {
        $toast.error('Unable to update role !');
      }
    } catch (error) {
      $toast.error('Unable to update role !');
    } finally {
      isCreating.value = false;
      showCreateModal.value = false
    }
  }
}
	 

const initUpdate = async (roleInfo: Role) => {
  selectedRole.value = roleInfo;

  name.value = roleInfo.name;
  description.value = roleInfo.description;
  displayName.value = roleInfo.displayName;
  
  // Clear the multiselect before fetching
  permissionInfo.value = [];

  // Use a different variable name to avoid shadowing the grantedPermissions ref
  let fetchedPermissions = await getGrantedPermissionsByRoleId(roleInfo.id);

  console.log('grantedPermissions->', fetchedPermissions);

  // Assign the fetched objects to permissionInfo to pre-populate the VueMultiselect
  permissionInfo.value = fetchedPermissions;
  
  // Note: Your existing watch(permissionInfo, ...) will automatically extract 
  // the names from fetchedPermissions and populate grantedPermissions.value

  id.value = roleInfo.id;

  modalTitle.value = 'Update Role';

  showCreateModal.value = true;
}


const initDelete = (role: Role) => {
  selectedRole.value = role;

  id.value = role.id;

  modalTitle.value = 'Delete Role';

  showDeleteConfirmationModal.value = true;
}

 

  const delRole = async () => {
    isDeleting.value = true;
    try {
      let isSuccessful = await deleteRole(id.value);
      if (isSuccessful) {
        $toast.success('Role deleted !');
        await getPaginatedRoles();
      }
      else {
        $toast.error('Unable to delete role !');
      }
    } catch (error) {
      $toast.error('Unable to delete role !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }

  
  

const resetForm = () => { 

  showCreateModal.value = true
  name.value = '';
  displayName.value = '';
  description.value = '';
  permissionInfo.value = [];
  grantedPermissions.value = [];
  id.value = ''
  modalTitle.value = 'Create Role'

}

  const closeModal = () => {
    showCreateModal.value = false
     
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedRoles();
  }, 300); // 300ms delay


watch(() => filters.query, debouncedSearch);

watch(permissionInfo, (newVal) => {
  grantedPermissions.value = [];
  
  // Safeguard against newVal being null when the multiselect is cleared
  if (newVal && Array.isArray(newVal)) {
    for (let i = 0; i < newVal.length; i++) {
      grantedPermissions.value.push(newVal[i].name);
    }
  }
}, { deep: true }); // Required in Vue 3 to watch array mutations


  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    await getPaginatedRoles();
    
    await getAllPermissions();

  });
 
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>