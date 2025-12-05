import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const authStore = useAuthStore()
    
    if (error.response?.status === 401) {
      // Token过期或无效，尝试刷新token
      const refreshToken = authStore.refreshToken
      
      if (refreshToken && !error.config._retry) {
        error.config._retry = true
        
        try {
          const newToken = await authStore.refreshAccessToken(refreshToken)
          // 重试原请求
          error.config.headers.Authorization = `Bearer ${newToken}`
          return api.request(error.config)
        } catch (refreshError) {
          // 刷新失败，清除认证信息并跳转到登录页
          authStore.clearAuth()
          ElMessage.error('登录已过期，请重新登录')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        // 没有刷新token或已经重试过，直接清除认证信息
        authStore.clearAuth()
        ElMessage.error('登录已过期，请重新登录')
        window.location.href = '/login'
      }
    } else if (error.response?.status >= 500) {
      ElMessage.error('服务器错误，请稍后重试')
    } else if (error.response?.status === 403) {
      ElMessage.error('没有权限访问该资源')
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络连接')
    } else if (!window.navigator.onLine) {
      ElMessage.error('网络连接已断开')
    }
    
    return Promise.reject(error)
  }
)

export default api