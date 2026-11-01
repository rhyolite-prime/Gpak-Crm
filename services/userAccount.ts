import type {
  BaseApiResponse,
  ResetPasswordResponse,
  UserAccount,
} from '~/models';

export async function getUserAccountDetails() {
    const response = await httpClient<BaseApiResponse<UserAccount>>(
        "session/getCurrentLoginInformations"
    );
    return response.result;
}

export async function getPasswordResetCode(payload: object) {
    const response = await httpClient<BaseApiResponse<ResetPasswordResponse>>(
        "user/SendPasswordResetCode",
        {
            method: "post",
            body: payload,
        }
    );
    return response.result;
}

export async function confirmVerificationCode(payload: object) {
    const response = await httpClient<BaseApiResponse<ResetPasswordResponse>>(
        "user/VerifyPasswordResetCode",
        {
            method: "post",
            body: payload,
        }
    );
    return response.result;
}

export async function setNewAccountPassword(payload: object) {
    const response = await httpClient<BaseApiResponse<ResetPasswordResponse>>(
        "user/ResetUserPassword",
        {
            method: "post",
            body: payload,
        }
    );
    return response.result;
}

export async function updateAccountPassword(payload: object) {
    const response = await httpClient<BaseApiResponse<ResetPasswordResponse>>(
        "user/ChangePassword",
        {
            method: "post",
            body: payload,
        }
    );
    return response;
}
