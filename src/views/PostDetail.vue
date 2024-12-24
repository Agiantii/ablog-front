<template>
  <div class="post-detail">
    <el-card class="post-card dark">
      <!-- 文章标题 -->
      <h1 class="post-title">{{ post.title }}</h1>

      <!-- 作者信息 -->
      <div class="author-info">
        <el-avatar :size="40" :src="post.avatar" @click="goToUserProfile" />
        <div class="author-meta">
          <span class="author-name" @click="goToUserProfile">{{ post.username }}</span>
          <span class="post-time">{{ formatTime(post.createdAt) }}</span>
        </div>
        <template v-if="!isCurrentUser">
          <el-button
            :type="isFollowingState ? 'default' : 'primary'"
            size="small"
            @click="handleFollow"
          >
            {{ isFollowingState ? '已关注' : '关注' }}
          </el-button>
        </template>
        <template v-else>
          <el-button type="primary" size="small" @click="handleEdit">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
        </template>
      </div>

      <!-- 添加下载按钮 -->
      <div class="post-actions">
        <el-button 
          type="primary" 
          text 
          size="small"
          @click="downloadPost"
        >
          <el-icon><Download /></el-icon>
          下载文章
        </el-button>
      </div>

      <!-- 文章内容 -->
      <div class="post-content markdown-body" v-html="renderedContent"></div>
    </el-card>

    <!-- 添加登录/注册对话框 -->
    <auth-dialog
      v-if="!userStore.isLoggedIn"
      v-model="authVisible"
      :mode="authMode"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPost, deletePost, getFollowing } from '../api'
import { formatTime } from '../utils/format'
import MarkdownIt from 'markdown-it'
import mk from '@iktakahiro/markdown-it-katex'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 或其他主题
import 'highlight.js/styles/github-dark.css' // 深色主题
import 'katex/dist/katex.min.css'
import mermaid from 'mermaid'
import AuthDialog from '../components/AuthDialog.vue'
import { Download } from '@element-plus/icons-vue'

// 初始化 mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default',
  securityLevel: 'loose',
  flowchart: {
    htmlLabels: true,
    curve: 'basis'
  },
  themeVariables: {
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const post = ref({})
const isFollowingState = ref(false)

// 判断是否是当前用户的文章
const isCurrentUser = computed(() => {
  return userStore.userInfo?.id === post.value.userId
})

// 配置 markdown-it
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    // mermaid 图表处理
    if (lang === 'mermaid') {
      return `<div class="mermaid">${str}</div>`
    }
    
    // 代码高亮处理
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`
      } catch (__) {}
    }
    
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 使用插件
md.use(mk)

// 渲染Markdown内容
const renderedContent = computed(() => {
  const html = md.render(post.value.content || '')
  // 在下一个 tick 重新初始化 mermaid 图表
  nextTick(async () => {
    try {
      const elements = document.querySelectorAll('.mermaid')
      elements.forEach((element) => {
        // 获取原始内��
        const graphDefinition = element.textContent || ''
        // 生成唯一ID
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        element.id = id
        
        try {
          // 解析和渲染图表
          mermaid.parse(graphDefinition)
          mermaid.render(id, graphDefinition).then(({ svg }) => {
            element.innerHTML = svg
          })
        } catch (err) {
          console.error('Mermaid parse error:', err)
          // 显示错误信息
          element.innerHTML = `
            <pre class="mermaid-error">
              Graph rendering failed:
              ${err.message}
            </pre>
          `
        }
      })
    } catch (error) {
      console.error('Mermaid initialization error:', error)
    }
  })
  return html
})

// 监听深色模式变化
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
darkModeMediaQuery.addEventListener('change', (e) => {
  mermaid.initialize({
    ...mermaid.mermaidAPI.getConfig(),
    theme: e.matches ? 'dark' : 'default'
  })
  // 重新渲染内容
  if (post.value.content) {
    renderedContent.value = md.render(post.value.content)
  }
})

// 获取文章详情
const fetchPost = async () => {
  try {
    const res = await getPost(route.params.id)
    post.value = res.data
    // 获取文章后立即检查关注状态
    await checkFollowStatus()
  } catch (error) {
    console.error(error)
  }
}

// 检查关注状态
const checkFollowStatus = async () => {
  if (userStore.isLoggedIn && post.value.userId) {
    try {
      const res = await getFollowing(userStore.userInfo.id)
      isFollowingState.value = res.data.some(user => user.id === post.value.userId)
    } catch (error) {
      console.error(error)
    }
  }
}

// 跳转到用户主页
const goToUserProfile = () => {
  router.push(`/user/${post.value.userId}`)
}

// 添加登录对话框相关状态
const authVisible = ref(false)
const authMode = ref('login')

// 处理关注/取消关注
const handleFollow = async () => {
  if (!userStore.isLoggedIn) {
    // 显示登录对话框而不是跳转
    authMode.value = 'login'
    authVisible.value = true
    return
  }

  try {
    if (isFollowingState.value) {
      await userStore.unfollow(post.value.userId)
      isFollowingState.value = false
    } else {
      await userStore.follow(post.value.userId)
      isFollowingState.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

// 处理登录成功
const handleAuthSuccess = async () => {
  authVisible.value = false
  ElMessage.success('登录成功')
  // 登录成功后自动���注
  await handleFollow()
}

// 编辑文章
const handleEdit = () => {
  router.push(`/post/edit/${post.value.id}`)
}

// 删除文章
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      type: 'warning'
    })
    
    await deletePost(post.value.id)
    router.push('/')
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

// 下载文章
const downloadPost = () => {
  try {
    // 创建 Blob 对象
    const content = `# ${post.value.title}\n\n${post.value.content}`
    const blob = new Blob([content], { type: 'text/markdown' })
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // 设置文件名（移除特殊字符，避免文件名无效）
    const fileName = `${post.value.title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '')}.md`
    link.setAttribute('download', fileName)
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    
    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('文章下载成功')
  } catch (error) {
    console.error('Download error:', error)
    ElMessage.error('下载失败')
  }
}

onMounted(async () => {
  await fetchPost()
})
</script>

<style scoped>
.post-detail {
  min-width: 50vw;
  margin: 20px auto;
  padding: 0 20px;
}

.post-card {
  padding: 20px;
}

.post-card.dark {
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
}

.post-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #303133;
}

.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 12px;
}

.author-meta {
  flex: 1;
}

.author-name {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  cursor: pointer;
}

.author-name:hover {
  color: #409EFF;
}

.post-time {
  font-size: 14px;
  color: #909399;
}

.post-content {
  margin: 20px 0;
  line-height: 1.8;
}

/* 添加 markdown 图片样式 */
:deep(.markdown-body) {
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  
  img {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
    display: block;
    margin: 1em auto;
    filter: brightness(0.9);
  }
  
  pre {
    background-color: var(--el-bg-color-overlay) !important;
  }
  
  code {
    background-color: var(--el-bg-color-overlay);
    color: var(--el-text-color-regular);
  }
  
  blockquote {
    border-left-color: var(--el-border-color-darker);
    color: var(--el-text-color-secondary);
    background-color: var(--el-bg-color-overlay);
  }
  
  table {
    border-color: var(--el-border-color);
  }
  
  th, td {
    border-color: var(--el-border-color);
  }
  
  hr {
    background-color: var(--el-border-color);
  }
}

/* 调整 KaTeX 样式 */
:deep(.katex) {
  color: var(--el-text-color-primary);
}

/* 代码块样式 */
:deep(.hljs) {
  background-color: var(--el-bg-color-overlay) !important;
  color: var(--el-text-color-primary);
}

/* mermaid 图表样式 */
:deep(.mermaid) {
  background-color: var(--el-bg-color-overlay);
}

.post-actions {
  border-color: var(--el-border-color-darker);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .post-title {
    color: #E5EAF3;
  }

  .author-name {
    color: #E5EAF3;
  }

  .post-time {
    color: #909399;
  }

  .post-content {
    color: #E5EAF3;
  }

  :deep(.markdown-body) {
    img {
      /* 深色模式下可以添加一些特殊处理，比如轻微降低亮度 */
      filter: brightness(0.9);
    }
  }

  :deep(.katex) {
    color: #e5eaf3;
  }

  :deep(code:not(.hljs)) {
    background-color: #2d2d2d;
    color: #e5eaf3;
  }
  
  :deep(.mermaid) {
    background-color: #1a1a1a;
  }
  
  /* 使用深色主题的语法高亮 */
  :deep(.hljs) {
    background-color: #2d2d2d !important;
  }
  
  :deep(.mermaid-error) {
    color: #ff7875;
    background-color: #2a1f1f;
    border-color: #592d2d;
  }
  
  :deep(.mermaid) {
    filter: brightness(0.9);
  }
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
  padding: 10px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .post-actions {
    border-color: #363637;
  }
}
</style> 