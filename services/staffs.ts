import type { Staff, BaseApiResponse, BasePaginationModel,} from "~/models";

 

export async function getStaffs(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Staff[]>>>('staff/getall', { query });
  return response.result;
}

export async function createStaff(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('staff/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateStaff(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('staff/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteStaff(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`staff/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}