import type { WorkflowTransition, BaseApiResponse, BasePaginationModel } from "~/models";


export async function createWorkflowTransition(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('workflow/addtransition', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateWorkflowTransition(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('workflow/updatetransition', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteWorkflowTransition(workflowId: string, id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`workflow/deletetransition?workflowId=${workflowId}&stageId=${id}`, {
    method: "delete",
  });
  return response.success;
}
