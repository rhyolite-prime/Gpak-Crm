import type { ProductionOrder, ProductionOrderStats, BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getProductionOrders(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<ProductionOrder[]>>>('productionorder/getall', { query });
  return response.result;
}

export async function getProductionOrderStats() {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<ProductionOrderStats[]>>>('productionorder/getstats');
  return response.result;
}

export async function updateProductionOrder(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('productionorder/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateProductionOrderStatus(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('productionorder/updatestatus', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function cancelProductionOrder(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`productionorder/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}