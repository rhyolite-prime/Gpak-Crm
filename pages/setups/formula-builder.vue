<template>
  <div class="max-w-8xl mx-auto py-8 text-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Formula Builder
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          Create and manage custom formulas and the variables they use.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Variables Section -->
      <div class="bg-white shadow rounded-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-medium text-gray-900">Variables</h3>
          <button @click="openVariableModal()" class="btn-primary py-1.5 px-3 text-sm flex items-center">
            <Plus class="h-4 w-4 mr-1"/> Add Variable
          </button>
        </div>
        <div class="flex-1 p-6 overflow-y-auto max-h-[600px]">
           <div v-if="variableList.length === 0" class="text-center py-8 text-gray-500">
             No variables defined yet.
           </div>
           <ul v-else class="divide-y divide-gray-200 border border-gray-200 rounded-md">
             <li v-for="variable in variableList" :key="variable.id" class="p-4 flex justify-between items-center hover:bg-gray-50">
               <div>
                  <p class="text-sm font-medium text-gray-900">{{ variable.name }}</p>
                  <p class="text-xs text-gray-500">Default Value: {{ variable.defaultValue }}</p>
               </div>
               <div class="flex space-x-2">
                 <button @click="openVariableModal(variable)" class="text-gray-400 hover:text-blue-600">
                   <Edit2 class="h-4 w-4" />
                 </button>
                 <button @click="removeVariable(variable.id)" class="text-gray-400 hover:text-red-600">
                   <Trash2 class="h-4 w-4" />
                 </button>
               </div>
             </li>
           </ul>
        </div>
      </div>

      <!-- Formulas Section -->
       <div class="bg-white shadow rounded-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-medium text-gray-900">Formulas</h3>
          <button @click="openFormulaModal()" class="btn-primary py-1.5 px-3 text-sm flex items-center">
            <Plus class="h-4 w-4 mr-1"/> Add Formula
          </button>
        </div>
        <div class="flex-1 p-6 overflow-y-auto max-h-[600px]">
           <div v-if="formulas.length === 0" class="text-center py-8 text-gray-500">
             No formulas defined yet.
           </div>
            <ul v-else class="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
             <li 
               v-for="f in formulas" 
               :key="f.id" 
               class="p-4 flex justify-between items-center hover:bg-gray-50 border-l-8"
               :style="{ borderLeftColor: f.estimateTypeHexColour || '#e5e7eb' }"
             >
               <div>
                  <p class="text-sm font-medium text-gray-900">{{ f.name }}</p>
                  <p class="text-xs text-gray-500 font-mono mt-1 px-2 py-0.5 bg-gray-100 rounded inline-block">{{ f.userFriendlyExpression }}</p>
               </div>
               <div class="flex space-x-2 items-center">
                 <button v-if="!f.isSystemDefault" @click="openFormulaModal(f)" class="text-gray-400 hover:text-blue-600">
                   <Edit2 class="h-4 w-4" />
                 </button>
                 <button v-if="!f.isSystemDefault" @click="removeFormula(f.id)" class="text-gray-400 hover:text-red-600">
                   <Trash2 class="h-4 w-4" />
                 </button>
                 <span v-if="f.isSystemDefault" class="text-xs text-blue-500 font-medium px-2 italic">System Default</span>
               </div>
             </li>
           </ul>
        </div>
      </div>
    </div>

    <!-- Variable Modal -->
    <div v-if="isVarModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" @click="closeVarModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ variableId.id ? 'Edit Variable' : 'Add Variable' }}
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Variable Name</label>
                <input v-model="variableForm.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" placeholder="e.g. Quantity" />
                <p class="mt-1 text-xs text-gray-500">Variables should contain only letters, numbers, and underscores.</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Type of Value</label>
                <select 
                  v-model="variableForm.dataType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" required>
                  <option value="" disabled>Select a type</option>
                  <option value="text">Text</option>
                  <option value="number">Whole Number</option>
                  <option value="decimal">Decimal</option>
                  <option value="money">Money</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Default Value</label>
                <input v-model="variableForm.defaultValue" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveVariable" :disabled="isSavingVariable" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isSavingVariable" class="flex items-center">
                <Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Saving...
              </span>
              <span v-else>Save</span>
            </button>
            <button @click="closeVarModal" :disabled="isSavingVariable" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Formula Modal -->
    <div v-if="isFormModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" @click="closeFormulaModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div 
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border-t-8"
          :style="{ borderTopColor: formulaForm.estimateTypeHexColour || '#ef4444' }"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Estimate Type</label>
                <select 
                  v-model="formulaForm.estimateTypeId" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option :value="generateEmptyGuid()">Select Option</option>
                  <option v-for="type in estimateTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <div v-if="selectedEstimateType" class="mt-2 flex items-center space-x-2">
                  <div class="w-4 h-4 rounded-full border border-gray-200" :style="{ backgroundColor: selectedEstimateType.hexColour }"></div>
                  <span class="text-xs text-gray-500">Theme color applied from {{ selectedEstimateType.name }}</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Formula Name</label>
                <input v-model="formulaForm.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" placeholder="e.g. Book Cost" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Expression</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <textarea v-model="formulaForm.userFriendlyExpression" rows="3" class="block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm font-mono" placeholder="e.g. (Pages * Rate) + Binding_Fee"></textarea>
                </div>
                <div class="mt-2 text-sm text-gray-500 flex flex-wrap gap-2">
                   <p class="w-full">Available variables (click to insert):</p>
                   <button v-for="variable in variableList" :key="variable.id" @click="insertVariable(variable.name)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                     {{ variable.name }}
                   </button>
                   <span v-if="variableList.length === 0" class="text-xs text-red-500">No variables available. Please create some first.</span>
                </div>
                 <div class="mt-3 text-sm text-gray-500 flex flex-wrap gap-2">
                   <p class="w-full">System Functions (click to insert):</p>
                   <button @click="insertFunction('ROUNDUP')" type="button" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200">
                     ROUNDUP(x)
                   </button>
                   <button @click="insertFunction('ROUNDDOWN')" type="button" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200">
                     ROUNDDOWN(x)
                   </button>
                   <button @click="insertFunction('MAX')" type="button" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200">
                     MAX(x, y)
                   </button>
                   <button @click="insertFunction('MIN')" type="button" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200">
                     MIN(x, y)
                   </button>
                </div>
                <div class="mt-3 text-sm text-gray-500 flex flex-wrap gap-2">
                   <p class="w-full">Arithmetic Operations (click to insert):</p>
                   <button @click="insertOperator('+')" type="button" class="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
                     +
                   </button>
                   <button @click="insertOperator('-')" type="button" class="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
                     -
                   </button>
                   <button @click="insertOperator('*')" type="button" class="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
                     *
                   </button>
                   <button @click="insertOperator('/')" type="button" class="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
                     /
                   </button>
                   <button @click="insertOperator('(')" type="button" class="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
                     (
                   </button>
                   <button @click="insertOperator(')')" type="button" class="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
                     )
                   </button>
                </div>
              </div>

              <!-- Inventory Items Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Inventory Items (Raw Materials)</label>
                  <div class="relative">
                      
                      <input 
                          v-model="inventorySearchQuery" 
                          @input="searchInventoryItems"
                          type="text" 
                          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm" 
                          placeholder="Search raw materials to add..." 
                      />
                      <div v-if="isSearchingInventory" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <Loader2 class="animate-spin h-4 w-4 text-gray-400" />
                      </div>
                      
                      <!-- Search Results Dropdown -->
                      <div v-if="inventorySearchResults.length > 0" class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          <div 
                              v-for="item in inventorySearchResults" 
                              :key="item.id"
                              @click="addInventoryItem(item)"
                              class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-red-50 hover:text-red-900"
                          >
                              <div class="flex items-center justify-between">
                                  <span class="font-normal block truncate">{{ item.name }}</span>
                                  <span class="text-xs text-gray-500">{{ item.sku }}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <!-- Selected Inventory Items -->
                  <div v-if="formulaForm.inventoryItems.length > 0" class="mt-4 space-y-2">
                      <div v-for="item in formulaForm.inventoryItems" :key="item.id" class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
                          <div class="flex-1 min-w-0">
                              <p class="text-xs font-medium text-gray-900 truncate">{{ item.name }}</p>
                              <p class="text-[10px] text-gray-500">{{ item.sku }} - {{ item.unitOfMeasure }}</p>
                          </div>
                          <div class="flex items-center space-x-3 ml-4">
                              <div class="flex flex-col items-center">
                                  <label class="text-[9px] text-gray-500 uppercase font-bold">Qty</label>
                                  <input v-model.number="item.quantity" type="number" step="0.01" class="w-16 text-center border-gray-300 rounded text-xs px-1 py-0.5" />
                              </div>
                              <button @click="insertInventoryItemVariable(item)" class="text-blue-600 hover:text-blue-800 p-1" title="Insert into formula">
                                  <Plus class="h-4 w-4" />
                              </button>
                              <button @click="removeInventoryItem(item.id)" class="text-red-400 hover:text-red-600 p-1">
                                  <X class="h-4 w-4" />
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
              
              <!-- Formula Tester -->
              <div v-if="formulaForm.userFriendlyExpression" class="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Formula Tester</h4>
                  <div class="grid grid-cols-2 gap-4 mb-4">
                      <div v-for="varName in testVariables" :key="varName" class="flex flex-col">
                          <label class="text-[10px] text-gray-500 mb-1 font-medium">{{ varName }}</label>
                          <input v-model.number="testContext[varName]" type="number" step="0.01" class="border-gray-300 rounded shadow-sm text-xs px-2 py-1" />
                      </div>
                  </div>
                  <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span class="text-xs font-medium text-gray-700">Calculated Result:</span>
                      <span class="text-sm font-bold text-red-600 font-mono">{{ evaluatedPreview }}</span>
                  </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveFormulaObj" :disabled="isSavingFormula" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isSavingFormula" class="flex items-center">
                <Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Saving...
              </span>
              <span v-else>Save</span>
            </button>
            <button @click="closeFormulaModal" :disabled="isSavingFormula" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <DeleteConfirmationModal
      :is-open="isDeleteDialogOpen"
      :is-deleting="isDeleting"
      :item-name="itemToDelete?.name || ''"
      @close="isDeleteDialogOpen = false"
      @confirm="handleConfirmDelete"
    />

  </div>
</template>

<script setup lang="ts">
import { Plus, Edit2, Trash2, Loader2, Search, X } from 'lucide-vue-next';
import DeleteConfirmationModal from '~/components/ui/DeleteConfirmationModal.vue';
import type { FormulaVariable, Formula, EstimateType, RawMaterial, FormulaInventoryItem } from "~/models";
import { getEstimateTypes } from "~/services/estimateTypes";
import { getRawMaterials } from "~/services/rawMaterials";
import { isEmpty, debounce } from "lodash-es";
const { evaluateExpression, extractPlaceholders } = useFormulaEvaluator();

const isDeleteDialogOpen = ref(false);
const isDeleting = ref(false);
const itemToDelete = ref<{ id: string, name: string, type: 'variable' | 'formula' } | null>(null);

useHead({
  title: 'Formula Builder | G-Pak CRM'
})

const { $toast } = useNuxtApp();

const router = useRouter();
const route = useRoute();

const variableFilters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 100,

});

const variablePaginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const formulaFilters = reactive({
  query: '',
  pageNo: 1,
  estimateTypeId: generateEmptyGuid(),
  pageSize: 100,

});

const formulaPaginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const formulaForm = reactive({
  name: '',
  expression: '',
  userFriendlyExpression: '',
  estimateTypeId: generateEmptyGuid(),
  estimateTypeName: '',
  estimateTypeHexColour: '',
  inventoryItems: [] as FormulaInventoryItem[],
});

const estimateTypes = ref<EstimateType[]>([]);
const selectedEstimateType = computed(() => {
  return estimateTypes.value.find(t => t.id === formulaForm.estimateTypeId);
});

watch(selectedEstimateType, (newType) => {
  if (newType) {
    formulaForm.estimateTypeName = newType.name;
    formulaForm.estimateTypeHexColour = newType.hexColour;
  } else {
    formulaForm.estimateTypeName = '';
    formulaForm.estimateTypeHexColour = '';
  }
});

const variableList = ref<FormulaVariable[]>([]);
const formulas = ref<Formula[]>([]);

const isSavingVariable = ref(false)
const isVariableShimmerLoading = ref(false)
const variableId = ref('')

const isSavingFormula = ref(false)
const isFormulaShimmerLoading = ref(false)
const formulaId = ref('')

// Inventory Search State
const inventorySearchQuery = ref('');
const inventorySearchResults = ref<RawMaterial[]>([]);
const isSearchingInventory = ref(false);

const searchInventoryItems = debounce(async () => {
  if (!inventorySearchQuery.value || inventorySearchQuery.value.length < 2) {
    inventorySearchResults.value = [];
    return;
  }
  isSearchingInventory.value = true;
  try {
    const result = await getRawMaterials({ query: inventorySearchQuery.value, pageNo: 1, pageSize: 10 });
    inventorySearchResults.value = result.data;
  } catch (error) {
    console.error('Failed to search inventory items', error);
  } finally {
    isSearchingInventory.value = false;
  }
}, 300);

const addInventoryItem = (item: RawMaterial) => {
  const exists = formulaForm.inventoryItems.find(i => i.id === item.id);
  if (exists) {
    $toast.error('Item already added to formula');
    return;
  }
  formulaForm.inventoryItems.push({
    id: item.id,
    name: item.name,
    quantity: 1,
    sku: item.sku,
    unitOfMeasure: item.unitOfMeasure
  });
  inventorySearchQuery.value = '';
  inventorySearchResults.value = [];
};

const removeInventoryItem = (id: string) => {
  formulaForm.inventoryItems = formulaForm.inventoryItems.filter(i => i.id !== id);
};

const insertInventoryItemVariable = (item: FormulaInventoryItem) => {
  // Sanitize name for use as a variable: replace non-alphanumeric with underscores
  const sanitizedName = item.name.replace(/[^a-zA-Z0-9]/g, '_');
  insertVariable(sanitizedName);
};

// Formula Testing State
const testContext = ref<Record<string, number>>({});
const testVariables = computed(() => {
    return extractPlaceholders(formulaForm.userFriendlyExpression);
});

const evaluatedPreview = computed(() => {
    const result = evaluateExpression(formulaForm.userFriendlyExpression, testContext.value);
    return new Intl.NumberFormat('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(result);
});

// Initialize test context when variables change
watch(testVariables, (newVars) => {
    newVars.forEach(v => {
        if (testContext.value[v] === undefined) {
            const globalVar = variableList.value.find(gv => gv.name === v);
            if (globalVar) {
              testContext.value[v] = parseFloat(globalVar.defaultValue) || 0;
            } else {
              // Check in inventory items
              const invItem = formulaForm.inventoryItems.find(i => i.name.replace(/[^a-zA-Z0-9]/g, '_') === v);
              testContext.value[v] = invItem ? invItem.quantity : 0;
            }
        }
    });
}, { immediate: true });

// Sync inventory item quantities with test context
watch(() => formulaForm.inventoryItems, (newItems) => {
    newItems.forEach(item => {
        const sanitizedName = item.name.replace(/[^a-zA-Z0-9]/g, '_');
        testContext.value[sanitizedName] = item.quantity;
    });
}, { deep: true });


// Variable Modal State & Logic
const isVarModalOpen = ref(false);


const variableForm = reactive({
  name: '',
  systemName: '',
  dataType: '',
  defaultValue: '',
});



const openVariableModal = (v?: FormulaVariable) => {
  if (v) {
    variableId.value = v.id;
    variableForm.systemName = v.systemName;
    variableForm.name = v.name;
    variableForm.dataType = v.dataType;
    variableForm.defaultValue = v.defaultValue;
  } else {
    variableForm.name = '';
    variableForm.dataType = '';
    variableForm.systemName = '';
    variableForm.defaultValue = '';
  }
  isVarModalOpen.value = true;
};

const closeVarModal = () => {
  isVarModalOpen.value = false;
};

const getPaginatedVariables = async () => {
  isVariableShimmerLoading.value = true;
  try {
    let result = await getVariables(variableFilters);
    variableList.value = result.data;
    variablePaginationParams.totalPages = result.totalPages;
    variablePaginationParams.totalCount = result.totalCount;
    variablePaginationParams.lowerBound = result.lowerBound;
    variablePaginationParams.upperBound = result.upperBound;
  } catch (error) {
    $toast.error('Unable to fetch variables!');
  } finally {
    isVariableShimmerLoading.value = false;
  }
};



const saveVariable = async () => {
  if (!variableForm.name) {
    $toast.error('Variable name is required');
    return;
  }

  // Derive systemName: replace whitespace with underscores and lowercase everything
  variableForm.systemName = variableForm.name.trim().replace(/\s+/g, '_').toLowerCase();

  const isEditing = !isEmpty(variableId.value);

  isSavingVariable.value = true;

  try {

    const isSuccessful = isEditing
      ? await updateVariable({ ...variableForm, id: variableId.value })
      : await createVariable(variableForm);

    if (isSuccessful) {
      $toast.success(isEditing ? 'Variable updated!' : 'Variable saved!');
      variableId.value = '';
      await getPaginatedVariables();
    } else {
      $toast.error(`Unable to ${isEditing ? 'update' : 'create'} variable!`);
    }
  } catch {
    $toast.error(`Unable to ${isEditing ? 'update' : 'create'} variable!`);
  } finally {
    isSavingVariable.value = false;
    closeVarModal();
  }
};

const confirmDeleteVariable = (v: FormulaVariable) => {
  itemToDelete.value = { id: v.id, name: v.name, type: 'variable' };
  isDeleteDialogOpen.value = true;
};

const deleteVariableItem = async (id: string) => {
  isDeleting.value = true;
  try {
    const isSuccessful = await deleteVariable(id);
    if (isSuccessful) {
      $toast.success('Variable deleted');
      await getPaginatedVariables();
    } else {
      $toast.error('Unable to delete variable!');
    }
  } finally {
    isDeleting.value = false;
    isDeleteDialogOpen.value = false;
    itemToDelete.value = null;
  }
};


// Formula Modal State & Logic
const isFormModalOpen = ref(false);



watch(() => formulaForm.userFriendlyExpression, (newVal) => {
  if (!newVal) {
    formulaForm.expression = '';
    return;
  }
  let systemExpr = newVal;
  variableList.value.forEach(v => {
    const escapedName = v.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\[${escapedName}\\]`, 'g');
    systemExpr = systemExpr.replace(regex, `[${v.systemName}]`);
  });
  formulaForm.expression = systemExpr;
});

const getPaginatedFormulas = async () => {
  isFormulaShimmerLoading.value = true;
  try {
    let result = await getFormulas(formulaFilters);
    formulas.value = [
      {
        id: 'system-plugin-percentage',
        name: 'Percentage Plugin (%)',
        expression: '[Percentage_Plugin]',
        userFriendlyExpression: 'System Default Plugin',
        isSystemDefault: true,
      } as any,
      {
        id: 'system-function-roundup',
        name: 'Round Up',
        expression: 'ROUNDUP([x])',
        userFriendlyExpression: 'ROUNDUP([x])',
        isSystemDefault: true,
      } as any,
      {
        id: 'system-function-rounddown',
        name: 'Round Down',
        expression: 'ROUNDDOWN([x])',
        userFriendlyExpression: 'ROUNDDOWN([x])',
        isSystemDefault: true,
      } as any,
      {
        id: 'system-function-max',
        name: 'Maximum',
        expression: 'MAX([x], [y])',
        userFriendlyExpression: 'MAX([x], [y])',
        isSystemDefault: true,
      } as any,
      {
        id: 'system-function-min',
        name: 'Minimum',
        expression: 'MIN([x], [y])',
        userFriendlyExpression: 'MIN([x], [y])',
        isSystemDefault: true,
      } as any,
      ...result.data
    ];
    formulaPaginationParams.totalPages = result.totalPages;
    formulaPaginationParams.totalCount = result.totalCount;
    formulaPaginationParams.lowerBound = result.lowerBound;
    formulaPaginationParams.upperBound = result.upperBound;
  } catch (error) {
    $toast.error('Unable to fetch formulas!');
  } finally {
    isFormulaShimmerLoading.value = false;
  }
};

const openFormulaModal = (f?: Formula) => {
  if (f) {
    formulaId.value = f.id;
    formulaForm.name = f.name;
    formulaForm.expression = f.expression;
    formulaForm.userFriendlyExpression = f.userFriendlyExpression;
    formulaForm.estimateTypeId = f.estimateTypeId || generateEmptyGuid();
    formulaForm.inventoryItems = f.inventoryItems ? JSON.parse(JSON.stringify(f.inventoryItems)) : [];
  } else {
    formulaId.value = '';
    formulaForm.name = '';
    formulaForm.expression = '';
    formulaForm.userFriendlyExpression = '';
    formulaForm.estimateTypeId = generateEmptyGuid();
    formulaForm.inventoryItems = [];
  }
  isFormModalOpen.value = true;
};

const closeFormulaModal = () => {
  isFormModalOpen.value = false;
  inventorySearchQuery.value = '';
  inventorySearchResults.value = [];
};

const insertVariable = (name: string) => {
  const bracketedName = `[${name}]`;
  if (formulaForm.userFriendlyExpression) {
    formulaForm.userFriendlyExpression += ` ${bracketedName} `;
  } else {
    formulaForm.userFriendlyExpression = bracketedName;
  }
};

const insertFunction = (funcName: string) => {
  const funcText = `${funcName}()`;
  if (formulaForm.userFriendlyExpression) {
    formulaForm.userFriendlyExpression += ` ${funcText} `;
  } else {
    formulaForm.userFriendlyExpression = funcText;
  }
};

const insertOperator = (operator: string) => {
  if (formulaForm.userFriendlyExpression) {
    formulaForm.userFriendlyExpression += ` ${operator} `;
  } else {
    formulaForm.userFriendlyExpression = operator;
  }
};

const saveFormulaObj = async () => {
  if (!formulaForm.name || !formulaForm.userFriendlyExpression) {
    $toast.error('Name and expression are required');
    return;
  }
  isSavingFormula.value = true;
  const isEditing = !isEmpty(formulaId.value);
  try {
    const isSuccessful = isEditing
      ? await updateFormula({ ...formulaForm, id: formulaId.value })
      : await createFormula(formulaForm);
    if (isSuccessful) {
      $toast.success(isEditing ? 'Formula updated!' : 'Formula saved!');
      formulaId.value = '';
      await getPaginatedFormulas();
    } else {
      $toast.error(`Unable to ${isEditing ? 'update' : 'create'} formula!`);
    }
  } catch {
    $toast.error(`Unable to ${isEditing ? 'update' : 'create'} formula!`);
  } finally {
    isSavingFormula.value = false;
    closeFormulaModal();
  }
};

const confirmDeleteFormula = (f: Formula) => {
  itemToDelete.value = { id: f.id, name: f.name, type: 'formula' };
  isDeleteDialogOpen.value = true;
};

const deleteFormulaItem = async (id: string) => {
  isDeleting.value = true;
  try {
    const isSuccessful = await deleteFormula(id);
    if (isSuccessful) {
      $toast.success('Formula deleted');
      await getPaginatedFormulas();
    } else {
      $toast.error('Unable to delete formula!');
    }
  } finally {
    isDeleting.value = false;
    isDeleteDialogOpen.value = false;
    itemToDelete.value = null;
  }
};

const handleConfirmDelete = async () => {
  if (!itemToDelete.value) return;
  
  if (itemToDelete.value.type === 'variable') {
    await deleteVariableItem(itemToDelete.value.id);
  } else {
    await deleteFormulaItem(itemToDelete.value.id);
  }
};

const fetchEstimateTypes = async () => {
  try {
    const result = await getEstimateTypes({ pageNo: 1, pageSize: 100 });
    estimateTypes.value = result.data;
  } catch (error) {
    console.error('Failed to fetch estimate types', error);
  }
};

onMounted(async () => {
  if (!isEmpty(route.query)) {
    variableFilters.pageNo = parseInt(route.query.pageNo as string);
    formulaFilters.pageNo = parseInt(route.query.pageNo as string);
  }
  await Promise.all([
    getPaginatedVariables(),
    getPaginatedFormulas(),
    fetchEstimateTypes()
  ]);
});
</script>

<style scoped>
input[type="text"], input[type="number"], textarea {
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
}
input:focus, textarea:focus {
  outline: none;
  border-color: #ef4444;
}
</style>
