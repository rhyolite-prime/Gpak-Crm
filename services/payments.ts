import type { Payment, PaymentStats, BaseApiResponse, BasePaginationModel,} from "~/models";


export async function getPayments(query: object) {

  const response = await httpClient<BaseApiResponse<BasePaginationModel<Payment[]>>>('payment/getall', { query });
  return response.result;
}


export async function getPaymentStats(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<PaymentStats[]>>>('payment/getpaymentstats', { query });
  return response.result;
}

export async function updatePaymentStatus(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('payment/updatestatus', {
    method: "post",
    body: payload,
  });
  return response.success;
}