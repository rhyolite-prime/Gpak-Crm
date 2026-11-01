import type { Product, BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getProducts(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Product[]>>>('product/getall', { query });
  return response.result;
}

export async function createProduct(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('product/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateProduct(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('product/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteProduct(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`product/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}