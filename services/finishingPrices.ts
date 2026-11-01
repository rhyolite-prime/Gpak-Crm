import type { BaseApiResponse, BasePaginationModel } from '~/models'
import type { FinishingPriceRecord, FinishingPrices } from '~/utils/finishingPricing'

/** Proposed API contract. Confirm routes and response shapes with the backend before use. */
export type FinishingPrice = FinishingPriceRecord & { id: string; currency: 'GHS' }
export type CreateFinishingPriceRequest = FinishingPrices
export type UpdateFinishingPriceRequest = CreateFinishingPriceRequest & { id: string }
export type FinishingPriceQuery = {
  pageNo: number
  pageSize: number
  category?: FinishingPriceRecord['category']
  option?: string
}

export async function getFinishingPrices(query: FinishingPriceQuery) {
  const response = await httpClient<BaseApiResponse<BasePaginationModel<FinishingPrice[]>>>(
    'finishingprice/getall', { query: { ...query } },
  )
  return response.result;
}

export async function createFinishingPrice(payload: CreateFinishingPriceRequest) {
  const response = await httpClient<BaseApiResponse<object>>(
    'finishingprice/create', { method: 'post', body: payload },
  )
  return response.success;
}

export async function updateFinishingPrice(payload: UpdateFinishingPriceRequest) {
  const response = await httpClient<BaseApiResponse<object>>(
    'finishingprice/update', { method: 'post', body: payload },
  )
  return response.success;
}
