import type { Workflow , BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getProductionWorkflows(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Workflow[]>>>('workflow/getall', { query });
  return response.result;
}

export async function getWorkflowDetails(id: string) {
  const response = await httpClient<BaseApiResponse<Workflow>>(`workflow/getdetails?id=${id}`);
  return response.result;
}

export async function createProductionWorkflow(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('workflow/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateProductionWorkflow(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('workflow/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteProductionWorkflow(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`workflow/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}