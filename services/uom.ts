import type { Uom , BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getUnitOfMeasures(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Uom[]>>>('unitofmeasure/getall', { query });
  return response.result;
}

export async function createUnitOfMeasure(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('unitofmeasure/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateUnitOfMeasure(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('unitofmeasure/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteUnitOfMeasure(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`unitofmeasure/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}