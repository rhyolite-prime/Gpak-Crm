<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/setups/workflows" class="text-gray-400 hover:text-gray-600">
          <ArrowLeft class="w-6 h-6" />
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">{{ workflow?.name || 'Loading...' }}</h1>
        <div class="flex space-x-2" v-if="workflow">
          <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Enabled</span>
          <span v-if="workflow?.isDefault === 'true' || workflow?.isDefault === true" class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Default</span>
        </div>
      </div>
      <button class="btn-secondary flex items-center space-x-2" @click="goBack">
        <Edit class="w-4 h-4" />
        <span>Edit Workflow</span>
      </button>
    </div>

    <p class="text-gray-500 text-sm max-w-3xl">{{ workflow?.description }}</p>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'stages'"
          :class="[
            activeTab === 'stages'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2'
          ]"
        >
          <Layers class="w-4 h-4" />
          <span>Stages</span>
        </button>
        <button
          @click="activeTab = 'transitions'"
          :class="[
            activeTab === 'transitions'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2'
          ]"
        >
          <ArrowRightLeft class="w-4 h-4" />
          <span>Transitions</span>
        </button>
      </nav>
    </div>

    <!-- Tab Contents -->
    <div v-if="activeTab === 'stages'">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-lg font-medium text-gray-900">Workflow Stages</h2>
          <p class="text-sm text-gray-500">Manage the individual states a content item can be in during this workflow.</p>
        </div>
        <button @click="openStageModal()" class="btn-primary flex items-center space-x-2 bg-purple-900 hover:bg-purple-800 text-white">
          <Plus class="w-4 h-4" />
          <span>Add Stage</span>
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordering</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notifications</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="stagesList.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No stages found.</td>
            </tr>
            <tr v-for="stage in stagesList" :key="stage.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ stage.ordering }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-900">{{ stage.title }}</span>
                  <span v-if="stage.isDefault === 'true' || stage.isDefault === true" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Default</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="stage.description">{{ stage.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                 <div class="flex flex-wrap gap-1">
                    <span v-for="(userId, index) in stage.targetUsers || []" :key="index" class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded border border-purple-200 flex items-center space-x-1">
                      <UserIcon class="w-3 h-3"/>
                      <span>{{ getUserFullName(userId) }}</span>
                    </span>
                 </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="stage.status === 'Enabled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ stage.status || 'Enabled' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button @click="openStageModal(stage)" class="text-purple-600 hover:text-purple-900 font-semibold">Edit</button>
                <button @click="initDeleteStage(stage)" class="text-red-600 hover:text-red-900 font-semibold">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'transitions'">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-lg font-medium text-gray-900">Workflow Transitions</h2>
          <p class="text-sm text-gray-500">Define the valid paths content can take between stages.</p>
        </div>
        <button @click="openTransitionModal()" class="btn-primary flex items-center space-x-2 bg-purple-900 hover:bg-purple-800 text-white">
          <Plus class="w-4 h-4" />
          <span>Add Transition</span>
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Stage</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Stage</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notifications</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="transitionsList.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">No transitions found.</td>
            </tr>
            <tr v-for="transition in transitionsList" :key="transition.id" class="hover:bg-gray-50">
               
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ transition.title }}</div>
                <div class="text-xs text-gray-500">{{ transition.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">{{ getStageTitle(transition.currentStageId) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
                <ArrowRight class="w-4 h-4 text-gray-400" />
                <span class="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">{{ getStageTitle(transition.targetStageId) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                 <div class="flex flex-wrap gap-1">
                    <span v-for="(userId, index) in transition.targetUsers || []" :key="index" class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded border border-purple-200 flex items-center space-x-1">
                      <UserIcon class="w-3 h-3"/>
                      <span>{{ getUserFullName(userId) }}</span>
                    </span>
                 </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="transition.status === 'Enabled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ transition.status || 'Enabled' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button @click="openTransitionModal(transition)" class="text-purple-600 hover:text-purple-900 font-semibold">Edit</button>
                <button @click="initDeleteTransition(transition)" class="text-red-600 hover:text-red-900 font-semibold">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stage Modal -->
    <div v-if="showStageModal" class="modal-overlay" @click="closeStageModal">
      <div class="modal-content max-w-lg" @click.stop>
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">{{ isEditingStage ? 'Update Stage' : 'Create Stage' }}</h2>
          <button @click="closeStageModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input v-model="stageForm.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="stageForm.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ordering</label>
              <input v-model="stageForm.ordering" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="stageForm.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>
          <div class="flex items-center space-x-2 pt-2">
            <input v-model="stageForm.isDefault" type="checkbox" class="h-4 w-4 text-purple-600 border-gray-300 rounded">
            <label class="text-sm font-medium text-gray-700">Set as default stage</label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notifications (Target Users)</label>
            <VueMultiselect
              v-model="stageForm.targetUsers"
              :options="userList"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :hide-selected="true"
              :preserve-search="true"
              label="fullName"
              track-by="id"
              placeholder="Select Users"
            />
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="closeStageModal" class="btn-secondary">Cancel</button>
          <button @click="saveStage" class="btn-primary bg-purple-900 hover:bg-purple-800 border-transparent text-white flex items-center space-x-2" :disabled="isSaving">
            <div v-if="isSaving" class="loader border-white border-t-transparent"></div>
            <span>{{ isSaving ? 'Saving...' : 'Save Stage' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Transition Modal -->
    <div v-if="showTransitionModal" class="modal-overlay" @click="closeTransitionModal">
      <div class="modal-content max-w-lg" @click.stop>
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">{{ isEditingTransition ? 'Update Transition' : 'Create Transition' }}</h2>
          <button @click="closeTransitionModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input v-model="transitionForm.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input v-model="transitionForm.description" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">From Stage</label>
              <select v-model="transitionForm.currentStageId" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option value="">Select Stage</option>
                <option v-for="s in stagesList" :key="s.id" :value="s.id">{{ s.title }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To Stage</label>
              <select v-model="transitionForm.targetStageId" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option value="">Select Stage</option>
                <option v-for="s in stagesList" :key="s.id" :value="s.id">{{ s.title }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="transitionForm.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notifications (Target Users)</label>
            <VueMultiselect
              v-model="transitionForm.targetUsers"
              :options="userList"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :hide-selected="true"
              :preserve-search="true"
              label="fullName"
              track-by="id"
              placeholder="Select Users"
            />
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="closeTransitionModal" class="btn-secondary">Cancel</button>
          <button @click="saveTransition" class="btn-primary bg-purple-900 hover:bg-purple-800 border-transparent text-white flex items-center space-x-2" :disabled="isSaving">
            <div v-if="isSaving" class="loader border-white border-t-transparent"></div>
            <span>{{ isSaving ? 'Saving...' : 'Save Transition' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UiDeleteConfirmationModal
      :is-open="showDeleteModal"
      :isDeleting="isDeleting"
      :item-name="deleteItemName"
      @close="closeDeleteModal"
      @confirm="executeDelete"
    />
  </div>
</template>

<script lang="ts" setup>
import { 
  ArrowLeft,
  ArrowRightLeft,
  Layers,
  Edit,
  Plus,
  X,
  User as UserIcon,
  ArrowRight
} from 'lucide-vue-next'
import type { Workflow, WorkflowStage, WorkflowTransition, User } from '~/models'

import { getWorkflowDetails } from '~/services/workFlow'
import { createWorkflowStage, updateWorkflowStage, deleteWorkflowStage } from '~/services/workflowStages'
import { createWorkflowTransition, updateWorkflowTransition, deleteWorkflowTransition } from '~/services/workflowTransitions'
import { getUsers } from '~/services/userManagement'
import VueMultiselect from 'vue-multiselect'

const route = useRoute()
const router = useRouter()
const { $toast } = useNuxtApp()

const workflowId = route.params.id as string
const workflow = ref<Workflow | null>(null)
const activeTab = ref<'stages' | 'transitions'>('stages')

const stagesList = ref<WorkflowStage[]>([])
const transitionsList = ref<WorkflowTransition[]>([]);
const userList = ref<User[]>([]);


 const getAllUsers = async () => {
 
    try {

        let result = await getUsers({ pageNo: 1, pageSize: 1000 });

        userList.value = result.data;

    } catch (error) {
        $toast.error('Unable to fetch users !');
    }  

 }
const fetchWorkflowData = async () => {
  try {
    const wf = await getWorkflowDetails(workflowId)
    workflow.value = wf
    stagesList.value = wf?.stages || []
    transitionsList.value = wf?.transitions || []
  } catch (err) {
    $toast.error('Failed to load workflow details.')
  }
}

const getStageTitle = (stageId: string) => {
  const stage = stagesList.value.find(s => s.id === stageId)
  return stage ? stage.title : 'Unknown'
}

const getUserFullName = (userId: any) => {
  const user = userList.value.find(u => String(u.id) === String(userId))
  return user ? user.fullName : userId
}

onMounted(async () => {
  await fetchWorkflowData();
  await getAllUsers();
})

const goBack = () => {
  router.push('/setups/workflows')
}

// Stage Form Logic
const showStageModal = ref(false)
const isEditingStage = ref(false)
const isSaving = ref(false)
const stageForm = reactive({
  id: crypto.randomUUID(),
  workflowId: workflowId,
  title: '',
  description: '',
  ordering: 1,
  isDefault: false,
  targetUsers: [],
  status: 'Enabled'
})

const openStageModal = (stage?: WorkflowStage) => {
  if (stage) {
    isEditingStage.value = true
    stageForm.id = stage.id
    stageForm.workflowId = stage.workflowId
    stageForm.title = stage.title
    stageForm.description = stage.description
    stageForm.ordering = Number(stage.ordering) || 1
    stageForm.isDefault = stage.isDefault === 'true' || stage.isDefault === true
    stageForm.targetUsers = userList.value.filter(u => stage.targetUsers?.map(String).includes(String(u.id)))
    stageForm.status = stage.status || 'Enabled'
  } else {
    isEditingStage.value = false
    stageForm.id = crypto.randomUUID()
    stageForm.workflowId = workflowId
    stageForm.title = ''
    stageForm.description = ''
    stageForm.ordering = stagesList.value.length + 1
    stageForm.isDefault = false
    stageForm.targetUsers = []
    stageForm.status = 'Enabled'
  }
  showStageModal.value = true
}

const closeStageModal = () => {
  showStageModal.value = false
}

const saveStage = async () => {
  if (!stageForm.title) {
    $toast.error('Title is required')
    return
  }
  isSaving.value = true
  try {
    const payload = {
      ...stageForm,
      isDefault: String(stageForm.isDefault),
      ordering: Number(stageForm.ordering),
      targetUsers: (stageForm.targetUsers || []).map((u: any) => String(u.id))
    }
    if (isEditingStage.value) {
      await updateWorkflowStage(payload)
      $toast.success('Stage updated successfully')
    } else {
      await createWorkflowStage(payload)
      $toast.success('Stage created successfully')
    }
    closeStageModal()
    await fetchWorkflowData()
  } catch (err) {
    $toast.error('Failed to save stage')
  } finally {
    isSaving.value = false
  }
}

// Transition Form Logic
const showTransitionModal = ref(false)
const isEditingTransition = ref(false)
const transitionForm = reactive({
  id: crypto.randomUUID(),
  workflowId: workflowId,
  title: '',
  description: '',
  currentStageId: '',
  targetStageId: '',
  targetUsers: [],
  status: 'Enabled'
})

const openTransitionModal = (transition?: WorkflowTransition) => {
  if (transition) {
    isEditingTransition.value = true
    transitionForm.id = transition.id
    transitionForm.workflowId = transition.workflowId
    transitionForm.title = transition.title
    transitionForm.description = transition.description
    transitionForm.currentStageId = transition.currentStageId
    transitionForm.targetStageId = transition.targetStageId
    transitionForm.targetUsers = userList.value.filter(u => transition.targetUsers?.map(String).includes(String(u.id)))
    transitionForm.status = transition.status || 'Enabled'
  } else {
    isEditingTransition.value = false
    transitionForm.id = crypto.randomUUID()
    transitionForm.workflowId = workflowId
    transitionForm.title = ''
    transitionForm.description = ''
    transitionForm.currentStageId = ''
    transitionForm.targetStageId = ''
    transitionForm.targetUsers = []
    transitionForm.status = 'Enabled'
  }
  showTransitionModal.value = true
}

const closeTransitionModal = () => {
  showTransitionModal.value = false
}

const saveTransition = async () => {
  if (!transitionForm.title || !transitionForm.currentStageId || !transitionForm.targetStageId) {
    $toast.error('Title, From Stage, and To Stage are required')
    return
  }
  isSaving.value = true
  try {
    const payload = {
      ...transitionForm,
      targetUsers: (transitionForm.targetUsers || []).map((u: any) => String(u.id))
    }
    if (isEditingTransition.value) {
      await updateWorkflowTransition(payload)
      $toast.success('Transition updated successfully')
    } else {
      await createWorkflowTransition(payload)
      $toast.success('Transition created successfully')
    }
    closeTransitionModal()
    await fetchWorkflowData()
  } catch (err) {
    $toast.error('Failed to save transition')
  } finally {
    isSaving.value = false
  }
}

// Delete Logic
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const deleteItemName = ref('')
const deleteType = ref<'stage' | 'transition' | null>(null)
const deleteId = ref('')

const initDeleteStage = (stage: WorkflowStage) => {
  deleteType.value = 'stage'
  deleteId.value = stage.id
  deleteItemName.value = `Stage: ${stage.title}`
  showDeleteModal.value = true
}

const initDeleteTransition = (transition: WorkflowTransition) => {
  deleteType.value = 'transition'
  deleteId.value = transition.id
  deleteItemName.value = `Transition: ${transition.title}`
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const executeDelete = async () => {
  isDeleting.value = true
  try {
    if (deleteType.value === 'stage') {
      await deleteWorkflowStage(workflowId, deleteId.value)
      $toast.success('Stage deleted')
      await fetchWorkflowData()
    } else if (deleteType.value === 'transition') {
      await deleteWorkflowTransition(workflowId, deleteId.value)
      $toast.success('Transition deleted')
      await fetchWorkflowData()
    }
    closeDeleteModal()
  } catch (err) {
    $toast.error('Failed to delete item')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
