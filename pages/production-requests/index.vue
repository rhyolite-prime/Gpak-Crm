<template>
  <div class="space-y-6" @click="closeMenuOnOutsideClick">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Production Requests</h1>
        <p class="text-sm text-gray-500 mt-1">Manage and review all production request from customers.</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search Production Requests..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64">
        </div>
        <NuxtLink v-if="hasPermission('Production Request.Create')" to="/production-requests/create" class="btn-primary flex items-center space-x-2">
            <Plus class="w-4 h-4" />
            <span>Create Request</span>
        </NuxtLink>
        
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
      <div class="stat-card relative group cursor-pointer">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Requests</p>
            <p class="text-2xl font-bold text-gray-900">{{ productionStatsData.totalRequests }}</p>
          </div>
          <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Package class="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg z-50">
          Total number of production requests made by customers.
        </div>
      </div>
      <div class="stat-card relative group cursor-pointer">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Submitted</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="productionStatsData.totalRequests" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg z-50">
          Requests submitted by customers but not yet approved.
        </div>
      </div>
      <div class="stat-card relative group cursor-pointer">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Approved</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="productionStatsData.approved" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg z-50">
          Requests that have been approved for production.
        </div>
      </div>
      <div class="stat-card relative group cursor-pointer">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Planned</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="productionStatsData.scheduled" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CalendarClock class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg z-50">
          Requests that have been scheduled for a publication date.
        </div>
      </div>
      <div class="stat-card relative group cursor-pointer">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Rejected</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="productionStatsData.rejected" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle class="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg z-50">
          Requests that were declined or cancelled before completion.
        </div>
      </div>
      <div class="stat-card relative group cursor-pointer">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Completed</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="productionStatsData.published" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Send class="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg z-50">
          Requests that have been published or completed.
        </div>
      </div>
    </div>

    <!-- Receipts Table -->
    <div class="bg-white rounded-lg border border-gray-200">
      <!-- Loader -->
      <div v-if="isShimmerLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
      <div class="overflow-x-auto min-h-[400px]">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request ID
              </th>

               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Name
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business/Customer Name
              </th>

               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Email
              </th>
               
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone No.
              </th>
              
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="productionRequest in productionRequestList" :key="productionRequest.id"
              class="hover:bg-gray-50 transition-colors">

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ productionRequest.createdAt }}</div>
              </td>
 
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ productionRequest.requestNumber }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ productionRequest.jobName }}</div>
              </td>
              

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ productionRequest.businessName }}</div>
              </td>


              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ productionRequest.customerEmail }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ productionRequest.customerPhoneNumber }}</div>
              </td>


              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="status-badge"
                  :class="getStatusColor(productionRequest.currentStageName)">
                  {{ productionRequest.currentStageName }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="relative flex justify-end">
                  <button
                    @click.stop="toggleMenu(productionRequest.id)"
                    class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    :id="'menu-button-' + productionRequest.id"
                    title="Actions"
                  >
                    <MoreVertical class="w-5 h-5" />
                  </button>

                  <!-- Actions Dropdown -->
                  <div
                    v-if="activeMenuId === productionRequest.id"
                    class="absolute right-0 mt-8 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1 origin-top-right"
                  >
                    <!-- View Details -->
                    <button
                      @click="viewAdRequestDetails(productionRequest); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      <Eye class="w-4 h-4" />
                      <span>View Details</span>
                    </button>

                    <!-- Edit Request -->
                    <button
                      v-if="hasPermission('Production Request.Update')"
                      @click="router.push(`/production-requests/edit/${productionRequest.id}`); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <Edit class="w-4 h-4" />
                      <span>Edit Request</span>
                    </button>

                    <!-- Create / View Estimate -->
                    <button
                      v-if="hasPermission('Estimate.Create')"
                      @click="createEstimate(productionRequest); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      <Calculator class="w-4 h-4" />
                      <span>Create / Edit Estimate</span>
                    </button>

                    <!-- View Files -->
                    <button
                      v-if="productionRequest.uploadedFiles && productionRequest.uploadedFiles.length > 0"
                      @click="viewFiles(productionRequest); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                    >
                      <FileText class="w-4 h-4" />
                      <span>View Files</span>
                    </button>

                    <!-- View Timeline -->
                    <button
                      v-if="productionRequest.processingTimeLine && productionRequest.processingTimeLine.length > 0"
                      @click="viewTimeline(productionRequest); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                    >
                      <History class="w-4 h-4" />
                      <span>View Timeline</span>
                    </button>

                    <!-- View Payments -->
                    <!-- <button
                      @click="viewPayments(productionRequest); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                    >
                      <CreditCard class="w-4 h-4" />
                      <span>View Payments</span>
                    </button> -->

                    <div class="border-t border-gray-100 my-1"></div>

                    <!-- Update Status -->
                    <button
                      v-if="hasPermission('Production Request.UpdateStatus')"
                      @click="initUpdateStatus(productionRequest); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                    >
                      <CheckCheck class="w-4 h-4" />
                      <span>Update Status</span>
                    </button>

                    <!-- Update Status -->
                    <button
                      v-if="hasPermission('Production Request.Delete')"
                      @click="initDelete(productionRequest); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                    >
                      <CheckCheck class="w-4 h-4" />
                      <span>Delete</span>
                    </button>

                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      <!-- Status Update Modal -->
    <div v-if="showStatusUpdateModal" class="modal-overlay" @click="closeStatusUpdateModal">
      <div class="modal-content" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h2>
            <button @click="closeStatusUpdateModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <form class="space-y-4">

            <!-- Workflow loading state -->
            <div v-if="isWorkflowLoading" class="flex items-center justify-center py-10 text-gray-500">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mr-3"></div>
              <span class="text-sm">Loading workflow stages…</span>
            </div>

            <!-- No workflow configured -->
            <div v-else-if="!selectedWorkflow" class="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm text-yellow-700 flex items-start space-x-3">
              <GitMerge class="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
              <div>
                <p class="font-semibold">No workflow assigned</p>
                <p class="mt-0.5 text-yellow-600">This production request does not have an associated workflow. Assign a workflow first.</p>
              </div>
            </div>

            <!-- No valid transitions from current stage -->
            <div v-else-if="validNextStages.length === 0 && validPreviousStages.length === 0" class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600 flex items-start space-x-3">
              <Check class="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
              <div>
                <p class="font-semibold">No further stages available</p>
                <p class="mt-0.5">There are no available stages to move this request to.</p>
              </div>
            </div>

            <!-- Stage selection cards -->
            <div v-else class="space-y-6">
              <!-- Current Stage Info -->
              <div class="rounded-lg border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-700 flex items-start space-x-3">
                <Info class="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                <div>
                  <p class="font-semibold">Current Stage</p>
                  <p class="mt-0.5 text-blue-600 font-medium">{{ currentWorkflowStage?.title || 'Unknown' }}</p>
                  <p class="text-xs mt-1 text-blue-500" v-if="currentWorkflowStage?.description">{{ currentWorkflowStage.description }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div>
                <div class="grid grid-cols-2 gap-4">
                  <!-- Approve Action -->
                  <div 
                    v-if="validNextStages.length > 0"
                    @click="workflowStageForm.targetStageName = validNextStages[0].title; isApproveSelected = true"
                    :class="[
                      'relative cursor-pointer rounded-lg border-2 p-4 transition-all',
                      (workflowStageForm.targetStageName === validNextStages[0].title && isApproveSelected)
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-300'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/40'
                    ]"
                  >
                    <div class="flex flex-col items-center text-center">
                      <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <Check class="w-5 h-5 text-green-600" />
                      </div>
                      <p class="font-semibold text-gray-900">Approve</p>
                      <p class="text-xs text-gray-500 mt-1">Moves request to: <br/><span class="font-medium text-gray-700">{{ validNextStages[0].title }}</span></p>
                    </div>
                  </div>
                  
                  <!-- Reject Action -->
                  <div 
                    v-if="validPreviousStages.length > 0"
                    @click="workflowStageForm.targetStageName = validPreviousStages[0].title; isApproveSelected = false"
                    :class="[
                      'relative cursor-pointer rounded-lg border-2 p-4 transition-all',
                      (workflowStageForm.targetStageName === validPreviousStages[0].title && !isApproveSelected)
                        ? 'border-red-500 bg-red-50 ring-2 ring-red-300'
                        : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/40'
                    ]"
                  >
                    <div class="flex flex-col items-center text-center">
                      <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                        <X class="w-5 h-5 text-red-600" />
                      </div>
                      <p class="font-semibold text-gray-900">Reject</p>
                      <p class="text-xs text-gray-500 mt-1">Returns request to: <br/><span class="font-medium text-gray-700">{{ validPreviousStages[0].title }}</span></p>
                    </div>
                  </div>
                </div>
                
                <!-- Consequence Message -->
                <div v-if="workflowStageForm.targetStageName" class="rounded-lg p-3 text-sm mt-4" 
                     :class="isApproveSelected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
                  <p v-if="isApproveSelected"><strong>Consequence:</strong> Approving will advance this production request to the <strong>{{ validNextStages[0].title }}</strong> stage. The appropriate team members will be notified.</p>
                  <p v-else><strong>Consequence:</strong> Rejecting will send this production request back to the <strong>{{ validPreviousStages[0].title }}</strong> stage. This requires a remark explaining the rejection.</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-1 gap-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Reason or Remarks (optional)</label>
                <textarea placeholder="Reason or Remarks ..."
                  v-model="workflowStageForm.remarks"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-20">
                </textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeStatusUpdateModal" class="btn-secondary">
                Cancel
              </button>
              <button 
                type="button" 
                @click="confirmAdRequestStatusUpdate"
                :disabled="!workflowStageForm.targetStageName || isWorkflowLoading"
                :class="[
                  'btn-primary flex items-center space-x-2',
                  (!workflowStageForm.targetStageName || isWorkflowLoading) ? 'opacity-50 cursor-not-allowed' : ''
                ]">
                <ArrowRight class="w-4 h-4" />
                <span>Update Stage</span>
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>

      <UiActionVerificationModal
        :isOpen="showActionVerificationModal"
        :isProcessing="updating"
        actionTitle="Update Status"
        message="You are about to change the status of this production request. Do you want to proceed?"
        :requireConfirmationText="true"
        confirmationWord="CONFIRM"
        confirmButtonText="Update"
        infoNote="This change will notify the customer and cannot be undone."
        @close="showActionVerificationModal = false"
        @confirm="handleStatusUpdate"
      />



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
 
    <!-- View Production Request Details Modal -->
    <div v-if="showViewModal && selectedProductionRequest" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content max-w-4xl w-full" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h2>
            <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-6">
            <!-- Status Badge -->
            <div class="flex items-center justify-between">
              <div v-if="selectedWorkflow" class="text-sm text-gray-500 flex items-center space-x-2">
                <GitMerge class="w-4 h-4 text-gray-400" />
                <span>{{ selectedWorkflow.name }}</span>
              </div>
              <div v-else></div>
              <span 
                class="status-badge text-sm"
                :class="getStatusColor(selectedProductionRequest.currentStageName)"
              >
                {{ selectedProductionRequest.currentStageName }}
              </span>
            </div>

            <!-- Workflow Progress Tracker -->
            <div v-if="selectedWorkflow" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <!-- Header row -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-semibold text-gray-700">
                    Stage {{ sortedWorkflowStages.findIndex(s => s.id === selectedProductionRequest.currentStageId) + 1 }} of {{ sortedWorkflowStages.length }}
                  </span>
                  <span class="text-xs text-gray-500">· {{ workflowProgressPercent }}% Complete</span>
                </div>
                <div v-if="currentWorkflowStage" class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  Status: {{ currentWorkflowStage.title }}
                </div>
              </div>
              <!-- Progress bar -->
              <div class="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                <div 
                  class="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                  :style="{ width: workflowProgressPercent + '%' }"
                ></div>
              </div>
              <!-- Horizontal stage stepper -->
              <div class="flex items-start overflow-x-auto pb-2 space-x-1">
                <template v-for="(stage, idx) in sortedWorkflowStages" :key="stage.id">
                  <div class="flex flex-col items-center min-w-[80px] text-center">
                    <!-- Circle indicator -->
                    <div :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0',
                      stage.id === selectedProductionRequest.currentStageId
                        ? 'border-red-500 bg-red-500 text-white'
                        : sortedWorkflowStages.findIndex(s => s.id === selectedProductionRequest.currentStageId) > idx
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                    ]">
                      <Check v-if="sortedWorkflowStages.findIndex(s => s.id === selectedProductionRequest.currentStageId) > idx" class="w-4 h-4" />
                      <span v-else>{{ idx + 1 }}</span>
                    </div>
                    <!-- Stage title -->
                    <p :class="[
                      'text-xs mt-1 leading-tight',
                      stage.id === selectedProductionRequest.currentStageId ? 'text-red-600 font-semibold' : 'text-gray-500'
                    ]">{{ stage.title }}</p>
                    <p v-if="stage.id === selectedProductionRequest.currentStageId" class="text-[10px] text-red-400 font-medium">CURRENT</p>
                  </div>
                  <!-- Connector line -->
                  <div v-if="idx < sortedWorkflowStages.length - 1" :class="[
                    'h-0.5 flex-1 mt-4 min-w-[12px]',
                    sortedWorkflowStages.findIndex(s => s.id === selectedProductionRequest.currentStageId) > idx
                      ? 'bg-green-400'
                      : 'bg-gray-200'
                  ]"></div>
                </template>
              </div>
              <!-- Next Stage info -->
              <div v-if="nextWorkflowStages.length > 0" class="mt-3 pt-3 border-t border-gray-200 flex items-center space-x-2 text-sm text-gray-600">
                <ArrowRight class="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Next up: 
                  <span v-for="(ns, i) in nextWorkflowStages" :key="ns.id">
                    <strong class="text-gray-800">{{ ns.title }}</strong><span v-if="i < nextWorkflowStages.length - 1"> / </span>
                  </span>
                </span>
              </div>
              <div v-else-if="currentWorkflowStage" class="mt-3 pt-3 border-t border-gray-200 text-sm text-green-600 flex items-center space-x-2">
                <Check class="w-4 h-4" />
                <span>This is the final stage.</span>
              </div>
            </div>
            
            <!-- Customer & Business Information -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Business & Customer Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Business Name</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.businessName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Customer Name</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.customerFullName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Email Address</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.customerEmail }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Phone Number</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.customerPhoneNumber }}</p>
                </div>
              </div>
            </div>

            <!-- Production Request Details -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Production Request Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <p class="text-sm text-gray-500">Print Type/Category</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.productCategoryName }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Product</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.productName }}</p>
                </div>
                 
                <div>
                  <p class="text-sm text-gray-500">Quantity</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.quantity }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Unit of Measure</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.unitOfMeasure }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Estimated Invoice Amount</p>
                  <p class="text-base font-medium"> GHS {{ selectedProductionRequest.estimatedInvoiceAmount }}</p>
                </div>

              </div>
            </div>

            <!-- Invoice & Payment Details -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Estimate & Payment Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <p class="text-sm text-gray-500">Estimate Amount</p>
                  <p class="text-base font-medium">GHS {{ selectedProductionRequest.invoiceAmount }}</p>
                </div>
                
                <div>
                  <p class="text-sm text-gray-500">Request Status</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.status || 'Pending' }}</p>
                </div>

                <div v-if="selectedProductionRequest.paymentDate">
                  <p class="text-sm text-gray-500">Payment Date</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.paymentDate }}</p>
                </div>

                <div v-if="selectedProductionRequest.paymentMethod">
                  <p class="text-sm text-gray-500">Payment Method</p>
                  <p class="text-base font-medium">{{ selectedProductionRequest.paymentMethod }}</p>
                </div>
                
              </div>
            </div>

            <!-- Additional Information -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Special Instructions</p>
                  <p class="text-base">{{ selectedProductionRequest.description || 'No special instructions provided' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Admin Remarks</p>
                  <p class="text-base">{{ selectedProductionRequest.adminRemarks || 'No admin remarks' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Files</p>
                  <div v-if="selectedProductionRequest.uploadedFiles && selectedProductionRequest.uploadedFiles.length > 0">
                    <p class="text-base">{{ selectedProductionRequest.uploadedFiles.length }} file(s) uploaded</p>
                    <button 
                      @click="viewFiles(selectedProductionRequest)"
                      class="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-2"
                    >
                      <FileText class="w-4 h-4" />
                      <span>View Files</span>
                    </button>
                  </div>
                  <p v-else class="text-base">No files uploaded</p>
                </div>
              </div>
            </div>

            <div class="flex justify-between">
              <!-- Timeline Button -->
              <button 
                v-if="selectedProductionRequest.processingTimeLine && selectedProductionRequest.processingTimeLine.length > 0"
                @click="viewTimeline(selectedProductionRequest)" 
                class="btn-outline flex items-center space-x-2"
              >
                <History class="w-4 h-4" />
                <span>View Timeline</span>
              </button>
              <div v-else></div>

              <div class="space-x-3">
                <!-- Update Status Button -->
                <span v-if="selectedProductionRequest.status !== 'Published'" class="mr-3 inline-block">
                  <button 
                    @click="initUpdateStatus(selectedProductionRequest)" 
                    class="btn-secondary flex items-center space-x-2"
                  >
                    <CheckCheck class="w-4 h-4" />
                    <span>Update Status</span>
                  </button>
                </span>

                <!-- Close Button -->
                <button @click="closeViewModal" class="btn-primary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Files Modal -->
    <div v-if="showFilesModal && selectedFiles.length > 0" class="modal-overlay" @click="closeFilesModal">
      <div class="modal-content" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h2>
            <button @click="closeFilesModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <p class="text-sm text-gray-600 mb-4">
              The following files were uploaded for this advertisement request. Click preview to view the file or download to save it.
            </p>
            
            <div class="max-h-96 overflow-y-auto">
              <ul class="divide-y divide-gray-200">
                <li v-for="(file, index) in selectedFiles" :key="index" class="py-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="bg-blue-100 p-2 rounded">
                        <component :is="getFileIcon(file)" class="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {{ file.substring(file.lastIndexOf('/') + 1) }}
                        </p>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button 
                        @click="previewFile(file)"
                        class="p-2 text-blue-500 hover:text-blue-700"
                        title="Preview file"
                      >
                        <Eye class="w-5 h-5" />
                      </button>
                      <button 
                        @click="downloadFile(file)"
                        class="p-2 text-gray-400 hover:text-gray-600"
                        title="Download file"
                      >
                        <Download class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="flex justify-end mt-4">
              <button @click="closeFilesModal" class="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- File Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="closePreviewModal">
      <div class="modal-content max-w-4xl w-full h-[90vh] flex flex-col" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">File Preview</h2>
            <button @click="closePreviewModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="flex-grow p-2 overflow-hidden flex flex-col">
          <div class="bg-gray-100 rounded-lg p-2 mb-2 flex items-center justify-between">
            <p class="text-sm font-medium text-gray-700 truncate max-w-md">
              {{ previewingFileName }}
            </p>
            <div class="flex items-center space-x-2">
              <button 
                @click="openInNewTab(previewingFile)"
                class="p-2 text-blue-500 hover:text-blue-700"
                title="Open in new tab"
              >
                <ExternalLink class="w-5 h-5" />
              </button>
              <button 
                @click="downloadFile(previewingFile)"
                class="p-2 text-gray-600 hover:text-gray-800"
                title="Download file"
              >
                <Download class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div class="flex-grow overflow-auto bg-white rounded-lg border border-gray-200">
            <!-- Image preview -->
            <img 
              v-if="isImageFile(previewingFile)" 
              :src="previewingFile" 
              class="max-w-full max-h-full mx-auto object-contain h-full"
              alt="Preview"
            />
            
            <!-- PDF preview -->
            <iframe 
              v-else-if="isPdfFile(previewingFile)"
              :src="previewingFile" 
              class="w-full h-full"
              title="PDF Preview"
            ></iframe>
            
            <!-- Unsupported file type -->
            <div 
              v-else
              class="flex flex-col items-center justify-center h-full p-6 text-center"
            >
              <FileQuestion class="w-16 h-16 text-gray-400 mb-4" />
              <p class="text-lg font-medium text-gray-700">This file type cannot be previewed</p>
              <p class="text-sm text-gray-500 mt-2 mb-4">Please download the file to view its contents</p>
              <button 
                @click="downloadFile(previewingFile)" 
                class="btn-primary flex items-center space-x-2"
              >
                <Download class="w-5 h-5" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Timeline Modal -->
    <div v-if="showTimelineModal && selectedTimeline.length > 0" class="modal-overlay" @click="closeTimelineModal">
      <div class="modal-content max-w-3xl w-full" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h2>
            <button @click="closeTimelineModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center space-x-2 mb-6">
              <div class="bg-purple-100 p-2 rounded-full">
                <History class="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ selectedProductionRequest?.businessName }} - {{ selectedProductionRequest?.customerFullName }}
                </h3>
                <p class="text-sm text-gray-600">
                  Processing timeline for production request
                </p>
              </div>
            </div>
            
            <div class="relative">
              <!-- Timeline connecting line -->
              <div class="absolute left-5 top-0 w-0.5 h-full bg-gray-200"></div>
              
              <!-- Timeline items -->
              <ul class="space-y-6 relative z-10">
                <li v-for="(item, index) in selectedTimeline" :key="item.id" class="flex items-start">
                  <div 
                    class="flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10"
                    :class="getTimelineStatusColor(item.status)"
                  >
                    <component :is="getTimelineStatusIcon(item.status)" class="w-5 h-5" />
                  </div>
                  
                  <div class="ml-4 flex-grow">
                    <div class="flex items-center justify-between">
                      <h4 class="text-base font-medium text-gray-900">{{ item.title }}</h4>
                      <span 
                        class="text-xs font-medium px-2 py-1 rounded-full"
                        :class="getTimelineStatusColor(item.status)"
                      >
                        {{ item.status }}
                      </span>
                    </div>
                    
                    <p class="text-sm text-gray-600 mt-1">{{ item.details }}</p>
                    
                    <div class="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                      <span>{{ item.timeStamp }}</span>
                      <span>•</span>
                      <span>By: {{ item.updatedBy }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="flex justify-end mt-6">
              <button @click="closeTimelineModal" class="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Estimate Modal -->
    <div v-if="showEstimateModal" class="modal-overlay" @click="showEstimateModal = false">
      <div class="modal-content max-w-3xl w-full" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Create Estimate</h2>
            <button @click="showEstimateModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Estimate Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estimate Number</label>
              <input v-model="estimationForm.estimateNumber" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Enter estimate number" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Alias</label>
              <select v-model="estimationForm.preparedBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
              <option value="">Select Staff</option>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Time Effort (hrs)</label>
              <input type="number" v-model="estimationForm.estimatedTimeEffort" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Discount</label>
              <input type="number" v-model="estimationForm.discount" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
            </div>


            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="estimationForm.description" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" rows="3" placeholder="What this estimate covers"></textarea>
            </div>
          </div>

          <!-- Invoice Items -->
          <div>
            <div class="max-h-[60vh] overflow-y-auto pr-2">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Estimate Details</h3>
              <div class="space-y-4">
                <div
                  v-for="(item, index) in estimationForm.details"
                  :key="item.id"
                  class="border rounded-lg p-4 bg-gray-50 relative"
                >
                  <div class="flex justify-between items-center mb-3">
                    <p class="font-medium"> ({{ index + 1 }})</p>
                    <button @click="removeInvoiceItem(index)" class="text-red-500 hover:text-red-700 text-sm">Remove</button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="flex items-center justify-between">
                      <label class="block text-sm font-medium text-gray-700">Use Raw Material</label>
                      <div
                        @click="item.useRawMaterial = !item.useRawMaterial"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer"
                        :class="item.useRawMaterial ? 'bg-green-500' : 'bg-gray-300'"
                      >
                        <span
                          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300"
                          :class="item.useRawMaterial ? 'translate-x-6' : 'translate-x-1'"
                        ></span>
                      </div>
                    </div>

                    <div v-if="item.useRawMaterial">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Select Material</label>
                      <select v-model="item.itemId" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <option value="">Select Material</option>
                        <option v-for="mat in rawMaterialList" :key="mat.id" :value="mat.id">{{ mat.name }}</option>
                      </select>
                    </div>
                    <div v-else>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                      <input v-model="item.itemName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Enter item name" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input type="number" v-model="item.quantity" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                      <input type="number" v-model="item.unitPrice" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Summary Section -->
              <div class="border-t border-gray-300 pt-4 mt-4 flex justify-between text-sm font-medium text-gray-700">
                <!-- <div>Total Quantity: 
                  <span class="font-semibold">
                    {{ estimationForm.details.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) }}
                  </span>
                </div> -->
                <div>Total Estimated Cost (GHS): 
                  <span class="font-semibold">
                    {{ estimationForm.estimatedCost?.toFixed(2) || '0.00' }}
                  </span>
                </div>
              </div>

              <button @click="addInvoiceItem" class="btn-secondary mt-3">+ Add Item</button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button @click="showEstimateModal = false" class="btn-secondary">Cancel</button>
            <button @click="saveEstimate" :disabled="isCreatingEstimate" class="btn-primary">
               
              <div v-if="isCreatingEstimate" class="loader"></div>
                <span>{{ isCreatingEstimate ? 'Saving...' : 'Save Estimate' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Estimate Modal -->
    <client-only>

      <div v-if="showViewEstimateModal && estimateInfo" class="modal-overlay" @click="closeViewEstimateModal">
        <div class="modal-content max-w-2xl" @click.stop>
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Estimate #{{ estimateInfo.estimateNumber }}</h2>
              <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <!-- Shimmer Loading for Invoice -->
            <div v-if="isEstimateLoading" class="rounded-2xl shadow-2xl border border-gray-200 p-8 bg-white space-y-8">
              <div class="animate-pulse">
                <!-- Header shimmer -->
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-4">
                    <div class="h-12 w-24 bg-gray-200 rounded-md"></div>
                  </div>
                  <div class="text-right">
                    <div class="h-5 w-32 bg-gray-200 rounded-full mb-2"></div>
                    <div class="h-4 w-40 bg-gray-200 rounded mb-1"></div>
                    <div class="h-4 w-36 bg-gray-200 rounded mb-1"></div>
                    <div class="h-4 w-44 bg-gray-200 rounded"></div>
                  </div>
                </div>

                <!-- Party Info shimmer -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div>
                    <div class="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                    <div class="bg-gray-100 rounded-lg p-4">
                      <div class="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div class="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                      <div class="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
                      <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div>
                    <div class="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                    <div class="bg-gray-100 rounded-lg p-4">
                      <div class="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div class="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                      <div class="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
                      <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                <!-- Service Table shimmer -->
                <div class="mt-8">
                  <div class="bg-gray-100 rounded-lg overflow-hidden">
                    <div class="h-10 bg-gray-200 w-full mb-1"></div>
                    <div class="h-12 bg-gray-100 w-full"></div>
                  </div>
                </div>

                <!-- Summary shimmer -->
                <div class="flex flex-col sm:items-end space-y-2 mt-8">
                  <div class="w-full sm:max-w-xs space-y-1">
                    <div class="flex justify-between">
                      <div class="h-4 w-20 bg-gray-200 rounded"></div>
                      <div class="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div class="flex justify-between">
                      <div class="h-4 w-16 bg-gray-200 rounded"></div>
                      <div class="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div class="flex justify-between pt-2 mt-1 border-t border-gray-200">
                      <div class="h-5 w-24 bg-gray-200 rounded"></div>
                      <div class="h-5 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                <!-- Footer shimmer -->
                <div class="border-t border-dashed border-gray-300 pt-4 mt-8">
                  <div class="h-4 w-3/4 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div class="h-3 w-1/3 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>
            </div>

            <!-- Estimate Content -->
            <div id="estimate-content" v-else>
              <div class="rounded-2xl shadow-2xl border border-gray-200 p-8 bg-white space-y-8">
                <!-- Header -->
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-4">
                    <img src="/img/gpak.jpeg" alt="Daily Graphic Logo" class="h-12 w-auto rounded-md border border-gray-200 p-1 bg-white shadow" />
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Estimate No: <span class="font-semibold text-gray-700">#{{ estimateInfo.estimateNumber || 'N/A' }}</span></p>
                    <p class="text-sm text-gray-500">Estimate Date: <span class="font-semibold text-gray-700">{{ estimateInfo.invoiceDate }}</span></p>
                    <p class="text-sm text-gray-500">Valid Until: <span class="font-semibold text-gray-700">{{ estimateInfo.dueDate }}</span></p>
                  </div>
                </div>

                <!-- Party Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Bill To</h4>
                    <div class="text-sm text-gray-700 space-y-1">
                      <p class="font-semibold">{{ estimateInfo.businessName }}</p>
                      <p>{{ estimateInfo.fullName }}</p>
                      <p>{{ estimateInfo.email }}</p>
                      <p>{{ estimateInfo.phoneNumber }}</p>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">From</h4>
                    <div class="text-sm text-gray-700 space-y-1">
                      <p class="font-semibold">GPAK</p>
                      <p>Graphic Communications Group Ltd.</p>
                      <p>Accra, Ghana</p>
                      <p>+233302674071</p>
                    </div>
                  </div>
                </div>

                <!-- Invoice Items Table -->
                <div class="overflow-x-auto">
                  <table class="min-w-full text-sm text-gray-700 border border-gray-200">
                    <thead class="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th class="text-left px-4 py-2 font-semibold">Description</th>
                        <th class="text-left px-4 py-2 font-semibold">Qty</th>
                        <th class="text-left px-4 py-2 font-semibold">Unit Price (GHS)</th>
                        <th class="text-left px-4 py-2 font-semibold">Total (GHS)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-if="estimateInfo.details && estimateInfo.details.length > 0" 
                          v-for="(item, index) in estimateInfo.details" 
                          :key="index">
                        <td class="px-4 py-2">{{ item.itemName }}</td>
                        <td class="px-4 py-2">{{ item.quantity }}</td>
                        <td class="px-4 py-2"> {{ _currency(item.unitPrice) }}</td>
                        <td class="px-4 py-2 font-semibold">{{ _currency(item.unitPrice * item.quantity) }}</td>
                      </tr>
                       
                    </tbody>
                  </table>
                </div>

                <!-- Summary -->
                <div class="flex flex-col sm:items-end space-y-2">
                  <div class="text-sm text-gray-700 space-y-1 w-full sm:max-w-xs">
                    <div class="flex justify-between"><span>Sub Total:</span><span>GHS {{ _currency(estimateInfo.estimatedCost) }}</span></div>
                    <div class="flex justify-between"><span>Discount:</span><span>GHS {{ _currency(estimateInfo.discount || 0) }}</span></div>
                    
                    <!-- Taxes Section -->
                    <div v-if="estimateInfo.taxes && estimateInfo.taxes.length > 0" class="pt-3 mt-2 border-t border-gray-200">
                      <h5 class="font-medium text-gray-700 mb-2">Tax Summary</h5>
                      <div class="bg-gray-50 rounded-lg p-3">
                        <div v-for="tax in estimateInfo.taxes" :key="tax.id" class="flex justify-between items-center py-1">
                          <div class="flex items-center">
                            <span class="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 rounded-full mr-2 text-xs">
                              <span v-if="tax.isPercentage">%</span>
                              <span v-else>₵</span>
                            </span>
                            <span class="text-gray-700">{{ tax.taxName }} {{ tax.isPercentage ? `(${tax.rate}%)` : '' }}</span>
                          </div>
                          <span class="font-medium">GHS {{ _currency(tax.taxAmount) }}</span>
                        </div>
                        <div class="flex justify-between pt-2 mt-2 border-t border-gray-200 font-semibold text-gray-800">
                          <span>Total Tax:</span>
                          <span>GHS {{ _currency(calculateTotalTax(estimateInfo.taxes)) }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex justify-between pt-2 mt-1 border-t border-gray-200 text-base font-bold text-red-700">
                      <span>Total Amount:</span>
                      <span>GHS {{ _currency(estimateInfo.estimatedCost) }}</span>
                    </div>

                    <div class="flex justify-between pt-1 text-sm font-medium" v-if="estimateInfo.status === 'Paid'">
                      <span class="text-green-600">Paid Amount:</span>
                      <span class="text-green-600">GHS {{ _currency(estimateInfo.totalAmount) }}</span>
                    </div>

                    <div class="flex justify-between pt-1 text-sm font-medium" v-else>
                      <span class="text-yellow-600">Balance Due:</span>
                      <span class="text-yellow-600">GHS {{ _currency(estimateInfo.estimatedCost) }}</span>
                    </div>

                  </div>
                </div>

                <!-- Payment Status -->
                <div v-if="estimateInfo.status" class="border-t border-gray-200 pt-4 text-center">
                  <p v-if="estimateInfo.status === 'Paid'" class="text-xs text-green-600 mt-1">
                    Paid on: {{ estimateInfo.paidAt || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex justify-end space-x-3 pt-4 mt-4">
              <button @click="closeViewEstimateModal" class="btn-secondary">
                Close
              </button>
              <button 
                @click="downloadEstimate(estimateInfo)" 
                class="btn-primary flex items-center space-x-2"
                title="Download as PDF"
              >
                <Download class="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
 
      <!-- Delete Confirmation Modal -->
    <UiDeleteConfirmationModal
      :is-open="showDeleteConfirmationModal"
      :isDeleting="isDeleting"
      :item-name="'Production Request'"
      @close="closeDeleteModal"
      @confirm="delProductionRequest"
    />

    </client-only>
    
     
    <!-- Payments Modal -->
    <div v-if="showPaymentsModal" class="modal-overlay" @click="showPaymentsModal = false">
      <div class="modal-content max-w-4xl w-full" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h2>
            <button @click="showPaymentsModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Summary Card -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Payment Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-500">Invoice Amount</p>
                <p class="text-xl font-semibold text-gray-900">GHS {{ paymentsSummary.invoiceAmount.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Paid</p>
                <p class="text-xl font-semibold text-green-600">GHS {{ paymentsSummary.totalPaid.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Balance Due</p>
                <p class="text-xl font-semibold" :class="paymentsSummary.balanceDue > 0 ? 'text-red-600' : 'text-green-600'">
                  GHS {{ paymentsSummary.balanceDue.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Payment List -->
          <div class="max-h-[60vh] overflow-y-auto space-y-4">
            <div 
              v-for="payment in selectedPayments" 
              :key="payment.id" 
              class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-medium text-gray-800">
                  Receipt #{{ payment.receiptNo }}
                </h4>
                <span 
                  class="text-xs font-medium px-2 py-1 rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': payment.paymentState === 'Success',
                    'bg-yellow-100 text-yellow-800': payment.paymentState === 'Pending',
                    'bg-red-100 text-red-800': payment.paymentState === 'Failed'
                  }"
                >
                  {{ payment.paymentState }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-1">Transaction Ref: {{ payment.transactionReference }}</p>
              <p class="text-sm text-gray-600 mb-1">Amount Paid: <span class="font-semibold">GHS {{ payment.amountPaid.toFixed(2) }}</span></p>
              <p class="text-sm text-gray-600 mb-1">Payment Source: {{ payment.paymentSource }}</p>
              <p class="text-sm text-gray-600 mb-1">Paid By: {{ payment.fullName }}</p>
              <p class="text-sm text-gray-600 mb-2">Email: {{ payment.email }}</p>

              <div v-if="payment.uploadedFiles && payment.uploadedFiles.length > 0" class="mt-2">
                <p class="text-sm text-gray-500 mb-1">Proof of Payment:</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="file in payment.uploadedFiles"
                    :key="file"
                    @click="previewFile(file)"
                    class="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    {{ file.substring(file.lastIndexOf('/') + 1) }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end pt-4">
            <button @click="showPaymentsModal = false" class="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<script lang="ts" setup>
import type { ProductionRequest, Staff, RawMaterial, Payment, Estimation, ProductionRequestPaymentSummary, ProductionRequestStats, ProductionProcessingTimeLine, Workflow, WorkflowStage } from "~/models";
import { isEmpty, debounce } from "lodash-es";
import CountUp from 'vue-countup-v3'
const { $toast } = useNuxtApp();
const { hasPermission } = usePermissions();

import { 
  Search, 
  CreditCard, 
  CalendarClock, 
  Send, 
  Clock,
  XCircle,
  Eye,
  Download,
  CheckCheck,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  FileQuestion,
  File as FilePdf,
  ExternalLink,
  History,
  Plus,
  Calculator,
  Package,
  MoreVertical,
  X,
  ChevronRight,
  GitMerge,
  Info,
  Check,
  ArrowRight,
  Edit
} from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
  requiredPermissions: ['Production Request.View']
})


const showCreateModal = ref(false)
const showViewEstimateModal = ref(false);
const showDeleteConfirmationModal = ref(false);

// Context menu
const activeMenuId = ref<string | null>(null);

const toggleMenu = (id: string) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};

const closeMenuOnOutsideClick = () => {
  activeMenuId.value = null;
};
const isEstimateLoading = ref(false)
const showFilesModal = ref(false)
const showPreviewModal = ref(false)
const showTimelineModal = ref(false)
const selectedReceipt = ref(null)
const selectedFiles = ref<string[]>([]);
const previewingFile = ref('')
const previewingFileName = ref('')
const selectedTimeline = ref<ProductionProcessingTimeLine[]>([])
const estimateInfo = ref<Estimation>(null);
 
const isShimmerLoading = ref(true);
const isCreatingEstimate = ref(false);
const showActionVerificationModal = ref(false);
const showStatusUpdateModal = ref(false);
const updating = ref(false);
const isDeleting = ref(false);
const modalTitle = ref('');

//
const confirmationWord = ref('');
const confirmationText = ref('');
const showViewModal = ref(false);
 
const infoNote = ref('');
const actionTitle = ref('');
const message = ref('');


const isSummaryStatsShimmerLoading = ref(true);
const productionRequestList =  ref<ProductionRequest[]>([])
const selectedProductionRequest = ref<ProductionRequest>(null);
const staffList = ref<Staff[]>([]);
const rawMaterialList = ref<RawMaterial[]>([]);
const productionRequestPaymentSummary = ref<ProductionRequestPaymentSummary>();

const productionStatsData = ref<ProductionRequestStats>({
  totalRequests: 0,
  pending: 0,
  approved: 0,
  scheduled: 0,
  rejected: 0,
  published: 0
});

//payments
const showPaymentsModal = ref(false);
const selectedPayments = ref<Payment[]>([]);
const paymentsSummary = ref({
  invoiceAmount: 0,
  totalPaid: 0,
  balanceDue: 0
});



useHead({
  title: 'Production Requests'
})

const router = useRouter();
const route = useRoute();

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,
});

const productionStatusUpdateForm = reactive({
  id: '',
  status: '',
  adminRemarks: '',
});

// Workflow-driven advance stage
const workflowStageForm = reactive({
  id: '',
  targetStageName: '',
  remarks: '',
});
const isApproveSelected = ref(true);
const selectedWorkflow = ref<Workflow | null>(null);
const isWorkflowLoading = ref(false);

// Valid next stages based on current position
const validNextStages = computed(() => {
  if (!selectedWorkflow.value || !selectedProductionRequest.value) return [];
  const currentStageId = selectedProductionRequest.value.currentStageId;
  const workflow = selectedWorkflow.value;
  const validTransitions = currentStageId
    ? workflow.transitions.filter(t => t.currentStageId === currentStageId && t.status === 'Enabled')
    : workflow.transitions.filter(t => t.status === 'Enabled');
  const targetStageIds = new Set(validTransitions.map(t => t.targetStageId));
  return workflow.stages.filter(s => targetStageIds.has(s.id) && s.status === 'Enabled');
});

// Valid previous stages based on ordering
const validPreviousStages = computed(() => {
  if (!selectedWorkflow.value || !selectedProductionRequest.value?.currentStageId) return [];
  const currentStageId = selectedProductionRequest.value.currentStageId;
  const currentStage = selectedWorkflow.value.stages.find(s => s.id === currentStageId);
  if (!currentStage) return [];
  
  return selectedWorkflow.value.stages.filter(s => 
    s.status === 'Enabled' && 
    Number(s.ordering) < Number(currentStage.ordering)
  ).sort((a, b) => Number(b.ordering) - Number(a.ordering));
});

// For the details modal — current and next stage resolution
const currentWorkflowStage = computed(() => {
  if (!selectedWorkflow.value || !selectedProductionRequest.value?.currentStageId) return null;
  return selectedWorkflow.value.stages.find(s => s.id === selectedProductionRequest.value.currentStageId) ?? null;
});

const nextWorkflowStages = computed(() => {
  if (!selectedWorkflow.value || !selectedProductionRequest.value?.currentStageId) return [];
  const currentStageId = selectedProductionRequest.value.currentStageId;
  const transitions = selectedWorkflow.value.transitions.filter(
    t => t.currentStageId === currentStageId && t.status === 'Enabled'
  );
  const nextIds = new Set(transitions.map(t => t.targetStageId));
  return selectedWorkflow.value.stages.filter(s => nextIds.has(s.id));
});

const workflowProgressPercent = computed(() => {
  if (!selectedWorkflow.value || !selectedProductionRequest.value?.currentStageId) return 0;
  const sorted = [...selectedWorkflow.value.stages]
    .filter(s => s.status === 'Enabled')
    .sort((a, b) => Number(a.ordering) - Number(b.ordering));
  const idx = sorted.findIndex(s => s.id === selectedProductionRequest.value.currentStageId);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / sorted.length) * 100);
});

const sortedWorkflowStages = computed(() => {
  if (!selectedWorkflow.value) return [];
  return [...selectedWorkflow.value.stages]
    .filter(s => s.status === 'Enabled')
    .sort((a, b) => Number(a.ordering) - Number(b.ordering));
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const showEstimateModal = ref(false);

const estimationForm = reactive({
  estimateNumber: '',
  productionRequestId: '',
  productionRequestNumber: '',
  estimatedCost: null,
  discount: null,
  estimatedTimeEffort: null,
  description: '',
  status: 0,
  preparedBy: '',
  approvalDate: '',
  rejectionReason: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  businessName: '',
  details: [] as {
    id: string;
    itemId?: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    useRawMaterial: boolean;
  }[]
});

watch(
  () => estimationForm.details,
  (newDetails) => {
    estimationForm.estimatedCost = newDetails.reduce(
      (sum, item) => sum + ((Number(item.unitPrice) || 0) * (Number(item.quantity) || 0)),
      0
    );
  },
  { deep: true }
);

const viewPayments = async (productionRequest: ProductionRequest) => {

  try {
    // Example: Fetch payments related to the production request
    const result = await getPaymentsOnProductionRequest({ id: productionRequest.id }); // Implement this API call

    console.log(result);

    if (!result || result.data.length === 0) {
      $toast.info('No payments found for this request');
      return;
    }

    productionRequestPaymentSummary.value = result.data;
     
    showPaymentsModal.value = true;
    modalTitle.value = 'Payment Details';

  } catch (error) {
    console.error('Error fetching payments:', error);
    $toast.error('Unable to load payments');
  }
};

const closePaymentsModal = () => {
  showPaymentsModal.value = false;
};

const createEstimate = async (productionRequest: ProductionRequest) => {

  isShimmerLoading.value = true;
  activeMenuId.value = null;

  try {

    const verificationResults = await checkIfEstimateExistsForRequestId({ id: productionRequest.id });

    if (verificationResults.hasExistingEstimate) {

      estimateInfo.value = verificationResults.estimateInfo;

       router.push(`/estimates/${verificationResults.estimateInfo.id}`);
      
    } else {
      // Navigate to the new template-based estimate page with the PR id
      router.push({
        path: '/estimates/new',
        query: {
          productionRequestId: productionRequest.id,
          productionRequestNumber: productionRequest.requestNumber,
        }
      });
    }

  } catch (error) {
    console.error('Error checking estimate:', error);
    $toast.error('Unable to check existing estimate');
  } finally {
    isShimmerLoading.value = false;
  }

};

const closeViewEstimateModal = () => {
  showViewEstimateModal.value = false;
  estimateInfo.value = null;
}

const addInvoiceItem = () => {
  estimationForm.details.push({
    id: crypto.randomUUID(),
    itemName: '',
    quantity: 1,
    unitPrice: 0,
    useRawMaterial: false
  });
};

const removeInvoiceItem = (index: number) => {
  estimationForm.details.splice(index, 1);
};

const saveEstimate = async () => {

  isCreatingEstimate.value = true;

  // Before saving, loop through estimationForm.details and set itemName for raw materials
  for (const item of estimationForm.details) {
    if (item.useRawMaterial && item.itemId) {
      const rawMat = rawMaterialList.value.find((mat) => mat.id === item.itemId);
      if (rawMat) {
        item.itemName = rawMat.name;
      }
    }
  }

  if (estimationForm.discount == null) {
    estimationForm.discount = 0;
  }

  try {

      let isSuccessful = await createProductionEstimate(estimationForm);

      if (isSuccessful) {

        $toast.success('Production estimate created!');

        await getPaginatedProductionRequests();

      }
      else {
        $toast.error('Unable to create estimate !');
      }

    } catch (error) {
      $toast.error('Unable to create estimate !');

    }
    finally {

      isCreatingEstimate.value = false;
      showEstimateModal.value = false;
    }

};


const initDelete = (productionRequest: ProductionRequest) => {

  selectedProductionRequest.value = productionRequest;

  modalTitle.value = 'Delete Production Request';

  showDeleteConfirmationModal.value = true;
} 

 const delProductionRequest = async () => {

  isDeleting.value = true;
    
  try {
      
      let isSuccessful = await deleteProductionRequest(selectedProductionRequest.value.id);
      if (isSuccessful) {
        $toast.success('Production Request deleted !');

        await getPaginatedProductionRequests();

      }
      else {
        $toast.error('Unable to delete Production Request !');
      }
    } catch (error) {
      $toast.error('Unable to delete Production Request !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }


   const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
   }
 
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Draft Request':
      return 'bg-gray-100 text-gray-800';

    case 'Specification Review':
      return 'bg-blue-100 text-blue-800';

    case 'Estimation':
      return 'bg-amber-100 text-amber-800';

    case 'Quotation Prepared':
      return 'bg-purple-100 text-purple-800';

    case 'Quotation Sent':
      return 'bg-indigo-100 text-indigo-800';

    case 'Approved':
      return 'bg-green-100 text-green-800';

    case 'Work Instruction Created':
      return 'bg-cyan-100 text-cyan-800';

    case 'Pre-Press':
      return 'bg-sky-100 text-sky-800';

    case 'Printing':
      return 'bg-blue-100 text-blue-800';

    case 'Finishing':
      return 'bg-orange-100 text-orange-800';

    case 'Quality Check':
      return 'bg-yellow-100 text-yellow-800';

    case 'Ready for Delivery':
      return 'bg-emerald-100 text-emerald-800';

    case 'Delivered':
      return 'bg-teal-100 text-teal-800';

    case 'Post Production Analysis':
      return 'bg-violet-100 text-violet-800';

    case 'Closed':
      return 'bg-slate-100 text-slate-800';

    case 'Rejected':
      return 'bg-red-100 text-red-800';

    case 'Cancelled':
      return 'bg-red-100 text-red-800';

    default:
      return 'bg-gray-100 text-gray-800';
  }
}

const onPageChange = async (pageNumber: number) => {

  filters.pageNo = pageNumber;
  const filteredQuery = filterQueryParams({ ...route.query, ...filters });

  router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedProductionRequests()
}
 

 const getPaginatedProductionRequests = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getProductionRequest(filters);

        productionRequestList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch production request !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


  const getAllStaffs = async () => {

    let result = await getStaffs({pageNo: 1, pageSize: 10000});

    staffList.value = result.data;
 
  }

  const getAllRawMaterials = async () => {

    let result = await getRawMaterials({pageNo: 1, pageSize: 10000});

    rawMaterialList.value = result.data;
 
  }

 const getProductionRequestSummaryData = async () => {

   isSummaryStatsShimmerLoading.value = true;
  
    try {
    
      let result = await getProductionRequestStats();
      productionStatsData.value = result;

    } catch (error) {
        $toast.error('Unable to fetch production requests stats!');
    } finally {
        isSummaryStatsShimmerLoading.value = false;
    }

}



const initUpdateStatus = async (productionRequest: ProductionRequest) => {

  selectedProductionRequest.value = productionRequest;
  productionStatusUpdateForm.id = productionRequest.id;
  workflowStageForm.id = productionRequest.id;
  workflowStageForm.targetStageName = '';
  workflowStageForm.remarks = '';
  selectedWorkflow.value = null;

  showStatusUpdateModal.value = true;
  showViewModal.value = false;
  modalTitle.value = 'Update Workflow Stage';

  // Load workflow transitions
  if (productionRequest.workflowId) {
    isWorkflowLoading.value = true;
    try {
      selectedWorkflow.value = await getWorkflowDetails(productionRequest.workflowId);
    } catch (e) {
      $toast.error('Unable to load workflow stages');
    } finally {
      isWorkflowLoading.value = false;
    }
  }

}

const confirmAdRequestStatusUpdate = () => {
  
   showActionVerificationModal.value = true;
   
   showStatusUpdateModal.value = false;

 }

const closeStatusUpdateModal = () => {
  
   showStatusUpdateModal.value = false;
   isApproveSelected.value = true;

 }


 const handleStatusUpdate = async () => {

  updating.value = true;

   try {

      let isSuccessful = false;
      const targetStage = isApproveSelected.value ? validNextStages.value[0] : validPreviousStages.value[0];
      const payload = {
        id: workflowStageForm.id,
        WorkflowId: (selectedProductionRequest.value as any)?.workflowId,
        CurrentStageId: targetStage?.id,
        CurrentStageName: targetStage?.title
      };

      if (isApproveSelected.value) {
        isSuccessful = !!(await approveProductionRequest(payload));
      } else {
        isSuccessful = !!(await rejectProductionRequest(payload));
      }

      if (isSuccessful) {

        $toast.success(isApproveSelected.value ? 'Production request approved successfully!' : 'Production request rejected.');

        workflowStageForm.id = '';
        workflowStageForm.targetStageName = '';
        workflowStageForm.remarks = '';
         
        await getPaginatedProductionRequests();

      }
      else {
        $toast.error('Unable to update production request status!');
      }

    } catch (error) {
       $toast.error('Unable to update production request status!');

    }
    finally {
      updating.value = false;
      showStatusUpdateModal.value = false
      showActionVerificationModal.value = false;
    } 

  }

const getFileIcon = (fileUrl: string) => {
  const extension = fileUrl.split('.').pop()?.toLowerCase();
  
  if (isImageFile(fileUrl)) {
    return ImageIcon;
  } else if (isPdfFile(fileUrl)) {
    return FilePdf;
  } else {
    return FileText;
  }
}

const viewTimeline = (productionRequest: ProductionRequest) => {
  if (productionRequest.processingTimeLine && productionRequest.processingTimeLine.length > 0) {
    selectedTimeline.value = productionRequest.processingTimeLine;
    selectedProductionRequest.value = productionRequest;
    showTimelineModal.value = true;
    modalTitle.value = 'Processing Timeline';
  } else {
    $toast.info('No timeline data available for this request');
  }
}

const closeTimelineModal = () => {
  showTimelineModal.value = false;
}

const getTimelineStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'success':
      return 'bg-green-100 border-green-400 text-green-800';
    case 'failed':
      return 'bg-red-100 border-red-400 text-red-800';
    case 'pending':
      return 'bg-yellow-100 border-yellow-400 text-yellow-800';
    default:
      return 'bg-gray-100 border-gray-400 text-gray-800';
  }
}

const getTimelineStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'success':
      return CheckCircle;
    case 'failed':
      return XCircle;
    case 'pending':
      return Clock;
    default:
      return History;
  }
}

const isImageFile = (fileUrl: string): boolean => {
  const extension = fileUrl.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '');
}

const isPdfFile = (fileUrl: string): boolean => {
  const extension = fileUrl.split('.').pop()?.toLowerCase();
  return extension === 'pdf';
}

const previewFile = (fileUrl: string) => {
  previewingFile.value = fileUrl;
  previewingFileName.value = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
  showPreviewModal.value = true;
}

const closePreviewModal = () => {
  showPreviewModal.value = false;
}

const openInNewTab = (fileUrl: string) => {
  window.open(fileUrl, '_blank');
}

const viewAdRequestDetails = async (productionRequest: ProductionRequest) => {
  selectedProductionRequest.value = productionRequest;
  selectedWorkflow.value = null;
  showViewModal.value = true;
  modalTitle.value = 'Production Request Details';

  // Load workflow so we can show stage progress in the details modal
  if (productionRequest.workflowId) {
    try {
      selectedWorkflow.value = await getWorkflowDetails(productionRequest.workflowId);
    } catch (e) {
      // non-fatal; details modal still shows without workflow info
    }
  }
}

const closeViewModal = () => {
  showViewModal.value = false;
}

const viewFiles = (productionRequest: ProductionRequest) => {
  if (productionRequest.uploadedFiles && productionRequest.uploadedFiles.length > 0) {
    // Sanitize URLs by replacing http:// with https://
    selectedFiles.value = productionRequest.uploadedFiles.map(url => url.replace(/^http:\/\//i, 'https://'));
    selectedProductionRequest.value = productionRequest;
    showFilesModal.value = true;
    modalTitle.value = 'Uploaded Files';
  } else {
    $toast.info('No files uploaded for this request');
  }
}

const closeFilesModal = () => {
  showFilesModal.value = false;
}

const downloadEstimate = async (estimate: Estimation) => {
  if (import.meta.server) return; // Skip if somehow triggered on server

  const html2pdf = (await import('html2pdf.js')).default;

  const estimateContent = document.getElementById('estimate-content');
  if (!estimateContent) return;

  const opt = {
    margin: 0.5,
    filename: `Estimate-${estimate.estimateNumber || 'estimate'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: true,
      allowTaint: true,
    },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  try {
    $toast.info('Preparing estimate for download...');
    await html2pdf().from(estimateContent).set(opt).save();
    $toast.success('Estimate downloaded successfully');
  } catch (error) {
    console.error('Error downloading estimate:', error);
    $toast.error('Failed to download estimate');
  } 
};

const downloadFile = (fileUrl: string) => {
  try {
    // Create an anchor element
    const link = document.createElement('a');
    
    // Set the href to the file URL
    link.href = fileUrl;
    
    // Extract the filename from the URL
    const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    
    // Set the download attribute with the filename
    link.download = filename;
    
    // Append to the body
    document.body.appendChild(link);
    
    // Trigger the click event
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    
    $toast.success('File download started');
  } catch (error) {
    $toast.error('Failed to download file');
    console.error('Download error:', error);
  }
}


const debouncedSearch = debounce(() => {
  filters.pageNo = 1; // Reset to first page for new search
  getPaginatedProductionRequests();
}, 300); // 300ms delay
   
watch(() => filters.query, debouncedSearch);
 
onMounted(async () => {
  if (!isEmpty(route.query)) {
    filters.pageNo = parseInt(route.query.pageNo as string);
  }

  await getPaginatedProductionRequests();

  await getProductionRequestSummaryData();

  await getAllStaffs();

  await getAllRawMaterials();
  
});

</script>