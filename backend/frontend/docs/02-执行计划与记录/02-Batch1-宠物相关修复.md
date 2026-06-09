# Batch 1 执行提示词 — 宠物相关修复

> **批次范围**: 问题 1 + 问题 6 + 问题 8（宠物相关 3 个问题）
> **执行方式**: 执行机器人按提示词逐一操作，每步完成后报告
> **回滚准备**: 执行前确保 `D:/Ziling-app/backend/frontend/` 已提交 git 或备份

---

## 概览表

| 问题 | 文件 | 改动类型 | 预估行数 |
|------|------|----------|----------|
| 问题1 宠物设置页补充 | `src/stores/pet.js`, 新建 `src/pages/profile/PetSettingsPage.vue` | 新建页面 + Store 扩展 | +150 |
| 问题6 颜文字轮播 | `src/components/schedule/EmptyState.vue`, 新建 `src/components/common/EmojiCarousel.vue` | 新建组件 + 替换硬编码 | +80/-3 |
| 问题8 宠物互动增强 | `src/pages/home/PetHomePage.vue`, `src/api/ziling.js` | 现有页面增强 | +200 |

**合计变动**: 约 430 行（新建 ~230 行，修改 ~200 行）

---

## 提示词 1：宠物设置页补充（问题 1）

### 目标
在 `src/pages/profile/` 下新建 `PetSettingsPage.vue`，允许用户修改宠物个性（personality），并在设置页添加入口。

### 执行步骤

#### 步骤 1：扩展 pet Store，添加 personality 更新 action

**文件**: `src/stores/pet.js`

在 `actions` 中添加新方法（放在 `updatePet` 之后）：

```javascript
// 更新宠物个性
async updatePersonality(personality) {
  if (!this.pet) return
  try {
    const updated = await updatePet(this.pet.id, { personality })
    this.pet = updated
    localStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(updated))
    return updated
  } catch (error) {
    throw error
  }
}
```

同时确保 `updatePet` API 支持 `personality` 字段（已支持，无需修改 `src/api/pet.js`）。

#### 步骤 2：新建 PetSettingsPage.vue

**文件**: `src/pages/profile/PetSettingsPage.vue`

```vue
<script setup>
/**
 * PetSettingsPage.vue - 宠物设置页
 * 允许修改宠物昵称、个性（personality）
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '@/stores/pet'
import { updatePet } from '@/api/pet'

const router = useRouter()
const petStore = usePetStore()

// 表单状态
const petName = ref('')
const selectedPersonality = ref('gentle')
const isSaving = ref(false)
const saveMessage = ref('')

// 个性选项（与后端一致）
const personalityOptions = [
  { value: 'gentle', label: '温柔', desc: '温和耐心，善于倾听', emoji: '🐱' },
  { value: 'lively', label: '活泼', desc: '活力四射，鼓励行动', emoji: '🐶' },
  { value: 'tsundere', label: '傲娇', desc: '嘴硬心软，别样可爱', emoji: '🐱' },
  { value: 'calm', label: '沉稳', desc: '冷静理性，深度分析', emoji: '🦉' }
]

// 初始化表单
onMounted(() => {
  if (petStore.pet) {
    petName.value = petStore.petName
    selectedPersonality.value = petStore.petPersonality
  }
})

// 保存设置
const saveSettings = async () => {
  if (!petName.value.trim() || isSaving.value) return
  isSaving.value = true
  saveMessage.value = ''

  try {
    const updateData = {
      name: petName.value.trim()
    }
    // 仅当个性改变时才更新
    if (selectedPersonality.value !== petStore.petPersonality) {
      updateData.personality = selectedPersonality.value
    }

    const updated = await updatePet(petStore.pet.id, updateData)
    petStore.updatePetLocal(updated)
    saveMessage.value = '保存成功！'
    setTimeout(() => { saveMessage.value = '' }, 2000)
  } catch (error) {
    saveMessage.value = '保存失败，请重试'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="pet-settings-page">
    <div class="page-header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1 class="page-title">宠物设置</h1>
      <div class="placeholder"></div>
    </div>

    <div class="settings-content">
      <!-- 宠物昵称 -->
      <div class="setting-section">
        <h2 class="section-title">宠物昵称</h2>
        <input
          v-model="petName"
          type="text"
          class="name-input"
          placeholder="给宠物取个名字"
          maxlength="20"
        />
      </div>

      <!-- 个性选择 -->
      <div class="setting-section">
        <h2 class="section-title">宠物个性</h2>
        <div class="personality-options">
          <div
            v-for="opt in personalityOptions"
            :key="opt.value"
            class="personality-card"
            :class="{ active: selectedPersonality === opt.value }"
            @click="selectedPersonality = opt.value"
          >
            <span class="personality-emoji">{{ opt.emoji }}</span>
            <div class="personality-info">
              <span class="personality-label">{{ opt.label }}</span>
              <span class="personality-desc">{{ opt.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="save-section">
        <button
          class="save-btn"
          @click="saveSettings"
          :disabled="!petName.trim() || isSaving"
        >
          {{ isSaving ? '保存中...' : '保存设置' }}
        </button>
        <p v-if="saveMessage" class="save-message" :class="{ success: saveMessage.includes('成功') }">
          {{ saveMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pet-settings-page {
  width: 100%;
  min-height: 100vh;
  background: var(--zl-bg-warm);
  padding-bottom: var(--zl-tabbar-height);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zl-space-lg);
  background: var(--zl-bg);
  border-bottom: 1px solid var(--zl-border);
}

.back-btn {
  background: none;
  border: none;
  font-size: var(--zl-font-lg);
  cursor: pointer;
  color: var(--zl-text-primary);
  padding: var(--zl-space-xs);
}

.page-title {
  font-size: var(--zl-font-lg);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0;
}

.placeholder { width: 32px; }

.settings-content {
  padding: var(--zl-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-xl);
}

.setting-section {
  background: var(--zl-bg);
  border-radius: var(--zl-radius-lg);
  padding: var(--zl-space-lg);
}

.section-title {
  font-size: var(--zl-font-base);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0 0 var(--zl-space-md) 0;
}

.name-input {
  width: 100%;
  padding: var(--zl-space-md);
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  background: var(--zl-bg-cool);
  outline: none;
  box-sizing: border-box;
}

.name-input:focus {
  border-color: var(--zl-brand);
}

.personality-options {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
}

.personality-card {
  display: flex;
  align-items: center;
  gap: var(--zl-space-md);
  padding: var(--zl-space-md);
  border: 2px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.personality-card.active {
  border-color: var(--zl-brand);
  background: var(--zl-bg-warm);
}

.personality-emoji {
  font-size: 32px;
  flex-shrink: 0;
}

.personality-info {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-xs);
}

.personality-label {
  font-size: var(--zl-font-base);
  font-weight: 600;
  color: var(--zl-text-primary);
}

.personality-desc {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
}

.save-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-sm);
  padding: var(--zl-space-lg) 0;
}

.save-btn {
  width: 100%;
  padding: var(--zl-space-md);
  background: var(--zl-brand);
  color: #FFFFFF;
  border: none;
  border-radius: var(--zl-radius-lg);
  font-size: var(--zl-font-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-btn:hover:not(:disabled) {
  background: var(--zl-brand-dark);
}

.save-message {
  font-size: var(--zl-font-sm);
  color: var(--zl-danger);
  margin: 0;
}

.save-message.success {
  color: var(--zl-success);
}
</style>
```

#### 步骤 3：在设置页添加宠物设置入口

**文件**: `src/pages/profile/SettingsPage.vue`

在设置列表中添加宠物设置入口（找到设置列表数组，添加新项）：

```javascript
// 在设置项列表中添加
{
  label: '宠物设置',
  icon: '🐾',
  to: '/profile/pet-settings'
}
```

同时在路由配置中添加新页面路由。

#### 步骤 4：添加路由

**文件**: `src/router/index.js`（或类似路由文件）

在 `profile` 相关路由中添加：

```javascript
{
  path: '/profile/pet-settings',
  name: 'PetSettings',
  component: () => import('@/pages/profile/PetSettingsPage.vue'),
  meta: { requiresAuth: true }
}
```

### 验证方式
1. 进入"设置"页，看到"宠物设置"入口
2. 点击进入宠物设置页
3. 修改昵称和个性，点击保存
4. 刷新页，确认设置已持久化（localStorage + 后端）

---

## 提示词 2：硬编码颜文字替换为轮播组件（问题 6）

### 目标
新建 `EmojiCarousel.vue` 通用轮播组件，替换 `EmptyState.vue` 中的硬编码颜文字。

### 执行步骤

#### 步骤 1：新建 EmojiCarousel.vue 组件

**文件**: `src/components/common/EmojiCarousel.vue`

```vue
<script setup>
/**
 * EmojiCarousel.vue - 颜文字/emoji 轮播组件
 * 支持自动轮播和手动切换
 * Props:
 *   - emojis: Array<string> 颜文字数组
 *   - interval: number 轮播间隔（ms），默认 3000
 *   - autoplay: boolean 是否自动轮播，默认 true
 */
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  emojis: {
    type: Array,
    default: () => ['(·∀·)', '(·∇·)', '(·▿·*)', '(◕‿◕)', '(￣▽￣*)']
  },
  interval: {
    type: Number,
    default: 3000
  },
  autoplay: {
    type: Boolean,
    default: true
  }
})

const currentIndex = ref(0)
let timer = null

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.emojis.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.emojis.length) % props.emojis.length
}

const goTo = (index) => {
  currentIndex.value = index
}

onMounted(() => {
  if (props.autoplay && props.emojis.length > 1) {
    timer = setInterval(next, props.interval)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="emoji-carousel">
    <div class="carousel-track">
      <transition-group name="carousel" tag="div" class="carousel-inner">
        <span
          v-for="(emoji, index) in emojis"
          :key="index"
          v-show="index === currentIndex"
          class="carousel-emoji"
        >
          {{ emoji }}
        </span>
      </transition-group>
    </div>

    <!-- 指示器 -->
    <div v-if="emojis.length > 1" class="carousel-indicators">
      <button
        v-for="(emoji, index) in emojis"
        :key="index"
        class="indicator-dot"
        :class="{ active: index === currentIndex }"
        @click="goTo(index)"
      ></button>
    </div>

    <!-- 手动切换按钮（可选） -->
    <div v-if="emojis.length > 1" class="carousel-controls">
      <button class="control-btn" @click="prev">‹</button>
      <button class="control-btn" @click="next">›</button>
    </div>
  </div>
</template>

<style scoped>
.emoji-carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-md);
}

.carousel-track {
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-emoji {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  white-space: nowrap;
}

.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.5s ease;
}

.carousel-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.carousel-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.2);
}

.carousel-indicators {
  display: flex;
  gap: var(--zl-space-sm);
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--zl-border);
  cursor: pointer;
  padding: 0;
  transition: all var(--zl-transition-fast);
}

.indicator-dot.active {
  background: var(--zl-brand);
  width: 16px;
  border-radius: 4px;
}

.carousel-controls {
  display: flex;
  gap: var(--zl-space-md);
}

.control-btn {
  background: var(--zl-bg-cool);
  border: 1px solid var(--zl-border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--zl-text-primary);
  transition: all var(--zl-transition-fast);
}

.control-btn:hover {
  background: var(--zl-brand);
  color: #FFFFFF;
  border-color: var(--zl-brand);
}
</style>
```

#### 步骤 2：修改 EmptyState.vue，使用 EmojiCarousel

**文件**: `src/components/schedule/EmptyState.vue`

```vue
<template>
  <div class="empty-state">
    <EmojiCarousel :emojis="emojiList" />
    <p class="empty-text">{{ message }}</p>
  </div>
</template>

<script setup>
import EmojiCarousel from '@/components/common/EmojiCarousel.vue'

const props = defineProps({
  message: { type: String, default: '暂无数据' },
  // 允许自定义颜文字列表
  emojiList: {
    type: Array,
    default: () => ['(·∀·)', '(·∇·)', '(·▿·*)', '(◕‿◕)', '（￣▽￣）']
  }
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--zl-space-xxl) var(--zl-space-md);
}

.empty-text {
  font-size: var(--zl-font-base);
  color: var(--zl-text-hint);
  margin-top: var(--zl-space-md);
}
</style>
```

**删除**: 原模板中的 `<div class="empty-emoji">(·∀·)(·∇·)(·▿·*)</div>` 及相关 CSS `.empty-emoji`。

#### 步骤 3：（可选）在 StreamMessage.vue 中也使用轮播

如果希望宠物对话中的 emoji 也支持轮播效果，可以修改 `StreamMessage.vue`，但这会改变现有交互，建议作为后续优化。

### 验证方式
1. 打开任意空状态页面（如任务列表为空）
2. 观察颜文字是否自动轮播
3. 点击指示器或切换按钮，确认手动切换正常

---

## 提示词 3：宠物互动功能增强（问题 8）

### 目标
增强 `PetHomePage.vue`，添加：
1. 个性设置入口（跳转到 PetSettingsPage）
2. 历史对话查看（使用现有的 DialogueHistoryPage）
3. 新对话按钮（清空当前对话）
4. 不当回复处理（过滤/提示）

### 执行步骤

#### 步骤 1：修改 PetHomePage.vue，添加顶部操作栏

在 `<div class="pet-display-area">` 之前添加：

```vue
<!-- 顶部操作栏 -->
<div class="pet-actions-bar">
  <button class="action-btn" @click="startNewChat" title="新对话">
    <span>✨</span>
    <span class="action-label">新对话</span>
  </button>
  <button class="action-btn" @click="goToHistory" title="历史对话">
    <span>📜</span>
    <span class="action-label">历史</span>
  </button>
  <button class="action-btn" @click="goToSettings" title="宠物设置">
    <span>⚙️</span>
    <span class="action-label">设置</span>
  </button>
</div>
```

在 `<script setup>` 中添加方法：

```javascript
import { useRouter } from 'vue-router'
const router = useRouter()

// 新对话
const startNewChat = () => {
  conversationHistory.value = []
  streamMessages.value = []
  quickReply.value = '你好呀～我是zicodo！有什么想聊的吗？'
  hasStartedChat.value = false
}

// 跳转历史对话
const goToHistory = () => {
  router.push('/profile/dialogue-history')
}

// 跳转宠物设置
const goToSettings = () => {
  router.push('/profile/pet-settings')
}
```

#### 步骤 2：添加不当回复过滤

在 `sendMessage` 函数中，添加关键词过滤：

```javascript
// 不当内容检测（简单版）
const inappropriateKeywords = ['脏话', '暴力', '色情'] // 实际关键词需补充

const containsInappropriate = (text) => {
  return inappropriateKeywords.some(keyword => text.includes(keyword))
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  // 检测不当内容
  if (containsInappropriate(userInput.value)) {
    errorMessage.value = '请使用文明用语哦～'
    setTimeout(() => { errorMessage.value = '' }, 3000)
    userInput.value = ''
    return
  }

  // ... 原有逻辑
}
```

同时，对 AI 回复也进行过滤（在收到回复后）：

```javascript
// 在 try 块中，更新回复数据后添加
if (containsInappropriate(response.quickReply)) {
  response.quickReply = '这个问题有点难回答呢，换个话题吧～'
}
```

#### 步骤 3：显示对话历史（从 localStorage 或后端加载）

在 `onMounted` 中加载历史对话：

```javascript
import { getDialogueHistory } from '@/api/pet' // 需要后端提供此 API

onMounted(async () => {
  if (userStore.isLoggedIn && !petStore.hasPet) {
    try {
      await petStore.fetchMyPet()
    } catch (error) {
      console.error('[PetHome] 获取宠物信息失败', error)
    }
  }

  // 加载历史对话（最近 10 条）
  try {
    const history = await getDialogueHistory({ limit: 10 })
    if (history && history.length) {
      conversationHistory.value = history.map(item => ({
        role: item.role,
        content: item.content
      }))
    }
  } catch (error) {
    console.log('[PetHome] 无历史对话或加载失败')
  }
})
```

#### 步骤 4：添加顶部操作栏样式

在 `<style scoped>` 中添加：

```css
/* 顶部操作栏 */
.pet-actions-bar {
  display: flex;
  justify-content: center;
  gap: var(--zl-space-md);
  padding: var(--zl-space-md) var(--zl-space-lg);
  background: var(--zl-bg);
  border-bottom: 1px solid var(--zl-border);
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
}

.action-btn:hover {
  background: var(--zl-bg-cool);
  border-color: var(--zl-brand);
}

.action-btn span:first-child {
  font-size: 20px;
}

.action-label {
  font-size: var(--zl-font-xs);
  color: var(--zl-text-hint);
}
```

### 验证方式
1. 进入宠物首页，看到顶部操作栏（新对话、历史、设置）
2. 点击"新对话"，确认对话清空
3. 输入不当内容，确认有提示
4. 点击"历史"，跳转到历史对话页
5. 点击"设置"，跳转到宠物设置页

---

## 执行顺序建议

1. **先执行提示词 2**（颜文字轮播，独立组件，风险低）
2. **再执行提示词 1**（宠物设置页，新建文件，风险中等）
3. **最后执行提示词 3**（宠物互动增强，修改现有页面，风险较高）

每步执行后验证功能，确认无报错再继续。

---

## 后端配合事项

以下问题需要后端同步修改：

| 问题 | 后端改动 |
|------|----------|
| 问题 1 | `updatePet` API 已支持 `personality` 字段（无需修改） |
| 问题 8 | 需要新增 `GET /api/pets/:id/dialogues` 接口，返回对话历史 |

如果后端暂不支持对话历史接口，可以先用 localStorage 存储最近对话作为临时方案。

---

**生成时间**: 2026-06-09 00:30
**生成者**: 提示词完善顾问（ArchitectUX）
**使用前确认**: 执行机器人请先读懂提示词，再动手操作
