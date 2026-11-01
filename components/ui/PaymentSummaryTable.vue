<template>
  <div class="payment-summary-container">
    <h2 class="text-xl font-bold mb-4">Payment Summary by Year</h2>
    
    <!-- Loading state -->
    <div v-if="loading" class="py-10 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p class="mt-2 text-gray-600">Loading payment data...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="py-10 text-center text-red-600">
      <p>{{ error }}</p>
      <button @click="fetchData" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Try Again
      </button>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!hasData" class="py-10 text-center text-gray-500">
      <p>No payment data available.</p>
    </div>
    
    <!-- Data table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-3 px-4 text-left font-semibold text-gray-700 border-b">Name</th>
            <th 
              v-for="year in years" 
              :key="year" 
              class="py-3 px-4 text-right font-semibold text-gray-700 border-b"
            >
              {{ year }}
            </th>
            <th class="py-3 px-4 text-right font-semibold text-gray-700 border-b">Total</th>
          </tr>
        </thead>
        <tbody>
          <!-- Payment rows for each person -->
          <tr 
            v-for="row in processedData" 
            :key="row.id" 
            class="hover:bg-gray-50 border-b"
          >
            <td class="py-3 px-4 text-left">{{ row.name }}</td>
            <td 
              v-for="year in years" 
              :key="`${row.id}-${year}`" 
              class="py-3 px-4 text-right"
            >
              {{ formatCurrency(row.yearlyAmounts[year] || 0) }}
            </td>
            <td class="py-3 px-4 text-right font-semibold">
              {{ formatCurrency(row.total) }}
            </td>
          </tr>
          
          <!-- Totals row -->
          <tr class="bg-gray-100 font-bold">
            <td class="py-3 px-4 text-left">Total</td>
            <td 
              v-for="year in years" 
              :key="`total-${year}`" 
              class="py-3 px-4 text-right"
            >
              {{ formatCurrency(yearlyTotals[year] || 0) }}
            </td>
            <td class="py-3 px-4 text-right">
              {{ formatCurrency(grandTotal) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Define the types for our data structure
interface Payment {
  id: number;
  amount: number;
  date: string;
}

interface Person {
  id: number;
  name: string;
  payments: Payment[];
}

interface ProcessedPerson {
  id: number;
  name: string;
  yearlyAmounts: Record<string, number>;
  total: number;
}

// Props for the component
const props = defineProps({
  // Option to fetch data from an API endpoint
  apiUrl: {
    type: String,
    default: null
  },
  // Option to pass data directly to the component
  paymentData: {
    type: Array as () => Person[],
    default: () => []
  }
});

// Component state
const loading = ref(false);
const error = ref('');
const data = ref<Person[]>([]);

// Computed properties for data processing
const hasData = computed(() => data.value.length > 0);

// Extract all unique years from the data
const years = computed(() => {
  const yearSet = new Set<string>();
  
  data.value.forEach(person => {
    person.payments.forEach(payment => {
      const year = new Date(payment.date).getFullYear().toString();
      yearSet.add(year);
    });
  });
  
  return [...yearSet].sort();
});

// Process data for display in the table
const processedData = computed(() => {
  return data.value.map(person => {
    const yearlyAmounts: Record<string, number> = {};
    let total = 0;
    
    person.payments.forEach(payment => {
      const year = new Date(payment.date).getFullYear().toString();
      yearlyAmounts[year] = (yearlyAmounts[year] || 0) + payment.amount;
      total += payment.amount;
    });
    
    return {
      id: person.id,
      name: person.name,
      yearlyAmounts,
      total
    };
  });
});

// Calculate totals for each year
const yearlyTotals = computed(() => {
  const totals: Record<string, number> = {};
  
  processedData.value.forEach(person => {
    Object.entries(person.yearlyAmounts).forEach(([year, amount]) => {
      totals[year] = (totals[year] || 0) + amount;
    });
  });
  
  return totals;
});

// Calculate grand total
const grandTotal = computed(() => {
  return processedData.value.reduce((sum, person) => sum + person.total, 0);
});

// Format currency values
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Fetch data from API if URL provided
const fetchData = async () => {
  // If direct data is provided through props, use that
  if (props.paymentData && props.paymentData.length) {
    data.value = props.paymentData;
    return;
  }
  
  // Otherwise fetch from API if URL is provided
  if (!props.apiUrl) {
    error.value = 'No data source provided';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const response = await fetch(props.apiUrl);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    data.value = result;
  } catch (err) {
    console.error('Error fetching payment data:', err);
    error.value = 'Failed to load payment data. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Initialize the component
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.payment-summary-container {
  @apply bg-white rounded-lg shadow-sm p-6;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  white-space: nowrap;
}
</style>
