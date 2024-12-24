<template>
  <el-dialog
    :title="mode === 'login' ? '登录' : '注册'"
    v-model="visible"
    width="360px"
    :close-on-click-modal="false"
    :modal-class="'auth-dialog-modal'"
    :z-index="2000"
    append-to-body
  >
    <!-- 登录表单 -->
    <login-form
      v-if="mode === 'login'"
      @success="handleSuccess"
      @switch-mode="switchMode"
    />
    
    <!-- 注册表单 -->
    <register-form
      v-else
      @success="handleSuccess"
      @switch-mode="switchMode"
    />
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import LoginForm from '../views/Login.vue'
import RegisterForm from '../views/Register.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'login'
  }
})

const emit = defineEmits(['update:modelValue', 'update:mode', 'success'])

const visible = ref(props.modelValue)

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val
})

// 监听对话框显示状态变化
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 切换登录/注册模式
const switchMode = () => {
  emit('update:mode', props.mode === 'login' ? 'register' : 'login')
}

// 处理成功
const handleSuccess = () => {
  visible.value = false
  emit('success')
}
</script>

<style>
/* 使用全局样式确保对话框显示在最上层 */
.auth-dialog-modal {
  z-index: 2001 !important;
}

.el-overlay {
  z-index: 2000 !important;
}
</style>

<style scoped>
:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px 20px 10px;
  text-align: center;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-dialog__headerbtn) {
  top: 16px;
}
</style> 