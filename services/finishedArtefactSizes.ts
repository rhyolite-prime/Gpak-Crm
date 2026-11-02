import type { FinishedArtefactSize , BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getFinishedArtefactSizes(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<FinishedArtefactSize[]>>>('FinishedArtefactSize/getall', { query });
  return response.result;
}

export async function createFinishedArtefactSize(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('FinishedArtefactSize/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateFinishedArtefactSize(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('FinishedArtefactSize/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteFinishedArtefactSize(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`FinishedArtefactSize/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}