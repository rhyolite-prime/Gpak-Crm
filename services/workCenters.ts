import type { WorkCenter , BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getWorkCenters(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<WorkCenter[]>>>('workcenter/getall', { query });
  return response.result;
}

export async function createWorkCenter(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('workcenter/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateWorkCenter(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('workcenter/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteWorkCenter(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`workcenter/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}