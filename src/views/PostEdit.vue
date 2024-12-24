<template>
  <div class="post-edit">
    <el-card class="edit-card">
      <el-form
        ref="formRef"
        :model="postForm"
        :rules="rules"
        label-position="top"
      >
        <!-- 标题 -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="postForm.title" placeholder="请输入文章标题" />
        </el-form-item>

        <!-- 封面图 -->
        <el-form-item label="封面图" prop="cover">
          <el-input
            v-model="postForm.cover"
            placeholder="请输入图片链接（选填）"
            clearable
          >
            <template #append>
              <el-button @click="previewCover">预览</el-button>
            </template>
          </el-input>
          <!-- 图片预览 -->
          <div v-if="postForm.cover" class="cover-preview">
            <img :src="postForm.cover" alt="封面预览" />
          </div>
        </el-form-item>

        <!-- Markdown编辑器 -->
        <el-form-item label="内容" prop="content">
          <MdEditor
            v-model="postForm.content"
            :toolbars="toolbars"
            theme="dark"
            previewTheme="dark"
            codeTheme="dracula"
            height="600px"
          />
        </el-form-item>

        <!-- 批量上传 -->
        <el-form-item label="批量上传">
          <el-upload
            multiple
            :before-upload="beforeUpload"
            :on-change="handleFileChange"
            :auto-upload="false"
            accept=".md"
            show-file-list
            ref="uploadRef"
          >
            <el-button type="primary">选择文件</el-button>
          </el-upload>
          <el-button 
            type="primary" 
            @click="handleBatchUpload" 
            :loading="uploading"
            :disabled="!selectedFiles.length"
          >
            {{ uploading ? `正在上传 (${uploadProgress}/${selectedFiles.length})` : '确定上传' }}
          </el-button>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEdit ? '保存' : '发布' }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { createPost, updatePost, getPost } from '../api'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const selectedFiles = ref([]) // 存储选择的文件
const uploadRef = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)

// 判断是新建还是编辑
const isEdit = computed(() => !!route.params.id)

const postForm = reactive({
  title: '',
  content: '',
  cover: ''
})

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在2-100个字符之间', trigger: 'blur' }
  ],
  cover: [
    { type: 'url', message: '请输入有效的图片链接', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
}

// 上传前验
const beforeUpload = (file) => {
  const isMarkdown = file.type === 'text/markdown' || file.name.endsWith('.md')
  const isLt10M = file.size / 1024 / 1024 < 10 // 限制文件大小为10MB
  
  if (!isMarkdown) {
    ElMessage.error('只能上传 Markdown 文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return true
}

// 处理文件选择
const handleFileChange = (file, fileList) => {
  selectedFiles.value = fileList
}

// 读取文件内容
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file.raw)
  })
}

// 处理批量上传
const handleBatchUpload = async () => {
  if (!selectedFiles.value.length) return
  
  uploading.value = true
  uploadProgress.value = 0
  
  try {
    for (const file of selectedFiles.value) {
      try {
        const content = await readFile(file)
        const title = file.name.replace('.md', '')
        await createPost({ title, content, cover: '' })
        uploadProgress.value++
        ElMessage.success(`上传成功: ${file.name}`)
      } catch (error) {
        console.error(`上传失败: ${file.name}`, error)
        ElMessage.error(`上传失败: ${file.name}`)
        // 继续处理下一个文件，而不是中断整个过程
      }
    }
  } finally {
    uploading.value = false
    // 清空文件列表
    selectedFiles.value = []
    if (uploadRef.value) {
      uploadRef.value.clearFiles()
    }
  }
  
  // 如果有成功上传的文件，显示总体完成消息
  if (uploadProgress.value > 0) {
    ElMessage.success(`批量上传完成，成功上传 ${uploadProgress.value} 个文件`)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (isEdit.value) {
          await updatePost(route.params.id, postForm)
          ElMessage.success('更新成功')
        } else {
          await createPost(postForm)
          ElMessage.success('发布成功')
        }
        router.push('/')
      } catch (error) {
        ElMessage.error(error.message || '操作失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 取消
const handleCancel = () => {
  router.back()
}

// 如果是编辑模式，获取文章数据
onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await getPost(route.params.id)
      Object.assign(postForm, res.data)
    } catch (error) {
      ElMessage.error('获取文章失败')
      router.push('/')
    }
  }
})

// 编辑器工具栏配置
const toolbars = [
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog'
]

// 预览封面图
const previewCover = () => {
  if (!postForm.cover) {
    ElMessage.warning('请先输入图片链接')
    return
  }
}
</script>

<style scoped>
.post-edit {
  min-width: 60vw;
  margin: 20px auto;
  padding: 0 20px;
  background-color: black;
  img{
    width: 20px;
    height: 20px;
    object-fit: cover;
  }
}

.edit-card {
  padding: 20px;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 300px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-uploader:hover {
  border-color: #409EFF;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 30px;
  height: 30px;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.md-editor{
  background-color: black;
}
.cm-content cm-lineWrapping{
  background-color: black !important;
}
:deep(.md-editor) {
  --md-bk-color: var(--el-bg-color);
  --md-border-color: var(--el-border-color-darker);
  --md-color: var(--el-text-color-primary);
}

:deep(.md-editor-dark) {
  --md-bk-color: var(--el-bg-color);
  --md-border-color: var(--el-border-color-darker);
  --md-color: var(--el-text-color-primary);
}

.cover-preview {
  margin-top: 10px;
  width: 300px;
  height: 180px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.el-upload {
  margin-right: 10px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .el-upload-list {
    color: #e5eaf3;
  }
}
</style> 