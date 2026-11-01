import type { Quotation , BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getQuotations(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Quotation[]>>>('quotation/getall', { query });
  return response.result;
}

export async function getQuotationDetails(query: object) {
 
  const response = await httpClient<BaseApiResponse<Quotation>>('quotation/getdetails', { query });
  return response.result;
}

export async function approveQuotation(payload: object) {
 
  const response = await httpClient<BaseApiResponse<object>>('quotation/approve', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function rejectQuotation(payload: object) {
 
  const response = await httpClient<BaseApiResponse<object>>('quotation/reject', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function sendQuotationToCustomer(query: object) {

  const response = await httpClient<BaseApiResponse<object>>('quotation/sendquotationtocustomer', { query });
  return response.success;
}

export async function createQuotation(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('quotation/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}


export async function updateQuotation(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('quotation/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}


export async function getQuotationStats() {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Quotation>>>('quotation/getstats');
  return response.result;
}
 
export async function updateQuotationStatus(payload: object) {
 
  const response = await httpClient<BaseApiResponse<object>>('quotation/updateStatus', {
    method: "post",
    body: payload,
  });
  return response.success;

}

export async function deleteQuotation(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`quotation/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}