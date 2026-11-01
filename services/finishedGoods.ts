import type { FinishedGoods, BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getFinishedGoods(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<FinishedGoods[]>>>('finishedgood/getall', { query });
  return response.result;
}

export async function createFinishedGood(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('finishedgood/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateFinishedGood(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('finishedgood/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteFinishedGood(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`finishedgood/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}