import { defu } from 'defu';

export const useHttpClient = () => {
  const config = useRuntimeConfig().public;
  const businessIdentity = useBusinessAuthIdentity();
  const authToken = businessIdentity.value?.accessToken;

  const httpClient = async <T>(urlPath: string, options?: any) => {
    const defaultOptions = {
      lazy: false,
      immediate: true,
      server: false,
      baseURL: config.proxyApiBaseURL,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      mode: 'cors',
    };

    if (options?.query) {
      options.query = filterQueryParams(options.query);
    }

    return await $fetch<T>(urlPath, {
      ...defu(options, defaultOptions),

      onRequestError({ request, error, options }) {
        console.log(error);
      },

      onResponseError({ request, response, options }) {
        console.log(response);
      },
    });
  };

  return { httpClient };
};

export const getBusinessAuthIdentityHeaders = async () => {
    const businessIdentity = useBusinessAuthIdentity();
    const authToken = businessIdentity.value?.accessToken;

    return {
        Authorization: `Bearer ${authToken}`,
    };
};