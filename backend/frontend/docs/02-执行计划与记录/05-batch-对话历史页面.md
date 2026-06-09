# batch_3 — 对话历史页面完善

## ⚠️ 最高优先级硬性规则（4 条，违反任何一条立即停止）

1. **严格按照主提示词和设计规范**：所有 CSS 必须使用 `var(--zl-xxx)` design tokens，严禁硬编码颜色/字号/间距。除了 API 调用和交互逻辑的连接，**不允许破坏已有组件结构和页面架构**。
2. **每一步细节化操作必须先与用户敲定**：不允许擅自做、擅自跳过、擅自合并步骤。先汇报计划 → 等确认 → 再执行。
3. **给执行机器人的操作方案必须精准明确**：不允许给出模棱两可的答案。每个文件必须写明精确路径、精确行号范围、精确改动内容（新代码必须给出完整模板）。
4. **修复前汇报计划 → 修复时边做边说 → 修复后给出具体无误的修复报告**。

---

## 📂 参考文档（执行前必须阅读）

| 文档 | 路径 | 用途 |
|------|------|------|
| 主提示词 | `docs/ziling-frontend-prompt.md` | 整体架构和规范 |
| 设计规范 | `docs/design-system-spec.md` | CSS Design Token 定义 |
| batch_1 | `docs/batch_1-对话历史接口.md` | 后端接口已完成部分 |
| 6.8 用户体验审核 | `docs/6.8用户体验审核提示词.md` | 提示词文档结构参考 |

---

## 🎯 目标

1. **修复后端** `aiController.js`（补 `listDialogues` 函数）
2. **重建前端** `DialogueHistoryPage.vue`（完整历史对话页面）
3. **修复路由** `router/index.js`（加回 `/dialogue-history` 路由）
4. **修改** `PetHomePage.vue`（"历史"按钮跳转真实页面）

---

## 📋 任务拆解（A → B，严格顺序）

### A. 修复后端（3 个文件）

#### A-① `aiController.js` — 补 `Dialogue` 引入 + `ok` 引入 + `listDialogues()` + 导出

**修复前现状**（精确行号）：

| 行号 | 当前内容 | 问题 |
|--------|----------|------|
| 第 18 行 | `const { Pet } = require('../models');` | 缺少 `Dialogue` |
| 第 19 行 | `const { fail } = require('../utils/helpers');` | 缺少 `ok` |
| 第 201-203 行 | `module.exports = { chat, addMemory };` | 缺少 `listDialogues` |
| 全文 | 无 `listDialogues()` 函数 | 函数缺失 |

**执行机器人修复时边做边说**：
- "正在修改第 18 行：补 `Dialogue` 到模型引入"
- "正在修改第 19 行：补 `ok` 到 helpers 引入"
- "正在第 217 行后插入 `listDialogues()` 函数"
- "正在修改第 201-203 行：导出加入 `listDialogues`"

**修复时（精确操作方案）**：

**改法 A**：第 18 行改为：
```javascript
const { Pet, Dialogue } = require('../models');
```

**改法 B**：第 19 行改为：
```javascript
const { ok, fail } = require('../utils/helpers');
```

**改法 C**：在 `addMemory()` 函数结束后（第 217 行 `}` 之后）、`module.exports` 之前，插入 `listDialogues()` 函数：

```javascript
/**
 * GET /api/ai/dialogues
 * 查询当前用户的对话历史（分页）
 * query: { page?, limit? }
 */
async function listDialogues(req, res) {
  const page  = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);

  try {
    const { count, rows } = await Dialogue.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'message', 'reply', 'persona', 'mood', 'createdAt'],
    });

    return ok(res, { list: rows, total: count });
  } catch (err) {
    console.error('[listDialogues]', err.message);
    return fail(res, '获取对话历史失败');
  }
}
```

**改法 D**：第 201-203 行改为：
```javascript
module.exports = { chat, addMemory, listDialogues };
```

**修复后验证**：
1. 确认第 18 行引入了 `Dialogue`
2. 确认第 19 行引入了 `ok`
3. 确认 `listDialogues()` 函数已插入（在第 217 行之后）
4. 确认 `module.exports` 包含 `listDialogues`
5. 重启后端服务器，无报错

---

#### A-② `models/index.js` — 确认 Dialogue 已集成

**修复前现状**（精确行号）：

| 行号 | 当前内容 | 状态 |
|--------|----------|------|
| 第 13 行 | `const Dialogue = require('./Dialogue');` | ✅ 已存在 |
| 第 37-39 行 | `User.hasMany(Dialogue, ...)` + `Dialogue.belongsTo(User, ...)` | ✅ 已存在 |
| 第 41 行 | `module.exports = { User, Task, Pet, PointLog, Team, Dialogue };` | ✅ 已存在 |

**执行机器人修复时边做边说**：
- "正在检查第 13 行：Dialogue 引入 ✅"
- "正在检查第 37-39 行：关联关系 ✅"
- "正在检查第 41 行：导出 ✅"
- "models/index.js 无需修改"

**修复后验证**：
1. 确认 3 处均已正确配置
2. 如缺失则补（按 A-① 的精确行号操作）

---

#### A-③ 重启后端 — 确认 `dialogues` 表已创建

**修复前现状**：
- Sequelize 配置 `sync: true`（`connection.js` 第 16 行）
- 重启后会自动建表

**执行机器人修复时边做边说**：
- "正在重启后端服务器..."
- "正在检查 SQLite 文件中的 `dialogues` 表..."

**修复时（精确操作方案）**：

```bash
# 重启后端
cd D:/Ziling-app/backend/ziling-backend
node app.js

# 检查表是否创建（使用 sqlite3 CLI）
sqlite3 data/zicodo.db ".tables"
# 应输出包含 dialogues 的表列表
```

**修复后验证**：
1. 后端启动无报错
2. `dialogues` 表已存在（SQLite 文件中可查到）
3. 手动测试 `GET /api/ai/dialogues?page=1&limit=5`（用 Postman/curl）

---

### B. 重建前端历史对话页面（3 个文件）

#### B-① 新建 `DialogueHistoryPage.vue`

**修复前现状**：
- 文件已删除（batch_2 执行时删除了）
- 需要完全重建

**执行机器人修复时边做边说**：
- "正在新建文件：src/pages/profile/DialogueHistoryPage.vue"
- "正在写入模板结构..."
- "正在写入 script 逻辑..."
- "正在写入 CSS 样式..."

**修复时（精确操作方案）**：

新建文件 `D:/Ziling-app/backend/frontend/src/pages/profile/DialogueHistoryPage.vue`，写入以下内容（**完整模板，直接复制**）：

```vue
<template>
  <div class="dialogue-history-page">
    <!-- 顶部导航栏 -->
    <ZlTopBar title="对话历史" @back="router.back()" />

    <div class="history-content">
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
        message="暂无对话历史"
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

// 个性标签
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

.history-content {
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
```

**修复后验证**：
1. 文件已创建：`ls src/pages/profile/DialogueHistoryPage.vue`
2. 模板结构正确（ZlTopBar + 列表 + 空状态）
3. script 逻辑正确（加载历史、截断文本、格式化时间）
4. CSS 全部使用 `var(--zl-xxx)` tokens
5. 无硬编码颜色/字号/间距

---

#### B-② 修改 `router/index.js` — 加回 `/dialogue-history` 路由

**修复前现状**（精确行号）：
- 第 175-192 行：`/profile` 子路由列表（PetSettings、Achievements、Notifications）
- **没有** `/dialogue-history` 路由

**执行机器人修复时边做边说**：
- "正在修改 router/index.js 第 192 行之前"
- "正在插入 `/dialogue-history` 路由配置..."

**修复时（精确操作方案）**：

在 `D:/Ziling-app/backend/frontend/src/router/index.js` 的第 192 行（`Notifications` 路由结束后）插入：

```javascript
      // 对话历史
      {
        path: 'dialogue-history',
        name: 'DialogueHistory',
        component: () => import('@/pages/profile/DialogueHistoryPage.vue'),
        meta: { title: '对话历史', showTabBar: false }
      },
```

**注意**：
- 插入位置：在 `Notifications` 路由（第 187-192 行）的 `},` 之后
- 缩进：与同级路由保持一致（6 个空格)
- 逗号：末尾加 `,`（因为后面还有 `]`）

**修复后验证**：
1. 确认路由已加入（搜索 `dialogue-history`）
2. 确认缩进正确
3. 确认逗号正确
4. 前端路由无报错（`router.push('/profile/dialogue-history')` 可正常跳转）

---

#### B-③ 修改 `PetHomePage.vue` — "历史"按钮跳转真实页面

**修复前现状**（精确行号）：

| 行号 | 当前内容 | 问题 |
|--------|----------|------|
| 第 136-139 行 | `<button @click="showHistoryTip" ...>` | 调用 `showHistoryTip()`（alert 提示） |
| 第 52-55 行 | `const showHistoryTip = () => { alert('对话历史功能即将上线') }` | 未跳转真实页面 |

**执行机器人修复时边做边说**：
- "正在修改 PetHomePage.vue 第 52-55 行"
- "正在将 `showHistoryTip` 改为 `goToHistory`..."
- "正在修改模板第 136-139 行：@click 改为 `goToHistory`..."

**修复时（精确操作方案）**：

**改法 A**：第 52-55 行改为：
```javascript
const goToHistory = () => {
  router.push('/profile/dialogue-history')
}
```

**改法 B**：第 136-139 行模板改为：
```vue
<button class="action-btn" @click="goToHistory" title="历史对话">
  <ScrollText :size="20" class="action-icon" />
  <span class="action-label">历史</span>
</button>
```

**修复后验证**：
1. 确认 `showHistoryTip` 已改为 `goToHistory`
2. 确认点击"历史"按钮跳转到 `/profile/dialogue-history`
3. 确认 `DialogueHistoryPage.vue` 正常加载
4. 确认列表展示正确（或空状态正确）

---

## ✅ 验证清单（执行完成后必须全部勾选）

### 后端
- [ ] `aiController.js` 第 18 行引入了 `Dialogue`
- [ ] `aiController.js` 第 19 行引入了 `ok`
- [ ] `aiController.js` 包含 `listDialogues()` 函数
- [ ] `aiController.js` 导出包含 `listDialogues`
- [ ] 后端重启无报错
- [ ] `dialogues` 表已自动创建
- [ ] `GET /api/ai/dialogues?page=1&limit=5` 返回 `{ code: 0, data: { list: [...], total: N } }`

### 前端
- [ ] `DialogueHistoryPage.vue` 已重建
- [ ] 页面结构正确（顶部栏 + 列表 + 空状态）
- [ ] CSS 全部使用 `var(--zl-xxx)` tokens
- [ ] `router/index.js` 已加回 `/dialogue-history` 路由
- [ ] 点击 PetHomePage 的"历史"按钮正常跳转
- [ ] 对话列表正确展示（或空状态正确）

### 架构完整性
- [ ] 未破坏任何已有组件结构
- [ ] 未破坏任何页面架构
- [ ] 所有新增/修改符合主提示词和设计规范

---

## 📊 修复报告模板（执行完成后必须填写）

```
## batch_3 对话历史页面 — 修复报告

### A. 后端修复

| 文件 | 操作 | 行数变化 | 状态 |
|------|------|----------|------|
| `aiController.js` | 补 Dialogue 引入 + ok 引入 + listDialogues() + 导出 | +25 行 | ✅/❌ |
| `models/index.js` | 确认（无需修改） | 0 行 | ✅ |
| 后端重启 | 确认 dialogues 表已创建 | — | ✅/❌ |

### B. 前端修复

| 文件 | 操作 | 行数变化 | 状态 |
|------|------|----------|------|
| `DialogueHistoryPage.vue` | 新建 | +190 行 | ✅/❌ |
| `router/index.js` | 加回路由 | +7 行 | ✅/❌ |
| `PetHomePage.vue` | 修改"历史"按钮跳转 | -4 +3 行 | ✅/❌ |

### 验证结果

**后端**：
- [ ] `listDialogues()` 函数正常工作
- [ ] `GET /api/ai/dialogues` 返回正确格式

**前端**：
- [ ] 对话历史页面正常加载
- [ ] 空状态正确展示
- [ ] 点击"历史"按钮正常跳转

### 架构完整性检查

- [ ] 未破坏已有组件结构
- [ ] 未破坏页面架构
- [ ] 所有 CSS 使用 `var(--zl-xxx)` tokens
- [ ] 无硬编码颜色/字号/间距

### 执行机器人签名

- 修复前计划已汇报：是/否
- 修复时边做边说：是/否
- 修复后报告已填写：是/否
```

---

## ⚠️ 执行注意事项

1. **必须先与用户敲定每一步**：执行机器人在执行 A-① 之前，必须先汇报"计划修复 `aiController.js` 的 4 处位置（第 18 行、第 19 行、第 217 行后、第 201-203 行）"，等用户确认后再动手。
2. **操作方案必须精准**：每个文件的修改都必须给出精确路径、精确行号、精确改动内容（如"第 18 行改为 `const { Pet, Dialogue } = require('../models');`"）。
3. **修复前 → 修复时 → 修复后**：执行机器人必须严格遵循三段式流程，并在修复报告中填写完整。
4. **不允许破坏架构**：所有修改只涉及 API 调用和交互逻辑，不允许修改已有组件的结构和样式（除非明确要求在提示词中）。

---

**文档生成时间**：2026-06-09  
**文档版本**：v1.0  
**对应批次**：batch_3  
**执行状态**：待用户敲定后执行
