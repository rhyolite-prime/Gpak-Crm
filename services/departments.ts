import type { Department, BaseApiResponse, BasePaginationModel,} from "~/models";


export async function getDepartments(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Department[]>>>('department/getall', { query });
  return response.result;
}

export async function createDepartment(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('department/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateDepartment(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('department/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteDepartment(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`department/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}