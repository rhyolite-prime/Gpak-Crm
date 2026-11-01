<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/production-execution/analysis" class="text-xs text-gray-500 hover:text-gray-900 flex items-center mb-2">
            &larr; Back to List
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">Post Production Analysis</h1>
        <p class="text-gray-500">Work Order: <span class="font-medium text-gray-900">{{ $route.params.id }}</span></p>
      </div>
      <div class="flex space-x-3">
        <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            Export PDF
        </button>
        <button class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
            Save Analysis
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Analysis Table</h2>
        
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
                    <th class="p-3 border-r border-gray-200 w-1/4">Materials / Process</th>
                    <th class="p-3 border-r border-gray-200 w-1/4 text-right">Estimated</th>
                    <th class="p-3 border-r border-gray-200 w-1/4 text-right">Actual</th>
                    <th class="p-3 w-1/4 text-right">Variance</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
                <tr v-for="(item, index) in analysisItems" :key="index" class="hover:bg-gray-50">
                    <td class="p-3 border-r border-gray-100 font-medium text-gray-700">{{ item.name }}</td>
                    
                    <!-- Estimated (Read-only) -->
                    <td class="p-3 border-r border-gray-100 text-right text-gray-600">
                        {{ formatCurrency(item.estimated) }}
                    </td>
                    
                    <!-- Actual (Editable) -->
                    <td class="p-3 border-r border-gray-100 text-right">
                        <input 
                            type="number" 
                            v-model.number="item.actual" 
                            class="w-full text-right bg-transparent focus:outline-none focus:bg-blue-50 border-b border-transparent focus:border-blue-300 py-1"
                            placeholder="0.00"
                        />
                    </td>
                    
                    <!-- Variance (Calculated) -->
                    <td class="p-3 text-right font-medium" :class="getVarianceClass(item)">
                        {{ formatCurrency(item.estimated - (item.actual || 0)) }}
                    </td>
                </tr>
            </tbody>
            <tfoot class="bg-gray-50 font-bold text-gray-900 border-t border-gray-200">
                <tr>
                    <td class="p-3 border-r border-gray-200">Total</td>
                    <td class="p-3 border-r border-gray-200 text-right">{{ formatCurrency(totalEstimated) }}</td>
                    <td class="p-3 border-r border-gray-200 text-right">{{ formatCurrency(totalActual) }}</td>
                    <td class="p-3 text-right" :class="totalEstimated - totalActual >= 0 ? 'text-green-600' : 'text-red-600'">
                        {{ formatCurrency(totalEstimated - totalActual) }}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

const analysisItems = ref([
    { name: 'Plate', estimated: 500, actual: 500 },
    { name: 'Paper Inside', estimated: 2000, actual: 2100 },
    { name: 'Paper Cover', estimated: 800, actual: 800 },
    { name: 'Inks', estimated: 400, actual: 350 },
    { name: 'Design', estimated: 1200, actual: 1200 },
    { name: 'Printing', estimated: 1500, actual: 0 },
    { name: 'Folding', estimated: 300, actual: 0 },
    { name: 'Collating', estimated: 200, actual: 0 },
    { name: 'Saddle Stitching', estimated: 450, actual: 0 },
    { name: 'Perfect Binding', estimated: 0, actual: 0 },
    { name: 'Folder / Gluer', estimated: 0, actual: 0 },
    { name: '3 Knife Trimmer', estimated: 100, actual: 0 },
    { name: 'Guillotine', estimated: 150, actual: 0 },
    { name: 'Laminate', estimated: 600, actual: 0 },
    { name: 'Renz Binder', estimated: 0, actual: 0 },
]);

const totalEstimated = computed(() => analysisItems.value.reduce((sum, item) => sum + item.estimated, 0));
const totalActual = computed(() => analysisItems.value.reduce((sum, item) => sum + (item.actual || 0), 0));

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value);
};

const getVarianceClass = (item) => {
    const variance = item.estimated - (item.actual || 0);
    return variance >= 0 ? 'text-green-600' : 'text-red-600';
};
</script>
