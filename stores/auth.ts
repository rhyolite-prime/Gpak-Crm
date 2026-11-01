import { defineStore } from 'pinia'

interface AuthResult {
  accessToken: string
  encryptedAccessToken: string
  expireInSeconds: number
  userId: number
}

interface AuthResponse {
  result: AuthResult
  targetUrl: string | null
  success: boolean
  error: string | null
  unAuthorizedRequest: boolean
  __abp: boolean
}

interface LoginCredentials {
  accountName: string
  userNameOrEmailAddress: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    encryptedAccessToken: null as string | null,
    userId: null as number | null,
    tokenExpiry: null as number | null,
    isAuthenticated: false,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    isTokenValid: (state) => {
      if (!state.accessToken || !state.tokenExpiry) return false
      return Date.now() < state.tokenExpiry
    },

    timeUntilExpiry: (state) => {
      if (!state.tokenExpiry) return 0
      return Math.max(0, state.tokenExpiry - Date.now())
    }
  },

  actions: {
    
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      this.error = null

      try {
        const response = await $fetch<AuthResponse>('https://adverts-api.graphic.com.gh/api/tokenauth/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: credentials
        })

        if (response.success && response.result) {
          const { accessToken, encryptedAccessToken, expireInSeconds, userId } = response.result
          
          // Calculate expiry timestamp
          const expiryTime = Date.now() + (expireInSeconds * 1000)
          
          // Store in state
          this.accessToken = accessToken
          this.encryptedAccessToken = encryptedAccessToken
          this.userId = userId
          this.tokenExpiry = expiryTime
          this.isAuthenticated = true

          // Store in localStorage for persistence
          if (process.client) {
            localStorage.setItem('auth_token', accessToken)
            localStorage.setItem('encrypted_token', encryptedAccessToken)
            localStorage.setItem('user_id', userId.toString())
            localStorage.setItem('token_expiry', expiryTime.toString())
          }

          return { success: true }
        } else {
          this.error = response.error || 'Authentication failed'
          return { success: false, error: this.error }
        }
      } catch (error: any) {
        console.error('Login error:', error)
        this.error = error.data?.error || 'Network error occurred'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      // Clear state
      this.accessToken = null
      this.encryptedAccessToken = null
      this.userId = null
      this.tokenExpiry = null
      this.isAuthenticated = false
      this.error = null

      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('encrypted_token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('token_expiry')
      }
    },

    initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const encryptedToken = localStorage.getItem('encrypted_token')
        const userId = localStorage.getItem('user_id')
        const expiry = localStorage.getItem('token_expiry')

        if (token && encryptedToken && userId && expiry) {
          const expiryTime = parseInt(expiry)
          
          // Check if token is still valid
          if (Date.now() < expiryTime) {
            this.accessToken = token
            this.encryptedAccessToken = encryptedToken
            this.userId = parseInt(userId)
            this.tokenExpiry = expiryTime
            this.isAuthenticated = true
          } else {
            // Token expired, clear everything
            this.logout()
          }
        }
      }
    },

    checkTokenExpiry() {
      if (this.tokenExpiry && Date.now() >= this.tokenExpiry) {
        this.logout()
        return false
      }
      return true
    }
  }
})