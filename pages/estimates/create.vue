<template>
  <div class="max-w-9xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Create New Estimate
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0 space-x-3">
        <NuxtLink to="/estimates" class="btn-secondary">Back to Estimate List</NuxtLink>
        <!-- <button @click="downloadPdf" class="btn-secondary flex items-center">
            <Download class="mr-2 h-4 w-4" />
            Download PDF
        </button> -->
      </div>
    </div>

    <!-- Production Request Context Banner -->
    <div v-if="form.productionRequestId" class="mb-6 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
      <!-- Header / Basic Banner -->
      <div class="flex items-center justify-between px-4 py-3 bg-blue-100/50 border-b border-blue-200">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Package class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-blue-800">
              Creating estimate for Production Request
              <span v-if="form.productionRequestNumber" class="font-bold">#{{ form.productionRequestNumber }}</span>
            </p>
            <p class="text-xs text-blue-600 mt-0.5">Fields below have been pre-filled from the request.</p>
          </div>
        </div>
        <NuxtLink to="/production-requests" class="text-xs font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap pl-4">
          ← Back to Requests
        </NuxtLink>
      </div>
      
      <!-- Expanded Details (when loaded) -->
      <div v-if="productionRequestDetails" class="px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Column 1: Customer Details -->
        <div>
          <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center">
            <User class="w-3 h-3 mr-1" /> Customer Details
          </h4>
          <div class="text-sm text-blue-900 space-y-2">
            <p><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Business/Customer Name</span> {{ productionRequestDetails.customerName || productionRequestDetails.businessName }}</p>
            <p><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Phone Number</span> <span class="flex items-center"><Phone class="w-3 h-3 mr-1 text-blue-500" /> {{ productionRequestDetails.phoneNo || productionRequestDetails.customerPhoneNumber }}</span></p>
            <p v-if="productionRequestDetails.email || productionRequestDetails.customerEmail"><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Email</span> <span class="flex items-center"><Mail class="w-3 h-3 mr-1 text-blue-500" /> {{ productionRequestDetails.email || productionRequestDetails.customerEmail }}</span></p>
          </div>
        </div>

        <!-- Column 2: Job Specifications -->
        <div>
          <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center">
            <Hash class="w-3 h-3 mr-1" /> Job Specifications
          </h4>
          <div class="text-sm text-blue-900 space-y-2">
            <p v-if="productionRequestDetails.jobName"><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Job Name</span> {{ productionRequestDetails.jobName }}</p>
            <p><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Service/Category</span> {{ productionRequestDetails.serviceCategoryName }}</p>
            <div class="grid grid-cols-2 gap-2">
                <p v-if="productionRequestDetails.quantity"><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Quantity</span> {{ productionRequestDetails.quantity }}</p>
                <p v-if="productionRequestDetails.size"><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Size</span> {{ productionRequestDetails.size }}</p>
            </div>
            <p><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Number of Pages</span> {{ productionRequestDetails.pages }}</p>
          </div>
        </div>

        <!-- Column 3: Request & Status Details -->
        <div>
          <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center">
            <Package class="w-3 h-3 mr-1" /> Request Details
          </h4>
          <div class="text-sm text-blue-900 space-y-2">
            <p v-if="productionRequestDetails.requestNumber"><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Request Number</span> #{{ productionRequestDetails.requestNumber }}</p>
            <p v-if="productionRequestDetails.createdAt"><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Created Date</span> {{ new Date(productionRequestDetails.createdAt).toLocaleDateString() }}</p>
            <p v-if="productionRequestDetails.currentStageName"><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Current Stage</span> <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{{ productionRequestDetails.currentStageName }}</span></p>
            <p v-if="productionRequestDetails.invoiceAmount"><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Invoice Amount</span> {{ productionRequestDetails.invoiceAmount }}</p>
            <p v-if="productionRequestDetails.adminRemarks"><span class="font-medium block text-blue-700/70 text-[10px] uppercase">Remarks</span> <span class="italic text-xs">{{ productionRequestDetails.adminRemarks }}</span></p>
          </div>
        </div>
      </div>
      <div v-else class="px-4 py-4 flex items-center justify-center text-sm text-blue-500">
        <Loader2 class="w-4 h-4 animate-spin mr-2" /> Loading request details...
      </div>
    </div>

    <!-- Drag Overlay indication -->
    <div v-if="isDraggingFormula" class="fixed inset-0 z-40 bg-red-500 bg-opacity-10 pointer-events-none transition-opacity"></div>


    <div class="bg-white shadow rounded-lg overflow-hidden" id="estimate-form">
      <div class="p-6">
        
        <!-- Header Info -->
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mb-8">
          <div class="sm:col-span-2">
             <label for="business-name" class="block text-sm font-medium text-gray-700">Business Name</label>
             <div class="mt-1">
               <input v-model="form.businessName" type="text" name="business-name" id="business-name" class="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
             </div>
          </div>

          <div class="sm:col-span-1">
            <label for="full-name" class="block text-sm font-medium text-gray-700">Job Name</label>
            <div class="mt-1">
              <input v-model="form.jobName" type="text" name="full-name" id="full-name" class="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            </div>
          </div>
          
           <div class="sm:col-span-1">
            <label for="phone" class="block text-sm font-medium text-gray-700">Quantity</label>
            <div class="mt-1">
              <input v-model="form.quantity" type="number" name="phone" id="phone" class="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            </div>
          </div>

           <div class="sm:col-span-1">
            <label for="email" class="block text-sm font-medium text-gray-700">Size</label>
            <div class="mt-1">
              <input v-model="form.size" type="text" name="email" id="email" class="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            </div>
          </div>
            <div class="sm:col-span-1">
            <label for="description" class="block text-sm font-medium text-gray-700">Estimate Date: </label>
            <div class="mt-1">
              <input v-model="form.date" type="date" name="description" id="description" class="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <div class="lg:grid lg:grid-cols-12 lg:gap-x-6">
            <!-- Formulas Sidebar (Left) -->
            <div class="lg:col-span-3">
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-bold text-gray-900 flex items-center uppercase tracking-wider">
                           <Calculator class="h-4 w-4 mr-2 text-red-600" />
                           Formulas
                        </h3>
                        <div class="flex space-x-2">
                           <button @click="loadFormulas" type="button" class="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600" title="Reload Formulas">
                               <RefreshCw class="h-4 w-4" />
                           </button>
                           <NuxtLink to="/setups/formula-builder" target="_blank" class="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600" title="Add Formula">
                               <Plus class="h-4 w-4" />
                           </NuxtLink>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div v-if="isLoadingFormulas" class="flex flex-col items-center justify-center py-8 text-gray-500">
                           <Loader2 class="h-6 w-6 animate-spin text-red-500 mb-2" />
                           <p class="text-xs">Loading formulas...</p>
                        </div>
                        <div v-else-if="availableFormulas.length === 0" class="text-xs text-gray-500 text-center py-4">
                           No formulas created yet.
                        </div>
                        <div v-for="formula in availableFormulas" :key="formula.id" 
                           draggable="true" 
                           @dragstart="onDragStart($event, formula)"
                           @dragend="onDragEnd"
                           class="bg-white border border-gray-200 rounded-md p-2 cursor-grab hover:shadow-md transition-all active:cursor-grabbing border-l-4"
                           :class="{'bg-blue-50/30': formula.isSystemDefault}"
                           :style="{ borderLeftColor: formula.estimateTypeHexColour || (formula.isSystemDefault ? '#3b82f6' : '#e5e7eb') }">
                           <div class="flex justify-between items-start">
                             <p class="text-xs font-medium text-gray-900 truncate" :class="{'text-blue-800 font-bold': formula.isSystemDefault}">{{ formula.name }}</p>
                             <Zap v-if="formula.isSystemDefault" class="h-3 w-3 text-blue-500" />
                           </div>
                           <p v-if="!formula.isSystemDefault" class="text-[10px] text-gray-500 mt-1 truncate" :title="formula.expression">{{ formula.expression }}</p>
                           <p v-else class="text-[9px] text-blue-600/70 mt-1 uppercase tracking-wider font-bold">System Plugin</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Estimate Sheet (Center) -->
            <div class="lg:col-span-9 mt-8 lg:mt-0">
                <div class="border-t border-gray-200 pt-8 lg:border-t-0 lg:pt-0">
                    <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Estimation Sheet</h3>
                    
                    <div class="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-hidden">
                        <div class="max-h-[600px] overflow-y-auto" ref="tableContainer">
                            <table class="min-w-full divide-y divide-gray-300 border border-gray-200">
                                <thead class="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Description</th>
                                    <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Qty</th>
                                    <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Unit Price</th>
                                    <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Total</th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span class="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white transition-colors"
                                :class="{ 'bg-red-50 border-2 border-dashed border-red-400': isDragOverTable }"
                                @dragover.prevent="onDragOver" 
                                @dragleave.prevent="onDragLeave"
                                @drop.prevent="onDrop">
                                
                                <template v-for="(item, index) in form.details" :key="index">
                                    <!-- Main Row -->
                                    <tr v-if="!item.isPercentagePlugin" :class="{ 'bg-gray-50': item.isFormula || item.isDerived }">
                                        <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-[200px]">
                                            <div class="flex items-center">
                                                <Calculator v-if="item.isFormula" class="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                                <Link2 v-if="item.isDerived" class="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                                                <input v-model="item.itemName" type="text" class="table-input" placeholder="Item Name" />
                                            </div>
                                        </td>
                                        <!-- <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-24">
                                            <input v-model.number="item.quantity" :disabled="item.isFormula || item.isDerived" type="number" min="0" class="table-input text-right disabled:bg-gray-100 disabled:text-gray-500" />
                                        </td> -->
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-24">
                                            <input v-model.number="item.quantity" type="number" min="0" class="table-input text-right" />
                                        </td> 
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-32">
                                            <input v-model.number="item.unitPrice" type="number" min="0" step="0.01" class="table-input text-right" />
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900 font-medium w-32">
                                            {{ item.isSteppingStone ? formatCurrency(0) : formatCurrency(item.quantity * item.unitPrice) }}
                                        </td>
                                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 w-16">
                                            <button @click="removeItem(index)" type="button" class="text-red-600 hover:text-red-900" title="Remove Item">
                                                <Trash2 class="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                    
                                      <!-- Embedded Variables Row for Formulas -->
                                    <tr v-if="item.isFormula" class="bg-gray-50 border-t-0">
                                       <td colspan="5" class="pb-4 pt-1 pl-12 pr-6">
                                          <div class="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                             <div class="flex justify-between items-center mb-2">
                                                 <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Formula Inputs: {{ item.expression }}</div>
                                                 <label class="flex items-center cursor-pointer group">
                                                     <div class="relative">
                                                         <input type="checkbox" v-model="item.isSteppingStone" class="sr-only" @change="recalculateAllFormulas" />
                                                         <div class="block w-8 h-5 rounded-full shadow-inner transition-colors" :class="item.isSteppingStone ? 'bg-green-500' : 'bg-gray-200 hover:bg-gray-300'"></div>
                                                         <div class="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform" :class="{ 'translate-x-3': item.isSteppingStone }"></div>
                                                     </div>
                                                     <span class="ml-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Interim Results</span>
                                                 </label>
                                             </div>
                                             <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                
                                                <div v-for="v in getVariablesForItem(item.expression)" :key="v.name" class="flex flex-col">
                                                   <label class="text-[10px] text-gray-500 mb-1 font-medium truncate" :title="v.name">{{ v.name }}</label>
                                                   <input v-model.number="v.value" type="number" step="0.01" class="border-gray-300 rounded shadow-sm text-sm focus:border-red-500 focus:ring-red-500 px-2 py-1" />
                                                </div>
                                                
                                             </div>
                                          </div>
                                       </td>
                                    </tr>

                                    <!-- Row for Percentage Plugin -->
                                    <tr v-if="item.isPercentagePlugin" class="bg-blue-50">
                                        <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-[200px]">
                                            <div class="flex items-center">
                                                <Zap class="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                                                <input v-model="item.itemName" type="text" class="table-input border-blue-200 bg-white" placeholder="Name (e.g. Discount)" />
                                            </div>
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-24">
                                            <input v-model.number="item.quantity" disabled type="number" min="0" class="table-input text-right bg-gray-100 text-gray-500 border-transparent" />
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-32">
                                            <input v-model.number="item.unitPrice" type="number" min="0" step="0.01" class="table-input text-right" />
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900 font-medium w-32">
                                            {{ formatCurrency(item.quantity * item.unitPrice) }}
                                        </td>
                                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 w-16">
                                            <button @click="removeItem(index)" type="button" class="text-red-600 hover:text-red-900" title="Remove Item">
                                                <Trash2 class="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                    <!-- Configuration Row for Percentage Plugin -->
                                    <tr v-if="item.isPercentagePlugin" class="bg-blue-50 border-t-0">
                                       <td colspan="5" class="pb-4 pt-1 pl-12 pr-6">
                                          <div class="bg-white p-3 rounded-md border border-blue-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                                              <div class="flex items-center space-x-2">
                                                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Compute</label>
                                                  <input v-model.number="item.percentageRate" @input="recalculateAllFormulas" type="number" step="0.1" class="w-20 border-gray-300 rounded shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-1" placeholder="%" />
                                                  <span class="text-sm font-medium text-gray-600">%</span>
                                              </div>
                                              <div class="text-sm text-gray-400 font-medium">of</div>
                                              <div class="flex-1 max-w-xs">
                                                  <select v-model="item.percentageTarget" @change="recalculateAllFormulas" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                                      <option value="" disabled>Select Target</option>
                                                      <optgroup label="Global Variables">
                                                          <option v-for="v in form.variables" :key="v.systemName" :value="v.systemName">{{ v.name }}</option>
                                                      </optgroup>
                                                      <optgroup label="Computed Results">
                                                          <option v-for="(v, name) in computedResults" :key="name" :value="'RESULT:' + name">{{ name }}</option>
                                                      </optgroup>
                                                  </select>
                                              </div>
                                          </div>
                                       </td>
                                    </tr>
                                </template>
                                
                                <tr v-if="form.details.length === 0">
                                   <td colspan="5" class="py-12 text-center text-sm text-gray-400 italic">
                                      Drag formulas from the left or results from the right here.
                                   </td>
                                 </tr>
                            </tbody>
                        </table>
                        </div>
                        <div class="p-4 bg-gray-50 border-t border-gray-200">
                            <button @click="addRegularItem" type="button" class="flex items-center text-sm font-medium text-red-600 hover:text-red-700">
                                <Plus class="h-4 w-4 mr-1" />
                                Add Item
                            </button>
                        </div>
                    </div>

                    <!-- Summary & Totals (Now under Sheet) -->
                    <div class="mt-12 border-t-2 border-gray-200 pt-10 flex justify-end">
                        <div class="w-full">
                            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
                                <h3 class="text-lg font-medium text-gray-900 mb-4">Summary</h3>
                                <div class="space-y-4">

                                    <div class="flex justify-between text-sm text-gray-600">
                                        <span>Sub Total</span>
                                        <span class="font-medium">{{ formatCurrency(subTotal) }}</span>
                                    </div>

                                    <div class="flex justify-between text-sm text-gray-600">
                                        <span>Unit Cost of Production</span>
                                        <span class="font-medium">{{ formatCurrency(unitCostOfProduction) }}</span>
                                    </div>
                                    
                                    <div class="flex justify-between items-center text-sm text-gray-600">
                                        <span class="flex items-center space-x-2">
                                            <span>Margin (%)</span>
                                            <input v-model.number="form.marginPercentage" type="number" min="0" max="100" class="w-16 h-8 border border-gray-300 rounded-md text-right text-sm focus:border-red-500 focus:ring-red-500" />
                                        </span>
                                        <span class="font-medium">{{ formatCurrency(marginAmount) }}</span>
                                    </div>

                                    <div class="flex justify-between text-sm text-gray-600">
                                        <span>Sub Total + Margin</span>
                                        <span class="font-medium">{{ formatCurrency(subTotal + marginAmount) }}</span>
                                    </div>


                                    <div class="flex justify-between text-sm text-gray-600 font-medium border-t border-gray-200 pt-2">
                                        <span>Total Excl. VAT</span>
                                        <span>{{ formatCurrency(totalExclVat) }}</span>
                                    </div>

                                    <div class="flex justify-between items-center text-sm text-gray-600">
                                        <span>NHIS/GETFUND ({{ nhisGetFundRate }}%)</span>
                                        <span class="font-medium">{{ formatCurrency(nhisGetFundAmount) }}</span>
                                    </div>

                                    <div class="flex justify-between items-center text-sm text-gray-600">
                                        <span>VAT ({{ vatRate }}%)</span>
                                        <span class="font-medium">{{ formatCurrency(vatAmount) }}</span>
                                    </div>

                                    <div class="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-4">
                                        <span>Grand Total</span>
                                        <span>{{ formatCurrency(grandTotal) }}</span>
                                    </div>

                                    <div class="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <label for="save-template" class="text-sm font-medium text-gray-700 flex flex-col cursor-pointer">
                                            <span>Save as Template</span>
                                            <span class="text-[10px] text-gray-500 font-normal">Keep this configuration for future estimates</span>
                                        </label>
                                        <div class="relative flex items-center cursor-pointer" @click="form.isTemplate = !form.isTemplate">
                                            <input type="checkbox" id="save-template" v-model="form.isTemplate" class="sr-only" />
                                            <div class="block w-10 h-6 rounded-full shadow-inner transition-colors border border-gray-200" :class="form.isTemplate ? 'bg-red-500 border-red-500' : 'bg-gray-100 hover:bg-gray-200'"></div>
                                            <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm" :class="{ 'translate-x-4': form.isTemplate }"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="mt-8 grid grid-cols-2 gap-3">
                                    <button @click="submitEstimate" :disabled="isSubmitting" class="btn-primary flex justify-center items-center py-2.5">
                                        <div v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </div>
                                        Save Estimate
                                    </button>
                                    <NuxtLink to="/estimates" class="inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        Cancel
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { Plus, Trash2, Download, Calculator, Zap, Link2, ArrowRightLeft, Loader2, Package, User, Phone, Mail, Hash, RefreshCw } from 'lucide-vue-next';
import type { FormulaVariable, Formula, ProductionRequest } from "~/models";
import { getProductionRequestDetails } from '~/services/productionRequests';
const { $toast } = useNuxtApp();
const router = useRouter();
const { evaluateExpression, extractPlaceholders } = useFormulaEvaluator();

const tableContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
    await nextTick();
    if (tableContainer.value) {
        tableContainer.value.scrollTop = tableContainer.value.scrollHeight;
    }
};

const getTodayFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Constants for Tax Rates
const NHIS_GETFUND_RATE = 2.5 + 2.5; // Example combined rate
const VAT_RATE = 15; // Example Standard VAT

// State
const isSubmitting = ref(false);
const nhisGetFundRate = ref(5.0); // Default, editable if needed? Keeping it static for now as per usual standard
const vatRate = ref(15.0); // Standard VAT

const form = reactive({
    businessName: '',
    jobName: '',
    quantity: '',
    size: '',
    date: getTodayFormatted(), 
    marginPercentage: 40, 
    isTemplate: false,
    estimateTypeId: '',
    estimateTypeName: '',
    productionRequestId: '',
    productionRequestNumber: '',
    variables: [] as { name: string, systemName: string, value: number }[],
    details: [
        
    ] as any[]
});

const filters = reactive({
  pageNo: 1,
  pageSize: 1000,
  estimateTypeId: ''
});

// Drag and Drop formula state
const availableFormulas = ref<Formula[]>([]);
const globalVariables = ref<FormulaVariable[]>([]);
const computedResults = ref<Record<string, number>>({});
const isDraggingFormula = ref(false);
const isDragOverTable = ref(false);
const isDraggingResult = ref(false);
const isLoadingFormulas = ref(false);


const getAllVariables = async () => {
    try {
        let result = await getVariables(filters);
        globalVariables.value = result.data;
    } catch (e) {
        console.error('Error loading variables:', e);
    }
}

const getAllFormulas = async () => {
    isLoadingFormulas.value = true;
    try {
        let result = await getFormulas(filters);
        availableFormulas.value = [
            {
                id: 'system-plugin-percentage',
                name: 'Percentage Plugin (%)',
                expression: 'system-plugin-percentage',
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
    } catch (error) {
        console.error('Error loading formulas:', error);
        $toast.error('Failed to load formulas');
    } finally {
        isLoadingFormulas.value = false;
    }
}



// Computed Calculations
const subTotal = computed(() => {
    return form.details.reduce((sum, item) => {
        if (item.isSteppingStone) return sum;
        return sum + (item.quantity * item.unitPrice);
    }, 0);
});

const unitCostOfProduction = computed(() => {
    const qty = parseFloat(form.quantity as any) || 0;
    if (qty <= 0) return 0;
    return subTotal.value / qty;
});

const marginAmount = computed(() => {
    return subTotal.value * (form.marginPercentage / 100);
});

const totalExclVat = computed(() => {
    return subTotal.value + marginAmount.value;
});

const nhisGetFundAmount = computed(() => {
    return totalExclVat.value * (nhisGetFundRate.value / 100);
});

const vatAmount = computed(() => {
    const baseForVat = totalExclVat.value + nhisGetFundAmount.value;
    return baseForVat * (vatRate.value / 100);
});

const grandTotal = computed(() => {
    return totalExclVat.value + nhisGetFundAmount.value + vatAmount.value;
});


// Helper Methods
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value);
};

const addItem = () => {
    form.details.push({
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        isFormula: false
    });
};

const removeItem = (index: number) => {
    form.details.splice(index, 1);
    syncFormVariables();
};

const extractVariables = (expression: string) => {
    return extractPlaceholders(expression);
};

const normalizeName = (name: string) => name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

const syncFormVariables = () => {

    const allRequiredVars = new Set<string>();
    
    // Collect all unique variables used in all formulas
    form.details.forEach(item => {
        if (item.isFormula && item.expression) {
            const vars = extractVariables(item.expression);
            vars.forEach(v => allRequiredVars.add(v));
        }
    });

    const computedItemNames = form.details.map(d => normalizeName(d.itemName));

    // Remove variables from form.variables that are no longer needed
    // or that are now computed by an item in the sheet
    form.variables = form.variables.filter(fv => {
        const isRequired = allRequiredVars.has(fv.systemName);
        const isComputed = computedItemNames.includes(normalizeName(fv.systemName));
        return isRequired && !isComputed;
    });

    // Add new variables from formulas
    allRequiredVars.forEach(vName => {
        const normalizedVName = normalizeName(vName);
        
        // Skip if this variable is actually computed by another formula item in the sheet
        if (computedItemNames.includes(normalizedVName)) {
            return;
        }

        if (!form.variables.find(fv => fv.systemName === vName)) {
            const globalVar = globalVariables.value.find(gv => normalizeName(gv.systemName) === normalizedVName);
            let initialValue = globalVar ? parseFloat(globalVar.defaultValue) || 0 : 0;
            
            for (const [key, val] of Object.entries(computedResults.value)) {
                if (normalizeName(key) === normalizedVName) {
                    initialValue = val;
                    break;
                }
            }

            form.variables.push({
                name: globalVar?.name || vName,
                systemName: globalVar?.systemName || vName,
                value: initialValue
            });
        }
    });
};

const evaluateFormula = (expression: string, values: Record<string, number>): number => {
    return evaluateExpression(expression, values);
};

const recalculateAllFormulas = () => {
    const varMap: Record<string, number> = {};
    
    // 1. Load global/user-defined variables
    form.variables.forEach(v => {
        varMap[v.systemName] = v.value || 0;
    });

    // 2. Recursive evaluation (multi-pass to handle dependencies)
    // We do up to 5 passes to resolve cascading formulas (e.g., A -> B -> C)
    const MAX_PASSES = 5;
    let hasChanged = true;
    let pass = 0;

    const results: Record<string, number> = {};

    while (hasChanged && pass < MAX_PASSES) {
        hasChanged = false;
        pass++;
        console.log(`[create.vue] Calculation Pass #${pass}...`);

        form.details.forEach(item => {
            if (item.isPercentagePlugin) {
                 const context = { ...varMap, ...results };
                 let targetVal = 0;
                 if (item.percentageTarget) {
                     if (item.percentageTarget.startsWith('RESULT:')) {
                         const rName = item.percentageTarget.replace('RESULT:', '');
                         targetVal = results[rName] || 0;
                     } else {
                         targetVal = context[item.percentageTarget] || 0;
                     }
                 }
                 const newResult = (targetVal * (item.percentageRate || 0)) / 100;
                 const roundedResult = Math.round(newResult * 10000) / 10000;
                 
                 item.formulaOutput = roundedResult; // Keep track of latest calculation

                 if (item.quantity !== roundedResult) {
                     item.quantity = roundedResult;
                     hasChanged = true;
                 }
                 results[item.itemName] = roundedResult;
            } else if (item.isFormula && item.expression) {
                // Combine global vars with current computed results for this pass
                const context = { ...varMap, ...results };
                const newResult = evaluateFormula(item.expression, context);
                const roundedResult = Math.round(newResult * 10000) / 10000;

                if (item.formulaOutput !== roundedResult) {
                    item.formulaOutput = roundedResult;
                    hasChanged = true;
                }

                // Sync quantity unless it's a stepping stone
                if (!item.isSteppingStone && item.quantity !== roundedResult) {
                    item.quantity = roundedResult;
                    hasChanged = true;
                }
                
                // Track results by formula name/ID for other formulas to use
                results[item.itemName] = roundedResult;
                if (item.formulaId) {
                    results[item.formulaId] = roundedResult;
                }
            } else if (item.isDerived && item.sourceId) {
                 // Update derived items from their source
                 const sourceValue = results[item.sourceName] || 0;
                 if (item.quantity !== sourceValue) {
                    item.quantity = sourceValue;
                    hasChanged = true;
                 }
            }
        });
    }

    // Only display human-readable names in the sidebar
    const displayable: Record<string, number> = {};
    form.details.forEach(item => {
        if (item.isFormula) {
            displayable[item.itemName] = item.formulaOutput || 0;
        } else if (item.isPercentagePlugin) {
            displayable[item.itemName] = item.formulaOutput || 0;
        }
    });
    computedResults.value = displayable;
};

const getVariablesForItem = (expression: string) => {
    if (!expression) return [];
    const systemNames = extractVariables(expression);
    return form.variables.filter(v => systemNames.includes(v.systemName));
};

// Watch for variable changes to trigger recalculation
watch(() => form.variables, () => {
    recalculateAllFormulas();
}, { deep: true });

// Drag & Drop for Library Formulas
const onDragStart = (event: DragEvent, formula: Formula) => {
    if (event.dataTransfer) {
        event.dataTransfer.setData('application/json', JSON.stringify(formula));
        event.dataTransfer.effectAllowed = 'copy';
    }
    isDraggingFormula.value = true;
};

const onDragEnd = () => {
    isDraggingFormula.value = false;
    isDraggingResult.value = false;
    isDragOverTable.value = false;
};

const onDragOver = (event: DragEvent) => {
    if (event.dataTransfer?.types.includes('application/json')) {
        event.dataTransfer.dropEffect = 'copy';
        isDragOverTable.value = true;
    }
};

const onDragLeave = () => {
    isDragOverTable.value = false;
};

// Drag & Drop for Computed Results
const onDragStartResult = (event: DragEvent, name: string, value: number) => {
    if (event.dataTransfer) {
        const payload = { type: 'computed', name, value };
        event.dataTransfer.setData('application/json', JSON.stringify(payload));
        event.dataTransfer.effectAllowed = 'copy';
    }
    isDraggingResult.value = true;
};

const onDrop = (event: DragEvent) => {
    isDragOverTable.value = false;
    isDraggingFormula.value = false;
    isDraggingResult.value = false;
    
    try {
        const rawData = event.dataTransfer?.getData('application/json');
        if (!rawData) return;
        
        const data = JSON.parse(rawData);
        
        if (data.type === 'computed') {
             // Add derived item
             const newItem = {
                itemName: data.name,
                quantity: data.value,
                unitPrice: 1,
                isFormula: false,
                isDerived: true,
                sourceName: data.name,
                sourceId: data.name // Using name as ID for matching
            };
            form.details.push(newItem);
            $toast.success(`Result "${data.name}" added to sheet`);
        } else {
            // It's a formula blueprint
            const formula = data as any;
            if (formula.id === 'system-plugin-percentage') {
                const newItem = {
                    itemName: 'Percentage',
                    quantity: 1,
                    unitPrice: 1,
                    isFormula: false,
                    isPercentagePlugin: true,
                    percentageTarget: '',
                    percentageRate: 0,
                };
                form.details.push(newItem);
                $toast.success(`Percentage Plugin added to sheet`);
            } else {
                const newItem = {
                    itemName: formula.name,
                    quantity: 1,
                    unitPrice: 0,
                    isFormula: true,
                    isSteppingStone: false,
                    formulaOutput: 0,
                    formulaId: formula.id,
                    expression: formula.expression
                };
                form.details.push(newItem);
                syncFormVariables();
                $toast.success(`Formula "${formula.name}" added to sheet`);
            }
        }
        
        // Trigger recalculation
        recalculateAllFormulas();
        scrollToBottom();
        
    } catch (e) {
        console.error('Drop error', e);
    }
};

const recalculateFormula = (item: any) => {
    // This is now redundant with watcher but kept for template calls if any
    recalculateAllFormulas();
};

const addRegularItem = () => {
    form.details.push({
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        isFormula: false
    });
    scrollToBottom();
};

const submitEstimate = async () => {
    if (!form.businessName) {
        $toast.error('Please enter a business name');
        return;
    }

    isSubmitting.value = true;

    // Filter out items with 0 total to keep payload clean? Or keep all?
    // Let's keep items with quantity > 0
    const validDetails = form.details.filter(d => d.quantity > 0 && d.unitPrice > 0);
    
    // Construct payload capturing EXACT frontend state
    const payload = {
        businessName: form.businessName,
        jobName: form.jobName,
        quantity: form.quantity,
        size: form.size,
        date: form.date,
        marginPercentage: form.marginPercentage,
        isTemplate: form.isTemplate,
        
        // Summary Results (Pre-calculated for immediate display on retrieval)
        summary: {
            subTotal: subTotal.value,
            unitCostOfProduction: unitCostOfProduction.value,
            marginAmount: marginAmount.value,
            totalExclVat: totalExclVat.value,
            nhisGetFundAmount: nhisGetFundAmount.value,
            vatAmount: vatAmount.value,
            grandTotal: grandTotal.value,
            taxRates: {
                nhisGetFund: nhisGetFundRate.value,
                vat: vatRate.value
            }
        },

        // Full Sheet State (Including Formulas and Plugins)
        details: form.details.map(d => ({
            ...d,
            id: d.id || crypto.randomUUID()
        })),

        // Variable Context (For formula recalculation)
        variables: form.variables,

        estimateTypeId: form.estimateTypeId,
        estimateTypeName: form.estimateTypeName,
        productionRequestId: form.productionRequestId || undefined,
        productionRequestNumber: form.productionRequestNumber || undefined,
        // Legacy/Compatibility fields (if the backend uses these for reporting)
        estimatedCost: grandTotal.value,
        description: `${form.jobName || 'Estimate'} (Qty: ${form.quantity}, Size: ${form.size})`,
        taxes: [
            { taxName: 'NHIS/GETFUND', rate: nhisGetFundRate.value, isPercentage: true, taxAmount: nhisGetFundAmount.value },
            { taxName: 'VAT', rate: vatRate.value, isPercentage: true, taxAmount: vatAmount.value }
        ]
    };

    try {
        const success = await createProductionEstimate(payload);
        if (success) {
            $toast.success('Estimate saved successfully!');
            router.push('/estimates');
        } else {
             $toast.error('Failed to save estimate.');
        }
    } catch (error) {
        console.error(error);
        $toast.error('An error occurred while saving.');
    } finally {
        isSubmitting.value = false;
    }
};

const downloadPdf = async () => {
    if (import.meta.server) return; 

    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('estimate-form');
    
    // Clone node to modify for PDF (e.g. remove buttons) if needed, 
    // or just use CSS print media queries. For simplicity, we just print the div.
    
    const opt = {
        margin: 0.5,
        filename: `Estimate-${form.businessName || 'New'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' } 
    };

    try {
        $toast.info('Generating PDF...');
        await html2pdf().from(element).set(opt).save();
        $toast.success('PDF downloaded successfully');
    } catch(err) {
        console.error(err);
        $toast.error('Failed to generate PDF');
    }
}

const productionRequestDetails = ref<ProductionRequest | null>(null);

onMounted(async () => {
    const route = useRoute();
    if (route.query.estimateTypeId) {
        filters.estimateTypeId = route.query.estimateTypeId as string;
        form.estimateTypeId = route.query.estimateTypeId as string;
    }
    if (route.query.estimateTypeName) {
        form.estimateTypeName = route.query.estimateTypeName as string;
    }

    // Pre-populate from a production request if navigated from one
    if (route.query.productionRequestId) {
        form.productionRequestId = route.query.productionRequestId as string;
        
        try {
            const details = await getProductionRequestDetails({ id: form.productionRequestId });
            if (details) {
                productionRequestDetails.value = details;
                form.productionRequestNumber = details.requestNumber;
                form.businessName = details.customerName;
                form.estimateTypeId = details.serviceCategoryId;
                form.jobName = details.jobName;
                form.quantity = details.quantity;
                form.size = details.size || '';
            }
        } catch (error) {
            console.error('Error fetching production request details:', error);
            $toast.error('Unable to fetch production request details');
        }
    }
    
    await getAllFormulas();
    await getAllVariables();
});

</script>

<style scoped>
.input-field {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
}

.table-input {
    @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm;
    padding: 0.375rem 0.5rem;
    border: 1px solid #d1d5db;
}

.input-field:focus, .table-input:focus {
    outline: none;
    border-color: #ef4444;
}

/* Remove number input spinner arrows */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}

/* Print styles */
@media print {
    .btn-secondary, .btn-primary, .md\:flex.md\:items-center.md\:justify-between, button {
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