import type { FormulaVariable, Formula, BaseApiResponse, BasePaginationModel,} from "~/models";


// --- Variables ---

export async function getVariables(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<FormulaVariable[]>>>('formula/getvariables', { query });
  return response.result;
}


export async function createVariable(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('formula/createvariable', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateVariable(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('formula/updatevariable', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteVariable(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`formula/deletevariable?id=${id}`, {
    method: "delete",
  });
  return response.success;
}

// --- Formulas ---

export async function getFormulas(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<Formula[]>>>('formula/getformulas', { query });
  return response.result;
}


export async function createFormula(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('formula/createformula', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateFormula(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('formula/updateformula', {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteFormula(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`formula/deleteformula?id=${id}`, {
    method: "delete",
  });
  return response.success;
}