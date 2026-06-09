# Batch 0 执行提示词：全局品牌改名（字灵 / ZiLing → zicodo）

> **执行前必须阅读**：本提示词严格按照 `6.8用户体验审核提示词.md` 中 Batch 0 的方案编写。
> **硬性规则**：每改完一个类别，必须搜索验证残留，确认无误后再改下一类。

---

## ⚠️ 执行前最后确认（必须逐条核对）

1. **搜索已排除**：`node_modules/`、`dist/`、`build/`、`.git/`、`src.bak.old/`、`项目用品/`、`.workbuddy/` ✅
2. **`constants.js` 不需要改**：`STORAGE_KEYS` 全是 `zl_` 前缀，不在改名范围内 ✅
3. **`zl_` 前缀 key 不需要改**（`zl_token`、`zl_user`、`zl_theme`、`zl_pet`）✅
4. **只有 `ziling_` 前缀的 key 需要改**（`ziling_schedule_tasks`、`ziling_teams`、`ziling_teams_user`、`ziling_chat_history`）✅

---

## 执行顺序（严格按此顺序，每步执行完向我汇报）

---

### 第一步：D 类 — 配置文件（影响最小，先改）

#### 1.1 `index.html`

**文件路径**：`D:/Ziling-app/backend/frontend/index.html`

**精确操作**：搜索 `字灵`，替换为 `zicodo`。预计 1-2 处（`title` 标签 + `apple-mobile-web-app-title`）。

```html
<!-- 改前 -->
<title>字灵</title>
<meta name="apple-mobile-web-app-title" content="字灵" />

<!-- 改后 -->
<title>zicodo</title>
<meta name="apple-mobile-web-app-title" content="zicodo" />
```

#### 1.2 `public/manifest.json`

**文件路径**：`D:/Ziling-app/backend/frontend/public/manifest.json`

**精确操作**：修改 3 个字段：

```json
// 改前
{
  "name": "字灵",
  "short_name": "字灵",
  "description": "...字灵..."
}

// 改后
{
  "name": "zicodo",
  "short_name": "zicodo",
  "description": "...zicodo..."  // 把描述中的「字灵」也替换掉
}
```

#### 1.3 `package.json`

**文件路径**：`D:/Ziling-app/backend/frontend/package.json`

**精确操作**：修改 `name` 字段：

```json
// 改前
{ "name": "ziling-frontend" }

// 改后
{ "name": "zicodo-frontend" }
```

#### 1.4 验证 D 类

执行完后，搜索 `index.html`、`manifest.json`、`package.json` 中是否还有「字灵」，确认无残留。

---

### 第二步：C 类 — localStorage key（最关键，必须读写两端同步改）

#### 2.1 `src/stores/schedule.js`

**精确操作**：全局搜索 `ziling_schedule_tasks`，**全部替换**为 `zicodo_schedule_tasks`。

预计 2 处：
- `loadFromStorage()` 中的读 key
- `saveToStorage()` 中的写 key

**⚠️ 改完必须验证**：读和写两侧的 key 都改了，不能只改一边。

#### 2.2 `src/stores/teams.js`

**精确操作**：全局搜索 `ziling_teams`，替换为 `zicodo_teams`；搜索 `ziling_teams_user`，替换为 `zicodo_teams_user`。

预计各 2 处（读 + 写）。

#### 2.3 `src/pages/home/PetHomePage.vue`

**精确操作**：全局搜索 `ziling_chat_history`，**全部替换**为 `zicodo_chat_history`。

预计 2 处：
- `loadChatHistory()` 中的 `localStorage.getItem(STORAGE_KEY)`
- `saveChatHistory()` 中的 `localStorage.setItem(STORAGE_KEY, ...)`

**⚠️ 如果 `STORAGE_KEY` 是常量变量**（如 `const STORAGE_KEY = 'ziling_chat_history'`），只需改常量定义那一处即可。

#### 2.4 验证 C 类

执行完后，全局搜索 `ziling_`，确认：
- `schedule.js` 中无 `ziling_schedule_tasks` 残留
- `teams.js` 中无 `ziling_teams` / `ziling_teams_user` 残留
- `PetHomePage.vue` 中无 `ziling_chat_history` 残留

---

### 第三步：A 类 — 用户可见文本（模板 + 页面标题）

#### 3.1 搜索范围

在 `src/` 目录下搜索中文「字灵」，**排除** `.js` 文件中的代码注释（只改模板和用户可见文本）。

#### 3.2 需要改的典型位置

| 文件（示例） | 改动内容 |
|-------------|-----------|
| `src/pages/profile/AboutPage.vue` | 关于页面中的「字灵」→「zicodo」 |
| `src/pages/profile/ProfilePage.vue` | 个人中心可能显示的宠物名 |
| `src/router/index.js` | 路由 meta.title 中的「字灵」 |
| 所有 `.vue` 模板中的「字灵」 | 用户能看到的中文文案 |

#### 3.3 精确操作

逐个文件打开，搜索「字灵」，判断是否为**用户可见文本**：
- ✅ 改：`<title>`、`<p>`、`<span>`、`<button>` 中的文案
- ❌ 不改：代码注释、`package.json` 的 `name`（已改过）、变量名

#### 3.4 验证 A 类

执行完后，在 `src/` 目录下搜索中文「字灵」，确认只剩代码注释中的（这些留给 B 类处理）。

---

### 第四步：B 类 — 代码注释 / 文档中的「ZiLing」

#### 4.1 搜索范围

在 `src/` 和 `docs/` 目录下搜索英文 `ZiLing`（区分大小写）。

#### 4.2 精确操作

逐个替换注释和文档中的「ZiLing」→「zicodo」：

```js
// 改前
// ZiLing chat store
// 字灵宠物模块

// 改后
// zicodo chat store
// zicodo 宠物模块
```

#### 4.3 不需要改的

- 变量名、函数名、组件名（如 `PetHomePage`、`schedule.js`）— 这些是代码标识符，不改
- Git 仓库地址（如 `github.com/Reaor/ziling_new`）— 外部资源，不改

#### 4.4 验证 B 类

执行完后，全局搜索 `ZiLing`，确认残留 only 在排除清单中（目录名、Git 仓库等）。

---

### 第五步：全局残留验证（必须做）

执行完所有步骤后，**最后一次全局搜索**，确认残留：

| 搜索词 | 预期残留 | 处理 |
|--------|-----------|------|
| `字灵` | 目录名 `Ziling-app/`、旧备份路径 | ✅ 不改 |
| `ZiLing` | Git 仓库 `ziling_new`、目录名 | ✅ 不改 |
| `ziling_` | **应该为空** | ❌ 如果有，说明漏改了 |

**⚠️ 如果 `ziling_` 搜索还有结果，必须停下来检查是哪里漏了，不能继续。**

---

## 执行报告模板（每步执行完填写）

```
### 第一步：D 类配置文件
- [ ] index.html 已改（改了几处：___）
- [ ] manifest.json 已改（name/short_name/description）
- [ ] package.json 已改（name 字段）
- [ ] 验证：搜索确认无「字灵」残留 ✅/❌

### 第二步：C 类 localStorage key
- [ ] schedule.js 已改（ziling_schedule_tasks → zicodo_schedule_tasks，读+写都改了）
- [ ] teams.js 已改（ziling_teams → zicodo_teams，ziling_teams_user → zicodo_teams_user）
- [ ] PetHomePage.vue 已改（ziling_chat_history → zicodo_chat_history）
- [ ] 验证：全局搜索 ziling_ 确认无残留 ✅/❌

### 第三步：A 类用户可见文本
- [ ] 改了 __ 个文件，__ 处文案
- [ ] 验证：src/ 下搜索「字灵」，只剩注释 ✅/❌

### 第四步：B 类注释/文档
- [ ] 改了 __ 个文件，__ 处注释
- [ ] 验证：搜索 ZiLing 确认残留 only 在排除清单 ✅/❌

### 第五步：全局残留验证
- [ ] 搜索「字灵」：残留 __ 处（都是目录名，合理）
- [ ] 搜索「ZiLing」：残留 __ 处（都是外部仓库，合理）
- [ ] 搜索「ziling_」：残留 __ 处（应该为 0）
```

---

## ❌ 排除清单（这些绝对不能改）

1. 目录名：`Ziling-app/`、`ziling-backend/`、`ziling-frontend/`（改了路径全炸）
2. Git 仓库：`github.com/Reaor/ziling_new`（外部资源）
3. 已废弃的 API 路径：`/ziling/api/`（已不用，不动）
4. 旧备份目录：`src.bak.old/`、`项目用品/`
5. `node_modules/`、`dist/`、`build/`、`.git/`、`.workbuddy/`

---

**执行机器人：每完成一步，停下来向我汇报结果，不要连续改多步。我确认无误后再让你继续下一步。**
