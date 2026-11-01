import type { BaseApiResponse, FinishingPrice } from '~/models'


export async function getFinishingPrices(query: object) {
 
  const response = await httpClient<BaseApiResponse<FinishingPrice>>('FinishingOptionPrice/ListAll', { query });
  return response.result;
}

export async function createFinishingPrice(payload: object) {

  const response = await httpClient<BaseApiResponse<object>>('FinishingOptionPrice/create', { method: 'post', body: payload })
  return response.success;
}
