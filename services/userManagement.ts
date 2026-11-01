import type { BaseApiResponse, BasePaginationModel, User , Role, RolePermision } from "~/models";

//users

export async function getUsers(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<User[]>>>('user/listall', { query });
    return response.result;
  }
  
  export async function activateUser(payload: object) {
    const response = await httpClient<BaseApiResponse<object>>('user/activate', {
      method: "post",
      body: payload,
    });
    return response.success;
  }

  export async function deactivateUser(payload: object) {
    const response = await httpClient<BaseApiResponse<object>>('user/deactivate', {
      method: "post",
      body: payload,
    });
    return response.success;
  }

  export async function createUser(payload: object) {
    const response = await httpClient<BaseApiResponse<object>>('user/create', {
      method: "post",
      body: payload,
    });
    return response.success;
  }
  
  export async function updateUser(payload: object) {
    const response = await httpClient<BaseApiResponse<object>>('user/update', {
      method: "post",
      body: payload,
    });
    return response.success;
  }
  
  export async function deleteUser(id: number) {
    const response = await httpClient<BaseApiResponse<object>>(`user/delete?id=${id}`, {
      method: "delete",
    });
    return response.success;
  }

//roles
export async function getRoles(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<Role[]>>>('role/listall', { query });
    return response.result;
}

export async function getPermissions() {
 
    const response = await httpClient<BaseApiResponse<RolePermision[]>>('role/listpermissions');
    return response.result;
}

export async function getGrantedPermissionsByRoleId(roleId: number) {
 
    const response = await httpClient<BaseApiResponse<RolePermision[]>>(`role/getgrantedpermissionsbyroleid?roleId=${roleId}`);
    return response.result;
  }
  
  export async function createRole(payload: object) {
    const response = await httpClient<BaseApiResponse<object>>('role/create', {
      method: "post",
      body: payload,
    });
    return response.success;
  }
  
  export async function updateRole(payload: object) {
    const response = await httpClient<BaseApiResponse<object>>('role/update', {
      method: "post",
      body: payload,
    });
    return response.success;
  }
  
  export async function deleteRole(id: number) {
    const response = await httpClient<BaseApiResponse<object>>(`role/delete?id=${id}`, {
      method: "delete",
    });
    return response.success;
  }