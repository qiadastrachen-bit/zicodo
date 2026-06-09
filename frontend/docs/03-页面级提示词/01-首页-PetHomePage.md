# 第一页：首页 (PetHomePage.vue) — 详细页面提示词

> **这是发给执行机器人的第一张页面的详细指令。**
> 在主提示词（ziling-frontend-prompt.md）的基础上，本文件补充首页的具体实现细节。
> 将以下内容追加在主提示词之后，或者作为第一张截图的配套说明一同发送。

---

## 页面基本信息

| 属性 | 值 |
|------|-----|
| **页面名称** | 首页 / 宠物对话主页 |
| **组件路径** | `src/pages/home/PetHomePage.vue` |
| **路由** | `/pet/home` （默认首页，TabBar第一个"首页"选中项） |
| **布局父级** | `AppLayout.vue`（含底部TabBar） |
| **核心功能** | 字灵宠物展示 + AI对话交互（三阶段数据流） |

---

## 页面整体结构（从上到下）

```
┌─────────────────────────────────┐
│  （系统状态栏占位 ~44px）         │  ← 安全区域适配
├─────────────────────────────────┤
│                                 │
│          ┌──────────┐           │
│          │  字灵Logo │           │  ← PetAvatar 组件
│          │ (80px)   │           │     logo_clear.png / blink.png
│          └──────────┘           │
│                                 │
│   ╭──────────────────────╮      │
│   │ "今天也要加油呀！"    │      │  ← QuickReplyBubble 组件
│   ╰──────────────────────╯      │     来自 chat.quickReply
│                                 │
│  ┌────────────────────────┐     │
│  │ ^_^ 嗯嗯好的！          │     │  ← StreamMessage 列表
│  │    那我们开始吧～        │     │     来自 chat.stream[]
│  └────────────────────────┘     │
│  ┌────────────────────────┐     │
│  │ ≥▽≤ 加油！你可以的！     │     │
│  └────────────────────────┘     │
│                                 │
│         （可滚动区域）           │
│                                 │
├─────────────────────────────────┤
│ [........输入框........] [发送] │  ← 固定底部输入区（TabBar上方）
├─────────────────────────────────┤
│ HomeIcon首页 │PawPrintIcon互动│PlusIcon添加│CalendarIcon日历│UserIcon个人│  ← ZlTabbar 组件
└─────────────────────────────────┘
```

---

## 子组件详细说明

### 1. PetAvatar.vue — 宠物头像组件
- **路径：** `src/components/pet/PetAvatar.vue`
- **功能：** 展示字灵Logo图片，支持睁眼/眨眼状态切换
- **Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isBlinking` | Boolean | false | 是否显示眨眼状态 |
| `size` | Number/String | 80 | 头像尺寸(px) |

- **实现方式：**
  ```vue
  <template>
    <div class="pet-avatar" :style="{ width: sizePx, height: sizePx }">
      <img :src="isBlinking ? blinkSrc : logoSrc" alt="字灵" class="avatar-img" />
    </div>
  </template>

  <script setup>
  import { computed } from 'vue'

  const props = defineProps({
    isBlinking: { type: Boolean, default: false },
    size: { type: [Number, String], default: 80 }
  })

  const sizePx = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size)

  // Logo图片路径（public目录下的绝对路径）
  const logoSrc = '/logo/logo_clear.png'
  const blinkSrc = '/logo/blink.png'
  </script>

  <style scoped>
  .pet-avatar {
    border-radius: var(--zl-radius-full);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  </style>
  ```

### 2. MegacharDisplay.vue — 汉字精灵展示组件
- **路径：** `src/components/pet/MegacharDisplay.vue`
- **功能：** 显示chat接口返回的大汉字（1~4个），作为字灵的"汉字精灵"形态展示
- **Props：**

| Prop | 类型 | 说明 |
|------|------|------|
| `chars` | Array\<string\> | 汉字数组，如 `["字", "灵"]` |
| `direction` | String | `"vertical"` (≤2字) 或 `"horizontal"` (≥3字) |

- **样式要求：**
  - 每个字号：64~80px（根据chars数量自适应，越多字越小）
  - 字重：500 (Medium)
  - 颜色：`var(--zl-brand)` (#87C8B4)
  - direction=vertical 时文字竖排（writing-mode: vertical-rl）
  - 居中显示
  - ⚠️ **不需要任何动画！直接静态显示即可**

- **在首页中的位置：** PetAvatar下方、QuickReplyBubble上方
- **注意：** 如果chat返回的megachar为空或没有chars，则隐藏此组件（不渲染）

### 3. QuickReplyBubble.vue — 快捷回复气泡
- **路径：** `src/components/pet/QuickReplyBubble.vue`
- **功能：** 显示chat接口返回的简短回复（≤20字）
- **Props：**

| Prop | 类型 | 说明 |
|------|------|------|
| `text` | String | 回复文本内容 |

- **样式要求：**
  ```css
  .quick-reply-bubble {
    background: var(--zl-brand);           /* #87C8B4 */
    color: var(--zl-text-secondary);       /* #FFFFFF 白字 */
    border-radius: var(--zl-radius-lg);    /* 20px 大圆角气泡感 */
    padding: 12px 24px;
    font-size: var(--zl-font-size-base);   /* 16px */
    font-weight: 500;                       /* Medium 稍微突出 */
    display: inline-block;
    max-width: 80%;
    text-align: center;
    /* 不需要动画，直接显示 */
  }
  ```
- **位置：** MegacharDisplay下方，居中对齐
- **注意：** 如果text为空则不渲染

### 4. StreamMessage.vue — 流式消息段
- **路径：** `src/components/pet/StreamMessage.vue`
- **功能：** 显示chat.stream[]中的每一条消息段
- **Props：**

| Prop | 类型 | 说明 |
|------|------|------|
| `text` | String | 消息文本内容 |
| `emoji` | String | 颜文字表情（如 ^_^, T_T, Q_Q） |
| `word` | String \| null | 可选的展示词语（如成语/关键词） |

- **样式要求：**
  ```css
  .stream-message {
    background: var(--zl-bg-card);         /* #FFFFFF 白色卡片 */
    border-radius: var(--zl-radius-md);    /* 12px */
    box-shadow: var(--zl-shadow-sm);       /* 轻微阴影 */
    padding: var(--zl-space-md);           /* 16px */
    margin-bottom: var(--zl-space-sm);     /* 8px 间距 */
    font-size: var(--zl-font-size-base);   /* 16px */
    line-height: 1.6;
  }
  .stream-emoji {
    font-size: var(--zl-font-size-lg);     /* 18px 表情稍大 */
    margin-right: var(--zl-space-sm);      /* 8px */
  }
  .stream-word {
    color: var(--zl-brand);                /* 展示词用品牌色高亮 */
    font-weight: 500;
  }
  ```
- **模板结构：**
  ```vue
  <div class="stream-message">
    <span class="stream-emoji">{{ emoji }}</span>
    <span class="stream-text">{{ text }}</span>
    <span v-if="word" class="stream-word">「{{ word }}」</span>
  </div>
  ```

---

## PetHomePage.vue 主组件逻辑

### 数据流（三阶段展示）

```
用户发送消息
    ↓
POST /ziling/api/chat  { message, history[], persona, schedule? }
    ↓
收到响应 {
  quickReply: "简短回复",     → 第1阶段：QuickReplyBubble
  megachar: { chars: [...] }, → 第2阶段：MegacharDisplay
  stream: [...],              → 第3阶段：StreamMessage列表（循环）
}
    ↓
更新页面展示（全部替换，无动画）
```

### 核心状态（reactive data）

```javascript
const state = reactive({
  // 输入相关
  inputText: '',              // 当前输入框文字
  isSending: false,            // 是否正在发送（防重复提交）

  // 宠物展示
  isBlinking: false,           // 宠物是否眨眼
  megacharChars: [],           // 汉字精灵字符数组
  megacharDirection: 'vertical',

  // 对话数据
  quickReply: '',             // 快捷回复文本
  streamMessages: [],          // StreamMessage[] 数组

  // 对话历史（本地维护）
  history: [],                 // [{role, content}, ...] 最近6~10轮

  // 服务状态
  serviceOnline: false,       // 后端服务是否在线
})
```

### 生命周期

```javascript
onMounted(async () => {
  // 1. 检测后端服务可用性
  try {
    await zilingApi.ping()
    state.serviceOnline = true
  } catch (e) {
    state.serviceOnline = false
    // 可选：显示一个Toast提示"服务暂不可用"
  }

  // 2. 发送一条欢迎消息（可选）
  // await sendMessage('你好')  // 或者等用户主动输入
})
```

### 核心方法：sendMessage()

```javascript
async function sendMessage() {
  if (!state.inputText.trim() || state.isSending) return

  const userMessage = state.inputText.trim()
  state.inputText = ''
  state.isSending = true

  // 1. 记录用户消息到历史
  state.history.push({ role: 'user', content: userMessage })

  // 2. 构建请求体
  const requestBody = {
    message: userMessage,
    history: state.history.slice(-10),  // 最近10轮
    persona: 'gentle',                   // 默认温柔性格
    // schedule: 可选，如果有日程数据的话
  }

  try {
    // 3. 调用核心对话接口
    const res = await zilingApi.chat(requestBody)
    const data = res.data  // { code, message, data: { quickReply, megachar, stream } }

    // 4. 记录助手回复到历史
    const assistantContent = data.quickReply || ''
    state.history.push({ role: 'assistant', content: assistantContent })

    // 5. 更新三阶段展示数据（全部替换，无动画）
    state.quickReply = data.quickReply || ''

    if (data.megachar?.chars?.length > 0) {
      state.megacharChars = data.megachar.chars
      state.megacharDirection = data.megachar.direction || 'vertical'
    }

    if (data.stream?.length > 0) {
      // 追加新的stream消息（不清空旧的）
      state.streamMessages.push(...data.stream)
    }

    // 6. 随机触发眨眼效果（30%概率）
    if (Math.random() < 0.3) {
      state.isBlinking = true
      setTimeout(() => { state.isBlinking = false }, 800)
    }
  } catch (error) {
    console.error('对话请求失败:', error)
    // TODO: 显示错误提示 Toast
  } finally {
    state.isSending = false
  }
}
```

### 底部输入区（固定定位）

```vue
<!-- 固定在底部的输入区 -->
<div class="input-bar">
  <input
    v-model="state.inputText"
    type="text"
    placeholder="和字灵聊聊天..."
    @keyup.enter="sendMessage"
    :disabled="state.isSending"
    class="chat-input"
  />
  <button
    @click="sendMessage"
    :disabled="state.isSending || !state.inputText.trim()"
    class="send-btn"
  >
    {{ state.isSending ? '...' : '发送' }}
  </button>
</div>
```

```css
.input-bar {
  position: fixed;
  bottom: 56px;           /* TabBar高度之上（假设TabBar高56px） */
  left: 0;
  right: 0;
  height: 56px;
  background: var(--zl-bg-card);
  border-top: 1px solid var(--zl-border);
  display: flex;
  align-items: center;
  padding: 0 var(--zl-space-md);
  gap: var(--zl-space-sm);
}
.chat-input {
  flex: 1;
  height: 36px;
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-full);
  padding: 0 var(--zl-space-md);
  font-family: var(--zl-font-family);
  font-size: var(--zl-font-size-base);
  background: transparent;
  outline: none;
}
.send-btn {
  height: 36px;
  padding: 0 16px;
  border-radius: var(--zl-radius-full);
  background: var(--zl-brand);
  color: var(--zl-text-secondary);
  border: none;
  font-family: var(--zl-font-family);
  font-size: var(--zl-font-size-sm);
  cursor: pointer;
}
.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 整体页面布局样式

```css
.pet-home-page {
  min-height: 100vh;
  background: var(--zl-bg);
  padding-bottom: 120px;  /* 为输入区+TabBar留空间 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 宠物展示区（上半部分）：居中 */
.pet-display-area {
  flex-shrink: 0;
  padding-top: 60px;     /* 状态栏+间距 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-md);
}

/* 消息流区域（下半部分）：可滚动 */
.message-area {
  flex: 1;
  width: 100%;
  max-width: 400px;     /* 移动端最大宽度 */
  padding: var(--zl-space-md);
  overflow-y: auto;
}
```

---

## 数据来源汇总

| 数据 | 来源API | 触发时机 | 存储位置 |
|------|---------|---------|---------|
| 服务检测 | GET `/ziling/api/ping` | 页面加载时(onMounted) | state.serviceOnline |
| 对话响应 | POST `/ziling/api/chat` | 用户点击发送 | state.quickReply/megachar/stream |
| 对话历史 | 本地维护(reactive) | 每次发送/接收后push | state.history[] |
| 宠物头像 | 本地PNG文件 | 始终显示 | `/logo/logo_clear.png`, `/logo/blink.png` |

---

## 注意事项（重要！⚠️）

1. **不要写任何CSS动画！** 开屏动画有独立的splash包处理。页面内的所有切换都是**直接替换DOM/数据**，不需要transition/animation/keyframes
2. **所有样式必须使用CSS变量！** 禁止硬编码颜色值、字号、间距。唯一允许硬编码的是magic number（如 `padding-bottom: 120px` 为底部固定元素留空间）
3. **输入区的z-index要正确**：输入区 fixed 定位要在 TabBar 上方（z-index > TabBar的z-index），但低于开屏层(z-index: 9999)
4. **history数组限制长度**：每次发送时只带最近6~10轮，防止payload过大
5. **错误处理**：如果 `/ziling/api/chat` 请求失败，显示友好提示，不要崩溃。如果 ping 失败，可以禁用输入框并提示"服务暂不可用"
6. **MegacharDisplay是可选的**：如果后端返回的megachar为空或不包含chars数组，就隐藏这个组件，不影响其他两个阶段的展示
7. **颜文字emoji来自后端**：不要自己生成emoji，全部使用chat接口返回的数据。颜文字一览.md仅作为参考
