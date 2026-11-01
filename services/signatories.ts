import type { Signatory , BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getSignatories(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Signatory[]>>>('signatory/getall', { query });
  return response.result;
}

export async function createSignatory(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('signatory/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateSignatory(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('signatory/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteSignatory(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`signatory/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}