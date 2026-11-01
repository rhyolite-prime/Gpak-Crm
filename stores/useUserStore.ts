// stores/useUserStore.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    tenant: null,
  }),
  actions: {
    setUser(user: any) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setTenant(tenant: any) {
      this.tenant = tenant
      localStorage.setItem('tenant', JSON.stringify(tenant))
    },
    loadFromLocalStorage() {
      const user = localStorage.getItem('user')
      const tenant = localStorage.getItem('tenant')
      if (user) this.user = JSON.parse(user)
      if (tenant) this.tenant = JSON.parse(tenant)
    },
    clearUser() {
      this.user = null
      this.tenant = null
      localStorage.removeItem('user')
      localStorage.removeItem('tenant')
    }
  }
})