import type { QcChecklist , BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getQcChecklists(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<QcChecklist[]>>>('qcchecklist/getall', { query });
  return response.result;
}

export async function createQcChecklist(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('qcchecklist/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateQcChecklist(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('qcchecklist/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteQcChecklist(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`qcchecklist/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}