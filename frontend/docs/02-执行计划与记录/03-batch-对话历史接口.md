# batch_1 — 对话历史接口（后端 + 前端联调）

> **目标**：实现 `GET /api/ai/dialogues` 对话历史接口
> **涉及文件**：后端 4 个 + 前端 2 个 = 共 6 个
> **生成时间**：2026-06-09
> **依赖**：必须先启动后端服务器（Express + SQLite），前端需连后端

---

## ⚠️ 执行前须知

1. **所有路径以工作空间根目录为准**：`D:/Ziling-app/backend/`
2. **后端文件在** `ziling-backend/src/`，**前端文件在** `frontend/src/`
3. **执行顺序**：①②③④⑤⑥ 严格按顺序，每步完成后检查无报错再继续
4. **修复前 → 修复时 → 修复后** 三段式：先看现状，再精确操作，再验证

---

## ① 新建 `src/models/Dialogue.js`

### 修复前

`ziling-backend/src/models/` 目录下目前有 6 个模型文件（User / Task / Pet / PointLog / Team / index），**没有 Dialogue 模型**。

项目现有模型规范（参照 `User.js`、`Task.js`、`Pet.js`）：
- 主键统一用 `DataTypes.UUID` + `DataTypes.UUIDV4`
- `createdAt` / `updatedAt` 由 `connection.js` 的 `timestamps: true` 自动维护，**模型内不声明**
- 用 `sequelize.define()` 定义，导出模型本身（非对象包一层）
- 表名用复数小写蛇形命名（如 `users`、`tasks`、`pets`）

### 修复时

在 `D:/Ziling-app/backend/ziling-backend/src/models/` 目录下新建 `Dialogue.js`，写入以下完整内容：

```javascript
'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

/**
 * Dialogue — 对话历史表
 * 存储用户与 AI 宠物的每一次完整对话
 */
const Dialogue = sequelize.define('Dialogue', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '用户发送的消息',
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'AI 宠物的完整回复',
  },
  persona: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '对话时的宠物性格（gentle / lively / tsundere / calm）',
  },
  mood: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '对话时的宠物情绪（happy / neutral / sad / angry / focused）',
  },
}, {
  tableName: 'dialogues',
  indexes: [
    { fields: ['userId'] },
    { fields: ['createdAt'] },
  ],
});

module.exports = Dialogue;
```

**注意**：
- `createdAt` / `updatedAt` **不要声明**，Sequelize 自动维护（`connection.js` 第 16 行 `timestamps: true`）
- `persona` 和 `mood` 可为 null，因为旧对话可能没有记录这些字段

### 修复后

1. 确认文件已创建：`ls ziling-backend/src/models/Dialogue.js`
2. 确认文件内容匹配上述代码
3. 不要单独 `require` 这个文件——下一步通过 `index.js` 统一引入

---

## ② 修改 `src/models/index.js` — 引入 Dialogue + 关联

### 修复前

当前 `index.js` 第 8~12 行 require 了 5 个模型（User / Task / Pet / PointLog / Team），第 17~34 行定义了它们的关联关系，第 36 行导出这 5 个模型。**没有 Dialogue**。

### 修复时

对 `D:/Ziling-app/backend/ziling-backend/src/models/index.js` 做以下精确修改：

**改法 1**：在第 12 行 `const Team` 之后插入一行：

```javascript
const Dialogue = require('./Dialogue');
```

**改法 2**：在第 34 行 `Task.hasMany(PointLog...` 之后插入关联：

```javascript
// 用户 → 对话历史（一对多）
User.hasMany(Dialogue, { foreignKey: 'userId', onDelete: 'CASCADE' });
Dialogue.belongsTo(User, { foreignKey: 'userId' });
```

**改法 3**：将第 36 行的导出改为：

```javascript
module.exports = { User, Task, Pet, PointLog, Team, Dialogue };
```

**完整修改后的 `index.js` 应为**（仅展示最终效果，不要整文件复制）：

```
第 8~12 行（require 区）新增 Dialogue：
  const User     = require('./User');
  const Task     = require('./Task');
  const Pet      = require('./Pet');
  const PointLog = require('./PointLog');
  const Team     = require('./Team');
  const Dialogue = require('./Dialogue');   ← 新增

第 34 行后（关联区）新增：
  // 用户 → 对话历史（一对多）
  User.hasMany(Dialogue, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Dialogue.belongsTo(User, { foreignKey: 'userId' });

第 36 行（导出）新增 Dialogue：
  module.exports = { User, Task, Pet, PointLog, Team, Dialogue };
```

### 修复后

1. 确认 `Dialogue` 已加入 require 区、关联区、导出区
2. Sequelize 在下次 sync 时会自动建表（`dialogues` 表）
3. 如已有 `sync()` 调用（通常在 `app.js` 或入口文件），启动服务器即可自动创建表

---

## ③ 修改 `src/controllers/aiController.js` — 累积 reply + 存入 Dialogue + 新增 listDialogues

### 修复前

当前 `aiController.js` 的 `chat()` 函数（第 133~188 行）：
- 第 156~158 行 `sendChunk` 只把 token 写入 `res`，**没有累积完整 reply**
- 第 173~176 行 SSE 结束后只存入 RAG memory 摘要，**没有存入 Dialogue 表**
- 文件末尾 `module.exports` 只导出 `{ chat, addMemory, listMemory }`（第 219 行）

### 修复时

对 `D:/Ziling-app/backend/ziling-backend/src/controllers/aiController.js` 做以下精确修改：

---

**改法 A**：第 19 行 `const { Pet } = require('../models');` 改为：

```javascript
const { Pet, Dialogue } = require('../models');
```

---

**改法 B**：第 20 行 `const { fail } = require('../utils/helpers');` 改为：

```javascript
const { ok, fail } = require('../utils/helpers');
```

（`ok` 之前没引入，现在 listDialogues 要用）

---

**改法 C**：在 `chat()` 函数内部，第 156 行之前插入 `fullReply` 变量：

```javascript
  res.flushHeaders();

  let fullReply = '';   // ← 新增：累积完整回复

  const sendChunk = (text) => {
    fullReply += text;  // ← 新增：每收到一个 token 就追加
    res.write(`data: ${JSON.stringify({ text })}\n\n`);
  };
```

---

**改法 D**：在 `chat()` 函数的 try 块内，第 175~176 行 RAG 存储之后，插入 Dialogue 存储：

```javascript
    // ─── 自动存入记忆 ──────────────────────────────────────
    const summary = `主人说：「${message.slice(0, 100)}」`;
    await rag.addMemory(req.user.id, summary, [], 2).catch(() => {});

    // ─── 存入对话历史 ───────────────────────────────────────
    await Dialogue.create({
      userId: req.user.id,
      message: message.trim(),
      reply: fullReply,
      persona: pet.personality || null,
      mood: pet.mood || null,
    }).catch(err => console.error('[Dialogue] 保存失败:', err.message));

    // 更新宠物互动时间和情绪（已有代码，不变）
```

---

**改法 E**：在 `listMemory()` 函数结束后（第 217 行 `}` 之后）、`module.exports` 之前，新增 `listDialogues()` 函数：

```javascript
/**
 * GET /api/ai/dialogues
 * 查询当前用户的对话历史（分页）
 * query: { page?, limit? }
 */
async function listDialogues(req, res) {
  const page  = Math.max(parseInt(req.query.page)  || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 50); // 上限 50 条/页

  const { count, rows } = await Dialogue.findAndCountAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit,
    offset: (page - 1) * limit,
    attributes: ['id', 'message', 'reply', 'persona', 'mood', 'createdAt'],
  });

  return ok(res, { list: rows, total: count });
}
```

---

**改法 F**：第 219 行 `module.exports` 末尾加入 `listDialogues`：

```javascript
module.exports = { chat, addMemory, listMemory, listDialogues };
```

### 修复后

1. 确认第 19~20 行引入了 `Dialogue` 和 `ok`
2. 确认 `chat()` 内有 `fullReply` 累积和 `Dialogue.create()` 调用
3. 确认新增了 `listDialogues()` 函数（含分页、排序、字段选择）
4. 确认 `module.exports` 包含 `listDialogues`

---

## ④ 修改 `src/routes/ai.js` — 新增 GET /dialogues 路由

### 修复前

当前 `routes/ai.js`（第 1~19 行）有三个路由：
- `POST /chat`
- `POST /memory`
- `GET /memory`

**没有** `/dialogues` 路由。

### 修复时

在 `D:/Ziling-app/backend/ziling-backend/src/routes/ai.js` 的第 17 行之后插入一行：

```javascript
// GET  /api/ai/dialogues —— 查询对话历史（分页）
router.get('/dialogues', aiCtrl.listDialogues);
```

修改后完整路由文件应为：

```
POST /api/ai/chat        → aiCtrl.chat
POST /api/ai/memory      → aiCtrl.addMemory
GET  /api/ai/memory      → aiCtrl.listMemory
GET  /api/ai/dialogues   → aiCtrl.listDialogues   ← 新增
```

### 修复后

1. 确认 `router.get('/dialogues', ...)` 已加入
2. 注意路由顺序：`/dialogues` 不能放在 `/memory` 之前，否则 Express 会把 `dialogues` 当成 `:id` 参数匹配到 `/memory` 路由（本项目 memory 路由不带 `:id`，所以无冲突）

---

## ⑤ 修改 `frontend/src/api/profile.js` — 从 Mock 切换到真实 API

### 修复前

当前 `profile.js` 第 93~106 行 `getDialogueHistory()` 使用 Mock 数据，返回 `new Promise` 包装的静态数组。注释中已经预留了真实实现的代码行：

```javascript
// 真实接口（待后端实现）
// return request.get('/api/ai/dialogues', { params })
```

### 修复时

将 `getDialogueHistory()` 函数**替换**为以下代码：

```javascript
/**
 * 获取对话历史
 * GET /api/ai/dialogues
 */
export function getDialogueHistory(params) {
  return request.get('/ai/dialogues', { params })
}
```

**注意**：
- URL 是 `/ai/dialogues` 不是 `/api/ai/dialogues`——因为 `request.js` 的 `baseURL` 已是 `/api`
- 返回格式：后端返回 `{ code: 0, data: { list: [...], total: N } }` → 拦截器解包后 → 函数拿到 `{ list: [...], total: N }`
- 调用方可传 `{ page, limit }` 做分页

**删除** Mock 相关代码：第 34~38 行的 `mockDialogues` 数组可保留（不影响功能），但 `getDialogueHistory` 函数内的 `new Promise` 包装必须完全移除。

### 修复后

1. `getDialogueHistory({ page: 1, limit: 20 })` 应发出 `GET /api/ai/dialogues?page=1&limit=20`
2. 返回 Promise，resolve 后拿到 `{ list: [...], total: N }`

---

## ⑥ 修改 `frontend/src/api/request.js` — 修复响应拦截器

### 修复前

当前 `request.js` 第 39 行的响应拦截器：

```javascript
if (res.code === 200) {
    return res.data
}
```

**Bug 原因**：后端统一用 `ok(res, data)` 返回 `{ code: 0, message: 'success', data }`，即成功时 `code` 为 `0` 而非 `200`。`res.code === 200` 永远为 `false`，导致**所有真实 API 调用都被当成错误 reject**。

至今未暴露的原因是 `profile.js` 的 API 函数全部用 `new Promise` 直接返回 Mock 数据，绕过了 `request` 模块。一旦切换到真实 API，就会全部报错。

### 修复时

将 `D:/Ziling-app/backend/frontend/src/api/request.js` 第 39 行：

```javascript
    if (res.code === 200) {
```

改为：

```javascript
    if (res.code === 0) {
```

**只改这一个字符**（`200` → `0`），其他不动。

### 修复后

1. 确认第 39 行为 `if (res.code === 0)`
2. 前端调用任何后端 API，成功后拦截器正确解包 `res.data` 返回
3. 失败时（`res.code !== 0`）仍走 `else` 分支 reject

---

## 📊 汇总

| 步骤 | 文件 | 操作 | 改动量 |
|------|------|------|--------|
| ① | `ziling-backend/src/models/Dialogue.js` | **新建** | 约 50 行 |
| ② | `ziling-backend/src/models/index.js` | **修改** | +4 行 |
| ③ | `ziling-backend/src/controllers/aiController.js` | **修改** | +25 行 |
| ④ | `ziling-backend/src/routes/ai.js` | **修改** | +1 行 |
| ⑤ | `frontend/src/api/profile.js` | **修改** | 约 -15 +5 行 |
| ⑥ | `frontend/src/api/request.js` | **修改** | 1 字符 |

---

## ✅ 验证清单

### 后端
- [ ] 重启后端服务器后 `dialogues` 表是否自动创建（SQLite 文件中出现 dialogues 表）
- [ ] `POST /api/ai/chat` 发送消息后，`dialogues` 表中是否出现新记录（含 `persona` 和 `mood`）
- [ ] `GET /api/ai/dialogues?page=1&limit=10` 是否返回 `{ code: 0, data: { list: [...], total: N } }`
- [ ] 空消息时是否返回 `{ code: 400, message: '消息不能为空' }`
- [ ] 未登录时是否返回 401

### 前端
- [ ] `getDialogueHistory({ page: 1 })` 是否成功返回数据（不再 Mock）
- [ ] 其他通过 `request` 调用的 API（如登录、获取用户信息）是否正常工作（`code: 0` 修复后）
- [ ] `DialogueHistoryPage.vue` 是否展示了对话列表（该页面本身是 TODO 占位，本次不改 UI，仅确保数据通道打通）

### 边界情况
- [ ] Mock 模式（未配置 DASHSCOPE_API_KEY）下对话历史是否依然保存
- [ ] AI 调用失败时（catch 分支）应保存错误提示信息到 `reply` 字段
