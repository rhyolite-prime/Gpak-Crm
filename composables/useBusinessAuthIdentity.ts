import type { BusinessAuthModel } from "~/models";

export const useBusinessAuthIdentity = () => {
  
  const businessIdentityCookie = useCookie("gpak-identity");

  return useState("gcgAuth", () => businessIdentityCookie.value as unknown as BusinessAuthModel | null);
};