<template>
  <div class="register-form dark">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="0">
      <el-form-item prop="username">
        <el-input 
          v-model="form.username" 
          placeholder="用户名"
          prefix-icon="User"
        />
      </el-form-item>
      
      <el-form-item prop="email">
        <el-input 
          v-model="form.email" 
          placeholder="邮箱"
          prefix-icon="Message"
        />
      </el-form-item>
      
      <el-form-item prop="password">
        <el-input 
          v-model="form.password" 
          type="password" 
          placeholder="密码"
          prefix-icon="Lock"
          show-password
        />
      </el-form-item>
      
      <el-form-item prop="confirmPassword">
        <el-input 
          v-model="form.confirmPassword" 
          type="password" 
          placeholder="确认密码"
          prefix-icon="Lock"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button 
          type="primary" 
          class="submit-btn" 
          :loading="loading"
          @click="handleSubmit"
        >
          注册
        </el-button>
      </el-form-item>

      <div class="form-footer">
        <span>已有账号？</span>
        <el-button 
          link 
          type="primary" 
          @click="$emit('switch-mode')"
        >
          立即登录
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['success', 'switch-mode'])
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const validateEmail = (rule, value, callback) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (value === '') {
    callback(new Error('请输入邮箱'))
  } else if (!emailRegex.test(value)) {
    callback(new Error('请输入有效的邮箱地址'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await userStore.register(form)
    ElMessage.success('注册成功')
    emit('success')
  } catch (error) {
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('注册失败，请重试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-form {
  padding: 20px;
  border-radius: 8px;
}

.register-form.dark {
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-dark);
}

.submit-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.form-footer {
  margin-top: 16px;
  text-align: center;
  color: var(--el-text-color-secondary);
}
</style> 