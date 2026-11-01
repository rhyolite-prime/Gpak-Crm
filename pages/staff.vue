<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Staff</h1>
        <p class="text-sm text-gray-500 mt-1"> Manage your Staff </p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Staff..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button
          @click="resetForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Staff</span>
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
                Employee ID
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>

               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Surname
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marital Status
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone No.
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>


              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="staff in staffList" 
              :key="staff.id"
              class="hover:bg-gray-50 transition-colors"
            >
               
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ staff.employeeIdentifier }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ staff.firstName }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ staff.lastName }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ staff.gender }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ staff.departmentName }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ staff.maritalStatus }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ staff.phoneNumber }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ staff.email }}</div>
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

    <!-- Create staff Modal -->
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
                    <!-- SKU -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                      <input 
                        v-model="staffForm.employeeIdentifier"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                    </div>

                    <!-- Name -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input 
                        v-model="staffForm.firstName"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input 
                        v-model="staffForm.lastName"
                        type="text"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                    </div>

                     
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Other Name</label>
                       <input 
                        v-model="staffForm.otherName"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                       
                      <select 
                        v-model="staffForm.departmentId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option disabled value="">Select Department</option>
                        <option 
                          v-for="department in departmentDropDownList" 
                          :key="department.id" 
                          :value="department.id"
                        >
                          {{ department.departmentHierarchy }}
                        </option>
                      </select>

                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>

                      <select 
                        v-model="staffForm.title"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <option value="">Select Title</option>
                        <option>Mr</option>
                          <option>Mrs</option>
                          <option>Ms</option>
                          <option>Miss</option>
                          <option>Dr</option>
                          <option>Prof</option>
                          <option>Rev</option>
                          <option>Hon</option>
                          <option>Sir</option>
                          <option>Madam</option>
                          <option>Chief</option>
                          <option>Capt</option>
                          <option>Col</option>
                          <option>Maj</option>
                          <option>Lt</option>
                          <option>Engr</option>
                          <option>Arch</option>
                          <option>Pastor</option>
                          <option>Imam</option>
                          <option>Elder</option>
                          <option>Justice</option>
                          <option>HRH</option>
                          <option>Hajia</option>
                          <option>Nana</option>

                      </select>

                    </div>
                     
                     
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                       
                      <select 
                        v-model="staffForm.gender"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <option>Male</option>
                        <option>Female</option>
                      </select>

                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                       
                      <select 
                        v-model="staffForm.status"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="OnLeave">OnLeave</option>
                        <option value="Terminated">Terminated</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Probation">Probation</option>
                        <option value="Retired">Retired</option>
                      </select>

                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Date Appointed</label>

                      <input 
                        v-model="staffForm.dateAppointed"
                        type="date"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >

                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>

                      <select 
                        v-model="staffForm.maritalStatus"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                        <option>Separated</option>
                         
                      </select>

                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                       <input 
                        v-model="staffForm.phoneNumber"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                       <input 
                        v-model="staffForm.email"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                    </div>
                    

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                      <input 
                          type="file"
                          class="w-full h-[42px] px-3 border border-gray-300 rounded-lg text-sm file:mr-3 file:py-2 file:px-3 file:border-0 file:bg-gray-100 file:text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                       <input 
                        v-model="staffForm.residenceAddress"
                        type="text"
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
                      @click="saveStaff"
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
      :item-name="'Staff'"
      @close="closeDeleteModal"
      @confirm="delStaff"
    />

    
  </div>
</template>

<script lang="ts" setup>
import type { Staff, Department } from "~/models";
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
//staff form fields
const staffForm = reactive({
  firstName: '',
  lastName: '',
  otherName: '',
  gender: '',
  phoneNumber: '',
  email: '',
  address: '',
  departmentId: '',
  departmentName: '',
  dateAppointed: '',
  status: 'Active',
  residenceAddress: '',
  employeeIdentifier: ''
});

//product form fields end
const staffList = ref<Staff[]>([])
 const departmentDropDownList = ref<Department[]>([])
const id = ref('')
const modalTitle = ref('')
 
 
useHead({
  title: 'Staff'
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
    await getPaginatedStaffs()
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
      departmentHierarchy: getHierarchy(dept),
    }));
  } catch (error) {
    $toast.error('Error building department hierarchy');
    return departments;
  }
};

const getAllDepartments = async () => {

  let result = await getDepartments({pageNo: 1, pageSize: 10000});

  const departmentsWithHierarchy = await buildDepartmentHierarchy(result.data);

  departmentDropDownList.value = departmentsWithHierarchy;

}


 const getPaginatedStaffs = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getStaffs(filters);

        staffList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch staff !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


const saveStaff = async () => {
  // Set departmentName based on selected departmentId before creating payload
  const selectedDepartment = departmentDropDownList.value.find(
    (department) => department.id === staffForm.departmentId
  );
  if (selectedDepartment) {
    staffForm.departmentName = selectedDepartment.name;
  }

  let payload = { ...staffForm };

  console.log(payload);

  isCreating.value = true;

  if (isEmpty(id.value)) {
    try {
      let isSuccessful = await createStaff(payload);
      if (isSuccessful) {
        $toast.success('Staff saved!');
        id.value = ''
        await getPaginatedStaffs();
      }
      else {
        $toast.error('Unable to create staff !');
      }
    } catch (error) {
      $toast.error('Unable to create staff !');
    }
    finally {
      isCreating.value = false;
      showCreateModal.value = false
    }
  } else {
    try {
      let isSuccessful = await updateStaff({ ...payload, id: id.value, });
      if (isSuccessful) {
        $toast.success('Staff updated!');
        await getPaginatedStaffs();
        id.value = '';
      }
      else {
        $toast.error('Unable to update staff !');
      }
    } catch (error) {
      $toast.error('Unable to update staff !');
    } finally {
      isCreating.value = false;
      showCreateModal.value = false
    }
  }
}


const initUpdate = (staff: Staff) => {
  // Populate the staff form with existing data
  Object.assign(staffForm, {
    firstName: staff.firstName || '',
    lastName: staff.lastName || '',
    otherName: staff.otherName || '',
    gender: staff.gender || '',
    phoneNumber: staff.phoneNumber || '',
    email: staff.email || '',
    address: staff.address || '',
    departmentId: staff.departmentId || '',
    departmentName: staff.departmentName || '',
    dateJoined: staff.dateJoined || '',
    status: staff.status || 'Active',
    residenceAddress: staff.residenceAddress || '',
    employeeIdentifier: staff.employeeIdentifier || '',
    title: staff.title || '',
    maritalStatus: staff.maritalStatus || '',
    dateAppointed: staff.dateAppointed || ''
  });

  // Set id and modal title
  id.value = staff.id;
  modalTitle.value = 'Update Staff';
  showCreateModal.value = true;
}


const initDelete = (staff: Staff) => {

  id.value = staff.id;

  modalTitle.value = 'Delete Staff';

  showDeleteConfirmationModal.value = true;
}

 

const delStaff = async () => {
    
    isDeleting.value = true;
    
  try {
      
      let isSuccessful = await deleteStaff(id.value);
      if (isSuccessful) {

        $toast.success('Staff deleted !');

        await getPaginatedStaffs();

      }
      else {
        $toast.error('Unable to delete staff !');
      }
    } catch (error) {
      $toast.error('Unable to delete staff !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }
 


const resetForm = () => {
  // Clear all staff form fields
  Object.assign(staffForm, {
    firstName: '',
    lastName: '',
    otherName: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    departmentId: '',
    departmentName: '',
    dateJoined: '',
    status: 'Active',
    residenceAddress: '',
    employeeIdentifier: '',
    title: '',
    maritalStatus: '',
    dateAppointed: ''
  });

  // Reset modal and id
  id.value = '';
  modalTitle.value = 'Create Staff';
  showCreateModal.value = true;
}

  const closeModal = () => {
    showCreateModal.value = false
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedStaffs();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);
  

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    await getPaginatedStaffs();
    await getAllDepartments();
  
  });



 
</script>