<template>
  <div class="write-article-container">
    <div class="editor-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="icon-edit"></i>
          创作文章
        </h1>
        <p class="page-subtitle">用 Markdown 记录您的想法，分享您的见解</p>
      </div>
    </div>

    <div class="editor-main">
      <div class="form-container">
        <el-form :model="article" :rules="rules" ref="formRef" label-position="top">
          <div class="title-section">
            <el-form-item prop="title" class="title-form-item">
              <template #label>
                <span class="form-label">
                  <i class="icon-heading"></i>
                  文章标题
                </span>
              </template>
              <el-input
                v-model="article.title"
                placeholder="给您的文章起一个吸引人的标题..."
                class="title-input"
                size="large"
                clearable
              />
            </el-form-item>
          </div>
          
          <div class="content-section">
            <el-form-item prop="content" class="content-form-item">
              <template #label>
                <span class="form-label">
                  <i class="icon-code"></i>
                  Markdown 内容
                  <span class="markdown-hint">支持丰富的 Markdown 语法</span>
                </span>
              </template>
              
              <div class="editor-wrapper">
                <div class="editor-toolbar">
                  <div class="toolbar-section">
                    <span class="toolbar-label">格式</span>
                    <div class="toolbar-buttons">
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('**', '**')"
                        class="toolbar-btn"
                        title="粗体"
                      >
                        <i class="icon-bold"></i>
                      </el-button>
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('*', '*')"
                        class="toolbar-btn"
                        title="斜体"
                      >
                        <i class="icon-italic"></i>
                      </el-button>
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('~~', '~~')"
                        class="toolbar-btn"
                        title="删除线"
                      >
                        <i class="icon-strikethrough"></i>
                      </el-button>
                    </div>
                  </div>
                  
                  <div class="toolbar-section">
                    <span class="toolbar-label">结构</span>
                    <div class="toolbar-buttons">
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('# ', '')"
                        class="toolbar-btn"
                        title="一级标题"
                      >
                        H1
                      </el-button>
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('## ', '')"
                        class="toolbar-btn"
                        title="二级标题"
                      >
                        H2
                      </el-button>
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('### ', '')"
                        class="toolbar-btn"
                        title="三级标题"
                      >
                        H3
                      </el-button>
                    </div>
                  </div>
                  
                  <div class="toolbar-section">
                    <span class="toolbar-label">插入</span>
                    <div class="toolbar-buttons">
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('[链接文字](', ')')"
                        class="toolbar-btn"
                        title="链接"
                      >
                        <i class="icon-link"></i>
                      </el-button>
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('![图片描述](', ')')"
                        class="toolbar-btn"
                        title="图片"
                      >
                        <i class="icon-image"></i>
                      </el-button>
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('```\n', '\n```')"
                        class="toolbar-btn"
                        title="代码块"
                      >
                        <i class="icon-code-block"></i>
                      </el-button>
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('> ', '')"
                        class="toolbar-btn"
                        title="引用"
                      >
                        <i class="icon-quote"></i>
                      </el-button>
                    </div>
                  </div>
                  
                  <div class="toolbar-section">
                    <span class="toolbar-label">列表</span>
                    <div class="toolbar-buttons">
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('- ', '')"
                        class="toolbar-btn"
                        title="无序列表"
                      >
                        <i class="icon-list"></i>
                      </el-button>
                      <el-button 
                        size="small" 
                        @click="insertMarkdown('1. ', '')"
                        class="toolbar-btn"
                        title="有序列表"
                      >
                        <i class="icon-list-numbered"></i>
                      </el-button>
                    </div>
                  </div>
                </div>
                
                <div class="editor-content">
                  <el-input
                    type="textarea"
                    v-model="article.content"
                    :rows="20"
                    placeholder="在这里开始写作...

支持以下 Markdown 语法：
# 一级标题
## 二级标题
### 三级标题

**粗体文字** *斜体文字* ~~删除线~~

- 无序列表项
1. 有序列表项

> 引用文字

`行内代码`

```语言
代码块
```

[链接文字](链接地址)
![图片描述](图片地址)"
                    class="markdown-textarea"
                  />
                </div>
              </div>
            </el-form-item>
          </div>
          
          <div class="action-section">
            <div class="action-buttons">
              <el-button 
                type="primary" 
                @click="handleSave" 
                :loading="saving"
                size="large"
                class="save-btn"
              >
                <i class="icon-save"></i>
                {{ saving ? '保存中...' : '发布文章' }}
              </el-button>
              <el-button 
                @click="handleCancel" 
                size="large"
                class="cancel-btn"
              >
                <i class="icon-close"></i>
                取消
              </el-button>
            </div>
            <div class="action-hint">
              <i class="icon-info"></i>
              文章将保存为 Markdown 格式，支持后续编辑
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface Article {
  title: string
  content: string
}

const router = useRouter()
const formRef = ref<FormInstance>()
const saving = ref(false)

const article = ref<Article>({
  title: '',
  content: ''
})

const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度应在 2 到 100 个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 10, message: '文章内容至少需要 10 个字符', trigger: 'blur' }
  ]
})

// 插入Markdown语法
const insertMarkdown = (before: string, after: string) => {
  const textarea = document.querySelector('.markdown-textarea textarea') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = article.value.content.substring(start, end)
  
  const newText = before + selectedText + after
  article.value.content = 
    article.value.content.substring(0, start) + 
    newText + 
    article.value.content.substring(end)
  
  // 重新设置光标位置
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(
      start + before.length,
      start + before.length + selectedText.length
    )
  }, 0)
}

// 保存文章
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  // 确认保存
  try {
    await ElMessageBox.confirm(
      '确定要发布这篇文章吗？发布后将公开显示。',
      '确认发布',
      {
        confirmButtonText: '确认发布',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
  } catch {
    return
  }

  saving.value = true
  
  try {
    // TODO: 调用 API 保存文章
    console.log('保存文章数据：', article.value)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    ElMessage({
      message: '文章发布成功！',
      type: 'success',
      duration: 3000,
    })
    router.push('/') // 保存后跳回首页
  } catch (error) {
    console.error('保存文章失败：', error)
    ElMessage.error('文章发布失败，请重试')
  } finally {
    saving.value = false
  }
}

// 取消写作
const handleCancel = async () => {
  if (article.value.title || article.value.content) {
    try {
      await ElMessageBox.confirm(
        '您有未保存的内容，确定要离开吗？',
        '确认离开',
        {
          confirmButtonText: '确定离开',
          cancelButtonText: '继续编辑',
          type: 'warning',
        }
      )
    } catch {
      return
    }
  }
  router.push('/')
}
</script>

<style scoped>
/* 主容器 */
.write-article-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

/* 页头 */
.editor-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.page-title {
  color: rgb(27, 25, 25);
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.page-subtitle {
  color: rgba(16, 14, 14, 0.8);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

/* 主内容区 */
.editor-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

.form-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 标题区域 */
.title-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.title-form-item {
  margin-bottom: 0;
}

.title-input :deep(.el-input__wrapper) {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.title-input :deep(.el-input__wrapper):hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.title-input :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.title-input :deep(.el-input__inner) {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

/* 内容区域 */
.content-section {
  padding: 40px;
}

.content-form-item {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.markdown-hint {
  font-weight: 400;
  color: #667eea;
  font-size: 14px;
  margin-left: 8px;
}

/* 编辑器包装器 */
.editor-wrapper {
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.editor-wrapper:hover {
  border-color: #c0c4cc;
}

/* 工具栏 */
.editor-toolbar {
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toolbar-buttons {
  display: flex;
  gap: 4px;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.toolbar-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.toolbar-btn:active {
  transform: translateY(0);
}

/* 编辑器内容 */
.editor-content {
  background: white;
}

.markdown-textarea :deep(.el-textarea__inner) {
  border: none;
  border-radius: 0;
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 15px;
  line-height: 1.8;
  color: #374151;
  background: #fafbfc;
  resize: vertical;
  padding: 24px;
  transition: background-color 0.3s ease;
}

.markdown-textarea :deep(.el-textarea__inner):focus {
  background: white;
  box-shadow: inset 0 0 0 2px rgba(102, 126, 234, 0.1);
}

/* 操作区域 */
.action-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 32px 40px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

.cancel-btn {
  background: white;
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #c0c4cc;
  color: #333;
  background: #f8f9fa;
}

.action-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

/* 图标样式 */
.icon-edit::before { content: "✏️"; }
.icon-heading::before { content: "📝"; }
.icon-code::before { content: "💻"; }
.icon-bold::before { content: "B"; font-weight: bold; }
.icon-italic::before { content: "I"; font-style: italic; }
.icon-strikethrough::before { content: "S"; text-decoration: line-through; }
.icon-link::before { content: "🔗"; }
.icon-image::before { content: "🖼️"; }
.icon-code-block::before { content: "</>"; font-family: monospace; }
.icon-quote::before { content: """"; }
.icon-list::before { content: "•"; }
.icon-list-numbered::before { content: "1."; }
.icon-save::before { content: "💾"; }
.icon-close::before { content: "❌"; }
.icon-info::before { content: "ℹ️"; }

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-main {
    padding: 20px 16px 40px;
  }
  
  .title-section,
  .content-section,
  .action-section {
    padding: 24px 20px;
  }
  
  .page-title {
    font-size: 28px;
    flex-direction: column;
    gap: 8px;
  }
  
  .editor-toolbar {
    padding: 12px 16px;
    gap: 16px;
  }
  
  .toolbar-section {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .save-btn,
  .cancel-btn {
    width: 100%;
    padding: 14px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-container {
  animation: fadeInUp 0.6s ease-out;
}
</style>
