<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Work Centers</h1>
        <p class="text-sm text-gray-500 mt-1"> Operational Units and Stations </p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Work Centers..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <button 
          @click="resetForm"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Work Center</span>
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
                Capacity/Hr
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supervisor
              </th>

               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supervisor Phone No
               </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supervisor Email
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="workCenter in workCenterList" 
              :key="workCenter.id"
              class="hover:bg-gray-50 transition-colors"
            >
               
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ workCenter.name }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ workCenter.capacityPerHour }}</div>
              </td>

               <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ workCenter.departmentName }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ workCenter.supervisorName }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ workCenter.supervisorPhoneNo }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ workCenter.supervisorEmail }}</div>
              </td>

               
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                   
                  <button 
                    @click="initUpdate(workCenter)"
                    class="text-green-600 hover:text-green-900">
                    <Edit class="w-4 h-4" />
                  </button>
                 
                  <button 
                    @click="initDelete(workCenter)"
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Work Center Name</label>
            <input 
              v-model="workCenterForm.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Capacity per Hour</label>
            <input 
              v-model.number="workCenterForm.capacityPerHour"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
      
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
            <select 
              v-model="workCenterForm.supervisorId"
              @change="onSupervisorSelect"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select Supervisor</option>
              <option 
                v-for="staff in staffList" 
                :key="staff.id"
                :value="staff.id"
              >
                {{ staff.firstName }} {{ staff.lastName }}
              </option>
            </select>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select 
              v-model="workCenterForm.departmentId"
              @change="onSupervisorSelect"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select Department</option>
              <option 
                v-for="department in departmentList" 
                :key="department.id"
                :value="department.id"
              >
                {{ department.name }} 
              </option>
            </select>
        </div>

        <div v-if="selectedSupervisor" class="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
          <h4 class="text-sm font-semibold text-gray-800 mb-1">Supervisor Details</h4>
          <p class="text-sm text-gray-700"><strong>Name:</strong> {{ selectedSupervisor.firstName }} {{ selectedSupervisor.lastName }}</p>
          <p class="text-sm text-gray-700"><strong>Phone:</strong> {{ selectedSupervisor.phoneNumber }}</p>
          <p class="text-sm text-gray-700"><strong>Email:</strong> {{ selectedSupervisor.email }}</p>
        </div>
        </div>

  <div class="pt-4">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-semibold text-gray-800">Operating Hours</h3>
      <button 
        type="button"
        @click="addOperatingHour"
        class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
      >
        <Plus class="w-4 h-4" />
        <span>Add Day</span>
      </button>
    </div>

    <div v-for="(hour, index) in workCenterForm.operatingHours" :key="index" class="grid grid-cols-3 gap-3 mb-3 items-end">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Weekday</label>
        <select 
          v-model="hour.weekDay"
          class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
          <option value="">Select Day</option>
          <option v-for="day in weekDays" :key="day" :value="day">{{ day }}</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Opening Time</label>
        <input 
          v-model="hour.openingTime"
          type="time"
          class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div class="flex items-center space-x-2">
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-600 mb-1">Closing Time</label>
          <input 
            v-model="hour.closingTime"
            type="time"
            class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <button 
          type="button"
          @click="removeOperatingHour(index)"
          class="text-red-500 hover:text-red-700 mt-4"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>

  <div class="flex justify-end space-x-3 pt-6">
    <button type="button" @click="closeModal" class="btn-secondary">
      Cancel
    </button>
    <button 
      type="button" 
      @click="saveWorkCenter"
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
      :item-name="'Work Center'"
      @close="closeDeleteModal"
      @confirm="delDepartment"
    />

    
  </div>
</template>

<script lang="ts" setup>
import type { WorkCenter, Staff, Department } from "~/models";
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
const workCenterForm = reactive({
  name: '',
  capacityPerHour: 0,
  supervisorName: '',
  supervisorEmail: '',
  supervisorPhoneNo: '',
  supervisorId: '',
  departmentId: '',
  departmentName: '',
  operatingHours: [] as { weekDay: string; openingTime: string; closingTime: string }[],
});

const weekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const addOperatingHour = () => {
  workCenterForm.operatingHours.push({
    weekDay: '',
    openingTime: '',
    closingTime: ''
  });
};

const removeOperatingHour = (index: number) => {
  workCenterForm.operatingHours.splice(index, 1);
};

const selectedSupervisor = ref<Staff | null>(null);

const onSupervisorSelect = () => {
  selectedSupervisor.value = staffList.value.find(staff => staff.id === workCenterForm.supervisorId) || null;
  if (selectedSupervisor.value) {
    workCenterForm.supervisorName = selectedSupervisor.value.name;
    workCenterForm.supervisorEmail = selectedSupervisor.value.email;
    workCenterForm.supervisorPhoneNo = selectedSupervisor.value.phoneNo;
  }
};

const workCenterList = ref<WorkCenter[]>([]);
const staffList = ref<Staff[]>([]);
const departmentList = ref<Department[]>([]);

const id = ref('')
const modalTitle = ref('')
 
 
useHead({
  title: 'Work Centers'
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
    await getPaginatedWorkCenters()
}

 const getPaginatedWorkCenters = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getWorkCenters(filters);


        workCenterList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch work centers !');
    } finally {
        isShimmerLoading.value = false;
    }

 }

  const getAllStaffs = async () => {

    let result = await getStaffs({pageNo: 1, pageSize: 10000});

    staffList.value = result.data;
 
  }

  const getAllDepartments = async () => {

    let result = await getDepartments({pageNo: 1, pageSize: 100000});

    const departmentsWithHierarchy = await buildDepartmentHierarchy(result.data);

    departmentList.value = departmentsWithHierarchy;
 
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

const saveWorkCenter = async () => {
  isCreating.value = true;

  //get department name
  let departmentInfo = departmentList.value.find(a => a.id == workCenterForm.departmentId);
  workCenterForm.departmentName = departmentInfo.name;

  const payload = { ...workCenterForm };

  try {
    let isSuccessful;
    if (!id.value) {
      isSuccessful = await createWorkCenter(payload);
    } else {
      isSuccessful = await updateWorkCenter({ ...payload, id: id.value });
    }

    if (isSuccessful) {
      $toast.success(id.value ? 'Work Center updated!' : 'Work Center created!');
      await getPaginatedWorkCenters();
      closeModal();
    } else {
      $toast.error('Unable to save work center!');
    }
  } catch (error) {
    $toast.error('Something went wrong!');
  } finally {
    isCreating.value = false;
  }
};

const initUpdate = (department: WorkCenter) => {

  id.value = department.id;

  modalTitle.value = 'Update Work Center';

  showCreateModal.value = true;
}


const initDelete = (department: WorkCenter) => {

  id.value = department.id;

  modalTitle.value = 'Delete Work Center';

  showDeleteConfirmationModal.value = true;
}

 

  const delDepartment = async () => {
    isDeleting.value = true;
    try {
      let isSuccessful = await deleteWorkCenter(id.value);
      if (isSuccessful) {

        $toast.success('Work Center deleted !');

        await getPaginatedWorkCenters();

      }
      else {
        $toast.error('Unable to delete work center !');
      }
    } catch (error) {
      $toast.error('Unable to delete work center !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }

  
 
  

const resetForm = () => { 

  showCreateModal.value = true
  workCenterForm.name = '';
  workCenterForm.capacityPerHour = 0;
  workCenterForm.supervisorName = '';
  workCenterForm.supervisorEmail = '';
  workCenterForm.supervisorPhoneNo = '';
  workCenterForm.supervisorId = '';
  workCenterForm.operatingHours = [];
  
  id.value = ''
  modalTitle.value = 'Create Work Center'

}

  const closeModal = () => {
    showCreateModal.value = false
     
  }

  const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedWorkCenters();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);


  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    await getPaginatedWorkCenters();
    await getAllStaffs();
    await getAllDepartments();


  });



 
</script>