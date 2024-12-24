<template>
  <div class="home">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索文章"
        class="search-input"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-select v-model="searchType" style="width: 110px">
            <el-option label="按标题" value="TITLE" />
            <el-option label="按内容" value="CONTENT" />
            <el-option label="按作者" value="AUTHOR" />
          </el-select>
        </template>
      </el-input>
    </div>

    <!-- 文章列表 -->
    <div 
      class="post-grid" 
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="disabled"
      v-loading="loading"
    >
      <div v-for="post in posts" :key="post.id" class="post-card-wrapper">
        <div class="post-card" @click="goToPost(post.id)">
          <div class="post-cover-wrapper">
            <img 
              :src="post.cover" 
              class="post-cover" 
              loading="lazy"
              :alt="post.title"
            />
            <div class="post-overlay">
              <h3 class="post-title">{{ post.title }}</h3>
            </div>
          </div>
          <div class="post-info">
            <div class="post-meta">
              <div class="author-info" @click.stop="goToUser(post.userId)">
                <el-avatar 
                  :size="28" 
                  :src="post.avatar || '/default-avatar.png'"
                />
                <span class="username">{{ post.username }}</span>
              </div>
              <span class="time">{{ formatTime(post.createdAt) }}</span>
            </div>
            <p class="post-preview">{{ post.content.substring(0, 100) }}...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="noMore" class="no-more">没有更多内容了</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { getAllPosts, searchPosts } from '../api'
import { formatTime } from '../utils/format'

const router = useRouter()
const posts = ref([])
const page = ref(1)
const size = ref(10)
const loading = ref(false)
const noMore = ref(false)
const searchQuery = ref('')
const searchType = ref('TITLE') // 默认按标题搜索

// 获取文章列表
const fetchPosts = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getAllPosts(page.value, size.value)
    posts.value = [...posts.value, ...res.data]
    noMore.value = res.data.length < size.value
  } catch (error) {
    console.error(error)
  }
  loading.value = false
}

// 搜索文章
const handleSearch = async () => {
  if (!searchQuery.value) {
    page.value = 1
    posts.value = []
    noMore.value = false
    await fetchPosts()
    return
  }
  
  loading.value = true
  try {
    const res = await searchPosts(searchQuery.value, searchType.value, 1, size.value)
    posts.value = res.data
    noMore.value = true
  } catch (error) {
    console.error(error)
  }
  loading.value = false
}

// 加载更多
const loadMore = () => {
  if (!loading.value && !noMore.value) {
    page.value++
    fetchPosts()
  }
}

// 跳转到文章详情
const goToPost = (id) => {
  router.push(`/post/${id}`)
}

// 是否禁用加载更多
const disabled = computed(() => {
  return loading.value || noMore.value
})

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.home {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background-color: black;
}

.search-bar {
  max-width: 600px;
  margin: 0 auto 32px;
  padding: 0 16px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(280px, 1fr));
  gap: 24px;
  padding: 0 16px;
  max-width: 1600px;
  margin: 0 auto;
}

.post-card-wrapper {
  min-width: 250px;
  max-width: 100%;
  aspect-ratio: 0.8;
}

.post-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.08),
    0 4px 6px -2px rgba(0, 0, 0, 0.04);
}

.post-cover-wrapper {
  position: relative;
  padding-top: 66.67%;
  overflow: hidden;
  flex-shrink: 0;
}

.post-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.post-card:hover .post-cover {
  transform: scale(1.05);
}

.post-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  transition: opacity 0.3s ease;
}

.post-title {
  color: #fff;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.time {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.post-preview {
  font-size: 15px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .post-grid {
    grid-template-columns: repeat(3, minmax(280px, 1fr));
  }
  
  .post-card-wrapper {
    min-width: 280px;
  }
  
  .post-title {
    font-size: 18px;
  }
  
  .post-preview {
    font-size: 14px;
  }
}

@media screen and (max-width: 1080px) {
  .post-grid {
    grid-template-columns: repeat(2, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .post-title {
    font-size: 16px;
  }
}

@media screen and (max-width: 640px) {
  .post-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    gap: 16px;
  }
  
  .post-card-wrapper {
    min-width: unset;
    aspect-ratio: 0.9;
  }
  
  .home {
    padding: 16px 8px;
  }
  
  .post-preview {
    font-size: 13px;
    line-height: 1.5;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .post-card {
    background: rgba(30, 30, 30, 0.7);
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.1);
  }
  
  .post-card:hover {
    box-shadow: 
      0 10px 15px -3px rgba(0, 0, 0, 0.3),
      0 4px 6px -2px rgba(0, 0, 0, 0.2);
  }
  
  .post-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  }
  
  .search-input :deep(.el-input__wrapper) {
    background-color: rgba(30, 30, 30, 0.7);
  }
}
</style> 