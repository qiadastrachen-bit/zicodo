# 🔧 字灵项目 — 五问题修复提示词

> **读前必知：** 这是五份独立的修复提示词，可以逐一发给执行机器人。每个问题都写明了：症状 → 根因 → 精确修改方案。**所有修改必须先读文件再动手，改完汇报。**

---

---

# 修复 1：开屏动画不显示

## 症状
用户打开网站直接进入首页，没看到开屏动画。

## 根因
`src/router/index.js` 中根路径 `/` 重定向到了 `/home`，完全跳过了 `/splash` 路由。动画文件和 SplashPage 组件都完好，只是没人导航过去。

## 修复（1 处修改）

**文件：`src/router/index.js`**

找到：
```js
{
  path: '/',
  redirect: '/home'
}
```

改为：
```js
{
  path: '/',
  redirect: '/splash'
}
```

## 验证
1. 清除浏览器 localStorage
2. 访问 `http://localhost:xxxx`（根路径）
3. 应看到开屏动画 → 动画结束后自动跳到 `/auth` 登录页

> ✅ 不需要改其他文件。`SplashPage.vue` 的 `onAnimationEnd` 已有正确跳转逻辑。

---

---

# 修复 2：添加页报错（`otherTasks` 未定义）

## 症状
打开添加页（+号按钮）时页面白屏/报错，控制台：
```
TypeError: Cannot read properties of undefined (reading 'length')
```

## 根因
`TaskCreatePage.vue` 第 70 行使用了 `store.otherTasks`，但 `src/stores/schedule.js` 中从未定义这个 computed 属性。Store 只有 `todayTasks` 和 `monthTasks` 两个 getter。

## 修复（1 处新增）

**文件：`src/stores/schedule.js`**

在现有 computed getter（`todayTasks` 和 `monthTasks` 附近）之后，新增：

```js
// 其他任务（非每日打卡类型的任务）
const otherTasks = computed(() => {
  return tasks.value.filter(t => t.type !== 'daily')
})
```

然后在文件末尾的 `return` 语句中，把 `otherTasks` 加入导出：
```js
return {
  tasks,
  todayTasks,
  monthTasks,
  otherTasks,    // ← 新增这行
  addTask,
  updateTask,
  deleteTask,
  toggleTask,
  getTasksByDate,
  getTasksByMonth,
  initDefaultTasks
}
```

## 验证
1. 点击底部 + 号进入添加页
2. 如果已有非 daily 类型的任务，应显示在列表中
3. 如果没有，页面正常渲染（空列表）

> ✅ 不需要改 `TaskCreatePage.vue`，它已经正确使用了 `store.otherTasks`。

---

---

# 修复 3：日历页报错

## 症状
日历页出现 503 错误，或页面加载异常。

## 根因（两个）

### 根因 A：503 是 Vite 开发服务器问题
503 通常是 HMR 热更新异常或后端接口不可达，**刷新页面 + 重启 `npm run dev`** 即可。

### 根因 B：图标库不统一
`CalendarPage.vue` 使用了 `vue-material-design-icons`，而项目中其他所有组件统一使用 `lucide-vue-next`。两个图标库共存可能导致模块加载冲突。

## 修复（2-3 处）

### 第一步：确认后端状态
```bash
# 在 backend 目录
cd backend && node server.js
# 确认没有报错，端口正常监听
```

### 第二步：统一图标库 — 替换 CalendarPage.vue 中的图标

**文件：`src/pages/tasks/CalendarPage.vue`**

1. **删除** `vue-material-design-icons` 的 import：
```js
// ❌ 删除这行
import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue'
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue'
```

2. **新增** `lucide-vue-next` 的 import（与项目其他页面一致）：
```js
// ✅ 改为
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
```

3. 模板中组件名保持不变（`<ChevronLeft />` `<ChevronRight />`），`lucide-vue-next` 的组件名相同。

4. 如果 CalendarPage 还用了其他 `vue-material-design-icons` 图标：
   - 全部替换为 `lucide-vue-next` 对应图标
   - 对照表：`vue-material-design-icons` 名称 = `lucide-vue-next` 名称（大部分一致）

### 第三步：卸载多余依赖（可选）
```bash
cd backend/frontend
npm uninstall vue-material-design-icons
```

## 验证
1. 重启 `npm run dev`
2. 打开日历页，确认左右箭头图标正常显示
3. 确认无控制台报错

---

---

# 修复 4：TabBar 导航总是回到一级页

## 症状
在二级页面（如任务详情 `/tasks/123`）时，点 TabBar 按钮总是跳到对应一级路由，而不是"回到之前的状态"。

## 根因分析（这不是 bug，是设计行为）

当前代码逻辑：
- TabBar 的 `switchTab` = `router.push(tabPath)` — **永远是 push 到一级路由**
- 二级页面（如 `/tasks/:id`）的 meta 没设 `showTabBar: true` → TabBar 自动隐藏
- 用户只能通过浏览器后退回到一级页

**设计意图就是：TabBar 4 个按钮 = 4 个一级页面入口。** 但用户体验差在没有返回按钮。

## 修复（推荐方案：给二级页面加返回导航）

### 修改 1：二级页面添加顶部返回栏

**文件：`src/pages/tasks/TaskCreatePage.vue`**

在 `<template>` 最顶部（`.page-content` div 之前）添加：

```html
<!-- 顶部导航栏 -->
<div class="top-nav">
  <button class="back-btn" @click="$router.back()">
    <ChevronLeft :size="24" />
  </button>
  <span class="nav-title">新建任务</span>
</div>
```

CSS：
```css
.top-nav {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
  padding: var(--zl-space-md) var(--zl-space-lg);
  background: var(--zl-bg-card);
  border-bottom: 1px solid var(--zl-border-light);
  position: sticky;
  top: 0;
  z-index: var(--zl-z-input); /* 100, 低于弹窗但高于内容 */
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--zl-radius-circle);
  background: transparent;
  border: none;
  color: var(--zl-text-primary);
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover,
.back-btn:active {
  background: var(--zl-bg-hover);
}

.nav-title {
  font-size: var(--zl-text-lg);
  font-weight: 600;
  color: var(--zl-text-primary);
}
```

### 修改 2：需要同样处理的二级页面
- `src/pages/tasks/CalendarPage.vue` — 同上加返回栏，标题"日历"
- 未来所有二级页面都遵循此模式

## 验证
1. 从首页进入任务详情
2. 点"新建任务"顶部返回按钮 → 回到上一页
3. TabBar 在一级页面正常显示，在二级页面隐藏

---

---

# 修复 5：设计规范遵守 — 硬编码清理 + 图标统一

## 问题清单

| # | 文件 | 行位置 | 问题 |
|---|------|--------|------|
| 5a | `src/styles/global.css` | 约 L24 | `max-width: 480px` 硬编码 |
| 5b | `src/styles/global.css` | 约 L34 | `padding-bottom: 80px` 硬编码 |
| 5c | `src/components/schedule/ToggleSwitch.vue` | 多处 | `48px` `26px` `white` 硬编码 |
| 5d | `src/components/schedule/TaskForm.vue` | 约 L281 | `color: white` 硬编码 |
| 5e | `src/components/schedule/CheckInTimer.vue` | 约 L274 | `color: white` 硬编码 |

---

### 修复 5a：页面最大宽度改为设计规范值

**文件：`src/styles/global.css`**

找到：
```css
max-width: 480px;
```

改为：
```css
max-width: var(--zl-container-mobile); /* = 430px，设计规范确定的值 */
```

> ⚠️ 如果 `tokens.css` 中没有 `--zl-container-mobile`，先确认设计规范的页面宽度究竟是 428px 还是 430px，然后在 `tokens.css` 中补充 token，再做替换。

---

### 修复 5b：底部内边距使用 Token

**文件：`src/styles/global.css`**

找到：
```css
padding-bottom: 80px;
```

改为：
```css
padding-bottom: var(--zl-tabbar-height); /* TabBar 高度，需确认 token 名 */
```

> ⚠️ 先去 `src/styles/tokens.css` 确认是否有对应 token。如果没有，在 tokens.css 新增：
> ```css
> --zl-tabbar-height: 80px;
> ```
> 此值需与 `ZlTabbar.vue` 中 TabBar 的实际高度一致。

---

### 修复 5c：ToggleSwitch.vue 硬编码清理

**文件：`src/components/schedule/ToggleSwitch.vue`**

逐项替换：

| 原值 | 替换为 |
|------|--------|
| `width: 48px` | `width: var(--zl-toggle-width)` 或 `48px`（如果 tokens 里没定义开关尺寸，保持原值但注释说明） |
| `height: 26px` | `height: var(--zl-toggle-height)` |
| `background: white` | `background: var(--zl-bg-white)` 或 `var(--zl-text-inverse)` |
| `color: white` | `color: var(--zl-text-inverse)` |

> 💡 如果 tokens 中没有开关组件专属 token，在此次修复中一并补充到 `tokens.css`。

---

### 修复 5d：TaskForm.vue 白色文字硬编码

**文件：`src/components/schedule/TaskForm.vue`**

找到所有 `color: white`：
```css
/* ❌ */
color: white;
```

改为：
```css
/* ✅ */
color: var(--zl-text-inverse);
```

> 全局搜索确认无遗漏：`grep -n "color:\s*white" src/components/schedule/TaskForm.vue`

---

### 修复 5e：CheckInTimer.vue 白色文字硬编码

**文件：`src/components/schedule/CheckInTimer.vue`**

找到所有 `color: white`：
```css
/* ❌ */
color: white;
```

改为：
```css
/* ✅ */
color: var(--zl-text-inverse);
```

> 全局搜索确认无遗漏：`grep -n "color:\s*white" src/components/schedule/CheckInTimer.vue`

---

### 修复 5f：全局硬编码扫描（额外）

修复完上述 5 项后，建议全局扫描一次：

```bash
cd backend/frontend/src
grep -rn "color:\s*white" --include="*.vue" --include="*.css" | grep -v node_modules
grep -rn "background:\s*white" --include="*.vue" --include="*.css" | grep -v node_modules
grep -rn "background-color:\s*white" --include="*.vue" --include="*.css" | grep -v node_modules
```

任何命中都替换为对应 token（`var(--zl-text-inverse)` / `var(--zl-bg-card)` / `var(--zl-bg-white)`）。

---

## 最终验证清单

全部修完后，逐项确认：

- [ ] 清除 localStorage，访问根路径 → 看到开屏动画
- [ ] 动画结束自动进入登录页
- [ ] 点击 + 号 → 添加页正常渲染，无报错
- [ ] 日历页图标显示正常（左右箭头），无 503
- [ ] 进入任务详情页 → 有顶部返回按钮 → 点击返回正常
- [ ] `npm run build` 无警告
- [ ] 搜索 `color: white`（不含注释和 node_modules）= 0 结果
- [ ] 搜索 `background: white` = 0 结果
- [ ] 搜索 `480px`（在 .vue/.css 中）= 0 结果（或只有 token 定义处保留）
- [ ] 删除 `vue-material-design-icons` 依赖后项目正常运行
