<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Action Bar -->
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Create Work Instructions Ticket
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0 space-x-3">
        <button @click="router.back()" class="btn-secondary flex items-center gap-2">
          <ArrowLeft class="w-4 h-4" />
          Back
        </button>
        <button @click="printTicket" class="btn-secondary flex items-center gap-2">
          <Printer class="w-4 h-4" />
          Print Ticket
        </button>
        <button @click="saveTicket" class="btn-primary flex items-center gap-2">
          <Save class="w-4 h-4" />
          Save Ticket
        </button>
      </div>
    </div>

    <!-- Ticket Form Container -->
    <div class="bg-white shadow rounded-lg overflow-hidden" id="ticket-content">
      <div class="p-6 space-y-8">
        
        <!-- Top Section: Core Details -->
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-b border-gray-200 pb-8">
          <div class="sm:col-span-1">
            <label class="block text-sm font-medium text-gray-700">Job No.</label>
            <input v-model="form.jobNo" type="text" class="input-field" />
          </div>
          
          <div class="sm:col-span-2">
             <label class="block text-sm font-medium text-gray-700">Customer</label>
             <input v-model="form.customer" type="text" class="input-field" />
          </div>
          <div class="sm:col-span-2">
             <label class="block text-sm font-medium text-gray-700">Job Name</label>
             <input v-model="form.jobName" type="text" class="input-field" />
          </div>

          <div class="sm:col-span-1">
             <label class="block text-sm font-medium text-gray-700">LPO No.</label>
             <input v-model="form.customerLpoNo" type="text" class="input-field" />
          </div>
          
          <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700">Job Description</label>
              <textarea v-model="form.jobDescription" rows="3" class="input-field resize-none"></textarea>
          </div>

          
          <div class="sm:col-span-1">
             <label class="block text-sm font-medium text-gray-700">Delivery Date</label>
             <input v-model="form.deliveryDate" type="date" class="input-field" />
          </div>
           <div class="sm:col-span-1">
             <label class="block text-sm font-medium text-gray-700">Quantity</label>
             <input v-model="form.quantity" type="number" class="input-field font-bold" />
          </div>
        </div>

        <!-- Specifications Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-200 pb-8">
            <!-- Left Spec Column -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Size Specifications</h3>
                 <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Final Size (Cover)</label>
                        <div class="flex items-center gap-2">
                            <input v-model="form.finalSizeCoverX" type="text" class="input-field" placeholder="X" />
                            <span class="text-gray-500">x</span>
                            <input v-model="form.finalSizeCoverY" type="text" class="input-field" placeholder="Y" />
                            <span class="text-xs text-gray-400">mm</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Final Size (Text)</label>
                        <div class="flex items-center gap-2">
                             <input v-model="form.finalSizeTextX" type="text" class="input-field" placeholder="X" />
                             <span class="text-gray-500">x</span>
                             <input v-model="form.finalSizeTextY" type="text" class="input-field" placeholder="Y" />
                             <span class="text-xs text-gray-400">mm</span>
                        </div>
                    </div>
                 </div>
                 
                 <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Total Pages (Cover)</label>
                        <input v-model="form.totalPagesCover" type="number" class="input-field" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Total Pages (Text)</label>
                        <input v-model="form.totalPagesText" type="number" class="input-field" />
                    </div>
                 </div>
            </div>
            
            <!-- Right Spec Column (DESIGN) -->
             <div class="space-y-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Design</h3>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Pages to View</label>
                        <input v-model="form.design.pagesToView" type="text" class="input-field" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">No. of Ups (Cover)</label>
                         <input v-model="form.design.noOfUps" type="text" class="input-field" />
                    </div>
                </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700">Sections</label>
                    <input v-model="form.design.sections" type="text" class="input-field" />
                </div>
                <div>
                     <label class="block text-sm font-medium text-gray-700">Instructions</label>
                     <textarea v-model="form.design.instructions" rows="2" class="input-field resize-none"></textarea>
                </div>
            </div>
        </div>

        <!-- Middle Sections: Repro & Press -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-200 pb-8">
            <!-- Repro -->
            <div class="space-y-6">
                 <h3 class="text-lg font-medium leading-6 text-gray-900">Repro</h3>
                 <div class="flex gap-6">
                    <label class="inline-flex items-center">
                        <input v-model="form.repro.makePlates" type="checkbox" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                        <span class="ml-2 text-sm text-gray-700">Make Plates</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input v-model="form.repro.checkExisting" type="checkbox" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                        <span class="ml-2 text-sm text-gray-700">Check Existing</span>
                    </label>
                 </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700">Total Quantity</label>
                    <input v-model="form.repro.totalQuantity" type="number" class="input-field" />
                </div>
                 <div>
                     <label class="block text-sm font-medium text-gray-700">Instructions</label>
                     <textarea v-model="form.repro.instructions" rows="2" class="input-field resize-none"></textarea>
                </div>
            </div>

            <!-- Press -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Press</h3>
                <div>
                     <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Machine Selection</label>
                     <div class="grid grid-cols-4 gap-2">
                        <label v-for="m in ['SM-74 5', 'SX-74', 'FLEXO', 'KBA', 'SM-74 4', 'GTO', 'SM-74 5 (Alt)', 'SM-74 2']" :key="m" 
                               class="flex flex-col items-center justify-center p-2 border rounded hover:bg-gray-50 cursor-pointer text-center"
                               :class="{'border-blue-500 bg-blue-50': form.press.machine === m, 'border-gray-200': form.press.machine !== m}">
                             <input v-model="form.press.machine" type="radio" :value="m" name="machine" class="sr-only" />
                             <span class="text-[10px] font-bold" :class="{'text-blue-700': form.press.machine === m, 'text-gray-600': form.press.machine !== m}">{{ m }}</span>
                        </label>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-sm font-medium text-gray-700">Impressions</label>
                        <input v-model="form.press.impressions" type="text" class="input-field" />
                     </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Colours Inside</label>
                        <input v-model="form.press.coloursInside" type="text" class="input-field" />
                     </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Colours Cover</label>
                        <input v-model="form.press.coloursCover" type="text" class="input-field" />
                     </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">Varnish</label>
                        <div class="flex items-center gap-2 mt-1">
                             <input v-model="form.press.varnish" type="checkbox" class="rounded border-gray-300 text-blue-600" />
                             <input :disabled="!form.press.varnish" v-model="form.press.varnishType" type="text" placeholder="Type..." class="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400" />
                        </div>
                     </div>
                </div>
                <div>
                     <label class="block text-sm font-medium text-gray-700">Instructions</label>
                     <textarea v-model="form.press.instructions" rows="2" class="input-field resize-none"></textarea>
                </div>
            </div>
        </div>

        <!-- Finishing -->
        <div class="border-b border-gray-200 pb-8">
            <h3 class="text-lg font-medium leading-6 text-gray-900 mb-6">Finishing</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Options</label>
                         <div class="flex flex-wrap gap-4">
                            <label v-for="item in ['Fold', 'Collate', 'Die-Cut', 'Strip', 'Fold/Glue', 'Punch', 'Laminate']" :key="item" class="inline-flex items-center cursor-pointer">
                                 <input v-model="form.finishing.options" :value="item" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                 <span class="ml-2 text-sm text-gray-700">{{ item }}</span>
                            </label>
                         </div>
                    </div>
                    <div class="flex gap-6">
                        <label class="inline-flex items-center">
                            <input v-model="form.finishing.gloss" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="ml-2 text-sm text-gray-700">Gloss</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input v-model="form.finishing.matt" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="ml-2 text-sm text-gray-700">Matt</span>
                        </label>
                    </div>
                </div>
                <div class="space-y-6">
                    <div>
                         <label class="block text-sm font-medium text-gray-700 mb-2">Binding</label>
                         <div class="grid grid-cols-3 gap-2">
                            <label v-for="b in ['Saddle Stitch', 'Wire-O', 'Side Stab', 'Perfect Bind', 'Spiral', 'Case Bind']" :key="b" class="inline-flex items-center cursor-pointer">
                                 <input v-model="form.finishing.binding" :value="b" type="radio" name="binding" class="text-blue-600 focus:ring-blue-500 border-gray-300" />
                                 <span class="ml-2 text-xs text-gray-700">{{ b }}</span>
                            </label>
                         </div>
                    </div>
                    <div>
                         <label class="block text-sm font-medium text-gray-700">Packaging</label>
                         <input v-model="form.finishing.packaging" type="text" class="input-field" />
                    </div>
                     <div>
                         <label class="block text-sm font-medium text-gray-700">Instructions</label>
                         <textarea v-model="form.finishing.instructions" rows="2" class="input-field resize-none"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <!-- Paper and Board Details Table -->
        <div>
             <div class="flex justify-between items-center mb-4">
                 <h3 class="text-lg font-medium leading-6 text-gray-900">Paper & Board Details</h3>
                 <button @click="addTableRow" class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    <Plus class="w-4 h-4 mr-1" /> Add Row
                 </button>
             </div>
             <div class="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Paper, Board</th>
                            <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">GSM</th>
                            <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Size</th>
                            <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Quantity</th>
                            <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Overs</th>
                            <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Total Qty</th>
                            <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Cut To</th>
                            <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Total Sheets</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Delete</span></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-for="(row, index) in form.paperTable" :key="index">
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                <input v-model="row.paperBoard" type="text" class="table-input" placeholder="Details..." />
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <input v-model="row.gsm" type="text" class="table-input text-center" />
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <input v-model="row.size" type="text" class="table-input text-center" />
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <input v-model="row.quantity" type="number" class="table-input text-center" />
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <input v-model="row.overs" type="number" class="table-input text-center" />
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-bold text-center bg-gray-50">
                                {{ (row.quantity || 0) + (row.overs || 0) }}
                            </td>
                             <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <input v-model="row.cutTo" type="text" class="table-input text-center" />
                            </td>
                             <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <input v-model="row.totalSheets" type="text" class="table-input text-center" />
                            </td>
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button @click="removeTableRow(index)" class="text-red-600 hover:text-red-900">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                        <tr v-if="form.paperTable.length === 0">
                            <td colspan="9" class="p-8 text-center text-gray-400 italic">No paper details added.</td>
                        </tr>
                    </tbody>
                </table>
             </div>
        </div>

        <!-- Footer: Signatories -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-gray-200">
             <div class="text-center space-y-2">
                <input v-model="form.preparedBy" type="text" class="input-field text-center font-medium" placeholder="Name" />
                <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Prepared by</span>
             </div>
             <div class="text-center space-y-2">
                <input v-model="form.authorisedBy" type="text" class="input-field text-center font-medium" placeholder="Name" />
                <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Authorised by</span>
             </div>
             <div class="text-center space-y-2">
                <input v-model="form.approvedBy" type="text" class="input-field text-center font-medium" placeholder="Name" />
                <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Approved by</span>
             </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from '#app';
import { ArrowLeft, Save, Printer, Plus, Trash2 } from 'lucide-vue-next';

const router = useRouter();

const form = reactive({
    jobNo: '',
    date: new Date().toISOString().split('T')[0],
    customer: '',
    jobName: '',
    jobDescription: '',
    customerLpoNo: '',
    deliveryDate: '',
    quantity: 0,
    finalSizeCoverX: '',
    finalSizeCoverY: '',
    finalSizeTextX: '',
    finalSizeTextY: '',
    totalPagesCover: 0,
    totalPagesText: 0,
    design: {
        pagesToView: '',
        noOfUps: '',
        sections: '',
        instructions: ''
    },
    repro: {
        makePlates: false,
        checkExisting: false,
        totalQuantity: 0,
        instructions: ''
    },
    press: {
        machine: '',
        impressions: '',
        coloursInside: '',
        coloursCover: '',
        varnish: false,
        varnishType: '',
        instructions: ''
    },
    finishing: {
        options: [] as string[],
        gloss: false,
        matt: false,
        binding: '',
        packaging: '',
        instructions: ''
    },
    paperTable: [
        { paperBoard: '', gsm: '', size: '', quantity: null, overs: null, totalQty: 0, cutTo: '', totalSheets: '' }
    ],
    preparedBy: '',
    authorisedBy: '',
    approvedBy: ''
});

const addTableRow = () => {
    form.paperTable.push({ paperBoard: '', gsm: '', size: '', quantity: null, overs: null, totalQty: 0, cutTo: '', totalSheets: '' });
};

const removeTableRow = (index: number) => {
    form.paperTable.splice(index, 1);
};

const saveTicket = () => {
    console.log('Saving ticket:', form);
    // Implementation for saving to API would go here
};

const printTicket = async () => {
    if (typeof window === 'undefined') return;
    // Basic window print for now.
    window.print();
};
</script>

<style scoped>
.input-field {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
}

.table-input {
    @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm;
    padding: 0.375rem 0.5rem; /* Sligthly smaller padding than main inputs */
    border: 1px solid #d1d5db;
}

.input-field:focus, .table-input:focus {
    outline: none;
    border-color: #ef4444; /* red-500 */
}

/* Print styles override */
@media print {
    .btn-secondary, .btn-primary, .md\:flex.md\:items-center.md\:justify-between {
        display: none !important;
    }
    .shadow, .rounded-lg, .border, .border-gray-200 {
        box-shadow: none !important;
        border: none !important;
    }
    .input-field, .table-input {
        border: none !important;
        padding: 0 !important;
        box-shadow: none !important;
    }
}
</style>