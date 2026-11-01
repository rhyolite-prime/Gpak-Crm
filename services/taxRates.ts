import type { TaxRate, BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getTaxRates(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<TaxRate[]>>>('taxrate/getall', { query });
  return response.result;
}

export async function createTaxRate(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('taxrate/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateTaxRate(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('taxrate/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteTaxRate(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`taxrate/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}