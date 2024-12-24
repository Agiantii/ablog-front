import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, register as registerApi, updateUser, follow as followApi, unfollow as unfollowApi, getFollowing as getFollowingApi } from '../api'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)

  // 方法
  const login = async (credentials) => {
    try {
      const res = await loginApi(credentials)
      if (res.data) {
        token.value = res.data.token
        userInfo.value = {
          id: res.data.id,
          username: res.data.username,
          avatar: res.data.avatar,
          email: res.data.email,
          bio: res.data.bio
        }
        localStorage.setItem('token', token.value)
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      logout()
      throw error
    }
  }

  const register = async (data) => {
    const res = await registerApi(data)
    return res
  }

  const logout = () => {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  const updateProfile = async (data) => {
    try {
      const res = await updateUser(data)
      // 更新本地状态
      userInfo.value = { 
        ...userInfo.value, 
        ...res.data 
      }
      // 更新本地存储
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return res
    } catch (error) {
      throw error
    }
  }

  const follow = async (targetUserId) => {
    await followApi(targetUserId)
  }

  const unfollow = async (targetUserId) => {
    await unfollowApi(targetUserId)
  }

  const getFollowing = async (page, size) => {
    const res = await getFollowingApi(userInfo.value.id, page, size)
    return res
  }

  // 初始化用户信息
  const initUserInfo = () => {
    try {
      const savedUserInfo = localStorage.getItem('userInfo')
      if (savedUserInfo && savedUserInfo !== 'undefined') {
        const parsed = JSON.parse(savedUserInfo)
        if (parsed && parsed.id) {
          userInfo.value = parsed
        } else {
          throw new Error('Invalid user info format')
        }
      }
    } catch (error) {
      console.error('Failed to parse user info:', error)
      logout() // 如果解析失败，清除所有状态
    }
  }

  // 初始化
  initUserInfo()

  return {
    userInfo,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    updateProfile,
    follow,
    unfollow,
    getFollowing
  }
}) 