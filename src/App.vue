<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from './components/Navbar.vue'

const route = useRoute()

// 判断是否是认证页面
const isAuthPage = computed(() => {
  return ['login', 'register'].includes(route.name)
})
</script>

<template>
  <div class="app">
    <!-- 只在非登录/注册页面显示导航栏 -->
    <Navbar v-if="!isAuthPage" />
    
    <!-- 主内容区 -->
    <main :class="{ 'main-content': !isAuthPage }">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* 全局样式 */
:root {
  --primary-color: #409EFF;
  --text-color: #303133;
  --text-color-secondary: #909399;
  --border-color: #DCDFE6;
  --background-color: black;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: var(--background-color);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 60px;
  padding: 20px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
