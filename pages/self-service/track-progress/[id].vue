<template>
  <div class="min-h-screen bg-gray-50 flex flex-col pt-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-4xl">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-red-600">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Track Your Request</h1>
            <p class="text-sm text-gray-500 mt-1">Request #: <span class="font-mono font-medium text-gray-800">{{ requestNumber }}</span></p>
          </div>
          <!-- optionally a logo here -->
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 class="w-8 h-8 text-red-600 animate-spin" />
          <p class="text-sm text-gray-500">Retrieving your request timeline...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="hasError" class="bg-red-50 p-4 rounded-md">
          <p class="text-red-700 font-medium text-center">We couldn't find a request with that number, or an error occurred.</p>
        </div>
        
        <!-- Content -->
        <div v-else-if="productionRequest">
          <!-- Request Info Summary -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Customer / Business</p>
              <p class="text-sm font-medium text-gray-900 mt-0.5">{{ productionRequest.customerName || productionRequest.businessName }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Job Name</p>
              <p class="text-sm font-medium text-gray-900 mt-0.5">{{ productionRequest.jobName }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Quantity</p>
              <p class="text-sm font-medium text-gray-900 mt-0.5">{{ productionRequest.quantity?.toLocaleString() || '-' }}</p>
            </div>
          </div>

          <!-- Workflow Stage Tracker -->
          <div v-if="associatedWorkflow" class="mb-8 border border-gray-200 rounded-lg overflow-hidden">
            <div class="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
              <h2 class="text-sm font-semibold text-gray-700">Production Progress</h2>
              <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {{ workflowProgressPercent }}% Complete
              </span>
            </div>
            
            <div class="px-5 py-6 overflow-x-auto">
              <div class="flex items-start space-x-1 min-w-max justify-center">
                <template v-for="(stage, idx) in sortedWorkflowStages" :key="stage.id">
                  <div class="flex flex-col items-center w-28 text-center flex-shrink-0">
                    <div :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                      stage.id === currentWorkflowStageId
                        ? 'border-red-500 bg-red-500 text-white shadow-md shadow-red-200'
                        : sortedWorkflowStages.findIndex(s => s.id === currentWorkflowStageId) > idx
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-200 bg-white text-gray-400'
                    ]">
                      <Check v-if="sortedWorkflowStages.findIndex(s => s.id === currentWorkflowStageId) > idx" class="w-5 h-5" />
                      <span v-else>{{ idx + 1 }}</span>
                    </div>
                    <p :class="[
                      'text-xs mt-2 leading-tight font-medium',
                      stage.id === currentWorkflowStageId ? 'text-red-600' : 'text-gray-600'
                    ]">{{ stage.title }}</p>
                    <p v-if="stage.id === currentWorkflowStageId" class="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1">Current Phase</p>
                  </div>
                  <div v-if="idx < sortedWorkflowStages.length - 1" :class="[
                    'h-1 flex-1 mt-4.5 min-w-[30px] rounded',
                    sortedWorkflowStages.findIndex(s => s.id === currentWorkflowStageId) > idx ? 'bg-green-400' : 'bg-gray-100'
                  ]"></div>
                </template>
              </div>
            </div>
          </div>

          <!-- Vertical Timeline -->
          <div class="mt-8">
            <h3 class="text-lg font-bold text-gray-900 mb-6">Detailed Timeline</h3>
            <div v-if="sortedTimeline.length > 0" class="relative border-l-2 border-gray-200 ml-3 md:ml-4 space-y-8 pb-4">
              <div v-for="(item, index) in sortedTimeline" :key="index" class="relative pl-6 md:pl-8">
                <!-- Timeline Dot -->
                <div class="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-4 border-red-500 shadow"></div>
                
                <div class="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                    <h4 class="text-sm font-bold text-gray-900">{{ item.title }}</h4>
                    <span class="text-xs font-medium text-gray-500 flex items-center bg-gray-50 px-2 py-1 rounded">
                      <Clock class="w-3 h-3 mr-1" />
                      {{ formatDateTime(item.timeStamp) }}
                    </span>
                  </div>
                  <p v-if="item.details" class="text-sm text-gray-600">{{ item.details }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500 text-sm">
              No timeline history available for this request yet.
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, Check, Clock } from 'lucide-vue-next';
import type { ProductionRequest, Workflow } from "~/models";

const route = useRoute();
const requestNumber = computed(() => route.params.id as string);

const isLoading = ref(true);
const hasError = ref(false);
const productionRequest = ref<ProductionRequest | null>(null);

// Workflow tracking
const associatedWorkflow = ref<Workflow | null>(null);
const currentWorkflowStageId = ref<string | null>(null);

definePageMeta({
  layout: "blank" // we want a clean layout with no sidebar for customers
});

const sortedWorkflowStages = computed(() => {
    if (!associatedWorkflow.value) return [];
    return [...associatedWorkflow.value.stages]
        .filter(s => s.status === 'Enabled')
        .sort((a, b) => Number(a.ordering) - Number(b.ordering));
});

const workflowProgressPercent = computed(() => {
    const stages = sortedWorkflowStages.value;
    if (!stages.length || !currentWorkflowStageId.value) return 0;
    const idx = stages.findIndex(s => s.id === currentWorkflowStageId.value);
    if (idx < 0) return 0;
    return Math.round(((idx + 1) / stages.length) * 100);
});

const sortedTimeline = computed(() => {
  if (!productionRequest.value?.processingTimeLine) return [];
  // Sort descending (newest first)
  return [...productionRequest.value.processingTimeLine].sort(
    (a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
  );
});

const formatDateTime = (isoString: string) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return new Intl.DateTimeFormat('en-GB', { 
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(d);
};

onMounted(async () => {
  if (!requestNumber.value) {
    hasError.value = true;
    isLoading.value = false;
    return;
  }

  try {
    const req = await getProductionRequestByNumber(requestNumber.value);
    if (req) {
      productionRequest.value = req;
      currentWorkflowStageId.value = req.currentStageId ?? null;
      
      if (req.workflowId) {
        try {
          associatedWorkflow.value = await getWorkflowDetails(req.workflowId);
        } catch (we) {
          console.warn('Failed to load workflow details', we);
        }
      }
    } else {
      hasError.value = true;
    }
  } catch (err) {
    console.error('Failed to fetch request', err);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>
