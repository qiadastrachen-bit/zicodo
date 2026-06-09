<script setup>
/**
 * PetHomePage.vue - zicodo首页
 * 展示宠物、对话交互、输入消息
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '@/stores/pet'
import { useUserStore } from '@/stores/user'
import ZlIcon from '@/components/common/ZlIcon.vue'
import { chatWithPet } from '@/api/ziling'
import PetAvatar from '@/components/pet/PetAvatar.vue'
import MegacharDisplay from '@/components/pet/MegacharDisplay.vue'
import UserMessageBubble from '@/components/pet/UserMessageBubble.vue'
import QuickReplyBubble from '@/components/pet/QuickReplyBubble.vue'
import StreamMessage from '@/components/pet/StreamMessage.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import PointsDisplay from '@/components/pet/PointsDisplay.vue'

const router = useRouter()
const petStore = usePetStore()
const userStore = useUserStore()

// 用户输入的消息
const userInput = ref('')

// 对话状态
const isLoading = ref(false)
const errorMessage = ref('')

// zicodo回复数据
const quickReply = ref('你好呀～我是小灵！有什么想聊的吗？') // 首次进入固定文案，加载宠物后动态替换
const megacharData = ref(null)
const streamMessages = ref([])

// 对话历史（存储完整对话）
const conversationHistory = ref([])

// 是否已开始对话（控制是否显示Megachar和Stream）
const hasStartedChat = ref(false)

// 推荐问题标签
const defaultQuestions = ref([
  '今天学什么？',
  '聊聊天',
  '帮我制定学习计划'
])

// localStorage 相关
const STORAGE_KEY = 'zicodo_chat_history'
const MAX_HISTORY = 50

// 加载历史
const loadChatHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      conversationHistory.value = JSON.parse(saved)
      hasStartedChat.value = conversationHistory.value.length > 0
    }
  } catch (e) { /* ignore */ }
}

// 保存历史
const saveChatHistory = () => {
  try {
    const trimmed = conversationHistory.value.slice(-MAX_HISTORY)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (e) { /* ignore */ }
}

// 不当内容检测（简单版）
const inappropriateKeywords = ['脏话', '暴力', '色情']

const containsInappropriate = (text) => {
  return inappropriateKeywords.some(keyword => text.includes(keyword))
}

// 新对话
const startNewChat = () => {
  conversationHistory.value = []
  streamMessages.value = []
  quickReply.value = petStore.pet?.name
    ? `你好呀～我是${petStore.pet.name}！有什么想聊的吗？`
    : '你好呀～我是小灵！有什么想聊的吗？'
  hasStartedChat.value = false
  megacharData.value = null
  localStorage.removeItem(STORAGE_KEY)
}

// 历史对话（暂未实现）
const showHistoryTip = () => {
  router.push('/profile/dialogue-history')
}

// 跳转宠物设置
const goToSettings = () => {
  router.push('/profile/pet-settings')
}

// 重试获取宠物信息
const retryFetch = () => {
  errorMessage.value = ''
  if (userStore.isLoggedIn && !petStore.hasPet) {
    petStore.fetchMyPet().catch(err => {
      errorMessage.value = err.message || '获取宠物信息失败'
    })
  }
}

// 发送消息（支持直接传入文本）
const sendMessage = async (text) => {
  const message = text || userInput.value.trim()
  if (!message || isLoading.value) return

  // 检测不当内容
  if (containsInappropriate(message)) {
    errorMessage.value = '请使用文明用语哦～'
    setTimeout(() => { errorMessage.value = '' }, 3000)
    userInput.value = ''
    return
  }

  // 保存用户消息到历史
  conversationHistory.value.push({ role: 'user', content: message })
  userInput.value = ''
  isLoading.value = true
  errorMessage.value = ''
  hasStartedChat.value = true

  try {
    // 构造请求数据
    const requestData = {
      message,
      history: conversationHistory.value,
      persona: petStore.petPersonality
    }

    // 调用 API
    const response = await chatWithPet(requestData)

    // 更新回复数据
    const safeReply = containsInappropriate(response.quickReply) 
      ? '这个问题有点难回答呢，换个话题吧～' 
      : response.quickReply
    quickReply.value = safeReply
    megacharData.value = response.megachar
    streamMessages.value = response.stream

    // 保存助手回复到历史
    conversationHistory.value.push({
      role: 'assistant',
      type: 'quickReply',
      content: safeReply
    })

    saveChatHistory()
  } catch (error) {
    console.error('[PetHome] 发送消息失败', error)
    errorMessage.value = '发送失败，请重试'
    saveChatHistory()
  } finally {
    isLoading.value = false
  }
}

// 处理输入框按键（回车发送）
const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// 页面加载时获取宠物信息和聊天历史
onMounted(async () => {
  if (userStore.isLoggedIn && !petStore.hasPet) {
    try {
      await petStore.fetchMyPet()
    } catch (error) {
      console.error('[PetHome] 获取宠物信息失败', error)
    }
  }
  // 加载宠物后动态更新首语
  if (petStore.pet?.name) {
    quickReply.value = `你好呀～我是${petStore.pet.name}！有什么想聊的吗？`
  }
  loadChatHistory()
})
</script>

<template>
  <div class="pet-home-page bg-warm">
    <!-- 顶部操作栏 -->
    <div class="pet-actions-bar">
      <PointsDisplay />
      <button class="action-btn" @click="showHistoryTip" title="历史对话">
        <ZlIcon name="ScrollText" :size="20" class="action-icon" />
        <span class="action-label">历史</span>
      </button>
      <button class="action-btn" @click="goToSettings" title="宠物设置">
        <ZlIcon name="Settings" :size="20" class="action-icon" />
        <span class="action-label">设置</span>
      </button>
    </div>

    <!-- 顶部宠物展示区域 -->
    <div class="pet-display-area">
      <PetAvatar :personality="petStore.petPersonality" />

      <!-- 大zicodo展示（对话开始后显示） -->
      <MegacharDisplay
        v-if="hasStartedChat && megacharData"
        :chars="megacharData.chars"
        :direction="megacharData.direction"
        :duration="megacharData.duration"
        :rotateInterval="megacharData.rotateInterval"
      />
    </div>

    <!-- 对话区域 -->
    <div class="conversation-area">
      <!-- 推荐问题标签（仅首次对话前显示） -->
      <div v-if="!hasStartedChat" class="quick-replies">
        <button
          v-for="q in defaultQuestions"
          :key="q"
          class="quick-reply-tag"
          @click="sendMessage(q)"
        >
          {{ q }}
        </button>
      </div>

      <!-- 对话历史列表 -->
      <template v-for="(msg, idx) in conversationHistory" :key="idx">
        <!-- 用户消息 -->
        <UserMessageBubble v-if="msg.role === 'user'" :text="msg.content" />

        <!-- 助手消息 -->
        <div v-else-if="msg.role === 'assistant'" class="assistant-message-wrapper">
          <QuickReplyBubble v-if="msg.type === 'quickReply'" :text="msg.content" />
        </div>
      </template>

      <!-- 最新流式回复（实时显示） -->
      <StreamMessage
        v-if="hasStartedChat && streamMessages.length && !isLoading"
        :messages="streamMessages"
        :auto-play="true"
      />
    </div>

    <!-- 错误信息 -->
    <ErrorState
      v-if="errorMessage"
      :message="errorMessage"
      :show-retry="true"
      @retry="retryFetch"
    />

    <!-- 底部输入区域（固定定位） -->
    <div class="input-area">
      <div class="input-wrapper">
        <button class="new-chat-btn" @click="startNewChat" title="新对话">
          <ZlIcon name="Plus" :size="20" />
        </button>
        <input
          v-model="userInput"
          type="text"
          class="message-input"
          placeholder="和zicodo聊聊天吧～"
          @keydown="handleKeydown"
          :disabled="isLoading"
        />
        <button
          class="send-btn"
          @click="sendMessage()"
          :disabled="!userInput.trim() || isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          <span v-else>发送</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pet-home-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: var(--zl-content-padding);
}

/* 顶部操作栏 */
.pet-actions-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--zl-space-md);
  padding: var(--zl-space-sm) var(--zl-space-lg);
  background: var(--zl-bg);
  border-bottom: 1px solid var(--zl-border);
  min-height: 44px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-xs);
  background: none;
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  padding: var(--zl-space-sm) var(--zl-space-md);
  cursor: pointer;
  color: var(--zl-text-primary);
  font-size: var(--zl-font-xs);
  transition: all var(--zl-transition-fast);
  min-height: 44px;
}

.action-btn:hover {
  background: var(--zl-bg-cool);
  border-color: var(--zl-brand);
}

.action-icon {
  color: var(--zl-brand);
}

.action-label {
  font-size: var(--zl-font-xs);
  color: var(--zl-text-hint);
}

.pet-display-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--zl-space-xl) var(--zl-space-lg);
  min-height: 140px;
}

/* 对话区域 */
.conversation-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--zl-space-md) var(--zl-space-lg);
  overflow-y: auto;
}

/* 推荐问题标签 */
.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: var(--zl-space-sm);
  justify-content: center;
  margin-bottom: var(--zl-space-lg);
}

.quick-reply-tag {
  padding: var(--zl-space-xs) var(--zl-space-md);
  background: var(--zl-surface);
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-full);
  color: var(--zl-text-secondary);
  font-size: var(--zl-font-sm);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.quick-reply-tag:active {
  background: var(--zl-brand);
  color: #FFFFFF;
  border-color: var(--zl-brand);
}

/* 助手消息包装器 */
.assistant-message-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-bottom: var(--zl-space-md);
}

/* 底部输入区域 */
.input-area {
  position: fixed;
  bottom: var(--zl-tabbar-height);
  left: 0;
  right: 0;
  height: var(--zl-input-area-height);
  background: var(--zl-bg);
  border-top: 1px solid var(--zl-border);
  z-index: 101;
  display: flex;
  align-items: center;
  padding: 0 var(--zl-space-md);
  max-width: 430px;
  margin: 0 auto;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
  width: 100%;
  background: var(--zl-bg-cool);
  border-radius: var(--zl-radius-lg);
  padding: var(--zl-space-sm) var(--zl-space-md);
}

.new-chat-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--zl-text-hint);
  cursor: pointer;
  border-radius: var(--zl-radius-full);
  flex-shrink: 0;
  transition: color var(--zl-transition-fast);
}

.new-chat-btn:active {
  color: var(--zl-brand);
}

.message-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  outline: none;
}

.message-input::placeholder {
  color: var(--zl-text-hint);
}

.send-btn {
  background: var(--zl-brand);
  color: #FFFFFF;
  border: none;
  border-radius: var(--zl-radius-md);
  padding: var(--zl-space-sm) var(--zl-space-md);
  font-size: var(--zl-font-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--zl-transition-fast);
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  background: var(--zl-brand-dark);
  transform: scale(1.05);
}

.send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #FFFFFF;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
