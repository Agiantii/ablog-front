<template>
  <div class="following">
    <el-card class="following-card">
      <template #header>
        <div class="card-header">
          <span>我的关注</span>
        </div>
      </template>

      <div class="user-list">
        <div v-for="user in following" :key="user.id" class="user-item">
          <el-avatar :size="50" :src="user.avatar" @click="goToUser(user.id)" />
          <div class="user-info">
            <div class="user-meta">
              <span class="username" @click="goToUser(user.id)">{{ user.username }}</span>
              <span class="join-time">加入于 {{ formatTime(user.createdAt) }}</span>
            </div>
            <p class="bio">{{ user.bio || '这个人很懒，什么都没写~' }}</p>
          </div>
          <el-button type="danger" plain size="small" @click="handleUnfollow(user.id)">
            取消关注
          </el-button>
        </div>
      </div>

      <!-- 加载更多 -->
      <el-infinite-scroll
        v-loading="loading"
        :infinite-scroll-disabled="disabled"
        @load="loadMore"
      >
        <span v-if="noMore">没有更多了</span>
      </el-infinite-scroll>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { formatTime } from '../utils/format'

const router = useRouter()
const userStore = useUserStore()

const following = ref([])
const page = ref(1)
const size = ref(20)
const loading = ref(false)
const noMore = ref(false)

// 获取关注列表
const fetchFollowing = async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const res = await userStore.getFollowing(page.value, size.value)
    following.value = [...following.value, ...res]
    noMore.value = res.length < size.value
  } catch (error) {
    ElMessage.error('获取关注列表失败')
  } finally {
    loading.value = false
  }
}

// 取消关注
const handleUnfollow = async (userId) => {
  try {
    await userStore.unfollow(userId)
    following.value = following.value.filter(user => user.id !== userId)
    ElMessage.success('取消关注成功')
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  }
}

// 加载更多
const loadMore = () => {
  if (!loading.value && !noMore.value) {
    page.value++
    fetchFollowing()
  }
}

// 跳转到用户主页
const goToUser = (userId) => {
  router.push(`/user/${userId}`)
}

// 是否禁用加载更多
const disabled = computed(() => {
  return loading.value || noMore.value
})

onMounted(() => {
  fetchFollowing()
})
</script>

<style scoped>
.following {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.card-header {
  font-size: 18px;
  font-weight: 500;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-item:hover {
  background-color: #f5f7fa;
}

.user-info {
  flex: 1;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.username {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  cursor: pointer;
}

.username:hover {
  color: #409EFF;
}

.join-time {
  font-size: 14px;
  color: #909399;
}

.bio {
  margin: 0;
  font-size: 14px;
  color: #606266;
}
</style> 