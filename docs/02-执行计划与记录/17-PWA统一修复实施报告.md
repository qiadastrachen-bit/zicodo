# PWA 统一修复实施报告

> **日期**: 2026-06-09  
> **目标**: 完成可运行 PWA，弥补前后端脱节、团队/登录/显示名等 8 项差距  
> **环境**: 本机 `D:\Ziling-app`（未部署服务器）

---

## 1. 实施步骤与关键节点

### 阶段 A：后端基础设施

| 节点 | 内容 |
|------|------|
| A1 | 确认并挂载 `GET/PUT /api/users/me`、`POST /api/users/me/password`（`usersController` 已存在，`app.js` 注册 `/api/users`） |
| A2 | 邀请码统一为 **6 位纯数字**（`helpers.genInviteCode` + `isValidInviteCode`） |
| A3 | 重写 `teamsController`：`listMyTeams`、`joinTeam` 数字校验、`formatTeam` 成员角色 |
| A4 | 注册 `GET /api/teams` 列表路由（排在 `/:id` 之前） |
| A5 | 显示名/宠物名策略：`petDisplayName(username, nickname)` — 有昵称用昵称，否则「用户名的宠物」 |
| A6 | 配置 `backend/.env`（含 `DEEPSEEK_API_KEY`、`DB_PATH=./data/zicodo.db`） |
| A7 | 默认数据库路径改为 `zicodo.db`（与 README 一致） |

### 阶段 B：前端对接

| 节点 | 内容 |
|------|------|
| B1 | 重写 `stores/teams.js`：全部走 `/api/teams`，隐藏团队仍用 localStorage |
| B2 | 更新 `api/team.js`、`api/user.js`、`api/profile.js` |
| B3 | `user` Store：`displayName = username`；`saveProfile` / `savePassword` 接 API |
| B4 | `JoinTeamForm` / `TeamCreateForm` 调后端 |
| B5 | `TeamListPage` 修复退出确认弹窗；`TaskCreatePage` 使用 `visibleTeams` |
| B6 | `SettingsPage` 图标改为字符串名；退出跳转 `/auth/login` |
| B7 | `SplashPage` + 路由守卫：关闭无感 `autoLogin`，未登录 → 登录页 |
| B8 | 团队成员展示统一为 `username` |

### 阶段 C：验证

| 节点 | 内容 |
|------|------|
| C1 | 新增 `backend/src/_api-smoke-test.js`，`npm run smoke` |
| C2 | 本地启动：`cd backend && npm run dev`，`cd frontend && npm run dev` |

---

## 2. 技术问题清单

| # | 问题 | 解决方案 | 效果 |
|---|------|----------|------|
| 1 | DeepSeek Key 未配置 | 写入 `backend/.env`（已 gitignore） | 配置 AI 真接口；无 Key 仍 Mock |
| 2 | 邀请码仅查 localStorage | 6 位数字 + `POST /api/teams/join` | 跨用户加入同一后端团队 |
| 3 | 昵称/用户名/宠物名混乱 | 显示名=username；宠物名=昵称或「用户名的宠物」；`PUT /api/users/me` 同步宠物 | 资料修改落库 |
| 4 | 设置页三项图标不显示 | `ZlListItem` 的 `icon` 传字符串 `"Bell"` 等 | 三项正常可见 |
| 5 | 退出后又自动登录 | 开屏/路由不再 `autoLogin`；退出 → `/auth/login` | 可重新登录 |
| 6 | 团队多套数据源 | teams Store 仅 API；任务页用 `visibleTeams` | 列表一致 |
| 7 | 退出团队无效 | 修复 Modal 先清空 `confirmLeaveTeam` 的竞态；单点 `store.leaveTeam` 调 API | 退出后列表更新 |
| 8 | 数据库难观测 | 统一 `zicodo.db` + 冒烟脚本 + 下文监测指引 | 可验证写入 |

---

## 3. 代码变更记录（主要文件）

### 后端

- `src/app.js` — 注册 `/api/users`
- `src/utils/helpers.js` — 数字邀请码、`petDisplayName`
- `src/controllers/teamsController.js` — 列表、格式化、数字 join
- `src/controllers/authController.js` — 注册/自动登录宠物名
- `src/controllers/usersController.js` — 资料更新同步宠物
- `src/routes/teams.js` — `GET /`
- `src/db/connection.js` — 默认 `zicodo.db`
- `src/_api-smoke-test.js` — API 冒烟测试
- `.env.example` — 补充 `DB_PATH`、`CORS_ORIGIN`
- `.env` — 本地 Key（**勿提交 Git**）

### 前端

- `src/stores/teams.js` — API 驱动
- `src/stores/user.js` — 显示名策略、资料 API
- `src/api/team.js`, `user.js`, `profile.js`
- `src/pages/profile/SettingsPage.vue`
- `src/pages/profile/ProfileEditPage.vue`
- `src/pages/auth/SplashPage.vue`, `LoginPage.vue`, `AuthPage.vue`
- `src/router/index.js`
- `src/pages/team/TeamListPage.vue`, `TeamDetailPage.vue`
- `src/pages/tasks/TaskCreatePage.vue`
- `src/components/schedule/JoinTeamForm.vue`, `TeamCreateForm.vue`, `TeamDetail.vue`, `MemberList.vue`

---

## 4. 数据库监测（本机 `D:\Ziling-app`）

### 文件位置

首次启动后端后生成：

```
D:\Ziling-app\backend\data\zicodo.db
```

（`data/` 与 `*.db` 已在 `backend/.gitignore` 中忽略。）

### 监测方式

**方式 1：API 冒烟（推荐）**

```powershell
cd D:\Ziling-app\backend
npm run dev
# 新终端
npm run smoke
```

**方式 2：SQLite 命令行**

```powershell
cd D:\Ziling-app\backend
sqlite3 data\zicodo.db ".tables"
sqlite3 data\zicodo.db "SELECT id, username, nickname, teamId FROM users;"
sqlite3 data\zicodo.db "SELECT id, name, inviteCode FROM teams;"
```

**方式 3：Postman 集合要点**

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 存活 |
| POST | `/api/auth/register` | body: `{ username, password, nickname? }` |
| POST | `/api/auth/login` | body: `{ username, password }` |
| GET | `/api/teams` | Header: `Authorization: Bearer <token>` |
| POST | `/api/teams` | 创建团队，返回 6 位 `inviteCode` |
| POST | `/api/teams/join` | `{ inviteCode: "123456" }` |
| POST | `/api/teams/leave` | 退出 |
| PUT | `/api/users/me` | `{ nickname }` |
| POST | `/api/ai/chat` | SSE，需 Key |

**方式 4：开发 SQL 日志**

`.env` 中 `NODE_ENV=development` 时控制台输出 `[SQL]`。

### 当前本机状态说明

执行实施时 **沙箱环境未能常驻启动后端**，仓库内尚无 `backend/data/zicodo.db` 文件。请在本机按「方式 1」启动一次后端后，数据库将自动迁移并可通过上述命令观测变化。

---

## 5. 手动测试清单

- [ ] 注册两个用户 A、B
- [ ] A 创建团队，复制 6 位邀请码
- [ ] B 输入邀请码加入成功
- [ ] B 退出团队，A/B 列表均无该队（B）或队仍在（A 为队长）
- [ ] 设置页三项可见；退出后进入登录页，不再自动进首页
- [ ] 修改昵称后 `users` 表与 `pets.name` 同步
- [ ] 个人中心显示 **用户名** 而非昵称

---

## 6. 安全提示

- DeepSeek API Key 已写入本地 `backend/.env`，**切勿提交到 Git**。
- 若在对话中暴露 Key，建议在 DeepSeek 控制台轮换密钥。

---

**报告版本**: v1.0  
**维护**: zicodo Team
