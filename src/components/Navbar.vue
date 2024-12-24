<template>
  <div class="navbar">
    <div class="nav-content">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <img src="@/assets/logo.jpg" alt="Logo">
        <span>博客广场</span>
      </router-link>

      <!-- 导航链接 -->
      <div class="nav-links">
        <router-link to="/">首页</router-link>
      </div>

      <!-- 用户操作区 -->
      <div class="user-area">
        <template v-if="userStore.isLoggedIn">
          <el-button type="primary" @click="$router.push('/post/edit')">
            写文章
          </el-button>
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
              <el-avatar 
                :size="32" 
                :src="userStore.userInfo?.avatar || '/default-avatar.png'"
              />
              <span class="username">{{ userStore.userInfo?.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人主页</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button @click="handleAuth('login')">登录</el-button>
          <el-button type="primary" @click="handleAuth('register')">注册</el-button>
        </template>
      </div>
    </div>

    <!-- 登录/注册对话框 -->
    <auth-dialog
      v-model="authVisible"
      v-model:mode="authMode"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import AuthDialog from './AuthDialog.vue'

const router = useRouter()
const userStore = useUserStore()

const authVisible = ref(false)
const authMode = ref('login')

// 处理登录/注册按钮点击
const handleAuth = (mode) => {
  authMode.value = mode
  authVisible.value = true
}

// 处理登录/注册成功
const handleAuthSuccess = () => {
  authVisible.value = false
  ElMessage.success('操作成功')
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      if (userStore.userInfo && userStore.userInfo.id) {
        router.push(`/user/${userStore.userInfo.id}`)
      } else {
        ElMessage.error('用户信息不完整，请重新登录')
        userStore.logout()
      }
      break
    case 'logout':
      userStore.logout()
      ElMessage.success('已退出登录')
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push('/')
      }
      break
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.nav-content {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--el-color-primary);
  font-size: 18px;
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo img {
  height: 32px;
  margin-right: 8px;
  border-radius: 4px;
}

.nav-links {
  display: flex;
  gap: 20px;
  
  a {
    color: #606266;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;
    
    &:hover, &.router-link-active {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }
}

.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-info:hover {
  background-color: var(--el-color-primary-light-9);
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .navbar {
    background: rgba(26, 26, 26, 0.8);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  .nav-links a {
    color: #a3a6ad;
    
    &:hover, &.router-link-active {
      color: var(--el-color-primary);
      background-color: rgba(64, 158, 255, 0.1);
    }
  }
  
  .username {
    color: #e5eaf3;
  }
  
  .user-info:hover {
    background-color: rgba(64, 158, 255, 0.1);
  }
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .nav-content {
    padding: 0 16px;
  }
  
  .logo span {
    display: none;
  }
  
  .username {
    display: none;
  }
  
  .user-info {
    padding: 4px;
  }
}
</style> 