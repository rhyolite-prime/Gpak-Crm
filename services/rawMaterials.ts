import type { RawMaterial, BaseApiResponse, BasePaginationModel,} from "~/models";

export async function getRawMaterials(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<RawMaterial[]>>>('rawmaterial/getall', { query });
  return response.result;
}

export async function createRawMaterial(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('rawmaterial/create', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateRawMaterial(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('rawmaterial/update', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteRawMaterial(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`rawmaterial/delete?id=${id}`, {
    method: "delete",
  });
  return response.success;
}