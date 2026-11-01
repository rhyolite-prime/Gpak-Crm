import type { ProductCategory, BaseApiResponse, BasePaginationModel} from "~/models";

export async function getProductCategories(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<ProductCategory[]>>>('productcategory/getall', { query });
  return response.result;
}

export async function createProductCategory(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('productcategory/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateProductCategory(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('productcategory/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteProductCategory(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`productcategory/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}