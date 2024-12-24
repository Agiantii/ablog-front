<template>
  <div class="profile">
    <!-- 用户信息卡片 -->
    <el-card class="user-card dark">
      <div class="user-header">
        <el-avatar :size="80" :src="userInfo.avatar" />
        <div class="user-info">
          <h2>{{ userInfo.username }}</h2>
          <p class="bio">{{ userInfo.bio || '这个人很懒，什么都没写~' }}</p>
          <div class="user-stats">
            <div 
              v-for="stat in userStats" 
              :key="stat.label" 
              class="stat-item"
            >
              <span class="count">{{ stat.count }}</span>
              <span class="label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
        <!-- 操作按钮区域 -->
        <div class="action-btn">
          <template v-if="isCurrentUser">
            <el-button @click="showEditDialog = true">编辑资料</el-button>
          </template>
          <template v-else>
            <el-button
              :type="isFollowingState ? 'default' : 'primary'"
              @click="handleFollow"
            >
              {{ isFollowingState ? '已关注' : '关注' }}
            </el-button>
          </template>
        </div>
      </div>
    </el-card>

    <!-- 内容标签页 -->
    <el-tabs v-model="activeTab" class="profile-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="文章" name="posts">
        <div class="post-grid">
          <div v-for="post in posts" :key="post.id" class="post-card">
            <el-card :body-style="{ padding: '0px' }" @click="goToPost(post.id)">
              <img :src="post.cover" class="post-cover" />
              <div class="post-info">
                <h3>{{ post.title }}</h3>
                <p>{{ post.content.substring(0, 50) }}...</p>
                <div class="post-meta">
                  <span>{{ formatTime(post.createdAt) }}</span>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        <!-- 加载更多 -->
        <div v-if="posts.length" class="load-more" v-loading="loading.posts">
          <el-button 
            v-if="!noMore.posts" 
            @click="loadMore('posts')"
            :loading="loading.posts"
          >
            加载更多
          </el-button>
          <span v-else>没有更多了</span>
        </div>
      </el-tab-pane>

      <el-tab-pane label="关注" name="following">
        <div class="user-list">
          <div v-for="user in following" :key="user.id" class="user-item">
            <el-avatar :size="40" :src="user.avatar" @click="goToUser(user.id)" />
            <div class="user-info">
              <span class="username">{{ user.username }}</span>
              <span class="bio">{{ user.bio || '这个人很懒，什么都没写~' }}</span>
            </div>
          </div>
        </div>
        <!-- 加载更多 -->
        <div v-if="following.length" class="load-more" v-loading="loading.following">
          <el-button 
            v-if="!noMore.following" 
            @click="loadMore('following')"
            :loading="loading.following"
          >
            加载更多
          </el-button>
          <span v-else>没有更多了</span>
        </div>
      </el-tab-pane>

      <el-tab-pane label="粉丝" name="followers">
        <div class="user-list">
          <div v-for="user in followers" :key="user.id" class="user-item">
            <el-avatar :size="40" :src="user.avatar" @click="goToUser(user.id)" />
            <div class="user-info">
              <span class="username">{{ user.username }}</span>
              <span class="bio">{{ user.bio || '这个人很懒，什么都没写~' }}</span>
            </div>
          </div>
        </div>
        <!-- 加载更多 -->
        <div v-if="followers.length" class="load-more" v-loading="loading.followers">
          <el-button 
            v-if="!noMore.followers" 
            @click="loadMore('followers')"
            :loading="loading.followers"
          >
            加载更多
          </el-button>
          <span v-else>没有更多了</span>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 编辑资料对话框 - 只在当前用户的主页显示 -->
    <el-dialog
      v-if="isCurrentUser"
      v-model="showEditDialog"
      title="编辑个人资料"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="editForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input
            v-model="editForm.avatar"
            placeholder="请输入头像图片链接"
            clearable
          >
            <template #append>
              <el-button @click="previewAvatar">预览</el-button>
            </template>
          </el-input>
          <!-- 头像预览 -->
          <div v-if="editForm.avatar" class="avatar-preview">
            <img :src="editForm.avatar" alt="头像预览" />
          </div>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            v-model="editForm.bio"
            type="textarea"
            :rows="3"
            placeholder="介绍一下自己吧"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateProfile" :loading="updating">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { formatTime } from '../utils/format'
import { getUserInfo, getUserPosts, getFollowers, getFollowing, updateUser, getUserStats } from '../api'
import AuthDialog from '../components/AuthDialog.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userInfo = ref({})
const posts = ref([])
const followers = ref([])
const following = ref([])
const stats = ref({
  postsCount: 0,
  followersCount: 0,
  followingCount: 0
})
const activeTab = ref('posts')
const showEditDialog = ref(false)
const updating = ref(false)
const isFollowingState = ref(false)

// 判断是否是当前登录用户的主页
const isCurrentUser = computed(() => {
  return userStore.userInfo?.id === Number(route.params.id)
})

const editForm = ref({
  username: '',
  avatar: '',
  bio: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, message: '用户名长度不能小于2位', trigger: 'blur' }
  ],
  avatar: [
    { type: 'url', message: '请输入有效的图片链接', trigger: 'blur' }
  ]
}

// 获取用户信息和关注状态
const fetchUserInfo = async () => {
  try {
    const res = await getUserInfo(route.params.id)
    userInfo.value = res.data
    // 初始化编辑表单
    Object.assign(editForm.value, res.data)
    // 检查关注状态
    await checkFollowStatus()
  } catch (error) {
    console.error(error)
  }
}

// 检查关注状态
const checkFollowStatus = async () => {
  if (userStore.isLoggedIn && !isCurrentUser.value) {
    try {
      const res = await getFollowing(userStore.userInfo.id)
      isFollowingState.value = res.data.some(user => user.id === Number(route.params.id))
    } catch (error) {
      console.error(error)
    }
  }
}

// 分页相关状态
const page = ref({
  posts: 1,
  followers: 1,
  following: 1
})
const size = ref(10)
const loading = ref({
  posts: false,
  followers: false,
  following: false
})
const noMore = ref({
  posts: false,
  followers: false,
  following: false
})

// 获取用户文章
const fetchUserPosts = async (reset = false) => {
  if (loading.value.posts) return
  
  try {
    loading.value.posts = true
    const res = await getUserPosts(route.params.id, page.value.posts, size.value)
    if (reset) {
      posts.value = res.data
    } else {
      posts.value = [...posts.value, ...res.data]
    }
    noMore.value.posts = res.data.length < size.value
    if (!noMore.value.posts) {
      page.value.posts++
    }
  } catch (error) {
    console.error('Failed to fetch user posts:', error)
  } finally {
    loading.value.posts = false
  }
}

// 获取粉丝列表
const fetchFollowers = async (reset = false) => {
  if (loading.value.followers) return
  
  try {
    loading.value.followers = true
    const res = await getFollowers(route.params.id, page.value.followers, size.value)
    if (reset) {
      followers.value = res.data
    } else {
      followers.value = [...followers.value, ...res.data]
    }
    noMore.value.followers = res.data.length < size.value
    if (!noMore.value.followers) {
      page.value.followers++
    }
  } catch (error) {
    console.error('Failed to fetch followers:', error)
  } finally {
    loading.value.followers = false
  }
}

// 获取关注列表
const fetchFollowing = async (reset = false) => {
  if (loading.value.following) return
  
  try {
    loading.value.following = true
    const res = await getFollowing(route.params.id, page.value.following, size.value)
    if (reset) {
      following.value = res.data
    } else {
      following.value = [...following.value, ...res.data]
    }
    noMore.value.following = res.data.length < size.value
    if (!noMore.value.following) {
      page.value.following++
    }
  } catch (error) {
    console.error('Failed to fetch following:', error)
  } finally {
    loading.value.following = false
  }
}

// 加载更多
const loadMore = async (type) => {
  switch (type) {
    case 'posts':
      await fetchUserPosts()
      break
    case 'followers':
      await fetchFollowers()
      break
    case 'following':
      await fetchFollowing()
      break
  }
}

// 处理标签页切换
const handleTabClick = async (tab) => {
  const type = tab.props.name
  if (type === 'followers' && !followers.value.length) {
    await fetchFollowers(true)
  } else if (type === 'following' && !following.value.length) {
    await fetchFollowing(true)
  }
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
      await userStore.unfollow(route.params.id)
      isFollowingState.value = false
    } else {
      await userStore.follow(route.params.id)
      isFollowingState.value = true
    }
    // 刷新粉丝列表
    await fetchFollowers()
  } catch (error) {
    console.error(error)
  }
}

// 处理登录成功
const handleAuthSuccess = async () => {
  authVisible.value = false
  ElMessage.success('登录成功')
  // 登录成功后自动关注
  await handleFollow()
  // 重新获取用户信息和关注状态
  await fetchUserInfo()
  await fetchFollowers()
  await fetchFollowing()
}

// 预览头像
const previewAvatar = () => {
  if (!editForm.value.avatar) {
    ElMessage.warning('请先输入图片链接')
    return
  }
}

// 更新个人资料
const handleUpdateProfile = async () => {
  updating.value = true
  try {
    const updateData = {
      username: editForm.value.username,
      bio: editForm.value.bio,
      avatar: editForm.value.avatar,
      email: editForm.value.email
    }
    // 使用 store 的方法更新
    await userStore.updateProfile(updateData)
    showEditDialog.value = false
    // 重新获取用户信息以更新页面显示
    await fetchUserInfo()
    // 更新 Navbar 显示
    await userStore.initUserInfo()
  } catch (error) {
    console.error(error)
  } finally {
    updating.value = false
  }
}

// 跳转到文章详情
const goToPost = (postId) => {
  router.push(`/post/${postId}`)
}

// 跳转到用户主页
const goToUser = (userId) => {
  router.push(`/user/${userId}`)
}

// 获取用户统计数据
const fetchUserStats = async () => {
  try {
    const res = await getUserStats(route.params.id)
    if (res.status === 200) {
      stats.value = res.data
    }
  } catch (error) {
    console.error('Failed to fetch user stats:', error)
  }
}

// 修改模板中的统计显示
const userStats = computed(() => [
  {
    label: '文章',
    count: stats.value.postsCount
  },
  {
    label: '粉丝',
    count: stats.value.followersCount
  },
  {
    label: '关注',
    count: stats.value.followingCount
  }
])

onMounted(async () => {
  await fetchUserInfo()
  await fetchUserPosts(true)
  await fetchUserStats()
})

// 监听路由参数变化
watch(() => route.params.id, async (newId) => {
  if (newId) {
    // 重置分页状态
    page.value = {
      posts: 1,
      followers: 1,
      following: 1
    }
    noMore.value = {
      posts: false,
      followers: false,
      following: false
    }
    // 清空列表数据
    posts.value = []
    followers.value = []
    following.value = []
    // 重新加载数据
    await fetchUserInfo()
    await fetchUserPosts(true)
    await fetchUserStats()
    // 如果当前标签页不是文章，则加载对应数据
    if (activeTab.value === 'followers') {
      await fetchFollowers(true)
    } else if (activeTab.value === 'following') {
      await fetchFollowing(true)
    }
  }
})
</script>

<style scoped>
.profile {
  max-width: 1000px;
  min-width: 60vw;
  margin: 20px auto;
  padding: 0 20px;
}

.user-card {
  background-color: black;
  margin-bottom: 20px;
}

.user-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  margin: 0 0 10px;
}

.bio {
  color: #606266;
  margin: 0 0 15px;
}

.user-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-item .count {
  display: block;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.stat-item .label {
  font-size: 14px;
  color: #909399;
}

.action-btn {
    background-color: black;
  margin-left: auto;
}

.profile-tabs {
  background-color: black;
  margin-top: 20px;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  background-color: black;
}

.post-card {
  cursor: pointer;
  background-color: black;
}

.post-cover {
  width: 100%;
  height: 200px;
  background-color: black;
  object-fit: cover;
}

.post-info {
  background-color: black;
  opacity: 0.8;
  padding: 15px;
}

.post-info h3 {
  margin: 0 0 10px;
  font-size: 16px;
}

.post-info p {
  margin: 0 0 10px;
  color: #606266;
}

.post-meta {
  color: #909399;
  font-size: 14px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-item:hover {
  background-color: #f5f7fa;
}

.user-item .user-info {
  display: flex;
  flex-direction: column;
}

.user-item .username {
  font-weight: 500;
  color: #303133;
}

.user-item .bio {
  font-size: 14px;
  color: #909399;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.avatar-preview {
  margin-top: 10px;
  width: 100px;
  height: 100px;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .avatar-preview, .cover-preview {
    border-color: #4c4d4f;
  }
}

.load-more {
  text-align: center;
  margin-top: 20px;
  padding: 10px 0;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .load-more {
    color: #909399;
  }
}
</style> 