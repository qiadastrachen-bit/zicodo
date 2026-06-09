# batch_2 — 首页顶部栏重做 + 删除对话历史展示

> **生成时间**：2026-06-09
> **对应问题**：问题1（部分）+ 问题8（部分）
> **执行顺序**：按 ① → ② → ③ 顺序执行

---

## 目标

1. **删除** PetHomePage 内嵌的对话消息展示区域（QuickReplyBubble + StreamMessage，太丑）
2. **删除** 独立的 DialogueHistoryPage 页面和路由
3. **重做顶部操作栏**：三个按钮（新对话、历史、设置）使用 **lucide-vue-next** 图标替代 emoji 字符
4. **严格遵循设计规范**（CSS Variables、8pt Grid、无 emoji）
5. **保留** 简单的回复文本展示（极简，一行文字）

---

## 涉及文件（共 3 个）

| 文件 | 操作 |
|------|------|
| `frontend/src/pages/home/PetHomePage.vue` | **修改** |
| `frontend/src/pages/profile/DialogueHistoryPage.vue` | **删除** |
| `frontend/src/router/index.js` | **修改**（删除路由） |

> 不涉及后端文件。batch_1 已建好的 Dialogue 模型和 API 保留不动。

---

## 修复前状态

### PetHomePage.vue（当前 383 行）

- **第 11 行**：`import { getDialogueHistory } from '@/api/profile'` ← 需删除
- **第 14 行**：`import QuickReplyBubble from '@/components/pet/QuickReplyBubble.vue'` ← 需删除
- **第 15 行**：`import StreamMessage from '@/components/pet/StreamMessage.vue'` ← 需删除
- **第 34 行**：`const conversationHistory = ref([])` ← **保留**（用于 API 请求中的 history 参数）
- **第 55-57 行**：`goToHistory()` 跳转到 `/dialogue-history` ← 需改为简单提示
- **第 136-147 行**：onMounted 中加载历史对话 ← 需删除
- **第 154-167 行（模板）**：顶部栏使用 emoji 字符（✨ 📜 ⚙️）← 需替换为 lucide 图标
- **第 183-194 行（模板）**：conversation-area 展示 QuickReplyBubble + StreamMessage ← 需删除并替换为极简展示
- **第 264-266 行（样式）**：`.action-btn span:first-child { font-size: 20px; }` ← 需删除（不再是 span 元素）

### DialogueHistoryPage.vue（当前存在）

- 文件路径：`frontend/src/pages/profile/DialogueHistoryPage.vue`
- 内容：基本是 TODO 占位（第 10-11 行）
- 操作：**整个文件删除**

### router/index.js（当前状态）

- **第 186-190 行**（估算）：`/dialogue-history` 路由 ← 需删除

---

## 修复时

### ① 修改 `PetHomePage.vue`

#### 步骤 A — 替换 `<script setup>` 中的导入

**搜索**（第 11-15 行）：
```javascript
import { getDialogueHistory } from '@/api/profile'
import PetAvatar from '@/components/pet/PetAvatar.vue'
import MegacharDisplay from '@/components/pet/MegacharDisplay.vue'
import QuickReplyBubble from '@/components/pet/QuickReplyBubble.vue'
import StreamMessage from '@/components/pet/StreamMessage.vue'
```

**替换为**：
```javascript
import { Sparkles, ScrollText, Settings } from 'lucide-vue-next'
import PetAvatar from '@/components/pet/PetAvatar.vue'
import MegacharDisplay from '@/components/pet/MegacharDisplay.vue'
```

> **说明**：删除 `getDialogueHistory`、`QuickReplyBubble`、`StreamMessage` 的导入；新增 lucide 图标导入。

---

#### 步骤 B — 删除 `goToHistory` 函数，改为 `showHistoryTip`

**搜索**（第 54-57 行）：
```javascript
// 跳转历史对话
const goToHistory = () => {
  router.push('/dialogue-history')
}
```

**替换为**：
```javascript
// 历史对话（暂未实现）
const showHistoryTip = () => {
  alert('对话历史功能即将上线')
}
```

> **说明**：保留按钮但暂时不做跳转，点击后弹提示。

---

#### 步骤 C — 删除 onMounted 中的历史加载逻辑

**搜索**（第 126-148 行，整个 onMounted）：
```javascript
// 页面加载时获取宠物信息和对话历史
onMounted(async () => {
  if (userStore.isLoggedIn && !petStore.hasPet) {
    try {
      await petStore.fetchMyPet()
    } catch (error) {
      console.error('[PetHome] 获取宠物信息失败', error)
    }
  }

  // 加载历史对话（最近10条）
  try {
    const history = await getDialogueHistory({ limit: 10 })
    if (history && history.list && history.list.length) {
      conversationHistory.value = history.list.map(item => ({
        role: item.message ? 'user' : 'assistant',
        content: item.message || item.reply
      }))
    }
  } catch (error) {
    console.log('[PetHome] 无历史对话或加载失败')
  }
})
```

**替换为**（只保留宠物信息加载）：
```javascript
// 页面加载时获取宠物信息
onMounted(async () => {
  if (userStore.isLoggedIn && !petStore.hasPet) {
    try {
      await petStore.fetchMyPet()
    } catch (error) {
      console.error('[PetHome] 获取宠物信息失败', error)
    }
  }
})
```

---

#### 步骤 D — 替换模板中的顶部操作栏

**搜索**（第 151-167 行）：
```html
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

**替换为**（使用 lucide 图标）：
```html
    <!-- 顶部操作栏 -->
    <div class="pet-actions-bar">
      <button class="action-btn" @click="startNewChat" title="新对话">
        <Sparkles class="action-icon" :size="20" />
        <span class="action-label">新对话</span>
      </button>
      <button class="action-btn" @click="showHistoryTip" title="历史对话">
        <ScrollText class="action-icon" :size="20" />
        <span class="action-label">历史</span>
      </button>
      <button class="action-btn" @click="goToSettings" title="宠物设置">
        <Settings class="action-icon" :size="20" />
        <span class="action-label">设置</span>
      </button>
    </div>
```

> **图标说明**：
> - `Sparkles` — 新对话（对应原 ✨）
> - `ScrollText` — 历史（对应原 📜）
> - `Settings` — 设置（对应原 ⚙️）

---

#### 步骤 E — 替换对话展示区域（极简版）

**搜索**（第 183-194 行）：
```html
    <!-- 对话展示区域 -->
    <div class="conversation-area">
      <!-- 快速回复气泡 -->
      <QuickReplyBubble :text="quickReply" />

      <!-- 流式消息展示（对话开始后显示） -->
      <StreamMessage
        v-if="hasStartedChat && streamMessages.length"
        :messages="streamMessages"
        :autoPlay="true"
      />
    </div>
```

**替换为**（极简回复展示）：
```html
    <!-- 极简回复展示（对话开始后显示） -->
    <div v-if="hasStartedChat && quickReply" class="simple-reply">
      <p>{{ quickReply }}</p>
    </div>
```

> **说明**：删除 QuickReplyBubble 和 StreamMessage 的复杂展示，改用一行文字展示 AI 回复。

---

#### 步骤 F — 更新脚本中的函数引用

**搜索**（第 55 行附近，模板已改但脚本中可能还有引用）：
无需额外修改，`showHistoryTip` 已在步骤 B 中定义，`goToSettings` 保留。

---

#### 步骤 G — 删除样式中的 emoji 相关规则

**搜索**（第 264-266 行）：
```css
.action-btn span:first-child {
  font-size: 20px;
}
```

**删除整个规则**（因为不再是 `span` 元素，图标由 lucide 组件控制）。

---

#### 步骤 H — 新增极简回复展示的样式

在 `<style scoped>` 中（第 281 行附近，原 `.conversation-area` 位置），**新增**：

```css
/* 极简回复展示 */
.simple-reply {
  padding: var(--zl-space-md) var(--zl-space-lg);
  text-align: center;
}

.simple-reply p {
  display: inline-block;
  background: var(--zl-bg-cool);
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-lg);
  padding: var(--zl-space-sm) var(--zl-space-md);
  font-size: var(--zl-font-sm);
  color: var(--zl-text-primary);
  max-width: 80%;
  line-height: var(--zl-line-height-normal);
}
```

> **样式说明**：
> - 居中展示
> - 背景用 `--zl-bg-cool`，边框用 `--zl-border`（遵循设计规范）
> - 字体 `--zl-font-sm`（14px），行高 `--zl-line-height-normal`
> - 最大宽度 80%，避免长文本撑满

---

#### 步骤 I — 调整 `.pet-actions-bar` 样式（确保高度一致）

**搜索**（第 235-242 行）：
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
```

**确认或替换为**（与其他页面闹铃高度一致）：
```css
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
```

> **高度说明**：`min-height: 44px` 与其他页面的闹铃/图标按钮高度一致（参考 `ZlTopBar.vue` 和 `TaskCreatePage.vue` 的 `header-icon-btn`）。

---

#### 步骤 J — 调整 `.action-btn` 样式（图标颜色）

**搜索**（第 244-257 行）：
```css
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
```

**替换为**（添加图标颜色规则）：
```css
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

.action-icon {
  color: var(--zl-brand);
}
```

> **说明**：
> - 新增 `.action-icon` 规则，图标颜色使用品牌色 `--zl-brand`
> - `.action-btn` 添加 `min-height: 44px` 确保触控区域足够

---

### ② 删除 `DialogueHistoryPage.vue`

**操作**：直接删除文件 `frontend/src/pages/profile/DialogueHistoryPage.vue`

---

### ③ 从 `router/index.js` 删除 `/dialogue-history` 路由

**搜索**（约第 186-190 行）：
```javascript
    {
      path: 'dialogue-history',
      name: 'DialogueHistory',
      component: () => import('@/pages/profile/DialogueHistoryPage.vue'),
      meta: { title: '对话历史' }
    },
```

**删除整个路由对象**（注意逗号和大括号的匹配）。

---

## 修复后验证清单

执行完成后，逐项验证：

- [ ] `PetHomePage.vue` 第 11 行：**无** `getDialogueHistory` 导入
- [ ] `PetHomePage.vue` 第 14-15 行：**无** `QuickReplyBubble`、`StreamMessage` 导入
- [ ] `PetHomePage.vue` 脚本中：**有** `Sparkles, ScrollText, Settings` 导入
- [ ] `PetHomePage.vue` 模板中：顶部栏按钮**无** emoji 字符，使用 `<Sparkles />`, `<ScrollText />`, `<Settings />` 组件
- [ ] `PetHomePage.vue` 模板中：**无** `QuickReplyBubble` 或 `StreamMessage` 组件
- [ ] `PetHomePage.vue` 模板中：**有** `.simple-reply` 极简回复展示
- [ ] `PetHomePage.vue` onMounted：**无** `getDialogueHistory` 调用
- [ ] `PetHomePage.vue` 点击"历史"按钮：弹出 `alert('对话历史功能即将上线')`
- [ ] `DialogueHistoryPage.vue` 文件：**已删除**
- [ ] `router/index.js`：**无** `/dialogue-history` 路由
- [ ] 前端运行 `npm run dev`：**无报错**，页面正常加载
- [ ] 点击"新对话"按钮：`conversationHistory.value` 清空，`hasStartedChat` 重置
- [ ] 发送消息后：`.simple-reply` 区域显示 AI 回复文本

---

## 注意事项

1. **不要删除** `conversationHistory` 变量（第 34 行），它仍用于 API 请求中的 `history` 参数
2. **不要删除** `MegacharDisplay` 组件（第 173-180 行），保留动画效果
3. **保留** `quickReply`、`megacharData`、`streamMessages` 变量（它们仍从 API 响应中接收数据）
4. **lucide-vue-next** 已在项目中安装（`package.json` 中有），无需额外安装
5. 如果 `alert()` 不符合设计规范，可后续改为 Toast 组件（本次暂不处理）

---

## 后续任务

- **问题 6**（硬编码颜文字替换为轮播）：见单独提示词文档
- **问题 8 剩余部分**（宠物互动增强）：见单独提示词文档
- **PetSettingsPage.vue** 中的 emoji（🐱🐶🦉）：待后续处理（本次只处理 PetHomePage）
