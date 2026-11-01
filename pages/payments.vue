<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Payments</h1>
        <p class="text-sm text-gray-500 mt-1">Track payments and receipts</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search payments..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
          >
        </div>
        <!-- <button v-if="isPaymentBtnVisible"
          @click="showCreateModal = true"
          class="btn-primary flex items-center space-x-2 d">
          <Plus class="w-4 h-4" />
          <span>Add Payment</span>
        </button> -->
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Receipts</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="paymentStatsData.totalTransactions" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Receipt class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">This Month</p>
            <p class="text-2xl font-bold text-gray-900">
              
              <CountUp :end-val="paymentStatsData.transactionsThisMonth" :duration="1.5" />
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Amount (GHS)</p>
            <p class="text-2xl font-bold text-gray-900"> 
              <CountUp :end-val="paymentStatsData.totalAmount" :duration="1.5" />
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-2xl font-bold">₵</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Avg. Amount (GHS)</p>
            <p class="text-2xl font-bold text-gray-900"> 
              <CountUp :end-val="paymentStatsData.averageAmount" :duration="1.5" />
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Receipts Table -->
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
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Receipt #
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone No.
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
              v-for="payment in paymentList" 
              :key="payment.id"
              class="hover:bg-gray-50 transition-colors">

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ payment.paymentDate }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ payment.receiptNo }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ payment.businessName }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ payment.fullName }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ payment.phoneNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">GHS {{ _currency(payment.amountPaid) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="status-badge"
                  :class="getStatusColor(payment.status)"
                >
                  {{ payment.status }}
                </span>
              </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <!-- View receipt button - only for successful payments -->
                  <button 
                    v-if="payment.status === 'Success' || payment.status === 'Verified & Successful'"
                    @click="viewReceipt(payment)"
                    class="text-blue-600 hover:text-blue-900"
                    title="View receipt"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  
                  <!-- Unavailable receipt info -->
                  <span 
                    v-else
                    class="text-gray-400 text-xs italic"
                    title="Receipt available after payment verification"
                  >
                    Pending receipt
                  </span>
                   
                  <button 
                    @click="viewFiles(payment)"
                    class="text-green-600 hover:text-green-900"
                    v-if="payment.uploadedFiles && payment.uploadedFiles.length > 0"
                    title="View proof of payment"
                  >
                    <FileText class="w-4 h-4" />
                  </button>
                  <button 
                    @click="initUpdateStatus(payment)"
                    class="text-purple-600 hover:text-purple-900"
                    v-if="payment.uploadedFiles && payment.uploadedFiles.length > 0"
                    title="Update payment status after reviewing files"
                  >
                    <CheckCircle class="w-4 h-4" />
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
 
    <!-- View Receipt Modal -->
    <client-only>

      <div v-if="showViewModal && selectedPayment" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content max-w-2xl" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Receipt #{{ selectedPayment.receiptNo }}</h2>
            <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <!-- Shimmer Loading for Receipt -->
          <div v-if="isReceiptLoading" class="rounded-2xl shadow-2xl border border-gray-200 p-8 bg-white space-y-8">
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

          <div id="payment-receipt" v-else>
            <div class="rounded-2xl shadow-2xl border border-gray-200 p-8 bg-white space-y-8">
              <!-- Header -->
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-4">
                  <img src="/img/graphic-logo.png" alt="Daily Graphic Logo" class="h-12 w-auto rounded-md border border-gray-200 p-1 bg-white shadow" />
                   
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">Receipt No: <span class="font-semibold text-gray-700">#{{ selectedPayment.receiptNo || 'N/A' }}</span></p>
                  <p class="text-sm text-gray-500">Date: <span class="font-semibold text-gray-700">{{ selectedPayment.paymentDate }}</span></p>
                  <!-- <p class="text-sm text-gray-500">Transaction Ref: <span class="font-semibold text-gray-700">{{ selectedPayment.transactionReference || 'N/A' }}</span></p> -->
                </div>
              </div>

              <!-- Party Info -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Paid By</h4>
                  <div class="text-sm text-gray-700 space-y-1">
                    <p class="font-semibold">{{ selectedPayment.businessName }}</p>
                    <p>{{ selectedPayment.fullName }}</p>
                    <p>{{ selectedPayment.email }}</p>
                    <p>{{ selectedPayment.phoneNumber }}</p>
                  </div>
                </div>
                <div>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Paid To</h4>
                  <div class="text-sm text-gray-700 space-y-1">
                    <p class="font-semibold">Daily Graphic</p>
                    <p>Graphic Communications Group Ltd.</p>
                    <p>Accra, Ghana</p>
                    <p>+233302674071</p>
                  </div>
                </div>
              </div>

              <!-- Service Table -->
              <div class="overflow-x-auto">
                <table class="min-w-full text-sm text-gray-700 border border-gray-200">
                  <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th class="text-left px-4 py-2 font-semibold">Description</th>
                      <th class="text-left px-4 py-2 font-semibold">Qty</th>
                      <th class="text-left px-4 py-2 font-semibold">Unit Price</th>
                      <th class="text-left px-4 py-2 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr>
                      <td class="px-4 py-2">Advertisement Booking</td>
                      <td class="px-4 py-2">1</td>
                      <td class="px-4 py-2">GHS {{ _currency(selectedPayment.amountPaid) }}</td>
                      <td class="px-4 py-2 font-semibold">GHS {{ _currency(selectedPayment.amountPaid) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Summary -->
              <div class="flex flex-col sm:items-end space-y-2">
                <div class="text-sm text-gray-700 space-y-1 w-full sm:max-w-xs">
                  <div class="flex justify-between"><span>Sub Total:</span><span>GHS {{ _currency(invoiceDetailsData.subTotal) }}</span></div>
                  <div class="flex justify-between"><span>Discount:</span><span>GHS {{ _currency(invoiceDetailsData.discountAmount) }}</span></div>
                  
                  <!-- Taxes Section -->
                  <div v-if="invoiceDetailsData.taxes && invoiceDetailsData.taxes.length > 0" class="pt-2 mt-1 border-t border-gray-100">
                    <div v-for="tax in invoiceDetailsData.taxes" :key="tax.id" class="flex justify-between">
                      <span>{{ tax.taxName }} {{ tax.isPercentage ? `(${tax.rate}%)` : '' }}:</span>
                      <span>GHS {{ _currency(tax.taxAmount) }}</span>
                    </div>
                    <div class="flex justify-between pt-1 mt-1 border-t border-gray-100 font-semibold">
                      <span>Total Tax:</span>
                      <span>GHS {{ _currency(calculateTotalTax(invoiceDetailsData.taxes)) }}</span>
                    </div>
                  </div>

                  <div class="flex justify-between pt-2 mt-1 border-t border-gray-200 text-base font-bold text-green-700">
                    <span>Amount Paid:</span>
                    <span>GHS {{ _currency(selectedPayment.amountPaid) }}</span>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-dashed border-gray-300 pt-4 text-center">
                <p class="text-sm text-gray-500 italic">This receipt is issued electronically and does not require a physical signature.</p>
                <p class="text-xs text-gray-400 mt-1">Generated on {{ new Date().toLocaleDateString('en-GB') }}</p>
              </div>
            </div>

          </div> <!-- End of payment-receipt -->

          <!-- Uploaded files section -->
          <div v-if="selectedPayment.uploadedFiles && selectedPayment.uploadedFiles.length > 0" class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Uploaded Payment Proofs:</h3>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="flex flex-wrap gap-2">
                <div 
                  v-for="(file, index) in selectedPayment.uploadedFiles" 
                  :key="index"
                  class="flex items-center space-x-2 bg-white px-3 py-2 rounded border border-gray-200"
                >
                  <component :is="getFileIcon(file)" class="w-4 h-4 text-blue-600" />
                  <span class="text-xs text-gray-600 truncate max-w-[150px]">
                    {{ file.substring(file.lastIndexOf('/') + 1) }}
                  </span>
                  <button 
                    @click="previewFile(file)"
                    class="text-blue-500 hover:text-blue-700"
                    title="Preview file"
                  >
                    <Eye class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>


          <!-- Action buttons -->
          <div class="flex justify-end space-x-3 pt-2">
            <button @click="closeViewModal" class="btn-secondary">
              Close
            </button>
            
              <button 
                @click="downloadPaymentReceipt(selectedPayment)" 
                class="btn-primary flex items-center space-x-2"
                title="Download as PDF"
              >
                <Download class="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <!-- <button 
                @click="printReceipt(selectedPayment)" 
                class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                title="Print receipt"
              >
                <Printer class="w-4 h-4" />
                <span>Print</span>
              </button> -->
             
          </div>
        </div>
      </div>
    </div>

    </client-only>
    
    
    
    <!-- Files Modal -->
    <div v-if="showFilesModal && selectedFiles.length > 0" class="modal-overlay" @click="closeFilesModal">
      <div class="modal-content" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Uploaded Payment Proofs</h2>
            <button @click="closeFilesModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <p class="text-sm text-gray-600 mb-4">
              The following files were uploaded as proof of payment. Click preview to view the file or download to save it.
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
                      <client-only>
                        <button 
                          @click="downloadFile(file)"
                          class="p-2 text-gray-400 hover:text-gray-600"
                          title="Download file"
                        >
                          <Download class="w-5 h-5" />
                        </button>
                      </client-only>
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
              <client-only>
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
              </client-only>
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
              <client-only>
                <button 
                  @click="downloadFile(previewingFile)" 
                  class="btn-primary flex items-center space-x-2"
                >
                  <Download class="w-5 h-5" />
                  <span>Download File</span>
                </button>
              </client-only>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div v-if="showStatusUpdateModal" class="modal-overlay" @click="closeStatusUpdateModal">
      <div class="modal-content max-w-lg" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Update Payment Status</h2>
            <button @click="closeStatusUpdateModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="selectedPayment" class="space-y-6">
            <div class="mb-4">
              <p class="text-sm text-gray-600">
                Payment #{{ selectedPayment.receiptNo }} for <span class="font-semibold">{{ selectedPayment.businessName }}</span>
              </p>
              <p class="mt-3 text-sm text-gray-600">
                Amount: <span class="font-semibold">GHS {{ _currency(selectedPayment.amountPaid) }}</span>
              </p>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  v-model="paymentStatusUpdateForm.status" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified & Successful">Verified & Successful</option>
                  <option value="Failed">Failed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea 
                  v-model="paymentStatusUpdateForm.adminRemarks"
                  placeholder="Add remarks about this payment status update"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button type="button" @click="closeStatusUpdateModal" class="btn-secondary">
                Cancel
              </button>
              <button 
                @click="confirmPaymentStatusUpdate"
                :disabled="!(paymentStatusUpdateForm.status && paymentStatusUpdateForm.adminRemarks)"
                class="btn-primary flex items-center space-x-2"
                :class="
                  !(paymentStatusUpdateForm.status && paymentStatusUpdateForm.adminRemarks) ? 'opacity-50 cursor-not-allowed' : ''
                "
              >
                <Check class="w-4 h-4" />
                <span>Update Status</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Invoice, Payment, PaymentStats } from "~/models";
import { isEmpty, debounce } from "lodash-es";
import CountUp from 'vue-countup-v3';
const { $toast } = useNuxtApp();

import { 
  Search, 
  Plus, 
  Receipt, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Eye,
  Download,
  FileText,
  Image as ImageIcon,
  FileQuestion,
  File as FilePdf,
  ExternalLink,
  Trash2,
  X,
  Check,
  CheckCircle,
  Printer
} from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})


const showCreateModal = ref(false)
const showViewModal = ref(false)
const showFilesModal = ref(false)
const showPreviewModal = ref(false)
const showStatusUpdateModal = ref(false)
const selectedReceipt = ref(null)
const selectedFiles = ref<string[]>([])
const previewingFile = ref('')
const previewingFileName = ref('')

// Status update form
const paymentStatusUpdateForm = reactive({
  id: '',
  status: '',
  adminRemarks: ''
})


const isShimmerLoading = ref(true);
const isReceiptLoading = ref(false);
 const paymentList =  ref<Payment[]>([])
const selectedPayment = ref<Payment>(null);
const invoiceDetailsData = ref<Invoice>(null);
const paymentStatsData = ref<PaymentStats>({});

useHead({
  title: 'Payments'
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


const getStatusColor = (status) => {
  switch (status) {
    case 'Success': return 'bg-green-100 text-green-800'
    case 'Verified & Successful': return 'bg-green-100 text-green-800'
    case 'In Progress': return 'bg-blue-100 text-blue-800'
    case 'Failed': return 'bg-red-100 text-red-800'
    case 'Cancelled': return 'bg-red-100 text-red-800'
    case 'Pending': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const statusTextColor = (status) => {
  switch (status) {
    case 'Success':
    case 'Verified & Successful':
      return 'text-green-700';
    case 'In Progress':
      return 'text-blue-700';
    case 'Failed':
    case 'Cancelled':
      return 'text-red-700';
    case 'Pending':
      return 'text-yellow-700';
    default:
      return 'text-gray-700';
  }
}

const onPageChange = async (pageNumber: number) => {

  filters.pageNo = pageNumber;
  const filteredQuery = filterQueryParams({ ...route.query, ...filters });

  router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedPayments()
}
 

 const getPaginatedPayments = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getPayments(filters);

        paymentList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch payments !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


 const getPaymentSummaryData = async () => {

    try {
    
      let result = await getPaymentStats();
      paymentStatsData.value = result;

    } catch (error) {
        $toast.error('Unable to fetch payment stats!');
    } finally {
        isShimmerLoading.value = false;
    }

}

const calculateTotalTax = (taxes) => {
  if (!taxes || !taxes.length) return 0;
  return taxes.reduce((sum, tax) => sum + (tax.taxAmount || 0), 0);
}

const viewReceipt = async (payment: Payment) => {
  // Check if payment is successful before proceeding
  if (payment.status !== 'Success' && payment.status !== 'Verified & Successful') {
    $toast.error('Receipt is only available for successful payments');
    return;
  }

  // First show the modal with loader
  selectedPayment.value = payment;
  showViewModal.value = true;
  isReceiptLoading.value = true;

  // Then call the API to fetch the invoice details 
  try {
    let result = await getInvoiceDetails({ id: payment.invoiceId });
    invoiceDetailsData.value = result;
  } catch (error) {
    $toast.error('Unable to fetch payment details!');
    console.error('Error fetching invoice details:', error);
  } finally {
    isReceiptLoading.value = false;
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
  if (typeof window === 'undefined') return;
  window.open(fileUrl, '_blank');
}

const viewFiles = (payment) => {
  if (payment.uploadedFiles && payment.uploadedFiles.length > 0) {
    selectedFiles.value = payment.uploadedFiles.map(url => url.replace(/^http:\/\//i, 'https://'));;
    selectedPayment.value = payment;
    showFilesModal.value = true;
  } else {
    $toast.info('No files uploaded for this payment');
  }
}

const closeFilesModal = () => {
  showFilesModal.value = false;
}


const downloadPaymentReceipt =  async(payment: Payment) => {

  if (import.meta.server) return; // Skip if somehow triggered on server

  const html2pdf = (await import('html2pdf.js')).default;

  // Select the HTML content (modal body or any other container)
  const receiptContent = document.getElementById('payment-receipt');
  if (!receiptContent) return;
  
  // Configure html2pdf options
    const opt = {
        margin: 0.5,  // Reduced margin for better layout
        filename: `Receipt-${payment.receiptNo || 'payment'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,  // Enable CORS for images
          logging: true,  // Enable logging for debugging
          allowTaint: true // Allow cross-origin images
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      // Show loading toast
      $toast.info('Preparing receipt for download...');
      
      // Generate and download the PDF
       html2pdf()
          .from(receiptContent)
          .set(opt)
          .save();
          
      $toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      $toast.error('Failed to download receipt');
    }
};

const downloadFile = (fileUrl: string) => {
  // Only execute on client-side
  if (typeof window === 'undefined') return;
  
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



const closeModal = () => {
  showCreateModal.value = false
   
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedReceipt.value = null
}


// Function to print the receip

const initUpdateStatus = (payment: Payment) => {
  // Only allow status update for payments with uploaded files
  if (!payment.uploadedFiles || payment.uploadedFiles.length === 0) {
    $toast.info('Cannot update status: No proof of payment files available for review')
    return
  }
  
  paymentStatusUpdateForm.id = payment.id
  paymentStatusUpdateForm.status = payment.status
  paymentStatusUpdateForm.adminRemarks = ''
  selectedPayment.value = payment
  showStatusUpdateModal.value = true
}

const closeStatusUpdateModal = () => {
  showStatusUpdateModal.value = false
  paymentStatusUpdateForm.id = ''
  paymentStatusUpdateForm.status = ''
  paymentStatusUpdateForm.adminRemarks = ''
}

const confirmPaymentStatusUpdate = () => {
  $toast.info('Updating payment status...')
  updatePaymentStatus({
    id: paymentStatusUpdateForm.id,
    status: paymentStatusUpdateForm.status,
    remarks: paymentStatusUpdateForm.adminRemarks
  })
    .then((success) => {
      if (success) {
        $toast.success('Payment status updated successfully')
        // Update the payment in the list with the new status
        const index = paymentList.value.findIndex(p => p.id === paymentStatusUpdateForm.id)
        if (index !== -1) {
          paymentList.value[index].status = paymentStatusUpdateForm.status
        }
        closeStatusUpdateModal()
      } else {
        $toast.error('Failed to update payment status')
      }
    })
    .catch((error) => {
      console.error('Error updating payment status:', error)
      $toast.error('An error occurred while updating payment status')
    })
}

const debouncedSearch = debounce(() => {
  filters.pageNo = 1; // Reset to first page for new search
  getPaginatedPayments();
}, 300); // 300ms delay
   
watch(() => filters.query, debouncedSearch);
 
onMounted(async () => {
  if (!isEmpty(route.query)) {
    filters.pageNo = parseInt(route.query.pageNo as string);
  }
  await getPaginatedPayments();
  await getPaymentSummaryData();
  
});

</script>

<style>
/* Status badge styling */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
}

/* Override the display property for the status badge in the payment details section */
.flex .status-badge {
  display: inline-flex;
}
</style>