import type { BusinessAuthModel } from '~/models';

// Helper to asynchronously read permissions from IndexedDB
const getPermissionsFromIndexedDB = (): Promise<string[]> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve([]);
            return;
        }
        
        const request = indexedDB.open('GpakCrmAuthDB', 1);
        
        request.onsuccess = (event: any) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('permissions')) {
                resolve([]);
                return;
            }
            const transaction = db.transaction('permissions', 'readonly');
            const store = transaction.objectStore('permissions');
            const getRequest = store.get('user_permissions');
            
            getRequest.onsuccess = () => {
                resolve(getRequest.result || []);
            };
            getRequest.onerror = () => resolve([]);
        };
        
        request.onerror = () => resolve([]);
    });
};

export default defineNuxtRouteMiddleware(async (to, from) => {

    const businessIdentity = useCookie("gpak-identity").value as unknown as BusinessAuthModel;

    const resetCookies = () => {
        useCookie("gpak-identity").value = null;
    };

    if (businessIdentity) {
        const currentTime = new Date().getTime();
        const tokenExpiry = new Date(businessIdentity.expiresOn).getTime();

        if (currentTime > tokenExpiry) {
            if (to.path !== from.path) {
                resetCookies();
                return navigateTo("/account/login");
            }
        }

        const requiredPermissions = to.meta.requiredPermissions as string[] | undefined;

        if (requiredPermissions && requiredPermissions.length > 0) {
            
            // 💡 IndexedDB only exists in the browser, so we only run this block on the client
            if (import.meta.client) {
                
                // Await the permissions from IndexedDB
                const userPerms = await getPermissionsFromIndexedDB();
                
                // Check if the user has ALL required permissions for this route
                const isAuthorized = requiredPermissions.every(permission => userPerms.includes(permission));

                if (!isAuthorized) {
                    return navigateTo('/no-access');
                }
            }
        }

    } else if (
        !businessIdentity &&
        ![
            "/account/login",
            "/account/register",
            "/account/forgot-password",
            "/account/verify-code",
            "/account/new-password",
        ].includes(to.path)
    ) {
        resetCookies();
        return navigateTo("/account/login");
    }
})