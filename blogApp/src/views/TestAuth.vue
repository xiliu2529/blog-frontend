<template>
  <div class="test-auth-container">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>JWT认证测试</span>
        </div>
      </template>
      
      <div class="test-section">
        <h3>认证状态</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="是否已登录">
            <el-tag :type="authStore.isAuthenticated ? 'success' : 'danger'">
              {{ authStore.isAuthenticated ? '已登录' : '未登录' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户名">
            {{ authStore.username || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="Token">
            <el-text class="token-text" truncated>{{ authStore.token || '无' }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="刷新Token">
            <el-text class="token-text" truncated>{{ authStore.refreshToken || '无' }}</el-text>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <div class="test-section">
        <h3>测试操作</h3>
        <el-space direction="vertical" style="width: 100%">
          <el-button 
            type="primary" 
            @click="testAuthEndpoint"
            :loading="loading.testAuth"
          >
            测试认证接口 (/api/auth/test)
          </el-button>
          
          <el-button 
            type="success" 
            @click="testUserEndpoint"
            :loading="loading.testUser"
          >
            测试用户信息接口 (/api/user/profile)
          </el-button>
          
          <el-button 
            type="warning" 
            @click="testRefreshToken"
            :loading="loading.testRefresh"
          >
            测试Token刷新
          </el-button>
          
          <el-button 
            type="danger" 
            @click="handleLogout"
          >
            退出登录
          </el-button>
        </el-space>
      </div>
      
      <div class="test-section" v-if="response.data">
        <h3>响应结果</h3>
        <el-card class="response-card">
          <pre>{{ JSON.stringify(response.data, null, 2) }}</pre>
        </el-card>
      </div>
      
      <div class="test-section" v-if="error">
        <h3>错误信息</h3>
        <el-alert :title="error" type="error" show-icon :closable="false" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TestAuthPage'
})
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import api from '../utils/request'

const authStore = useAuthStore()

const loading = reactive({
  testAuth: false,
  testUser: false,
  testRefresh: false
})

const response = reactive({
  data: null as any
})

const error = ref('')

// 测试认证接口
const testAuthEndpoint = async () => {
  loading.testAuth = true
  error.value = ''
  
  try {
    const result = await api.get('/api/auth/test')
    response.data = result.data
    ElMessage.success('认证接口测试成功')
  } catch (err: any) {
    error.value = err.response?.data || err.message
    ElMessage.error('认证接口测试失败')
  } finally {
    loading.testAuth = false
  }
}

// 测试用户信息接口
const testUserEndpoint = async () => {
  loading.testUser = true
  error.value = ''
  
  try {
    const result = await api.get('/api/user/profile')
    response.data = result.data
    ElMessage.success('用户信息接口测试成功')
  } catch (err: any) {
    error.value = err.response?.data || err.message
    ElMessage.error('用户信息接口测试失败')
  } finally {
    loading.testUser = false
  }
}

// 测试Token刷新
const testRefreshToken = async () => {
  loading.testRefresh = true
  error.value = ''
  
  try {
    const refreshToken = authStore.refreshToken
    if (!refreshToken) {
      throw new Error('没有刷新Token')
    }
    
    const newToken = await authStore.refreshAccessToken(refreshToken)
    response.data = { message: 'Token刷新成功', newToken }
    ElMessage.success('Token刷新成功')
  } catch (err: any) {
    error.value = err.response?.data || err.message
    ElMessage.error('Token刷新失败')
  } finally {
    loading.testRefresh = false
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await authStore.logout()
    ElMessage.success('已退出登录')
    response.data = null
    error.value = ''
  } catch (err: any) {
    ElMessage.error('退出登录失败')
  }
}
</script>

<style scoped>
.test-auth-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.test-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.test-section {
  margin-bottom: 30px;
}

.test-section h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.token-text {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  max-width: 200px;
}

.response-card {
  background-color: #f5f5f5;
}

.response-card pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
}
</style>