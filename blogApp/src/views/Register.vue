<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>用户注册</h2>
        <p>使用邮箱创建新账户</p>
      </div>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
        size="default"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="邮箱地址" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱地址"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
            clearable
            @keyup.enter="handleRegister"
          />
        </el-form-item>
        
        <el-form-item prop="agreement">
          <el-checkbox v-model="registerForm.agreement">
            我同意
            <a href="#" class="terms-link">用户协议</a>
            和
            <a href="#" class="terms-link">隐私政策</a>
          </el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="register-button"
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-prompt">
        已有账户？
        <router-link to="/login" class="login-link">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'RegisterPage'
})
import type { FormInstance, FormRules } from 'element-plus'
import type { InternalRuleItem } from 'async-validator'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const registerFormRef = ref<FormInstance>()

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const validateConfirmPassword = (_rule: InternalRuleItem, value: string, callback: (error?: string | Error) => void) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { required: true, message: '请同意用户协议和隐私政策', trigger: 'change' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return;

  try {
    await registerFormRef.value.validate();
    loading.value = true;

    const res = await axios.post('/api/auth/register', {
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password
    });

    // 后端返回字符串，例如："用户注册成功，用户ID: 1"
    ElMessage.success(res.data);
    router.push('/login');

  } catch (error: unknown) {
    // ✅ 类型保护，确认是 Axios 错误
    if (axios.isAxiosError(error)) {
      // error.response 可能为 undefined，所以加 ? 防止报错
      const msg = error.response?.data || '注册失败';
      ElMessage.error(msg);
    } else {
      // 其他未知错误
      console.error(error);
      ElMessage.error('发生未知错误');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
}

.register-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.register-form {
  margin-bottom: 24px;
}

.register-form .el-form-item {
  margin-bottom: 20px;
}

.terms-link {
  color: #409eff;
  text-decoration: none;
  margin: 0 2px;
}

.terms-link:hover {
  text-decoration: underline;
}

.register-button {
  width: 100%;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
}

.login-prompt {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 24px;
}

.login-link {
  color: #409eff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.login-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
  }
  
  .register-header h2 {
    font-size: 20px;
  }
}
</style>