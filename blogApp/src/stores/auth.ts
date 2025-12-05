import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/request'

export interface UserInfo {
  id: number
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const userInfo = ref<UserInfo | null>(
    localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')!) 
      : null
  )

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')

  // 方法
  const setAuth = (authToken: string, authRefreshToken: string, user: UserInfo) => {
    token.value = authToken
    refreshToken.value = authRefreshToken
    userInfo.value = user
    
    // 持久化到localStorage
    localStorage.setItem('token', authToken)
    localStorage.setItem('refreshToken', authRefreshToken)
    localStorage.setItem('userInfo', JSON.stringify(user))
  }

  const clearAuth = () => {
    token.value = null
    refreshToken.value = null
    userInfo.value = null
    
    // 清除localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
  }

  const refreshAccessToken = async (refreshTokenValue: string): Promise<string> => {
    try {
      const response = await api.post('/api/auth/refresh', {}, {
        headers: {
          Authorization: `Bearer ${refreshTokenValue}`
        }
      })
      
      const newToken = response.data
      token.value = newToken
      localStorage.setItem('token', newToken)
      
      return newToken
    } catch (error) {
      throw error
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      })
      
      const { token: authToken, refreshToken: authRefreshToken, userId, username: userName } = response.data
      
      setAuth(authToken, authRefreshToken, {
        id: userId,
        username: userName
      })
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      // 可以调用后端注销接口（如果有）
      // await api.post('/api/auth/logout')
    } catch (error) {
      console.error('注销请求失败:', error)
    } finally {
      clearAuth()
    }
  }

  // 初始化时验证token有效性
  const validateToken = async () => {
    if (!token.value) return false
    
    try {
      const response = await api.get('/api/auth/test')
      return response.status === 200
    } catch (error) {
      // Token无效，尝试刷新
      if (refreshToken.value) {
        try {
          await refreshAccessToken(refreshToken.value)
          return true
        } catch (refreshError) {
          clearAuth()
          return false
        }
      }
      clearAuth()
      return false
    }
  }

  return {
    // 状态
    token,
    refreshToken,
    userInfo,
    
    // 计算属性
    isAuthenticated,
    username,
    
    // 方法
    setAuth,
    clearAuth,
    refreshAccessToken,
    login,
    logout,
    validateToken
  }
})