# 数据库迁移系统使用指南（MIGRATION_GUIDE）

**生效版本**：2026-06-09（引入 umzug 迁移系统后）  
**适用范围**：数字生命后端所有涉及数据库表结构变更的开发工作

---

## 🎯 一句话理解

> 以前改模型（Model.js）→ nodemon 自动 `sync({ alter: true })` → 经常崩数据库。  
> 现在改模型（Model.js）→ **必须**先写 migration 文件 → 启动时 umzug 自动按顺序执行。  
> 任何数据库变更都必须有对应的 migration 文件。

---

## 📖 快速索引

- [为什么不用 sync alter 了](#-为什么不用-sync-alter-了)
- [日常开发 5 步流程](#-日常开发-5-步流程)
- [常用命令速查](#-常用命令速查)
- [migration 文件模板](#-migration-文件模板)
- [常见操作示例](#-常见操作示例)
- [团队协作与 Git 规范](#-团队协作与-git-规范)
- [回滚操作指南](#-回滚操作指南)
- [云服务器部署注意事项](#-云服务器部署注意事项)

---

## 🚨 为什么不用 sync alter 了

| 问题 | 描述 |
|------|------|
| **不可重复** | `sync({ alter: true })` 依赖 Sequelize 对比模型和表结构，环境不同结果不同 |
| **脏数据** | alter 会先创建 `xxx_backup` 表复制数据 → 中途崩溃会留下脏备份表 → 下次启动必崩 |
| **不可回滚** | alter 一旦执行就无法撤销，误删字段只能手动恢复 |
| **不可追溯** | Git 里看不到"上次到底改了哪个字段" |
| **部署不安全** | 云端执行 alter 期间有用户访问时，表结构不一致可能导致数据错误 |

---

## 📝 日常开发 5 步流程

### 场景：你要给 users 表加一个 `avatar` 字段

**Step 1** — 在 `src/db/migrations/` 下新建 migration 文件

```bash
# 文件名规则：NNN-简短描述.js
# NNN 是三位序号，目前最大是 008，所以新的是 009
# 简短描述用英文，用动词开头，例如 add-user-avatar / create-xxx / drop-xxx
# → 创建：src/db/migrations/009-add-user-avatar.js
```

**Step 2** — 写 migration 的 `up()` 和 `down()`

```javascript
'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    // up(): 描述这次变更要做什么
    await queryInterface.addColumn('users', 'avatar', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '用户头像 URL',
    });
  },

  down: async ({ context: queryInterface }) => {
    // down(): 描述"撤销这个变更"要做什么（必须写！回滚时用）
    await queryInterface.removeColumn('users', 'avatar');
  },
};
```

**Step 3** — 改对应的 Model 文件

```javascript
// src/models/User.js 中添加
avatar: {
  type: DataTypes.STRING(255),
  allowNull: true,
},
```

**Step 4** — 启动后端或手动执行 migration

```bash
# 方式 A：直接启动后端，umzug 会自动发现并执行新 migration
npm run dev

# 方式 B：手动执行（推荐首次用，看清楚输出）
npm run migrate:up
# 输出应该包含：已执行 009-add-user-avatar.js
```

**Step 5** — 验证（检查数据库和 API）

```bash
# 看已执行的 migration 列表
npm run migrate:executed

# 调用一个用到 users 表的 API，确认 avatar 字段可用
```

---

## 🔧 常用命令速查

| 命令 | 作用 | 什么时候用 |
|------|------|-----------|
| `npm run migrate:up` | 执行所有未跑过的 migration | 首次部署 / 拉了新代码后 / 写了新 migration |
| `npm run migrate:down` | 回滚最后一个 migration | 发现新 migration 有问题，要撤销 |
| `npm run migrate:pending` | 列出待执行的 migration | 看看哪些 migration 还没跑 |
| `npm run migrate:executed` | 列出已执行的 migration | 确认 migration 执行情况 |
| `npm run dev` | 启动后端（自动执行 migration） | 日常开发 |

---

## 📋 migration 文件模板

### 模板 1：添加字段（最常用）

```javascript
'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('表名', '字段名', {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '默认值',
      comment: '字段说明',
    });
    // 如需加索引
    // await queryInterface.addIndex('表名', ['字段名']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('表名', '字段名');
  },
};
```

### 模板 2：修改字段类型 / 约束

```javascript
'use strict';

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('users', 'nickname', {
      type: DataTypes.STRING(100),  // 原来是 50，现在改 100
      allowNull: true,
    });
  },

  down: async ({ context: queryInterface }) => {
    // down 要写"撤销这个修改"的操作，即改回原来的类型
    await queryInterface.changeColumn('users', 'nickname', {
      type: DataTypes.STRING(50),
      allowNull: true,
    });
  },
};
```

### 模板 3：新建表（首次创建某个实体）

```javascript
'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('新表名', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      // 其他字段...
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });
    await queryInterface.addIndex('新表名', ['某个需要索引的字段']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('新表名');
  },
};
```

### 模板 4：重命名字段（危险操作，尽量避免）

```javascript
// ⚠️ 注意：SQLite 不支持原生 renameColumn，需要用变通方案
// 如果必须做，推荐方案：新增字段 → 迁移数据 → 删除旧字段（分 2 个 migration）
```

---

## 💡 常见操作示例

| 想做什么 | 在 migration 中写什么 |
|---------|----------------------|
| 加字段 | `queryInterface.addColumn(table, column, attributes)` |
| 改字段 | `queryInterface.changeColumn(table, column, newAttributes)` |
| 删字段 | `queryInterface.removeColumn(table, column)` |
| 加索引 | `queryInterface.addIndex(table, [columns])` |
| 删索引 | `queryInterface.removeIndex(table, indexName)` |
| 建表 | `queryInterface.createTable(name, attributes)` |
| 删表 | `queryInterface.dropTable(name)` |
| 执行 SQL | `queryInterface.sequelize.query('你的SQL')` |

---

## 👥 团队协作与 Git 规范

1. **migration 文件永不可改**：已执行过的 migration 文件一旦提交到 Git，**绝对不能修改内容**。如果写错了，写一个新的 migration 纠正。

2. **migration 编号要协商**：多人同时开发时，如果有人用了 `009`，其他人就不能再用 `009`，要用 `010`、`011`…… 编号按创建先后递增。

3. **migration + Model + 业务代码一起提交**：一次 Git commit 应该包含：
   - `src/db/migrations/NNN-xxx.js`（migration 文件）
   - `src/models/Xxx.js`（模型变更）
   - 相关的 controller / route 变更

4. **先执行 migration 再改代码**：如果你的 migration 新增了必填字段，而老数据中该字段为 null，可能导致老数据读不出。**建议：新增字段一律 `allowNull: true` 或给 `defaultValue`**。

---

## ↩️ 回滚操作指南

**场景：你刚提交了 migration 009，发现字段名写错了，想撤销重来**

```bash
# 1) 回滚最后一个 migration
npm run migrate:down

# 2) 修改 migration 文件（⚠️ 仅限尚未提交 Git 的情况下可改文件名）
#    把 009-add-user-avatarr.js 改成 009-add-user-avatar.js

# 3) 重新执行
npm run migrate:up
```

**如果已经提交到 Git 且其他人可能已执行？**
→ 绝对不要改已有 migration，写一个新的 `010-fix-user-avatar-column.js` 来纠正

**如果数据库数据坏了想重头来？**（开发环境）
```bash
# 删数据库
rm data/digital_life.db
# 删迁移记录
rm data/migrations-log.json
# 重启后端，自动重建
npm run dev
```

---

## ☁️ 云服务器部署注意事项

1. **部署前先看 pending migrations**：
   ```bash
   npm run migrate:pending
   ```
   确认哪些 migration 会在这次部署时执行。

2. **部署顺序**：
   ```
   停服 → 备份数据库 → 拉新代码 → npm run migrate:up → 重启服务
   ```

3. **首次部署到新服务器**：
   ```bash
   # 在云端项目目录执行
   npm install
   npm run migrate:up   # 自动创建 users, teams, pets... 所有表
   npm start
   ```

4. **migration 期间不要有写入**：如果 migration 需要改大表（几十万行），建议先备份再操作，操作期间关闭写接口。

5. **`data/` 目录是关键**：云端的 `data/digital_life.db` 和 `data/migrations-log.json` 是数据库核心，**必须纳入备份计划和 Gitignore**。

---

## 📂 相关文件位置速查

```
ziling-backend/
├─ src/
│  ├─ db/
│  │  ├─ connection.js       ← 数据库连接配置（一般不用改）
│  │  ├─ migrate.js          ← umzug 引擎（一般不用改）
│  │  └─ migrations/         ← ★ 所有 migration 文件放这里
│  │     ├─ 001-create-users.js
│  │     ├─ 002-create-teams.js
│  │     ├─ ...
│  │     └─ NNN-你的新文件.js
│  └─ models/                ← ★ Sequelize 模型定义
└─ data/
   ├─ digital_life.db        ← SQLite 数据库文件（不在 Git）
   └─ migrations-log.json    ← umzug 执行记录（不在 Git）
```

---

## ❓ FAQ

**Q: 我只改了 model.js，没写 migration，会怎样？**  
A: 后端启动时不会报错，但数据库里没有这个字段，读写该字段时会报 `column xxx does not exist`。

**Q: migration 写到一半后端崩溃了，数据会坏吗？**  
A: SQLite 是事务型数据库。单个 migration 在一个事务中，要么全成功要么全失败，不会有部分执行导致的数据不一致。

**Q: 我可以直接用 `sequelize.query()` 写原生 SQL 吗？**  
A: 可以，`queryInterface.sequelize.query('SQL')`。但尽量用 queryInterface 的方法，它们是跨数据库兼容的。

**Q: 怎么看某个表的当前结构？**  
A: 用 SQLite 工具（如 `sqlite3 data/digital_life.db` 然后 `.schema users`）或 DB Browser for SQLite。

**Q: 已有 alter 时代的数据库，可以切换到 migration 系统吗？**  
A: 可以。如果数据库表结构和 migration 001-008 一致，直接删 `migrations-log.json` 重新跑一遍会自动建表（如果表已存在，建表会失败。**更安全的方案**：用 `INSERT INTO ... SELECT` 把数据从老库迁移到新库，或手动编辑 migrations-log.json 标记 001-008 为已执行）。
