import type { FinishingOption , BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getFinishingOptions(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<FinishingOption[]>>>('finishingoption/getall', { query });
  return response.result;
}

export async function createFinishingOption(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('finishingoption/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateFinishingOption(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('finishingoption/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteFinishingOption(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`finishingoption/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}