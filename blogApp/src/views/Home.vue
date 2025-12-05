<template>
  <div class="home-container">
    <div class="header">
      <div class="header-content">
        <h1 class="logo">博客系统</h1>
        <div class="nav-menu" v-if="!authStore.isAuthenticated">
          <el-button type="primary" @click="$router.push('/login')">登录</el-button>
          <el-button @click="$router.push('/register')">注册</el-button>
        </div>
        <div class="nav-menu" v-else>
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :icon="UserFilled" />
              <span class="username">{{ authStore.username }}</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="hero-section" v-if="!authStore.isAuthenticated">
        <h2>欢迎来到博客系统</h2>
        <p>分享您的想法，记录生活点滴</p>
        <div class="cta-buttons">
          <el-button type="primary" size="large" @click="$router.push('/register')">
            开始写作
          </el-button>
          <el-button size="large" @click="$router.push('/login')">
            立即登录
          </el-button>
        </div>
      </div>
      
      <div class="hero-section" v-else>
        <h2>欢迎回来，{{ authStore.username }}！</h2>
        <p>开始记录您的精彩瞬间吧</p>
        <div class="cta-buttons">
          <el-button type="primary" size="large" @click="handleWrite">
            写篇文章
          </el-button>
          <el-button size="large" @click="handleMyArticles">
            我的文章
          </el-button>
        </div>
      </div>
      
      <div class="features">
        <div class="feature-card">
          <el-icon size="48" color="#409eff"><EditPen /></el-icon>
          <h3>轻松写作</h3>
          <p>简洁的编辑器，让写作变得更加轻松愉快</p>
        </div>
        <div class="feature-card">
          <el-icon size="48" color="#409eff"><Share /></el-icon>
          <h3>分享交流</h3>
          <p>与志同道合的朋友分享您的想法和见解</p>
        </div>
        <div class="feature-card">
          <el-icon size="48" color="#409eff"><DataAnalysis /></el-icon>
          <h3>数据分析</h3>
          <p>查看您的文章数据，了解读者反馈</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HomePage'
})
import { EditPen, Share, DataAnalysis, UserFilled, ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心功能开发中...')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await authStore.logout()
        ElMessage.success('已退出登录')
        router.push('/login')
      } catch (error) {
        // 用户取消操作
      }
      break
  }
}

// 写文章
const handleWrite = () => {
  ElMessage.info('写文章功能开发中...')
}

// 我的文章
const handleMyArticles = () => {
  ElMessage.info('我的文章功能开发中...')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.nav-menu {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 80px;
}

.hero-section h2 {
  font-size: 48px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-section p {
  font-size: 20px;
  color: #666;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 80px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.feature-card h3 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 12px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .logo {
    font-size: 20px;
  }
  
  .hero-section h2 {
    font-size: 36px;
  }
  
  .hero-section p {
    font-size: 18px;
  }
  
  .features {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .feature-card {
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 40px 16px;
  }
  
  .hero-section h2 {
    font-size: 28px;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-buttons .el-button {
    width: 200px;
  }
}
</style>