<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>用户登录</h2>
        <p>使用用户名登录系统</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        size="default"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <div class="form-options">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <a href="#" class="forgot-link">忘记密码？</a>
        </div>
        
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="register-prompt">
        还没有账户？
        <router-link to="/register" class="register-link">立即注册</router-link>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
defineOptions({
  name: 'LoginPage'
})
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)
const loginFormRef = ref<FormInstance>()

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ]
}

// 登录方法
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    loading.value = true;

    await authStore.login(loginForm.username, loginForm.password);

    ElMessage.success('登录成功！');
    
    // 如果有重定向地址，跳转到指定页面
    const redirect = route.query.redirect as string
    router.push(redirect || '/');

  } catch (error: any) {
    ElMessage.error(error.response?.data || error.message || '登录失败');
  } finally {
    loading.value = false;
  }
};

// 检查是否已登录
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-form {
  margin-bottom: 24px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-link {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #337ecc;
  text-decoration: underline;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
}

.register-prompt {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 24px;
}

.register-link {
  color: #409eff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.register-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-header h2 {
    font-size: 20px;
  }
}
</style>