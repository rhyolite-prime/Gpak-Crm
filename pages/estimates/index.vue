<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Estimates</h1>
        <p class="text-sm text-gray-500 mt-1">Manage & Approve Estimates</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search estimates..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <NuxtLink 
          v-if="hasPermission('Quotation.Create')"
          to="/quotations/consolidate"
          class="btn-primary flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
            <FileText class="w-4 h-4" />
            <span>Create Consolidated Quotation</span>
        </NuxtLink>
         
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Estimates</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="estimateStatsData?.totalEstimates" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <FileText class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Partially Paid</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="toNumber(estimateStatsData?.partiallyPaidEstimates)" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Approved</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
               <CountUp :end-val="toNumber(estimateStatsData?.approvedEstimates)" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Rejected</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
               <CountUp :end-val="toNumber(estimateStatsData?.rejectedEstimates)" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Amount (GHS)</p>
            <p class="text-2xl font-bold text-gray-900">  
              <client-only>
              <CountUp :end-val="estimateStatsData?.totalEstimateAmount" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-2xl font-bold">₵</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estimate Table -->
    <div class="bg-white rounded-lg border border-gray-200">
      <!-- Loader -->
      <div v-if="isShimmerLoading" class="absolute inset-0 bg-white/75 flex items-center justify-center z-10 rounded-lg">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
      <div class="overflow-x-auto min-h-[450px]">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimate #
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Name
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Name
              </th>


              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
                

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
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
              v-for="estimate in estimateList" :key="estimate.id" class="hover:bg-gray-50 transition-colors">

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ estimate.estimateNumber }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ estimate.jobName }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ estimate.businessName }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ estimate.email }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ estimate.phoneNumber }}</div>
              </td>
             
 

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">GHS {{ _currency(estimate.estimatedCost) }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="status-badge"
                  :class="getStatusColor(estimate.currentStageName)">
                  {{ estimate.currentStageName }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="relative flex justify-end">
                  <button 
                    @click.stop="toggleMenu(estimate.id)"
                    class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    :id="'menu-button-' + estimate.id"
                  >
                    <MoreVertical class="w-5 h-5" />
                  </button>

                  <!-- Actions Dropdown -->
                  <div 
                    v-if="activeMenuId === estimate.id"
                    ref="menuRef"
                    class="absolute right-0 mt-8 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1 origin-top-right transition-all transform scale-100 opacity-100"
                  >
                    <button
                      @click="viewEstimate(estimate)"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      <Eye class="w-4 h-4" />
                      <span>View Estimate</span>
                    </button>
                    
                    <NuxtLink
                      v-if="hasPermission('Estimate.Update')"
                      :to="`/estimates/${estimate.id}`"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      <FileText class="w-4 h-4" />
                      <span>Edit Estimate</span>
                    </NuxtLink>

                    <NuxtLink
                      v-if="hasPermission('Quotation.Create')"
                      :to="`/quotations/create?estimateId=${estimate.id}`"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      <FileText class="w-4 h-4" />
                      <span>Create Quotation</span>
                    </NuxtLink>

                    <button
                        v-if="hasPermission('Estimate.UpdateStatus')"
                      @click="initUpdateEstimateStatus(estimate)"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                    >
                      <CheckCheck class="w-4 h-4" />
                      <span>Update Status</span>
                    </button>

                    <button 
                      v-if="estimate.processingTimeLine && estimate.processingTimeLine.length > 0"
                      @click="viewTimeline(estimate)"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                    >
                      <History class="w-4 h-4" />
                      <span>View Timeline</span>
                    </button>

                    <div class="border-t border-gray-100 my-1"></div>

                    <button 
                      v-if="hasPermission('Estimate.Delete')"
                      @click="initDelete(estimate)"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 class="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <UiActionVerificationModal
        :isOpen="showStatusUpdateVerificationModal"
        :isProcessing="updating"
        actionTitle="Update Status"
        message="You are about to change the status of this Estimate. Do you want to proceed?"
        :requireConfirmationText="true"
        confirmationWord="CONFIRM"
        confirmButtonText="Update"
        infoNote="This change will notify the customer and cannot be undone."
        @close="showStatusUpdateVerificationModal = false"
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

    <!-- Update Estimate Modal -->
    <div v-if="showEditEstimateModal" class="modal-overlay" @click="showEditEstimateModal = false">
      <div class="modal-content max-w-3xl w-full" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Edit Estimate</h2>
            <button @click="showEditEstimateModal = false" class="text-gray-400 hover:text-gray-600">
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

          <!-- Estimate Items -->
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
                        :class="item.useRawMaterial  ? 'bg-green-500' : 'bg-gray-300'"
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
              <div class="border-t border-gray-300 pt-4 mt-4 mx-3 flex justify-end text-sm font-medium text-gray-700">
                <div class="space-y-1 text-right">
                  <div>Sub Total (GHS): <span class="font-semibold">{{ estimationForm.details.reduce((sum, item) => sum + (Number(item.unitPrice) * Number(item.quantity)), 0).toFixed(2) }}</span></div>
                  <div>Discount (GHS): <span class="font-semibold">{{ estimationForm.discount }}</span></div>
                  <div>Total Estimated Cost (GHS): <span class="font-semibold">{{ estimationForm.estimatedCost?.toFixed(2) || '0.00' }}</span></div>
                </div>
              </div>

              <button @click="addInvoiceItem" class="btn-secondary mt-3">+ Add Item</button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button @click="showEditEstimateModal = false" class="btn-secondary">Cancel</button>
            <button @click="editEstimate" :disabled="isUpdatingEstimate" class="btn-primary">
               
              <div v-if="isUpdatingEstimate" class="loader"></div>
                <span>{{ isUpdatingEstimate ? 'Saving...' : 'Edit Estimate' }}</span>
            </button>
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
                  {{ selectedEstimate?.businessName }} - {{ selectedEstimate?.fullName }}
                </h3>
                <p class="text-sm text-gray-600">
                  Processing timeline for estimate
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
    
    <!-- View Estimate Details Modal -->
    <client-only>
      <div v-if="showViewEstimateModal && selectedEstimate" class="modal-overlay" @click="closeViewEstimateModal">
        <div class="modal-content max-w-2xl" @click.stop>
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Estimate #{{ selectedEstimate.estimateNumber }}</h2>
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
                    <img src="/img/gpak.jpeg" alt="GPAK Logo" class="h-12 w-auto rounded-md border border-gray-200 p-1 bg-white shadow" />
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Estimate No: <span class="font-semibold text-gray-700">#{{ selectedEstimate.estimateNumber || 'N/A' }}</span></p>
                    <p class="text-sm text-gray-500">Estimate Date: <span class="font-semibold text-gray-700">{{ selectedEstimate.creationTime }}</span></p>
                    <!-- <p class="text-sm text-gray-500">Valid Until: <span class="font-semibold text-gray-700">{{ selectedEstimate.dueDate }}</span></p> -->
                  </div>
                </div>

                <!-- Party Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Bill To</h4>
                    <div class="text-sm text-gray-700 space-y-1">
                      <p class="font-semibold">{{ selectedEstimate.businessName }}</p>
                      <p>{{ selectedEstimate.fullName }}</p>
                      <p>{{ selectedEstimate.email }}</p>
                      <p>{{ selectedEstimate.phoneNumber }}</p>
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
                      <tr v-if="selectedEstimate.details && selectedEstimate.details.length > 0" 
                          v-for="(item, index) in selectedEstimate.details" 
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
                    <div class="flex justify-between"><span>Sub Total:</span><span>GHS {{ _currency(selectedEstimate.estimatedCost) }}</span></div>
                    <div class="flex justify-between"><span>Discount:</span><span>GHS {{ _currency(selectedEstimate.discount || 0) }}</span></div>
                    
                    <!-- Taxes Section -->
                    <div v-if="selectedEstimate.taxes && selectedEstimate.taxes.length > 0" class="pt-3 mt-2 border-t border-gray-200">
                      <h5 class="font-medium text-gray-700 mb-2">Tax Summary</h5>
                      <div class="bg-gray-50 rounded-lg p-3">
                        <div v-for="tax in selectedEstimate.taxes" :key="tax.id" class="flex justify-between items-center py-1">
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
                          <span>GHS {{ _currency(calculateTotalTax(selectedEstimate.taxes)) }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex justify-between pt-2 mt-1 border-t border-gray-200 text-base font-bold text-red-700">
                      <span>Total Amount:</span>
                      <span>GHS {{ _currency(selectedEstimate.estimatedCost) }}</span>
                    </div>

                    <div class="flex justify-between pt-1 text-sm font-medium" v-if="selectedEstimate.status === 'Paid'">
                      <span class="text-green-600">Paid Amount:</span>
                      <span class="text-green-600">GHS {{ _currency(selectedEstimate.totalAmount) }}</span>
                    </div>

                    <div class="flex justify-between pt-1 text-sm font-medium" v-else>
                      <span class="text-yellow-600">Balance Due:</span>
                      <span class="text-yellow-600">GHS {{ _currency(selectedEstimate.estimatedCost) }}</span>
                    </div>

                  </div>
                </div>

                <!-- Payment Status -->
                <div v-if="selectedEstimate.status" class="border-t border-gray-200 pt-4 text-center">
                  <p v-if="selectedEstimate.status === 'Paid'" class="text-xs text-green-600 mt-1">
                    Paid on: {{ selectedEstimate.paidAt || 'N/A' }}
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
                @click="downloadEstimate(selectedEstimate)" 
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
 

    </client-only>


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
            <div v-if="isEstimateWorkflowLoading" class="flex items-center justify-center py-10 text-gray-500">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mr-3"></div>
              <span class="text-sm">Loading workflow stages…</span>
            </div>

            <!-- No workflow configured -->
            <div v-else-if="!selectedEstimateWorkflow" class="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm text-yellow-700 flex items-start space-x-3">
              <GitMerge class="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
              <div>
                <p class="font-semibold">No workflow assigned</p>
                <p class="mt-0.5 text-yellow-600">This estimate does not have an associated workflow. Assign a workflow first.</p>
              </div>
            </div>

            <!-- No valid transitions from current stage -->
            <div v-else-if="estimateValidNextStages.length === 0 && estimateValidPreviousStages.length === 0" class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600 flex items-start space-x-3">
              <Check class="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
              <div>
                <p class="font-semibold">No further stages available</p>
                <p class="mt-0.5">There are no available stages to move this estimate to.</p>
              </div>
            </div>

            <!-- Stage selection cards -->
            <div v-else class="space-y-6">
              <!-- Current Stage Info -->
              <div class="rounded-lg border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-700 flex items-start space-x-3">
                <Info class="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                <div>
                  <p class="font-semibold">Current Stage</p>
                  <p class="mt-0.5 text-blue-600 font-medium">{{ currentEstimateWorkflowStage?.title || 'Unknown' }}</p>
                  <p class="text-xs mt-1 text-blue-500" v-if="currentEstimateWorkflowStage?.description">{{ currentEstimateWorkflowStage.description }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div>
                <div class="grid grid-cols-2 gap-4">
                  <!-- Approve Action -->
                  <div 
                    v-if="estimateValidNextStages.length > 0"
                    @click="estimateStatusUpdateForm.status = 'Approved'; isApproveSelected = true"
                    :class="[
                      'relative cursor-pointer rounded-lg border-2 p-4 transition-all',
                      (estimateStatusUpdateForm.status === 'Approved' && isApproveSelected)
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-300'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/40'
                    ]"
                  >
                    <div class="flex flex-col items-center text-center">
                      <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <Check class="w-5 h-5 text-green-600" />
                      </div>
                      <p class="font-semibold text-gray-900">Approve</p>
                      <p class="text-xs text-gray-500 mt-1">Moves to: <br/><span class="font-medium text-gray-700">{{ estimateValidNextStages[0].title }}</span></p>
                    </div>
                  </div>
                  
                  <!-- Reject Action -->
                  <div 
                    v-if="estimateValidPreviousStages.length > 0"
                    @click="estimateStatusUpdateForm.status = 'Rejected'; isApproveSelected = false"
                    :class="[
                      'relative cursor-pointer rounded-lg border-2 p-4 transition-all',
                      (estimateStatusUpdateForm.status === 'Rejected' && !isApproveSelected)
                        ? 'border-red-500 bg-red-50 ring-2 ring-red-300'
                        : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/40'
                    ]"
                  >
                    <div class="flex flex-col items-center text-center">
                      <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                        <X class="w-5 h-5 text-red-600" />
                      </div>
                      <p class="font-semibold text-gray-900">Reject</p>
                      <p class="text-xs text-gray-500 mt-1">Returns to: <br/><span class="font-medium text-gray-700">{{ estimateValidPreviousStages[0].title }}</span></p>
                    </div>
                  </div>
                </div>

                <!-- Consequence Message -->
                <div v-if="estimateStatusUpdateForm.status" class="rounded-lg p-3 text-sm mt-4"
                     :class="isApproveSelected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
                  <p v-if="isApproveSelected"><strong>Consequence:</strong> Approving will advance this estimate to the <strong>{{ estimateValidNextStages[0]?.title }}</strong> stage. The appropriate team members will be notified.</p>
                  <p v-else><strong>Consequence:</strong> Rejecting will send this estimate back to the <strong>{{ estimateValidPreviousStages[0]?.title }}</strong> stage. A remark is required.</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-2" v-if="selectedEstimateWorkflow">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Reason or Remarks (optional)</label>
                <textarea placeholder="Reason or Remarks ..."
                  v-model="estimateStatusUpdateForm.statusChangeReason"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-20">
                </textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeStatusUpdateModal" class="btn-secondary">Cancel</button>
              <button
                type="button"
                @click="confirmEstimateStatusUpdate"
                :disabled="!estimateStatusUpdateForm.status || isEstimateWorkflowLoading"
                :class="[
                  'btn-primary flex items-center space-x-2',
                  (!estimateStatusUpdateForm.status || isEstimateWorkflowLoading) ? 'opacity-50 cursor-not-allowed' : ''
                ]">
                <ArrowRight class="w-4 h-4" />
                <span>Update Stage</span>
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
      :item-name="'Customer Estimate'"
      @close="closeDeleteModal"
      @confirm="delEstimate"
    />
    
    <!-- Estimate Type Selection Modal -->
    <div v-if="showTypeSelectionModal" class="modal-overlay" @click="showTypeSelectionModal = false">
      <div class="modal-content max-w-md w-full" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Select Estimate Type</h2>
            <button @click="showTypeSelectionModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <p class="text-sm text-gray-500 mb-6">Choose the type of estimate you want to create.</p>
          
          <div class="grid grid-cols-1 gap-4">
            <button 
              v-for="type in estimateTypes" 
              :key="type.id" 
              @click="selectType(type.id)"
              class="flex items-center p-4 border rounded-xl hover:bg-gray-50 transition-all border-l-8 text-left group"
              :style="{ borderLeftColor: type.hexColour }"
            >
              <div class="flex-1">
                <h3 class="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{{ type.name }}</h3>
                <p class="text-xs text-gray-500 mt-1">Click to start with {{ type.name }} formulas</p>
              </div>
              <Plus class="w-5 h-5 text-gray-300 group-hover:text-red-500" />
            </button>
            
            <button 
              @click="selectType(emptyGuid)"
              class="flex items-center p-4 border rounded-xl hover:bg-gray-50 transition-all border-l-8 text-left group border-l-gray-300"
            >
              <div class="flex-1">
                <h3 class="font-bold text-gray-900 group-hover:text-red-600 transition-colors">General / All Types</h3>
                <p class="text-xs text-gray-500 mt-1">Start without specific formula filtering</p>
              </div>
              <Plus class="w-5 h-5 text-gray-300 group-hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import type { Estimation, RawMaterial, Staff, ProductionProcessingTimeLine, EstimateStats, EstimateType, Workflow } from "~/models";
import { isEmpty, debounce } from "lodash-es";
import CountUp from 'vue-countup-v3';
const { $toast } = useNuxtApp();

import { 
  Search, 
  XCircle,
  History, 
  FileText, 
  CheckCircle, 
  Clock, 
  Eye,
  Edit,
  CheckCheck,
  Download,
  Trash2,
  X,
  Plus,
  MoreVertical,
  Info,
  Check,
  GitMerge,
  ArrowRight
} from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { getWorkflowDetails } from '~/services/workFlow';
import { approveEstimate, rejectEstimate } from '~/services/estimates';

definePageMeta({
  layout: 'default',
  middleware: 'auth',
  requiredPermissions: ['Estimate.View']
})

const showCreateModal = ref(false)
 
const showViewModal = ref(false)
const emptyGuid = generateEmptyGuid();
const isCreating = ref(false)
const activeMenuId = ref<string | null>(null);
const menuRef = ref(null);

onClickOutside(menuRef, () => {
  activeMenuId.value = null;
});
const isInvoiceLoading = ref(false);
const showViewEstimateModal = ref(false);
const showEditEstimateModal = ref(false);
const showTypeSelectionModal = ref(false);

const estimateTypes = ref<EstimateType[]>([]);
const selectedEstimate = ref<Estimation>(null);


const estimateStatusUpdateForm = reactive({
  id: '',
  status: '',
  statusChangeReason: '',
});
const isApproveSelected = ref(true);

// Workflow state for estimate status modal
const selectedEstimateWorkflow = ref<Workflow | null>(null);
const isEstimateWorkflowLoading = ref(false);

const estimateValidNextStages = computed(() => {
  if (!selectedEstimateWorkflow.value || !selectedEstimate.value) return [];
  const currentStageId = (selectedEstimate.value as any).currentStageId;
  const workflow = selectedEstimateWorkflow.value;
  const validTransitions = currentStageId
    ? workflow.transitions.filter(t => t.currentStageId === currentStageId && t.status === 'Enabled')
    : workflow.transitions.filter(t => t.status === 'Enabled');
  const targetStageIds = new Set(validTransitions.map(t => t.targetStageId));
  return workflow.stages.filter(s => targetStageIds.has(s.id) && s.status === 'Enabled');
});

const estimateValidPreviousStages = computed(() => {
  if (!selectedEstimateWorkflow.value || !(selectedEstimate.value as any)?.currentStageId) return [];
  const currentStageId = (selectedEstimate.value as any).currentStageId;
  const currentStage = selectedEstimateWorkflow.value.stages.find(s => s.id === currentStageId);
  if (!currentStage) return [];
  return selectedEstimateWorkflow.value.stages.filter(s =>
    s.status === 'Enabled' && Number(s.ordering) < Number(currentStage.ordering)
  ).sort((a, b) => Number(b.ordering) - Number(a.ordering));
});

const currentEstimateWorkflowStage = computed(() => {
  if (!selectedEstimateWorkflow.value || !(selectedEstimate.value as any)?.currentStageId) return null;
  return selectedEstimateWorkflow.value.stages.find(s => s.id === (selectedEstimate.value as any).currentStageId) ?? null;
});

 
useHead({
  title: 'Estimates'
})

const router = useRouter();
const route = useRoute();

const { hasPermission } = usePermissions();

const filters = reactive({
  query: '',
  pageNo: 1,
  estimateTypeId: generateEmptyGuid(),
  isTemplate: null,
  pageSize: 10,

});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const estimationForm = reactive({
  id: '',
  estimateNumber: '',
  productionRequestId: '',
  productionRequestNumber: '',
  estimatedCost: null,
  discount: 0,
  estimatedTimeEffort: null,
  description: '',
  status: '',
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

const isShimmerLoading = ref(true);
const updating = ref(false);
const isEstimateLoading = ref(false);
const isUpdatingEstimate = ref(false);
const showDeleteConfirmationModal = ref(false);
const isDeleting = ref(false);


const estimateList = ref<Estimation[]>([]);
const staffList = ref<Staff[]>([]);
const rawMaterialList = ref<RawMaterial[]>([]);
const estimateStatsData = ref<EstimateStats>();
const selectedTimeline = ref<ProductionProcessingTimeLine[]>([])
const showStatusUpdateModal = ref(false);
const showStatusUpdateVerificationModal = ref(false);
const showTimelineModal = ref(false)
const showEstimateModal = ref(false);
const modalTitle = ref('');

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
  await getPaginatedEstimates();
}
 
  const closeStatusUpdateModal = () => {
   showStatusUpdateModal.value = false;
   selectedEstimateWorkflow.value = null;
   isApproveSelected.value = true;
  }
 
 const getPaginatedEstimates = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getProductionEstimates(filters);

        estimateList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch estimates !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


 const getEstimateSummaryData = async () => {

    
    try {
    
    let result = await getEstimateStats();
    estimateStatsData.value = result;
        

    } catch (error) {
        $toast.error('Unable to fetch estimate summary!');
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

const viewEstimate = (estimate: Estimation) => {

  showViewEstimateModal.value = true;
  selectedEstimate.value = estimate;
    
};

const confirmEstimateStatusUpdate = () => {
  
   showStatusUpdateVerificationModal.value = true;
   showStatusUpdateModal.value = false;

}

const closeTimelineModal = () => {
  showTimelineModal.value = false;
}

const closeViewEstimateModal = () => {
  showViewEstimateModal.value = false;
  selectedEstimate.value = null;
}


 const handleStatusUpdate = async () => {

  updating.value = true;

  try {
    let isSuccessful = false;
    const targetStage = isApproveSelected.value ? estimateValidNextStages.value[0] : estimateValidPreviousStages.value[0];
    const payload = {
      id: estimateStatusUpdateForm.id,
      WorkflowId: (selectedEstimate.value as any)?.workflowId,
      CurrentStageId: targetStage?.id,
      CurrentStageName: targetStage?.title
    };

    if (isApproveSelected.value) {
      isSuccessful = !!(await approveEstimate(payload));
    } else {
      isSuccessful = !!(await rejectEstimate(payload));
    }

    if (isSuccessful) {
      $toast.success(isApproveSelected.value ? 'Estimate approved successfully!' : 'Estimate rejected.');
      estimateStatusUpdateForm.id = '';
      estimateStatusUpdateForm.status = '';
      estimateStatusUpdateForm.statusChangeReason = '';
      await getPaginatedEstimates();
    } else {
      $toast.error('Unable to update estimate status!');
    }
  } catch (error) {
    $toast.error('Unable to update estimate status!');
  } finally {
    updating.value = false;
    showStatusUpdateModal.value = false;
    showStatusUpdateVerificationModal.value = false;
  }

 }

 const viewTimeline = (estimation: Estimation) => {
  if (estimation.processingTimeLine && estimation.processingTimeLine.length > 0) {
    selectedTimeline.value = estimation.processingTimeLine;
    selectedEstimate.value = estimation;
    showTimelineModal.value = true;
    
    modalTitle.value = 'Processing Timeline';
  } else {
    $toast.info('No timeline data available for this request');
  }
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

const initUpdateEstimate = (estimate: Estimation) => {

  selectedEstimate.value = estimate;

  estimationForm.id = estimate.id;
  estimationForm.estimateNumber = estimate.estimateNumber;
  estimationForm.productionRequestId = estimate.productionRequestId;
  estimationForm.productionRequestNumber = estimate.productionRequestNumber;
  estimationForm.estimatedCost = estimate.estimatedCost;
  estimationForm.discount = estimate.discount;
  estimationForm.estimatedTimeEffort = estimate.estimatedTimeEffort;
  estimationForm.description = estimate.description;
  estimationForm.status = estimate.status;
  estimationForm.preparedBy = estimate.preparedBy;
  estimationForm.approvalDate = estimate.approvalDate;
  estimationForm.rejectionReason = estimate.rejectionReason;
  estimationForm.fullName = estimate.fullName;
  estimationForm.email = estimate.email;
  estimationForm.phoneNumber = estimate.phoneNumber;
  estimationForm.businessName = estimate.businessName;

  estimationForm.details = estimate.details;

  // For each detail, set useRawMaterial based on itemId === emptyGuid
  if (Array.isArray(estimationForm.details)) {
    for (const item of estimationForm.details) {
      if (item.itemId === emptyGuid) {
        item.useRawMaterial = false;
      } else {
        item.useRawMaterial = true;
      }
    }
  }

  showEditEstimateModal.value = true;
}


const removeInvoiceItem = (index: number) => {
  estimationForm.details.splice(index, 1);
};

const editEstimate = async () => {

  isUpdatingEstimate.value = true;

  // Before saving, loop through estimationForm.details and set itemName for raw materials
  for (const item of estimationForm.details) {
    if (item.useRawMaterial && item.itemId) {
      const rawMat = rawMaterialList.value.find((mat) => mat.id === item.itemId);
      if (rawMat) {
        item.itemName = rawMat.name;
      }
    }
  }

  try {

      let isSuccessful = await updateProductionEstimate(estimationForm);

      if (isSuccessful) {

        $toast.success('Production estimate updated!');

        await getPaginatedEstimates();

      }
      else {
        $toast.error('Unable to update estimate !');
      }

    } catch (error) {
      $toast.error('Unable to update estimate !');

    }
    finally {

      isUpdatingEstimate.value = false;
      showEditEstimateModal.value = false;
    }

};

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
 

const closeViewModal = () => {
  showViewModal.value = false
  selectedEstimate.value = null
}

const initDelete = (estimate: Estimation) => {

  selectedEstimate.value = estimate;

  modalTitle.value = 'Delete Estimate';

  showDeleteConfirmationModal.value = true;
}

 const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
 }


 const delEstimate = async () => {

  isDeleting.value = true;
    
  try {
      
      let isSuccessful = await deleteEstimate(selectedEstimate.value.id);
      if (isSuccessful) {
        $toast.success('Estimate deleted !');

        await getPaginatedEstimates();

      }
      else {
        $toast.error('Unable to delete estimate !');
      }
    } catch (error) {
      $toast.error('Unable to delete estimate !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }

const initUpdateEstimateStatus = async (estimate: Estimation) => {

  selectedEstimate.value = estimate;
  estimateStatusUpdateForm.id = estimate.id;
  estimateStatusUpdateForm.status = '';
  estimateStatusUpdateForm.statusChangeReason = '';
  selectedEstimateWorkflow.value = null;
 
  showStatusUpdateModal.value = true;
  showViewModal.value = false;
  modalTitle.value = 'Update Estimate Status';

  // Load workflow transitions
  const workflowId = (estimate as any).workflowId;
  if (workflowId) {
    isEstimateWorkflowLoading.value = true;
    try {
      selectedEstimateWorkflow.value = await getWorkflowDetails(workflowId);
    } catch (e) {
      $toast.error('Unable to load workflow stages');
    } finally {
      isEstimateWorkflowLoading.value = false;
    }
  }
};

const makeEstimatePayment = (estimate: Estimation) => {
  $toast.info(`Processing payment for Estimate #${estimate.estimateNumber}`);
  // TODO: implement payment logic
};


const openTypeSelectionModal = async () => {
  try {
    const result = await getEstimateTypes({ pageNo: 1, pageSize: 100 });
    estimateTypes.value = result.data;
    showTypeSelectionModal.value = true;
  } catch (error) {
    $toast.error('Failed to load estimate types');
  }
};

const selectType = (id: string) => {
  showTypeSelectionModal.value = false;
  router.push(`/estimates/create?estimateTypeId=${id}`);
};

const toggleMenu = (id: string) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};

const closeMenu = () => {
  activeMenuId.value = null;
};


const debouncedSearch = debounce(() => {
  filters.pageNo = 1; // Reset to first page for new search
  getPaginatedEstimates();
}, 300); // 300ms delay
   
watch(() => filters.query, debouncedSearch);

watch(
  () => estimationForm.details,
  (newDetails) => {
    const subtotal = newDetails.reduce(
      (sum, item) => sum + ((Number(item.unitPrice) || 0) * (Number(item.quantity) || 0)),
      0
    );
    estimationForm.estimatedCost = subtotal - (Number(estimationForm.discount) || 0);
  },
  { deep: true }
);

// Watch for changes in estimationForm.discount to recalculate estimatedCost
watch(
  () => estimationForm.discount,
  (newDiscount) => {
    const subtotal = estimationForm.details.reduce(
      (sum, item) => sum + ((Number(item.unitPrice) || 0) * (Number(item.quantity) || 0)),
      0
    );
    estimationForm.estimatedCost = subtotal - (Number(newDiscount) || 0);
  }
);
 
onMounted(async () => {
  if (!isEmpty(route.query)) {
    filters.pageNo = parseInt(route.query.pageNo as string);
  }
  await getEstimateSummaryData();
  await getPaginatedEstimates();
  await getAllStaffs();
  await getAllRawMaterials();
  
});
 

 
</script>