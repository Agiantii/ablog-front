<template>
  <div class="login-form dark">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="0">
      <el-form-item prop="username">
        <el-input 
          v-model="form.username" 
          placeholder="用户名"
          prefix-icon="User"
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

      <el-form-item>
        <el-button 
          type="primary" 
          class="submit-btn" 
          :loading="loading"
          @click="handleSubmit"
        >
          登录
        </el-button>
      </el-form-item>

      <div class="form-footer">
        <span>还没有账号？</span>
        <el-button 
          link 
          type="primary" 
          @click="$emit('switch-mode')"
        >
          立即注册
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
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await userStore.login(form)
    ElMessage.success('登录成功')
    emit('success')
  } catch (error) {
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('登录失败，请重试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-form {
  padding: 20px;
  border-radius: 8px;
}

.login-form.dark {
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