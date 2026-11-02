import type { BaseApiResponse, FinishingPrice } from '~/models'


export async function getFinishingPrices(query: object = {}) {
 
  const response = await httpClient<BaseApiResponse<FinishingPrice | null>>('FinishingOptionPrice/ListAll', { query });
  if (response.success === false) throw new Error(response.error?.message || 'Unable to load finishing prices.')
  return response.result;
}

export async function createFinishingPrice(payload: object) {

  const response = await httpClient<BaseApiResponse<object>>('FinishingOptionPrice/create', { method: 'post', body: payload })
  return response.success;
}
