import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import router from '../router'

const api_baseURL = import.meta.env.VITE_APP_API_BASE || 'http://localhost:9090/api'
// 创建axios实例
const request = axios.create({
  // baseURL: 'http://localhost:9090/api',
  baseURL: api_baseURL,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 从localStorage获取userId
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const { id } = JSON.parse(userInfo)
      // 如果是需要userId的接口，自动添加
      if (config.needUserId) {
        config.params = { ...config.params, userId: id }
      }
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 根据状态码判断请求是否成功
    if (res.status === 200) {
      // 如果有消息则显示
      if (res.msg) {
        ElMessage.success(res.msg)
      }
      return res
    } else {
      // 非200状态码都视为错误
      ElMessage.error(res.msg || '操作失败')
      return Promise.reject(new Error(res.msg || '操作失败'))
    }
  },
  error => {
    // 处理HTTP错误
    const message = error.response?.data?.msg || '请求失败'
    ElMessage.error(message)
    
    // 如果是401错误，清除登录状态
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    }
    
    return Promise.reject(error)
  }
)

// 文章相关接口
export const getAllPosts = (page = 1, size = 10) => {
  return request.get('/posts', { params: { page, size } })
}

export const searchPosts = (keyword, searchType, page = 1, size = 10) => {
  return request.get('/posts/search', {
    params: { 
      keyword, 
      searchType,  // 可以是 'TITLE', 'CONTENT', 或 'AUTHOR'
      page, 
      size 
    }
  })
}

export const getUserPosts = (userId, page = 1, size = 10) => {
  return request.get(`/posts/user/${userId}`, {
    params: { page, size }
  })
}

export const createPost = (data) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key])
    }
  })

  return request.post(`/posts/user/${userInfo.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updatePost = (postId, data) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key])
    }
  })
  formData.append('userId', userInfo.id)

  return request.put(`/posts/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deletePost = (postId) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  return request.delete(`/posts/${postId}`, {
    params: { userId: userInfo.id }
  })
}

export const getPost = (postId) => {
  return request.get(`/posts/${postId}`)
}

// 用户相关接口
export const login = (data) => {
  const formData = new FormData()
  formData.append('username', data.username)
  formData.append('password', data.password)

  return request.post('/users/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const register = (data) => {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key])
    }
  })

  return request.post('/users/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updateUser = (data) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const formData = new FormData()
  
  // 将数据添加到 FormData
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key])
    }
  })
  formData.append('userId', userInfo.id)
  return request.put(`/users`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
}

export const getUserInfo = (userId) => {
  return request.get(`/users/${userId}`, { 
  })
}

export const getFollowers = (puserId, page = 1, size = 20) => {
  return request.get(`/users/${puserId}/followers`, {
    params: { page, size , puserId},
    needUserId: true
  })
}

export const getFollowing = (puserId, page = 1, size = 20) => {
  return request.get(`/users/${puserId}/following`, {
    params: { page, size },
    needUserId: true
  })
}

export const follow = (targetUserId) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const formData = new FormData()
  formData.append('userId', userInfo.id)
  formData.append('targetUserId', targetUserId)

  return request.post(`/users/follow`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const unfollow = (targetUserId) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const formData = new FormData()
  formData.append('userId', userInfo.id)
  formData.append('targetUserId', targetUserId)

  return request.post(`/users/unfollow`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 工具函数
export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取用户统计数据
export const getUserStats = (userId) => {
  return request.get(`/users/${userId}/stats`)
} 