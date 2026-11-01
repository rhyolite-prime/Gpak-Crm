import type { EstimateType, BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getEstimateTypes(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<EstimateType[]>>>('estimatetype/getall', { query });
  return response.result;
}

export async function createEstimateType(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('estimatetype/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateEstimateType(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('estimatetype/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteEstimateType(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`estimatetype/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}