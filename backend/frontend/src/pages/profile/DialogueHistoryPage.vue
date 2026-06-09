<template>
  <div class="dialogue-history-page">
    <!-- 顶部导航栏 -->
    <ZlTopBar title="对话历史" @back="router.back()" />

    <div class="page-content">
      <!-- 对话列表 -->
      <div v-if="historyList.length > 0" class="history-list">
        <div
          v-for="item in historyList"
          :key="item.id"
          class="history-item"
          @click="showDetail(item)"
        >
          <div class="message-preview">{{ truncateText(item.message, 30) }}</div>
          <div class="reply-preview">{{ truncateText(item.reply, 40) }}</div>
          <div class="meta-row">
            <span class="time">{{ formatTime(item.createdAt) }}</span>
            <span v-if="item.persona" class="persona-tag">{{ personaLabel(item.persona) }}</span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <EmptyState
        v-else
        message="暂无对话记录"
        description="与 zicodo 聊天后，对话记录会出现在这里"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ZlTopBar from '@/components/common/ZlTopBar.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getDialogueHistory } from '@/api/profile'

const router = useRouter()
const historyList = ref([])
const isLoading = ref(false)

// 加载对话历史
async function loadHistory() {
  isLoading.value = true
  try {
    const res = await getDialogueHistory({ page: 1, limit: 50 })
    historyList.value = res.list || []
  } catch (err) {
    console.error('[DialogueHistory] 加载失败', err.message)
  } finally {
    isLoading.value = false
  }
}

// 截断文本
function truncateText(text, maxLen) {
  if (!text) return ''
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
}

// 格式化时间
function formatTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMin = Math.floor(diffMs / 60000)
  
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}小时前`
  
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

// 性格标签
function personaLabel(p) {
  const map = { gentle: '温柔', lively: '活泼', tsundere: '傲娇', calm: '沉稳' }
  return map[p] || p
}

// 查看详情（暂用 alert，后续可改底部面板）
function showDetail(item) {
  alert(`用户：${item.message}\n\nAI：${item.reply}`)
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.dialogue-history-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.page-content {
  flex: 1;
  padding: var(--zl-space-lg) var(--zl-space-md);
  padding-bottom: calc(var(--zl-space-lg) + 56px); /* TabBar 高度 */
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-sm);
}

.history-item {
  padding: var(--zl-space-md);
  background: var(--zl-surface);
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.history-item:active {
  background: var(--zl-bg-cool);
  border-color: var(--zl-brand);
}

.message-preview {
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  font-weight: var(--zl-weight-medium);
  margin-bottom: var(--zl-space-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reply-preview {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: var(--zl-space-xs);
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--zl-space-xs);
}

.time {
  font-size: var(--zl-font-xs);
  color: var(--zl-text-hint);
}

.persona-tag {
  font-size: var(--zl-font-xs);
  color: var(--zl-brand);
  background: var(--zl-primary-50, #E8F4F0);
  padding: var(--zl-space-xs) var(--zl-space-sm);
  border-radius: var(--zl-radius-full);
}
</style>
