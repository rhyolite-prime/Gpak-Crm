<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Users</h1>
        <p class="text-sm text-gray-500 mt-1">Manage and view user details</p>
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
          <span>Create User</span>
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
                Username
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Last Name
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Email
              </th>

               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Phone Number
              </th>
              
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="user in userList" 
              :key="user.id"
              class="hover:bg-gray-50 transition-colors">
               
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.userName }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.name }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.surname }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.emailAddress }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.phoneNumber }}</div>
              </td>
               
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                   
                  <button v-if="user.userName !== 'admin'"
                    @click="initUpdate(user)"
                    class="text-green-600 hover:text-green-900">
                    <Edit class="w-4 h-4" />
                  </button>
                 
                  <button v-if="user.userName !== 'admin'"
                    @click="initDelete(user)"
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
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  v-model="name"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  v-model="surname"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
              </div>
              
            </div>


            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">

              <div v-if="userName != 'admin'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  v-model="userName"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="emailAddress"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
              </div>
              
            </div>


            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  v-model="phoneNumber"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
              </div>

              <div v-if="id == null">
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  v-model="password"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
              </div>

              <div v-if="id">
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                 <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" v-model="selectedRole">
                    <option v-for="role in roleList"> {{role.name}} </option>
              </select>
              </div>
              
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">

              <div v-if="id == null">
                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input 
                  v-model="passwordConfirm"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
              </div>

              <div v-if="!id">
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                 <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" v-model="selectedRole">
                    <option v-for="role in roleList"> {{role.name}} </option>
              </select>
              </div>
              
            </div>

 

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button 
                type="button" 
                @click="saveUser"
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
      :item-name="'User'"
      @close="closeDeleteModal"
      @confirm="delUser"
    />

    
  </div>
</template>

<script lang="ts" setup>
import type { Role, User } from "~/models";
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
const isLoading = ref(false);
const isShimmerLoading = ref(false);
const userList = ref<User[]>([])
const roleList =  ref<Role[]>([]);
const modalTitle = ref("");
const name = ref("");
const surname = ref("");
const userName = ref("");
const emailAddress = ref("");
const phoneNumber = ref("");
const password = ref("");
const passwordConfirm = ref("");

 const isActive = ref<boolean>(true);
 const selectedRole = ref<string | undefined>('');

 const id = ref<number | null>();
 
useHead({
  title: 'Users'
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
    await getPaginatedUsers()
}
 
const getAllRoles = async () => {

	let result = await getRoles({ pageNo: 1, pageSize: 100000 });
	roleList.value = result.data;
}
 

 const getPaginatedUsers = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getUsers(filters);

        userList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch users !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


const saveUser = async () => {


  let payload = {
    
		name: name.value,
		surname: surname.value,
		userName: userName.value,
		emailAddress: emailAddress.value,
    password: password.value,
    phoneNumber: phoneNumber.value,
		isActive: isActive.value,
		roleNames: [selectedRole.value],

	};

  isCreating.value = true;

  if (id.value == null) {

    try {

      let isSuccessful = await createUser(payload);

      if (isSuccessful) {

        $toast.success('Role saved!');

        id.value = null;
        await getPaginatedUsers();

      }
      else {
        $toast.error('Unable to create role !');
      }

    } catch (error) {
      $toast.error('Unable to create role !');

    }
    finally {
      isCreating.value = false;
      showCreateModal.value = false
    }

  } else {

    try {

      let isSuccessful = await updateUser({ ...payload, id: id.value, });

      if (isSuccessful) {

        $toast.success('User updated!');

        await getPaginatedUsers();
        id.value = null;

      }
      else {

        $toast.error('Unable to update user !');

      }

    } catch (error) {
      $toast.error('Unable to update user !');

    } finally {

      isCreating.value = false;
      showCreateModal.value = false
    }
  }


  }


const activateUserAccount = async (userId: number) => {

  try {

    let isSuccessful = await activateUser({ id: userId });
    
    if (isSuccessful) {

      await getPaginatedUsers();
    }
    
      } catch (error) {

          $toast.error('An error occurred while activating user account');
      }

}

const deactivateUserAccount = async (userId: number) => {

  try {

    let isSuccessful = await deactivateUser({ id: userId });

    if (isSuccessful) {

      await getPaginatedUsers();
    }

  } catch (error) {

      $toast.error('An error occurred while deactivating user account');
  }

}
	 

const initUpdate = (userInfo: User) => {

  name.value = userInfo.name;
	surname.value = userInfo.surname;
	userName.value = userInfo.userName;
	emailAddress.value = userInfo.emailAddress;
  phoneNumber.value = userInfo.phoneNumber;
  isActive.value = userInfo.isActive;
	selectedRole.value = userInfo.roleNames[0];
  
	id.value = userInfo.id;

  console.log(userInfo);

	modalTitle.value = 'Update User';

  showCreateModal.value = true;
}


const initDelete = (role: Role) => {

  id.value = role.id;

  modalTitle.value = 'Delete User';

  showDeleteConfirmationModal.value = true;
}

 

  const delUser = async () => {
    isDeleting.value = true;
    try {
      let isSuccessful = await deleteUser(id.value);
      if (isSuccessful) {
        $toast.success('User deleted !');
        await getPaginatedUsers();
      }
      else {
        $toast.error('Unable to delete user !');
      }
    } catch (error) {
      $toast.error('Unable to delete user !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }

   
  const closeModal = () => {
    showCreateModal.value = false
     
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedUsers();
  }, 300); // 300ms delay


watch(() => filters.query, debouncedSearch);

const resetForm = () => {
 
	name.value = '';
	surname.value = '';
	userName.value = '';
	id.value = null;
	selectedRole.value = ''
  emailAddress.value = '';
  phoneNumber.value = '';
  password.value = '';
  passwordConfirm.value = '';
  isActive.value = true;
 
	modalTitle.value = 'Add User';
  showCreateModal.value = true

} 

onMounted(async () => {
  if (!isEmpty(route.query)) {
    filters.pageNo = parseInt(route.query.pageNo as string);
  }
	await getPaginatedUsers();
  await getAllRoles();
	 
});
 
</script>
