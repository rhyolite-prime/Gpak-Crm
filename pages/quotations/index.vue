<template>
  <div class="space-y-6" @click="closeMenuOnOutsideClick">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quotations</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your quotations</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search quotations..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <!-- <button 
          @click="showCreateModal = true"
          class="btn-primary flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>Create Invoice</span>
        </button> -->
      </div>
    </div>

    
    <!-- Quotations Table -->
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
                Invoice #
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Email
              </th>
              <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th> -->
              
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid Until
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount Quoted
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
              v-for="quotation in quotationList" 
              :key="quotation.id"
              class="hover:bg-gray-50 transition-colors">

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ quotation.quotationNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ quotation.businessName }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ quotation.email }}</div>
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ quotation.phoneNumber }}</div>
              </td> -->
             
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ quotation.validUntil }} ({{ quotation.remainingDays }} days remaining)</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">GHS {{ _currency(quotation.quotedPrice) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="status-badge"
                  :class="getStatusColor(quotation.currentStageName)"
                >
                  {{ quotation.currentStageName }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="relative flex justify-end">
                  <button
                    @click.stop="toggleMenu(quotation.id)"
                    class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    :id="'menu-button-' + quotation.id"
                    title="Actions"
                  >
                    <MoreVertical class="w-5 h-5" />
                  </button>

                  <!-- Actions Dropdown -->
                  <div
                    v-if="activeMenuId === quotation.id"
                    class="absolute right-0 mt-8 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1 origin-top-right"
                  >
                    <!-- View Details -->
                    <NuxtLink 
                      :to="`/quotations/${quotation.id}`"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      <Eye class="w-4 h-4" />
                      <span>View Details</span>
                    </NuxtLink>

                    <!-- View Timeline -->
                    <button
                      v-if="quotation.processingTimeLine && quotation.processingTimeLine.length > 0"
                      @click="viewTimeline(quotation); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                    >
                      <History class="w-4 h-4" />
                      <span>View Timeline</span>
                    </button>

                    <!-- Send Quote -->
                    <button
                      v-if="hasPermission('Quotation.Send')"
                      @click="initSendForConfirmation(quotation); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                    >
                      <Send class="w-4 h-4" />
                      <span>Send Quote</span>
                    </button>

                    <!-- Update Status -->
                    <button
                      v-if="hasPermission('Quotation.UpdateStatus')"
                      @click="initUpdateStatus(quotation); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <CheckCheck class="w-4 h-4" />
                      <span>Update Status</span>
                    </button>

                    <div class="border-t border-gray-100 my-1"></div>

                    <!-- Delete -->
                    <button
                      v-if="hasPermission('Quotation.Delete')"
                      @click="initDelete(quotation); activeMenuId = null"
                      class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
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
                  {{ selectedQuotation?.businessName }} - {{ selectedQuotation?.fullName }}
                </h3>
                <p class="text-sm text-gray-600">
                  Processing timeline for advertisement request
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

    <!-- View Quotation Modal -->
     <client-only>
      <div v-if="showViewQuotationModal && selectedQuotation" class="modal-overlay" @click="closeViewQuotationModal">
        <div class="modal-content max-w-2xl" @click.stop>
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Quotation #{{ selectedQuotation.quotationNumber }}</h2>
              <button @click="closeViewQuotationModal" class="text-gray-400 hover:text-gray-600">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <!-- Shimmer Loading for Invoice -->
            <div v-if="isQuotationLoading" class="rounded-2xl shadow-2xl border border-gray-200 p-8 bg-white space-y-8">
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

            <!-- Quotation Content -->
            <div id="quotation-content" v-else>
              <div class="rounded-2xl shadow-2xl border border-gray-200 p-8 bg-white space-y-8">
                <!-- Header -->
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-4">
                    <img src="/img/gpak.jpeg" alt="Daily Graphic Logo" class="h-12 w-auto rounded-md border border-gray-200 p-1 bg-white shadow" />
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Quotation No: <span class="font-semibold text-gray-700">#{{ selectedQuotation.quotationNumber || 'N/A' }}</span></p>
                    <p class="text-sm text-gray-500">Quotation Date: <span class="font-semibold text-gray-700">{{ selectedQuotation.creationTime }}</span></p>
                    <p class="text-sm text-gray-500">Valid Until: <span class="font-semibold text-gray-700">{{ selectedQuotation.validUntil }}</span></p>
                  </div>
                </div>

                <!-- Party Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Bill To</h4>
                    <div class="text-sm text-gray-700 space-y-1">
                      <p class="font-semibold">{{ selectedQuotation.businessName }}</p>
                      <p>{{ selectedQuotation.fullName }}</p>
                      <p>{{ selectedQuotation.email }}</p>
                      <p>{{ selectedQuotation.phoneNumber }}</p>
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
                      <tr v-if="selectedQuotation.details && selectedQuotation.details.length > 0" 
                          v-for="(item, index) in selectedQuotation.details" 
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
                    <div class="flex justify-between"><span>Sub Total:</span><span>GHS {{ _currency(selectedQuotation.quotedPrice) }}</span></div>
                    <div class="flex justify-between"><span>Discount:</span><span>GHS {{ _currency(selectedQuotation.discount || 0) }}</span></div>
                    
                    <!-- Taxes Section -->
                    <div v-if="selectedQuotation.taxes && selectedQuotation.taxes.length > 0" class="pt-3 mt-2 border-t border-gray-200">
                      <h5 class="font-medium text-gray-700 mb-2">Tax Summary</h5>
                      <div class="bg-gray-50 rounded-lg p-3">
                        <div v-for="tax in selectedQuotation.taxes" :key="tax.id" class="flex justify-between items-center py-1">
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
                          <span>GHS {{ _currency(calculateTotalTax(selectedQuotation.taxes)) }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex justify-between pt-2 mt-1 border-t border-gray-200 text-base font-bold text-red-700">
                      <span>Total Amount:</span>
                      <span>GHS {{ _currency(selectedQuotation.quotedPrice) }}</span>
                    </div>

                    <div class="flex justify-between pt-1 text-sm font-medium" v-if="selectedQuotation.status === 'Paid'">
                      <span class="text-green-600">Paid Amount:</span>
                      <span class="text-green-600">GHS {{ _currency(selectedQuotation.totalAmount) }}</span>
                    </div>

                    <div class="flex justify-between pt-1 text-sm font-medium" v-else>
                      <span class="text-yellow-600">Balance Due:</span>
                      <span class="text-yellow-600">GHS {{ _currency(selectedQuotation.quotedPrice) }}</span>
                    </div>

                  </div>
                </div>

                <!-- Payment Status -->
                <!-- <div v-if="selectedQuotation.status" class="border-t border-gray-200 pt-4 text-center">
                  <p v-if="selectedQuotation.status === 'Paid'" class="text-xs text-green-600 mt-1">
                    Paid on: {{ selectedQuotation.paidAt || 'N/A' }}
                  </p>
                </div> -->
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex justify-end space-x-3 pt-4 mt-4">
              <button @click="closeViewQuotationModal" class="btn-secondary">
                Close
              </button>
              <button 
                @click="downloadQuotation(selectedQuotation)" 
                class="btn-primary flex items-center space-x-2"
                title="Download as PDF">
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
            <div v-if="isQuotationWorkflowLoading" class="flex items-center justify-center py-10 text-gray-500">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mr-3"></div>
              <span class="text-sm">Loading workflow stages…</span>
            </div>

            <!-- No workflow configured -->
            <div v-else-if="!selectedQuotationWorkflow" class="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm text-yellow-700 flex items-start space-x-3">
              <GitMerge class="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
              <div>
                <p class="font-semibold">No workflow assigned</p>
                <p class="mt-0.5 text-yellow-600">This quotation does not have an associated workflow. Assign a workflow first.</p>
              </div>
            </div>

            <!-- No valid transitions from current stage -->
            <div v-else-if="quotationValidNextStages.length === 0 && quotationValidPreviousStages.length === 0" class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600 flex items-start space-x-3">
              <Check class="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
              <div>
                <p class="font-semibold">No further stages available</p>
                <p class="mt-0.5">There are no available stages to move this quotation to.</p>
              </div>
            </div>

            <!-- Stage selection cards -->
            <div v-else class="space-y-6">
              <!-- Current Stage Info -->
              <div class="rounded-lg border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-700 flex items-start space-x-3">
                <Info class="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                <div>
                  <p class="font-semibold">Current Stage</p>
                  <p class="mt-0.5 text-blue-600 font-medium">{{ currentQuotationWorkflowStage?.title || 'Unknown' }}</p>
                  <p class="text-xs mt-1 text-blue-500" v-if="currentQuotationWorkflowStage?.description">{{ currentQuotationWorkflowStage.description }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div>
                <div class="grid grid-cols-2 gap-4">
                  <!-- Approve Action -->
                  <div
                    v-if="quotationValidNextStages.length > 0"
                    @click="quotationStatusUpdateForm.status = 'Approved'; isApproveSelected = true"
                    :class="[
                      'relative cursor-pointer rounded-lg border-2 p-4 transition-all',
                      (quotationStatusUpdateForm.status === 'Approved' && isApproveSelected)
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-300'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/40'
                    ]"
                  >
                    <div class="flex flex-col items-center text-center">
                      <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <Check class="w-5 h-5 text-green-600" />
                      </div>
                      <p class="font-semibold text-gray-900">Approve</p>
                      <p class="text-xs text-gray-500 mt-1">Moves to: <br/><span class="font-medium text-gray-700">{{ quotationValidNextStages[0].title }}</span></p>
                    </div>
                  </div>

                  <!-- Reject Action -->
                  <div
                    v-if="quotationValidPreviousStages.length > 0"
                    @click="quotationStatusUpdateForm.status = 'Rejected'; isApproveSelected = false"
                    :class="[
                      'relative cursor-pointer rounded-lg border-2 p-4 transition-all',
                      (quotationStatusUpdateForm.status === 'Rejected' && !isApproveSelected)
                        ? 'border-red-500 bg-red-50 ring-2 ring-red-300'
                        : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/40'
                    ]"
                  >
                    <div class="flex flex-col items-center text-center">
                      <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                        <X class="w-5 h-5 text-red-600" />
                      </div>
                      <p class="font-semibold text-gray-900">Reject</p>
                      <p class="text-xs text-gray-500 mt-1">Returns to: <br/><span class="font-medium text-gray-700">{{ quotationValidPreviousStages[0].title }}</span></p>
                    </div>
                  </div>
                </div>

                <!-- Consequence Message -->
                <div v-if="quotationStatusUpdateForm.status" class="rounded-lg p-3 text-sm mt-4"
                     :class="isApproveSelected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
                  <p v-if="isApproveSelected"><strong>Consequence:</strong> Approving will advance this quotation to the <strong>{{ quotationValidNextStages[0]?.title }}</strong> stage. The appropriate team members will be notified.</p>
                  <p v-else><strong>Consequence:</strong> Rejecting will send this quotation back to the <strong>{{ quotationValidPreviousStages[0]?.title }}</strong> stage. A remark is required.</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-2" v-if="selectedQuotationWorkflow">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Reason or Remarks (optional)</label>
                <textarea placeholder="Reason or Remarks ..."
                  v-model="quotationStatusUpdateForm.adminRemarks"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-20">
                </textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeStatusUpdateModal" class="btn-secondary">Cancel</button>
              <button
                type="button"
                @click="confirmEstimateStatusUpdate"
                :disabled="isUpdateButtonDisabled || isQuotationWorkflowLoading"
                :class="[
                  'btn-primary flex items-center space-x-2',
                  (isUpdateButtonDisabled || isQuotationWorkflowLoading) ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
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
      :item-name="'Customer Quotation'"
      @close="closeDeleteModal"
      @confirm="delQuotation"
    />

    <UiActionVerificationModal
        :isOpen="showStatusUpdateVerificationModal"
        :isProcessing="isUpdatingStatus"
        actionTitle="Update Status"
        message="You are about to change the status of this Estimate. Do you want to proceed ?"
        :requireConfirmationText="true"
        confirmationWord="CONFIRM"
        confirmButtonText="Update"
        infoNote="This change will notify the customer and cannot be undone."
        @close="showStatusUpdateVerificationModal = false"
        @confirm="handleStatusUpdate"
      />

      <UiActionVerificationModal
        :isOpen="showSendQuotationVerificationModal"
        :isProcessing="isSendingConfirmation"
        actionTitle="Send Quotation Confirmation"
        message="You are about to send a Quotation Confirmation. Do you want to proceed ?"
        :requireConfirmationText="true"
        confirmationWord="CONFIRM"
        confirmButtonText="Send"
        infoNote="This change will notify the customer and cannot be undone."
        @close="showSendQuotationVerificationModal = false"
        @confirm="handleSendConfirmation"
      />

  </div>
</template>

<script lang="ts" setup>
import type { Quotation, ProductionProcessingTimeLine, QuotationStats, Workflow } from "~/models";
import { isEmpty, debounce } from "lodash-es";
import CountUp from 'vue-countup-v3';
const { $toast } = useNuxtApp();

import { 
  Search, 
  Plus, 
  Send,
  FileText, 
  CheckCircle, 
  Clock, 
  Eye,
  Edit,
  CheckCheck,
  XCircle,
  History,
  Download,
  Trash2,
  X,
  MoreVertical,
  Info,
  Check,
  GitMerge,
  ArrowRight
} from 'lucide-vue-next'
import { getWorkflowDetails } from '~/services/workFlow';


definePageMeta({
  layout: 'default',
  middleware: 'auth',
  requiredPermissions: ['Quotation.View']
})  

const isSendingConfirmation = ref(false);
const isUpdatingStatus = ref(false)
const showViewModal = ref(false)
const closeViewModal = ref(false)

const showDeleteConfirmationModal = ref(false)
const showSendQuotationVerificationModal = ref(false)
const isQuotationLoading = ref(false)
const showViewQuotationModal = ref(false)
const showStatusUpdateModal = ref(false)
const showStatusUpdateVerificationModal = ref(false)
const productionRequestInfo = ref(null);
const isProductionRequestLoading = ref(false);

const isDeleting = ref(false)

const showTimelineModal = ref(false)
const modalTitle = ref('')
 
useHead({
  title: 'Quotations'
})

const router = useRouter();
const route = useRoute();
const { hasPermission } = usePermissions();

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,

});

const quotationStatusUpdateForm = reactive({
  id: '',
  status: '',
  adminRemarks: '',
});
const isApproveSelected = ref(true);

// Workflow state for quotation status modal
const selectedQuotationWorkflow = ref<Workflow | null>(null);
const isQuotationWorkflowLoading = ref(false);

const quotationValidNextStages = computed(() => {
  if (!selectedQuotationWorkflow.value || !selectedQuotation.value) return [];
  const currentStageId = (selectedQuotation.value as any).currentStageId;
  const workflow = selectedQuotationWorkflow.value;
  const validTransitions = currentStageId
    ? workflow.transitions.filter(t => t.currentStageId === currentStageId && t.status === 'Enabled')
    : workflow.transitions.filter(t => t.status === 'Enabled');
  const targetStageIds = new Set(validTransitions.map(t => t.targetStageId));
  return workflow.stages.filter(s => targetStageIds.has(s.id) && s.status === 'Enabled');
});

const quotationValidPreviousStages = computed(() => {
  if (!selectedQuotationWorkflow.value || !(selectedQuotation.value as any)?.currentStageId) return [];
  const currentStageId = (selectedQuotation.value as any).currentStageId;
  const currentStage = selectedQuotationWorkflow.value.stages.find(s => s.id === currentStageId);
  if (!currentStage) return [];
  return selectedQuotationWorkflow.value.stages.filter(s =>
    s.status === 'Enabled' && Number(s.ordering) < Number(currentStage.ordering)
  ).sort((a, b) => Number(b.ordering) - Number(a.ordering));
});

const currentQuotationWorkflowStage = computed(() => {
  if (!selectedQuotationWorkflow.value || !(selectedQuotation.value as any)?.currentStageId) return null;
  return selectedQuotationWorkflow.value.stages.find(s => s.id === (selectedQuotation.value as any).currentStageId) ?? null;
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const isShimmerLoading = ref(true);
 const quotationList =  ref<Quotation[]>([])
const selectedQuotation = ref <Quotation> ()
const quotationStatsData = ref<QuotationStats>();
const selectedTimeline = ref<ProductionProcessingTimeLine[]>([])
 
const activeMenuId = ref<string | null>(null);

const toggleMenu = (id: string) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};

const closeMenuOnOutsideClick = () => {
  activeMenuId.value = null;
};

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedQuotations()
}
 

 const getPaginatedQuotations = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getQuotations(filters);

        quotationList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch quotations !');
    } finally {
        isShimmerLoading.value = false;
    }

 }

 const viewQuotation = (quotation: Quotation) => {

  showViewQuotationModal.value = true;
  selectedQuotation.value = quotation;
    
};


const debouncedSearch = debounce(() => {
  filters.pageNo = 1; // Reset to first page for new search
  getPaginatedQuotations();
}, 300); // 300ms delay
   


const getStatusColor = (status: number) => {
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

const calculateTotalTax = (taxes) => {
  if (!taxes || !taxes.length) return 0;
  return taxes.reduce((sum, tax) => sum + (tax.taxAmount || 0), 0);
}

const viewTimeline = (quotation: Quotation) => {
  if (quotation.processingTimeLine && quotation.processingTimeLine.length > 0) {
    selectedTimeline.value = quotation.processingTimeLine;
    selectedQuotation.value = quotation;
    showTimelineModal.value = true;
    modalTitle.value = 'Processing Timeline';
  } else {
    $toast.info('No timeline data available for this request');
  }
}

const closeTimelineModal = () => {
  showTimelineModal.value = false;
}


const confirmEstimateStatusUpdate = async () => {
  showStatusUpdateVerificationModal.value = true;
  showStatusUpdateModal.value = false;
}

const downloadQuotation = async (quotation: Quotation) => {
  if (import.meta.server) return; // Skip if somehow triggered on server

  const html2pdf = (await import('html2pdf.js')).default;

  const quotationContent = document.getElementById('quotation-content');
  if (!quotationContent) return;

  const opt = {
    margin: 0.5,
    filename: `Quotation-${quotation.quotationNumber || 'quotation'}.pdf`,
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
    $toast.info('Preparing quotation for download...');
    await html2pdf().from(quotationContent).set(opt).save();
    $toast.success('Quotation downloaded successfully');
  } catch (error) {
    console.error('Error downloading quotation:', error);
    $toast.error('Failed to download quotation');
  }
};

const closeStatusUpdateModal = () => {
   showStatusUpdateModal.value = false;
   selectedQuotationWorkflow.value = null;
   isApproveSelected.value = true;
}

//send for confirmation
const initSendForConfirmation = async (quotation: Quotation) => {

  selectedQuotation.value = quotation;
  showSendQuotationVerificationModal.value = true;
   
};

const handleSendConfirmation = async () => {

  isSendingConfirmation.value = true;

  try {
      const isSuccessful = await sendQuotationToCustomer({ id: selectedQuotation.value.id });
    if (isSuccessful) {
        $toast.success('Quotation Confirmation Successfully Sent !');
      }
    } catch (error) {
      $toast.error('Failed to send Quotation !');
  } finally {
    isSendingConfirmation.value = true;
      showSendQuotationVerificationModal.value = false;
    }

   
};




//status update

const initUpdateStatus = async (quotation: Quotation) => {

  selectedQuotation.value = quotation;
  quotationStatusUpdateForm.id = quotation.id;
  quotationStatusUpdateForm.status = '';
  quotationStatusUpdateForm.adminRemarks = '';
  selectedQuotationWorkflow.value = null;

  showStatusUpdateModal.value = true;
  showViewModal.value = false;
  modalTitle.value = 'Update Quotation Status';

  // Load workflow transitions
  const workflowId = (quotation as any).workflowId;
  if (workflowId) {
    isQuotationWorkflowLoading.value = true;
    try {
      selectedQuotationWorkflow.value = await getWorkflowDetails(workflowId);
    } catch (e) {
      $toast.error('Unable to load workflow stages');
    } finally {
      isQuotationWorkflowLoading.value = false;
    }
  }
};


const closeViewQuotationModal = () => {
  showViewQuotationModal.value = false;
  selectedQuotation.value = null;
}


const initDelete = (quotation: Quotation) => {

  selectedQuotation.value = quotation;

  modalTitle.value = 'Delete Product Category';

  showDeleteConfirmationModal.value = true;
}

 const closeDeleteModal = () => {
    showDeleteConfirmationModal.value = false
  }


const handleStatusUpdate = async () => {

  isUpdatingStatus.value = true;

  try {
    let isSuccessful = false;
    const targetStage = isApproveSelected.value ? quotationValidNextStages.value[0] : quotationValidPreviousStages.value[0];
    const payload = {
      id: quotationStatusUpdateForm.id,
      WorkflowId: (selectedQuotation.value as any)?.workflowId,
      CurrentStageId: targetStage?.id,
      CurrentStageName: targetStage?.title
    };

    if (isApproveSelected.value) {
      isSuccessful = !!(await approveQuotation(payload));
    } else {
      isSuccessful = !!(await rejectQuotation(payload));
    }

    if (isSuccessful) {
      $toast.success(isApproveSelected.value ? 'Quotation approved successfully!' : 'Quotation rejected.');
      
      quotationStatusUpdateForm.id = '';
      quotationStatusUpdateForm.status = '';
      quotationStatusUpdateForm.adminRemarks = '';

      await getPaginatedQuotations();
    } else {
      $toast.error('Unable to update quotation status!');
    }
  } catch (error) {
    $toast.error('Unable to update quotation status!');
  } finally {
    isUpdatingStatus.value = false;
    showStatusUpdateModal.value = false;
    showStatusUpdateVerificationModal.value = false;
  }
}

const delQuotation = async () => {

  isDeleting.value = true;
    
  try {
      
      let isSuccessful = await deleteQuotation(selectedQuotation.value.id);
      if (isSuccessful) {
        $toast.success('Quotation deleted !');

        await getPaginatedQuotations();

      }
      else {
        $toast.error('Unable to delete quotation !');
      }
    } catch (error) {
      $toast.error('Unable to delete quotation !');
    } finally {
      isDeleting.value = false;
      closeDeleteModal();
    }
  }

  watch(() => quotationStatusUpdateForm.status, async (newStatus) => {
  if (newStatus === 'Approved') {
    isProductionRequestLoading.value = true;
    try {
      const result = await getProductionRequestDetails({ id: selectedQuotation.value.productionRequestId });
      productionRequestInfo.value = result;
      quotationStatusUpdateForm.plannedQuantity = result.quantity;
    } catch (error) {
      $toast.error('Failed to load production request details');
    } finally {
      isProductionRequestLoading.value = false;
    }
  } else {
    productionRequestInfo.value = null;
  }
  });


  const isUpdateButtonDisabled = computed(() => {
    if (!quotationStatusUpdateForm.status) return true;
    if (!isApproveSelected.value && !quotationStatusUpdateForm.adminRemarks?.trim()) return true;
    return false;
  });
  

watch(() => filters.query, debouncedSearch);

 
onMounted(async () => {
  if (!isEmpty(route.query)) {
    filters.pageNo = parseInt(route.query.pageNo as string);
  }
  await getPaginatedQuotations();
  
});

</script>