import type { Invoice, InvoiceStats, BaseApiResponse, BasePaginationModel,} from "~/models";


export async function getInvoices(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Invoice[]>>>('invoice/getall', { query });
  return response.result;
}

export async function getInvoiceStats(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<InvoiceStats[]>>>('invoice/getStats', { query });
  return response.result;
}

export async function getInvoiceDetails(query: object) {

  const response = await httpClient<BaseApiResponse<Invoice>>('invoice/getDetails', { query });
  return response.result;
}