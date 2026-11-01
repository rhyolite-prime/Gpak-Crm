<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Invoices</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your invoices and billing</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.query"
            type="text" 
            placeholder="Search invoices..."
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

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Invoices</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="invoiceStatsData?.totalInvoices" :duration="1.5" />
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
            <p class="text-sm text-gray-500">Paid Invoices</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
                <CountUp :end-val="toNumber(invoiceStatsData?.paidInvoices)" :duration="1.5" />
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
            <p class="text-sm text-gray-500">Pending</p>
            <p class="text-2xl font-bold text-gray-900">
              <client-only>
               <CountUp :end-val="toNumber(invoiceStatsData?.pending)" :duration="1.5" />
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
              <CountUp :end-val="invoiceStatsData?.totalAmount" :duration="1.5" />
              </client-only>
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-2xl font-bold">₵</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Invoices Table -->
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
                Invoice #
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid At
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
              v-for="invoice in invoiceList" 
              :key="invoice.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ invoice.invoiceNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ invoice.businessName }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ invoice.fullName }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ invoice.phoneNumber }}</div>
              </td>
             
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ invoice.dueDate }}</div>
              </td>

               <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ invoice.paidAt }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">GHS {{ _currency(invoice.totalAmount) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="status-badge"
                  :class="getStatusColor(invoice.status)"
                >
                  {{ invoice.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="viewInvoice(invoice)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                   
                  <!-- <button 
                    @click="deleteInvoice(invoice)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button> -->
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

    <!-- Create Invoice Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Create New Invoice</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="createInvoice" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select 
                  v-model="newInvoice.customer"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Customer</option>
                  <option value="Jane Cooper">Jane Cooper</option>
                  <option value="Floyd Miles">Floyd Miles</option>
                  <option value="Ronald Richards">Ronald Richards</option>
                  <option value="Marvin McKinney">Marvin McKinney</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input 
                  v-model="newInvoice.dueDate"
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                v-model="newInvoice.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Invoice description..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Items</label>
              <div class="space-y-2">
                <div 
                  v-for="(item, index) in newInvoice.items" 
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input 
                    v-model="item.description"
                    type="text" 
                    placeholder="Item description"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                  <input 
                    v-model="item.quantity"
                    type="number" 
                    placeholder="Qty"
                    class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                  <input 
                    v-model="item.price"
                    type="number" 
                    step="0.01"
                    placeholder="Price"
                    class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                  <button 
                    type="button"
                    @click="removeItem(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button 
                type="button"
                @click="addItem"
                class="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
              >
                <Plus class="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn-primary flex items-center space-x-2"
                :disabled="isCreating"
              >
                <div v-if="isCreating" class="loader"></div>
                <span>{{ isCreating ? 'Creating...' : 'Create Invoice' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Invoice Modal -->
    <client-only>
      <div v-if="showViewModal && selectedInvoice" class="modal-overlay" @click="closeViewModal">
        <div class="modal-content max-w-2xl" @click.stop>
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Invoice #{{ selectedInvoice.invoiceNumber }}</h2>
              <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <!-- Shimmer Loading for Invoice -->
            <div v-if="isInvoiceLoading" class="rounded-2xl shadow-2xl border border-gray-200 p-8 bg-white space-y-8">
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

            <!-- Invoice Content -->
            <div id="invoice-content" v-else>
              <div class="rounded-2xl shadow-2xl border border-gray-200 p-8 bg-white space-y-8">
                <!-- Header -->
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-4">
                    <img src="/img/graphic-logo.png" alt="Daily Graphic Logo" class="h-12 w-auto rounded-md border border-gray-200 p-1 bg-white shadow" />
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Invoice No: <span class="font-semibold text-gray-700">#{{ selectedInvoice.invoiceNumber || 'N/A' }}</span></p>
                    <p class="text-sm text-gray-500">Invoice Date: <span class="font-semibold text-gray-700">{{ selectedInvoice.invoiceDate }}</span></p>
                    <p class="text-sm text-gray-500">Due Date: <span class="font-semibold text-gray-700">{{ selectedInvoice.dueDate }}</span></p>
                  </div>
                </div>

                <!-- Party Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Bill To</h4>
                    <div class="text-sm text-gray-700 space-y-1">
                      <p class="font-semibold">{{ selectedInvoice.businessName }}</p>
                      <p>{{ selectedInvoice.fullName }}</p>
                      <p>{{ selectedInvoice.email }}</p>
                      <p>{{ selectedInvoice.phoneNumber }}</p>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">From</h4>
                    <div class="text-sm text-gray-700 space-y-1">
                      <p class="font-semibold">Daily Graphic</p>
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
                      <tr v-if="selectedInvoice.details && selectedInvoice.details.length > 0" 
                          v-for="(item, index) in selectedInvoice.details" 
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
                    <div class="flex justify-between"><span>Sub Total:</span><span>GHS {{ _currency(selectedInvoice.subTotal) }}</span></div>
                    <div class="flex justify-between"><span>Discount:</span><span>GHS {{ _currency(selectedInvoice.discountAmount || 0) }}</span></div>
                    
                    <!-- Taxes Section -->
                    <div v-if="selectedInvoice.taxes && selectedInvoice.taxes.length > 0" class="pt-3 mt-2 border-t border-gray-200">
                      <h5 class="font-medium text-gray-700 mb-2">Tax Summary</h5>
                      <div class="bg-gray-50 rounded-lg p-3">
                        <div v-for="tax in selectedInvoice.taxes" :key="tax.id" class="flex justify-between items-center py-1">
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
                          <span>GHS {{ _currency(calculateTotalTax(selectedInvoice.taxes)) }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex justify-between pt-2 mt-1 border-t border-gray-200 text-base font-bold text-red-700">
                      <span>Total Amount:</span>
                      <span>GHS {{ _currency(selectedInvoice.totalAmount) }}</span>
                    </div>

                    <div class="flex justify-between pt-1 text-sm font-medium" v-if="selectedInvoice.status === 'Paid'">
                      <span class="text-green-600">Paid Amount:</span>
                      <span class="text-green-600">GHS {{ _currency(selectedInvoice.totalAmount) }}</span>
                    </div>
                    <div class="flex justify-between pt-1 text-sm font-medium" v-else>
                      <span class="text-yellow-600">Balance Due:</span>
                      <span class="text-yellow-600">GHS {{ _currency(selectedInvoice.totalAmount) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Payment Status -->
                <div v-if="selectedInvoice.status" class="border-t border-gray-200 pt-4 text-center">
                  <p v-if="selectedInvoice.status === 'Paid'" class="text-xs text-green-600 mt-1">
                    Paid on: {{ selectedInvoice.paidAt || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex justify-end space-x-3 pt-4 mt-4">
              <button @click="closeViewModal" class="btn-secondary">
                Close
              </button>
              <button 
                @click="downloadInvoice(selectedInvoice)" 
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
  </div>
</template>

<script lang="ts" setup>
import type { Invoice, InvoiceStats } from "~/models";
import { isEmpty, debounce } from "lodash-es";
import CountUp from 'vue-countup-v3';
const { $toast } = useNuxtApp();

import { 
  Search, 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
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
const showViewModal = ref(false)
const selectedInvoice = ref(null)
const isCreating = ref(false)
const isInvoiceLoading = ref(false)

const newInvoice = ref({
  customer: '',
  dueDate: '',
  description: '',
  items: [
    { description: '', quantity: 1, price: 0 }
  ]
})

 
useHead({
  title: 'Invoices'
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

const isShimmerLoading = ref(true);
 const invoiceList =  ref<Invoice[]>([])
const selectedCustomer = ref <Invoice> ([])
const invoiceStatsData = ref<InvoiceStats>();
 

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedInvoices()
}
 

 const getPaginatedInvoices = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getInvoices(filters);

        invoiceList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch invoices !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


 const getInvoiceSummaryData = async () => {
    
    try {
    
      let result = await getInvoiceStats();
      invoiceStatsData.value = result;
        

    } catch (error) {
        $toast.error('Unable to fetch invoice summary!');
    } finally {
        isShimmerLoading.value = false;
    }

}

const debouncedSearch = debounce(() => {
  filters.pageNo = 1; // Reset to first page for new search
  getPaginatedInvoices();
}, 300); // 300ms delay
   
watch(() => filters.query, debouncedSearch);
 
onMounted(async () => {
  if (!isEmpty(route.query)) {
    filters.pageNo = parseInt(route.query.pageNo as string);
  }
  await getInvoiceSummaryData();
  await getPaginatedInvoices();
  
});

 

const getStatusColor = (status) => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-800'
    case 'Pending': return 'bg-yellow-100 text-yellow-800'
    case 'Overdue': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const calculateTotalTax = (taxes) => {
  if (!taxes || !taxes.length) return 0;
  return taxes.reduce((sum, tax) => sum + (tax.taxAmount || 0), 0);
}

const viewInvoice = async (invoice) => {
  // First show the modal with loader
  selectedInvoice.value = invoice;
  showViewModal.value = true;
  isInvoiceLoading.value = true;

  // Then call the API to fetch any additional invoice details if needed
  try {
    // If you need to fetch additional details
    // let result = await getInvoiceDetails({ id: invoice.id });
    // selectedInvoice.value = { ...selectedInvoice.value, ...result };
    
    // Add a small delay to simulate loading (remove in production)
    setTimeout(() => {
      isInvoiceLoading.value = false;
    }, 500);
  } catch (error) {
    $toast.error('Unable to fetch invoice details!');
    console.error('Error fetching invoice details:', error);
    isInvoiceLoading.value = false;
  }
}

const editInvoice = (invoice) => {
  // Edit functionality would go here
  console.log('Edit invoice:', invoice)
}



const downloadInvoice = async (invoice: Invoice) => {
  if (import.meta.server) return; // Skip if somehow triggered on server

  const html2pdf = (await import('html2pdf.js')).default;

  const invoiceContent = document.getElementById('invoice-content');
  if (!invoiceContent) return;

  const opt = {
    margin: 0.5,
    filename: `Invoice-${invoice.invoiceNumber || 'invoice'}.pdf`,
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
    $toast.info('Preparing invoice for download...');
    await html2pdf().from(invoiceContent).set(opt).save();
    $toast.success('Invoice downloaded successfully');
  } catch (error) {
    console.error('Error downloading invoice:', error);
    $toast.error('Failed to download invoice');
  }
};


const closeModal = () => {
  showCreateModal.value = false
  newInvoice.value = {
    customer: '',
    dueDate: '',
    description: '',
    items: [{ description: '', quantity: 1, price: 0 }]
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedInvoice.value = null
}

const addItem = () => {
  newInvoice.value.items.push({ description: '', quantity: 1, price: 0 })
}

const removeItem = (index) => {
  if (newInvoice.value.items.length > 1) {
    newInvoice.value.items.splice(index, 1)
  }
}

 
</script>