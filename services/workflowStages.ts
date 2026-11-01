import type { WorkflowStage, BaseApiResponse, BasePaginationModel } from "~/models";


export async function createWorkflowStage(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('workflow/addstage', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateWorkflowStage(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('workflow/updatestage', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteWorkflowStage(workflowId: string, id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`workflow/deletestage?workflowId=${workflowId}&stageId=${id}`, {
    method: "delete",
  });
  return response.success;
}
