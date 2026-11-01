<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>

import type { ProductionOrder, ProductionRequest } from "~/models";

import { 
  CheckCircle, 
  User,
  Package,
  ArrowLeft,
  ArrowRight
} from 'lucide-vue-next'

const route = useRoute();

useHead({
  title: 'Confirm Quotation'
})

const quotationInfo = ref<ProductionOrder>(null);
const productionRequestDetails = ref<ProductionRequest>(null);

async function getQuotationDetails(id: string) {
  if (!id) return

  try {
    const res = await fetch(
      `https://devops.graphic.com.gh/api/services/app/Quotation/GetDetails?id=${id}`,
      {
        method: 'GET',
        headers: {
          'AccountSecret': 'w4yDB9kO',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!res.ok) throw new Error('Failed to fetch quotation details')
    const data = await res.json()
    console.log('Products:', data)
    // adjust based on actual structure
    quotationInfo.value = data.result.quotationInfo;
    productionRequestDetails.value = data.result.productionRequestDetails;
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}


onMounted(async () => {
  await getQuotationDetails(route.params.id);
})

</script>

<style>

</style>