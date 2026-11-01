import type { Estimation , BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getProductionEstimates(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Estimation[]>>>('estimation/getall', { query });
  return response.result;
}

export async function getEstimateDetails(estimateId: string) {
 
  const response = await httpClient<BaseApiResponse<Estimation>>(`estimation/getdetails?id=${estimateId}`);
  return response.result;
}

export async function approveEstimate(payload: object) {
 
  const response = await httpClient<BaseApiResponse<object>>('estimation/approve', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function rejectEstimate(payload: object) {
 
  const response = await httpClient<BaseApiResponse<object>>('estimation/reject', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function checkIfEstimateExistsForRequestId(query: object) {
 
  const response = await httpClient<BaseApiResponse<boolean>>('estimation/checkifestimateexistsforrequestId', { query });
  return response.result;
}

export async function createProductionEstimate(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('estimation/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}


export async function updateProductionEstimate(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('estimation/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}


export async function getEstimateStats() {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Estimation[]>>>('estimation/getstats');
  return response.result;
}
 
export async function updateProductionEstimateStatus(payload: object) {
 
  const response = await httpClient<BaseApiResponse<object>>('estimation/updatestatus', {
    method: "post",
    body: payload,
  });
  return response.success;

}


export async function deleteEstimate(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`estimation/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}