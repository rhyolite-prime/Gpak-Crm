import type { ProductionRequest, AdStats, ProductionRequestPaymentSummary, BaseApiResponse, BasePaginationModel,} from "~/models";


export async function getProductionRequest(query: object) {

  const response = await httpClient<BaseApiResponse<BasePaginationModel<ProductionRequest[]>>>('productionrequest/getall', { query });
  return response.result;
}


export async function getProductionRequestDetails(query: object) {

  const response = await httpClient<BaseApiResponse<ProductionRequest>>('productionrequest/getdetails', { query });
  return response.result;
}

export async function approveProductionRequest(payload: object) {
 
  const response = await httpClient<BaseApiResponse<object>>('productionrequest/approve', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function rejectProductionRequest(payload: object) {
 
  const response = await httpClient<BaseApiResponse<object>>('productionrequest/reject', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function getProductionRequestByNumber(requestNumber: string) {
  const response = await httpClient<BaseApiResponse<ProductionRequest>>(`productionrequest/ByRequestNumber/${requestNumber}`);
  return response.result;
}


export async function getPaymentsOnProductionRequest(query: object) {

  const response = await httpClient<BaseApiResponse<ProductionRequestPaymentSummary>>('productionrequest/getpayments', { query });
  return response.result;
}



export async function getProductionRequestStats() {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<AdStats[]>>>('productionrequest/getstats');
  return response.result;
}



export async function updateProductionRequestStatus(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('productionrequest/updateStatus', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function createProductionRequest(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('productionrequest/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateProductionRequest(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('productionrequest/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function advanceWorkflowStage(payload: { id: string; targetStageName: string }) {
  const response = await httpClient<BaseApiResponse<object>>('productionrequest/advanceWorkflowStage', {
    method: "post",
    body: payload,
  });
  return response.success;
}


export async function deleteProductionRequest(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`productionrequest/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}