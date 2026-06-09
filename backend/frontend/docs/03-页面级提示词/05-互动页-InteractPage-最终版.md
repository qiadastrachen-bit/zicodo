# 字灵(ZiLing) · 互动页详细提示词（最终版）
# 适用：执行机器人（新对话，只写代码不讨论）
# 对应页面：/interact — 汉字消消乐（找相同字）
# 修订日期：2026-06-08
# 修订内容：补全路由配置、TabBar逻辑、游戏状态保持、导航栏动画方案
#
# ✅ 确认标记（2026-06-08 03:00）
# - 导航栏动画方案：✅ 已选择 方案 B（iOS 风格，缩放 + 颜色变化）
# - 游戏状态保持：✅ 已确认（离开页面再返回，进度保持）
# - 路由配置：✅ 已补全（具体代码）
# - TabBar 切换逻辑：✅ 已补全（ZlTabbar.vue 组件代码）
# - 文件状态：✅ 已确认无误，可以发给执行机器人
# - TabBar 元素：✅ 已固定（5个图标，不允许再次变化）
# - 增量修改：✅ ZlTabbar.vue 已存在，执行机器人需增量修改（不覆盖）
#

---

## 📱 页面定位

互动页是**汉字消消乐游戏页**，用户在这里玩"找相同字"游戏（零 API 消耗）。

**页面路径：** `src/pages/interact/InteractPage.vue`
**路由：** `/interact` （TabBar 第2个图标，爪子图标）

---

## 🎮 游戏玩法（找相同字）

### 核心规则
1. **8×8 网格**，每个汉字在网格中**恰好出现2次**（共32种字，每种2个，共64格）
2. **点第一个字** → 高亮（内阴影 + 微放大 1.06倍）
3. **点第二个字**：
   - **相同** → 消除（墨色溢出特效） + 得分 +10分 + 补全新字
   - **不同** → 格子抖动（CSS shake） → 取消高亮
4. **全部消除** → 可以循环玩（或加"恭喜"弹窗）
5. **零 API 调用** —— 纯本地逻辑，不消耗 DeepSeek token

### 动效（完整保留！）
| 动效 | 触发时机 | 实现方式 |
|------|----------|---------|
| **墨色溢出（ink-burst）** | 消除时 | CSS animation（300ms，从中心扩散消失）|
| **抖动（shake）** | 判错时 | CSS animation（200ms，左右晃动3次）|
| **新字填入（refill）** | 消除后补字 | CSS animation（200ms，由 scale(0) → scale(1)）|

> ⚠️ **动画规则修正**：页面切换动画取消，但**游戏反馈动效必须保留**！

---

## 📂 依赖文件（需先准备好）

### 1. 字库文件 `src/game/chars.js`（已创建 ✅）
```js
/**
 * 字灵 · 汉字消消乐 — 单字池
 * 来源：ziling_new/js/game/wordmatch.js 的 WORD_LIST（60个词 → 166个不重复单字）
 * 用法：
 *   import { CHAR_POOL, generateGameChars } from '@/game/chars.js';
 *   const chars = generateGameChars(32); // 生成64个字符（32种×2）
 */
export const CHAR_POOL = [
  '明', '天', '今', '昨', '空', '气', '休', '息', '加', '油',
  '快', '乐', '开', '心', '学', '习', '工', '作', '朋', '友',
  '时', '间', '完', '成', '努', '力', '进', '步', '成', '长',
  '希', '望', '未', '来', '梦', '想', '语', '言', '文', '字',
  '心', '想', '理', '美', '好', '生', '活', '温', '暖', '光',
  '阳', '微', '笑', '花', '月', '圆', '风', '云', '山', '水',
  '春', '秋', '冬', '夏', '日', '和', '气', '平', '安', '宁',
  '知', '道', '思', '考', '记', '忆', '青', '春', '勇', '敢',
  '坚', '持', '相', '信', '感', '谢', '快', '慢', '高', '低',
  '大', '小', '上', '下', '左', '右', '前', '后', '内', '外',
  '东', '西', '南', '北', '黑', '白', '日', '月', '火', '冷',
  '暖', '甘', '苦', '悲', '喜', '聚', '散', '动', '静', '问',
  '答', '来', '往', '出', '入', '朋', '辈', '同', '老', '师',
  '父', '母', '家', '人', '孩', '子', '世', '界', '城', '市',
  '道', '路', '回', '家', '吃', '饭', '喝', '水', '睡', '觉',
  '读', '书', '写', '歌', '跳', '舞', '画', '运', '动', '游',
  '戏', '健', '康', '幸', '福', '自', '由', '宁', '静', '从',
  '容', '专', '注', '清', '醒', '放', '松', '充', '实', '丰',
  '盈',
];

/**
 * 生成游戏用字符数组（每个字出现2次）
 * @param {number} n - 需要的不同字数（8×8网格 → n=32）
 * @returns {string[]} 长度为 2n 的数组
 */
export function generateGameChars(n = 32) {
  const pool = [...CHAR_POOL];
  const selected = [];

  // 随机抽取 n 个不同的字
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(idx, 1)[0]);
  }

  // 每个字出现2次
  const doubled = [...selected, ...selected];

  // Fisher-Yates 洗牌
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }

  return doubled; // length = 2n
}
```

---

## 📐 页面布局（从 Figma 截图）

```
┌─────────────────────────────┐
│   （状态栏占位44px）          │
│                             │
│  游戏标题区：                │
│  ┌─────────────────────┐  │
│  │  🐾 汉字消消乐      │  │
│  └─────────────────────┘  │
│                             │
│  分数/时间信息栏：           │
│  ┌─────────────────────┐  │
│  │  分数: 120  │  时间: 01:23  │  │
│  └─────────────────────┘  │
│                             │
│  游戏网格区（自适应）：        │
│  ┌─────────────────────┐  │
│  │  [明][天][今][昨]... │  │
│  │  [空][气][休][息]... │  │
│  │  [...8行×8列...]     │  │
│  └─────────────────────┘  │
│                             │
│  （底部留白 120px）          │
├─────────────────────────────┤
│ 首页 │互动│+ │日历│个人      │  ← 爪子图标#87C8B4高亮
└─────────────────────────────┘
```

---

## 🧩 组件结构（执行机器人需创建）

### 文件清单
```
src/pages/interact/
├── InteractPage.vue          ← 主页面（路由 /interact）
src/components/
├── game/
│   ├── GameBoard.vue        ← 8×8 游戏网格
│   ├── GameCell.vue         ← 单个格子（汉字+动效）
│   ├── GameScore.vue        ← 分数 + 时间显示
│   └── GameComplete.vue     ← 通关弹窗（可选）
├── common/
│   └── ZlTabbar.vue        ← ⚠️ TabBar 组件（已存在，需增量修改）
src/game/
├── chars.js                 ← ✅ 字库（已创建）
└── game-logic.js            ← 游戏核心逻辑（状态管理）
src/styles/
└── game.css                 ← 游戏专属样式（动效）
```

> ⚠️ **重要**：`src/components/common/ZlTabbar.vue` **已存在**，请**增量修改**（不要覆盖）！

---

## 🔗 路由配置（具体代码）

### 在 `src/router/index.js` 中添加 `/interact` 路由

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 布局组件
import AuthLayout from '@/layout/AuthLayout.vue'
import AppLayout from '@/layout/AppLayout.vue'

// 页面组件
import SplashPage from '@/pages/auth/SplashPage.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import PetHomePage from '@/pages/home/PetHomePage.vue'
import InteractPage from '@/pages/interact/InteractPage.vue'  // ⚠️ 新增

const routes = [
  // 开屏页（不需要登录）
  {
    path: '/splash',
    name: 'Splash',
    component: SplashPage,
    meta: { requiresAuth: false }
  },
  // 登录页（不需要登录）
  {
    path: '/auth/login',  // ⚠️ 修正：项目实际路径是 /auth/login
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  // 主应用布局（需要登录）
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: PetHomePage,
        meta: { title: '首页', showTabBar: true }
      },
      // ⚠️ 新增：互动页路由
      {
        path: 'interact',
        name: 'Interact',
        component: InteractPage,
        meta: { title: '互动', showTabBar: true }
      },
      // TODO: 其他页面路由（日历页、个人页）待后续添加
    ]
  },
  // 捕获所有未匹配路由 → 重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫（已有，需修正重定向路径）
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/auth/login')  // ⚠️ 修正：重定向到 /auth/login
  } else if ((to.path === '/auth/login' || to.path === '/splash') && token) {
    next('/home')
  } else {
    next()
  }
})

export default router
```

### 路由说明
- **路径**：`/interact`（对应 TabBar 第2个图标）
- **布局**：使用 `AppLayout`（包含 TabBar）
- **Meta 字段**：
  - `requiresAuth: true` → 需要登录
  - `showTabBar: true` → 显示 TabBar
  - `title: '互动'` → 页面标题（可选）

---

## 🔗 TabBar 切换逻辑（具体代码 + 动画方案）

### 1. `src/components/common/ZlTabbar.vue` 组件代码（增量修改）

> ⚠️ **重要**：此文件**已存在**，请**增量修改**（不要覆盖）！
> 
> **修改原则**：
> - 保留现有 Lucide Icons 导入和用法
> - 保留现有的 `tabs` 配置（如果已有）
> - 只添加/修改：动画样式、isActive 逻辑、switchTab 方法

**修改步骤**：

#### 步骤1：添加方案 B 动画样式

在现有 `.tab-item` 样式基础上修改：

```css
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--zl-space-xs);
  cursor: pointer;
  padding: var(--zl-space-sm) var(--zl-space-md);
  border-radius: var(--zl-radius-sm);
  /* 方案 B 动画 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-item:active {
  transform: scale(0.95);  /* 按下时缩小到 95% */
}

.tab-item.active {
  transform: scale(1.1);  /* 选中时放大到 110% */
  /* 颜色变化在 template 里已处理（:color） */
}
```

#### 步骤2：修改 `isActive` 逻辑

**修改为**（自动判断激活状态）：
```js
import { useRoute } from 'vue-router'

const route = useRoute()

// 判断当前路由是否激活（支持子路由）
const isActive = (tabPath) => {
  return route.path.startsWith(tabPath)
}
```

#### 步骤3：修改 `switchTab` 方法

**修改为**：
```js
// 切换 Tab（路由跳转）
const switchTab = (tabPath) => {
  router.push(tabPath)
}
```

#### 步骤4：修改 template

**修改为**：
```vue
<template>
  <div class="zl-tabbar">
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      class="tab-item"
      :class="{ active: isActive(tab.path), special: tab.special }"
      @click="switchTab(tab.path)"
    >
      <!-- 特殊样式：添加按钮 -->
      <div v-if="tab.special" class="special-btn">
        <component :is="LucideIcons[tab.icon]" :size="24" color="#FFFFFF" />
      </div>
      <!-- 普通 Tab -->
      <template v-else>
        <component
          :is="isActive(tab.path) ? LucideIcons[tab.iconFill] : LucideIcons[tab.icon]"
          :size="24"
          :color="isActive(tab.path) ? 'var(--zl-brand)' : 'var(--zl-text-hint)'"
        />
        <span class="tab-label">{{ tab.name }}</span>
      </template>
    </div>
  </div>
</template>
```

#### 步骤5：确认 Tab 配置（⚠️ 固定，不允许修改）

```js
// Tab 配置（5个图标，固定，不允许再次变化）
const tabs = [
  { name: '首页', icon: 'Home', iconFill: 'Home', path: '/home' },
  { name: '互动', icon: 'MessageCircle', iconFill: 'MessageCircle', path: '/interact' },
  { name: '添加', icon: 'Plus', iconFill: 'Plus', path: '/add', special: true },
  { name: '日历', icon: 'Calendar', iconFill: 'Calendar', path: '/calendar' },
  { name: '个人', icon: 'User', iconFill: 'User', path: '/profile' }
]
```

> 🚨 **警告**：Tab 配置已固定为以上5个图标。**执行机器人不允许修改、添加或删除任何 Tab！**

---

### 2. 在 `src/layout/AppLayout.vue` 中使用 `ZlTabbar`

```vue
<!-- src/layout/AppLayout.vue -->
<template>
  <div class="app-layout">
    <!-- 主内容区（缓存互动页和首页） -->
    <router-view v-slot="{ Component }">
      <keep-alive :include="['InteractPage', 'PetHomePage']">
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <!-- TabBar（根据路由 meta 决定是否显示） -->
    <ZlTabbar v-if="route.meta.showTabBar" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ZlTabbar from '@/components/common/ZlTabbar.vue'

const route = useRoute()
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  padding-bottom: 56px;  /* 给 TabBar 留空间 */
}
</style>
```

---

### 3. 导航栏图标动画方案（方案 B：图标缩放 + 颜色变化）

**已集成到上面的 `ZlTabbar.vue` 代码中**，关键代码：

```css
.tab-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);  /* iOS 标准曲线，有弹性 */
}

.tab-item:active {
  transform: scale(0.95);  /* 按下时缩小到 95% */
}

.tab-item.active {
  color: var(--zl-brand, #87C8B4);  /* 选中时变品牌色 */
  transform: scale(1.1);  /* 选中时放大到 110% */
}
```

**参数说明**：
- **过渡曲线**：`cubic-bezier(0.4, 0, 0.2, 1)`（iOS 标准曲线，有弹性）
- **持续时间**：`0.3s`（300ms，符合人体工学）
- **缩放比例**：
  - 按下：`scale(0.95)`（轻微缩小，反馈点击）
  - 选中：`scale(1.1)`（轻微放大，突出选中态）

---

## 🔗 游戏状态保持（`<keep-alive>` 具体用法）

### 问题背景
用户从"互动页"切换到"首页"，再返回"互动页"时，**游戏进度应该保持**（不能重新初始化）。

### 解决方案
使用 Vue 的 `<keep-alive>` 组件缓存页面状态。

### 具体实现（已在上面 `AppLayout.vue` 中展示）

```vue
<!-- src/layout/AppLayout.vue -->
<template>
  <div class="app-layout">
    <!-- ⚠️ 关键：用 keep-alive 包裹 router-view -->
    <router-view v-slot="{ Component }">
      <keep-alive :include="['InteractPage', 'PetHomePage']">
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <ZlTabbar v-if="route.meta.showTabBar" />
  </div>
</template>
```

### 关键配置

1. **`include` 属性**：
   - 值为**组件名数组**（必须是 `name` 字段，不是文件名）
   - 只有 `InteractPage` 和 `PetHomePage` 会被缓存
   - 其他页面（如登录页、设置页）不会被缓存

2. **组件名设置**（在 `.vue` 文件中）：
   ```vue
   <!-- src/pages/interact/InteractPage.vue -->
   <script setup>
   defineOptions({
     name: 'InteractPage'  // ⚠️ 必须设置 name，否则 keep-alive 不生效
   })
   </script>
   ```

3. **生命周期变化**：
   - 被缓存的组件，**不会触发 `onUnmounted`**
   - 而是触发 `onDeactivated`（失去激活状态）
   - 返回时触发 `onActivated`（重新激活）

### 游戏状态保持的完整流程

```
用户在第1局游戏中（分数 120，时间 01:23）
  → 切换到首页（TabBar 第1个图标）
  → 再返回互动页（TabBar 第2个图标）
  → 游戏进度保持（分数 120，时间 01:23 继续计时）
```

1. **切换到首页**：
   - `InteractPage` 触发 `onDeactivated`
   - 游戏状态（`score`, `time`, `cells`）保存在内存中
   - ⚠️ **可选**：暂停计时器（如果希望切换页面时暂停计时）

2. **返回互动页**：
   - `InteractPage` 触发 `onActivated`
   - 游戏状态从内存中恢复（用户看到的和离开时一模一样）
   - ⚠️ **可选**：恢复计时器

3. **如果需要重置游戏**（用户点击"重新开始"）：
   - 在 `GameLogic` 类中添加 `restart()` 方法
   - 调用 `game.value.restart()` 即可

### 代码实现（在 `InteractPage.vue` 中）

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue';

// ⚠️ 生命周期：组件被缓存时不会触发 onUnmounted，而是触发 onDeactivated
onDeactivated(() => {
  // 可选：暂停计时器（如果希望切换页面时暂停计时）
  // stopTimer();
})

// ⚠️ 生命周期：组件重新激活时触发 onActivated
onActivated(() => {
  // 可选：恢复计时器
  // if (!timer) startTimer();
})
</script>
```

> ✅ **已在 `InteractPage.vue` 代码中实现**（见下方"4. `src/pages/interact/InteractPage.vue` — 主页面"部分）

---

## 💻 核心代码（直接给执行机器人用）

### 1. `src/game/game-logic.js` — 游戏核心逻辑

```js
/**
 * 字灵 · 汉字消消乐 — 游戏核心逻辑（找相同字版）
 * 移植自 ziling_new/js/game/wordmatch.js
 * 改动：去掉 AI 判定，改为"找相同字"逻辑
 */
import { generateGameChars } from './chars.js';

export class GameLogic {
  /**
   * @param {object} opts
   *   - size: 网格一边长度（默认8 → 8×8=64格）
   *   - onScoreChange: 分数变化回调
   *   - onGameComplete: 通关回调
   */
  constructor(opts = {}) {
    this.size = opts.size || 8;
    this.onScoreChange = opts.onScoreChange || (() => {});
    this.onGameComplete = opts.onGameComplete || (() => {});

    this.score = 0;
    this.time = 0;        // 秒数（可选计时功能）
    this.timer = null;
    this.sel = null;        // 当前选中的 {row, col, char}
    this.busy = false;     // 动画期间禁止点击
    this.cells = [];       // size×size 网格，每项 {char, cleared}

    this._init();
  }

  // 初始化 / 重新开始
  _init() {
    const chars = generateGameChars(this.size * this.size / 2); // 64格 → 32种×2
    this.cells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        this.cells.push({
          row: r,
          col: c,
          char: chars[r * this.size + c],
          cleared: false,
          active: false,   // 是否被选中
        });
      }
    }
    this.sel = null;
    this.busy = false;
    this.score = 0;
  }

  /** 重新开始 */
  restart() {
    this._init();
    this.onScoreChange(this.score);
  }

  /** 点击格子 */
  tap(row, col) {
    if (this.busy) return null;
    const idx = row * this.size + col;
    const cell = this.cells[idx];
    if (cell.cleared) return null;

    // 第一次点击 → 选中
    if (!this.sel) {
      cell.active = true;
      this.sel = { row, col, char: cell.char };
      return { type: 'select', cell };
    }

    // 第二次点击 → 判定
    const first = this.sel;

    // 点同一个格子 → 取消选中
    if (first.row === row && first.col === col) {
      cell.active = false;
      this.sel = null;
      return { type: 'deselect', cell };
    }

    // 判定：相同字 → 消除
    if (first.char === cell.char) {
      this.busy = true;
      cell.active = true;

      // 延迟执行消除动画
      setTimeout(() => {
        const idx1 = first.row * this.size + first.col;
        const idx2 = row * this.size + col;
        this.cells[idx1].cleared = true;
        this.cells[idx2].cleared = true;

        this.score += 10;
        this.onScoreChange(this.score);

        this.sel = null;
        this.busy = false;

        // 检查是否全部消除
        if (this.cells.every(c => c.cleared)) {
          this.onGameComplete(this.score, this.time);
        }
      }, 300); // 等待墨色溢出动效

      return {
        type: 'match',
        cells: [first, { row, col, char: cell.char }],
      };
    }

    // 判定：不同字 → 抖动
    cell.active = true;
    this.busy = true;
    setTimeout(() => {
      const idx1 = first.row * this.size + first.col;
      const idx2 = row * this.size + col;
      this.cells[idx1].active = false;
      this.cells[idx2].active = false;
      this.sel = null;
      this.busy = false;
    }, 400); // 等待抖动动效

    return {
      type: 'mismatch',
      cells: [first, { row, col, char: cell.char }],
    };
  }

  /** 开始计时（可选） */
  startTimer() {
    this.timer = setInterval(() => {
      this.time++;
    }, 1000);
  }

  /** 停止计时 */
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /** 销毁 */
  destroy() {
    this.stopTimer();
  }
}
```

---

### 2. `src/components/game/GameCell.vue` — 单个格子

```vue
<template>
  <div
    class="game-cell"
    :class="{
      'is-active': cell.active,
      'is-cleared': cell.cleared,
      'ink-burst': animType === 'clear',
      'shake': animType === 'mismatch',
    }"
    @click="$emit('tap', cell.row, cell.col)"
  >
    <span class="cell-char" v-if="!cell.cleared">{{ cell.char }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  cell: { type: Object, required: true },
});

const emit = defineEmits(['tap']);
const animType = ref('');

// 监听 cell 变化，触发动效
watch(() => props.cell.cleared, (cleared) => {
  if (cleared) {
    animType.value = 'clear';
    setTimeout(() => { animType.value = ''; }, 300);
  }
});

watch(() => props.cell.active, (active) => {
  if (!active && props.cell.cleared === false) {
    // 取消选中时不触发动效
  }
});
</script>

<style scoped>
.game-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  background: var(--zl-cell-bg, rgba(127,127,127,0.10));
  border: var(--zl-cell-border, 1px solid rgba(127,127,127,0.25));
  border-radius: var(--zl-radius-md, 12px);
  cursor: pointer;
  transition: transform 0.1s;
  font-size: var(--zl-cell-font-size, min(6vw, 26px));
  font-family: 'ZiLingFont', '阿里巴巴普惠体', sans-serif;
  color: var(--zl-brand, #87C8B4);
  user-select: none;
}

.game-cell.is-active {
  box-shadow: var(--zl-cell-active-ring, 0 0 0 2px var(--zl-brand) inset);
  transform: scale(var(--zl-cell-active-scale, 1.06));
}

.game-cell.is-cleared {
  visibility: hidden;
}

/* 墨色溢出动效 */
.game-cell.ink-burst {
  animation: inkBurst 0.3s ease-out;
}

@keyframes inkBurst {
  0%   { transform: scale(1); opacity: 1; }
  50%  { transform: scale(1.2); opacity: 0.5; }
  100% { transform: scale(0); opacity: 0; }
}

/* 抖动动效 */
.game-cell.shake {
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-4px); }
  40%      { transform: translateX(4px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(4px); }
}
</style>
```

---

### 3. `src/components/game/GameBoard.vue` — 8×8 网格

```vue
<template>
  <div class="game-board" :style="boardStyle">
    <GameCell
      v-for="(cell, idx) in cells"
      :key="idx"
      :cell="cell"
      @tap="onCellTap"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import GameCell from './GameCell.vue';
import { GameLogic } from '@/game/game-logic.js';

const props = defineProps({
  size: { type: Number, default: 8 },
});

const emit = defineEmits(['score-change', 'game-complete']);

const game = ref(null);
const cells = ref([]);

const boardStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.size}, 1fr)`,
  gap: 'var(--zl-game-gap, 5px)',
  maxWidth: 'var(--zl-game-board-max, 420px)',
  width: 'var(--zl-game-board-vw, 92vw)',
  margin: '0 auto',
  padding: 'var(--zl-game-pad, 8px)',
  background: 'var(--zl-game-board-bg, rgba(127,127,127,0.08))',
  borderRadius: 'var(--zl-radius-lg, 16px)',
  boxShadow: 'var(--zl-game-board-shadow, 0 6px 24px rgba(0,0,0,0.18))',
}));

function initGame() {
  game.value = new GameLogic({
    size: props.size,
    onScoreChange: (score) => emit('score-change', score),
    onGameComplete: (score, time) => emit('game-complete', score, time),
  });
  cells.value = game.value.cells;
}

function onCellTap(row, col) {
  const result = game.value.tap(row, col);
  if (result) {
    cells.value = [...game.value.cells]; // 触发响应式更新
  }
}

// 初始化
onMounted(() => {
  initGame();
});

// 销毁时清理定时器
onUnmounted(() => {
  if (game.value) {
    game.value.destroy();
  }
});

// ⚠️ 暴露 restart 方法（供父组件调用）
defineExpose({
  restart: () => {
    if (game.value) {
      game.value.restart();
      cells.value = [...game.value.cells];
    }
  }
});
</script>
```

---

### 4. `src/pages/interact/InteractPage.vue` — 主页面

```vue
<template>
  <div class="interact-page">
    <!-- 状态栏占位 -->
    <div class="status-bar-placeholder" style="height: 44px;"></div>

    <!-- 游戏标题 -->
    <div class="game-title">
      <span class="title-icon">🐾</span>
      <span class="title-text">汉字消消乐</span>
    </div>

    <!-- 分数/时间信息栏 -->
    <div class="game-info">
      <div class="info-item">
        <span class="info-label">分数</span>
        <span class="info-value">{{ score }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">时间</span>
        <span class="info-value">{{ formatTime(time) }}</span>
      </div>
    </div>

    <!-- 游戏网格 -->
    <GameBoard
      :size="8"
      ref="gameBoardRef"
      @score-change="onScoreChange"
      @game-complete="onGameComplete"
    />

    <!-- 通关弹窗（可选） -->
    <GameComplete
      v-if="showComplete"
      :score="score"
      :time="time"
      @restart="restartGame"
    />

    <!-- 底部留白（给 TabBar + 输入区） -->
    <div style="height: 120px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue';
import GameBoard from '@/components/game/GameBoard.vue';
import GameComplete from '@/components/game/GameComplete.vue';

defineOptions({
  name: 'InteractPage'  // ⚠️ 必须设置 name，否则 keep-alive 不生效
});

const score = ref(0);
const time = ref(0);
const showComplete = ref(false);
const gameBoardRef = ref(null);
let timer = null;

function onScoreChange(newScore) {
  score.value = newScore;
}

function onGameComplete(finalScore, finalTime) {
  showComplete.value = true;
  stopTimer();
}

function restartGame() {
  score.value = 0;
  time.value = 0;
  showComplete.value = false;
  
  // ⚠️ 调用 GameBoard 的 restart 方法
  if (gameBoardRef.value) {
    gameBoardRef.value.restart();
  }
  
  startTimer();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer() {
  timer = setInterval(() => { time.value++; }, 1000);
}

function stopTimer() {
  if (timer) { clearInterval(timer); timer = null; }
}

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  stopTimer();
});

// ⚠️ 生命周期：组件被缓存时不会触发 onUnmounted，而是触发 onDeactivated
onDeactivated(() => {
  // 可选：暂停计时器（如果希望切换页面时暂停计时）
  // stopTimer();
});

// ⚠️ 生命周期：组件重新激活时触发 onActivated
onActivated(() => {
  // 可选：恢复计时器
  // if (!timer) startTimer();
});
</script>

<style scoped>
.interact-page {
  min-height: 100vh;
  background: var(--zl-bg, #FFFAF1);
  padding: var(--zl-space-md, 16px);
}

.game-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--zl-space-sm, 8px);
  margin-bottom: var(--zl-space-md, 16px);
}

.title-icon {
  font-size: 28px;
}

.title-text {
  font-size: var(--zl-font-size-lg, 18px);
  font-weight: 500;
  color: var(--zl-text-primary, #000000);
}

.game-info {
  display: flex;
  justify-content: center;
  gap: var(--zl-space-lg, 32px);
  margin-bottom: var(--zl-space-md, 16px);
  padding: var(--zl-space-sm, 8px) var(--zl-space-md, 16px);
  background: var(--zl-game-score-bg, rgba(127,127,127,0.12));
  border-radius: var(--zl-radius-md, 12px);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.info-label {
  font-size: var(--zl-font-size-sm, 14px);
  color: var(--zl-text-secondary, #636E72);
}

.info-value {
  font-size: var(--zl-font-size-lg, 18px);
  font-weight: 500;
  color: var(--zl-brand, #87C8B4);
}
</style>
```

---

### 5. `src/components/game/GameComplete.vue` — 通关弹窗

```vue
<template>
  <div class="game-complete-overlay">
    <div class="game-complete-modal">
      <!-- 标题 -->
      <div class="modal-header">
        <span class="header-icon">🎉</span>
        <h2 class="header-title">恭喜通关！</h2>
      </div>

      <!-- 得分 + 用时 -->
      <div class="modal-body">
        <div class="stat-item">
          <span class="stat-label">得分</span>
          <span class="stat-value">{{ score }} 分</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">用时</span>
          <span class="stat-value">{{ formatTime(time) }}</span>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="modal-footer">
        <button class="btn-restart" @click="$emit('restart')">
          再玩一局
        </button>
        <button class="btn-home" @click="$router.push('/home')">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const props = defineProps({
  score: { type: Number, required: true },
  time: { type: Number, required: true }
})

const emit = defineEmits(['restart'])

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
</script>

<style scoped>
.game-complete-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.game-complete-modal {
  background: var(--zl-bg-card, #FFFFFF);
  border-radius: var(--zl-radius-lg, 20px);
  padding: var(--zl-space-xl, 32px);
  max-width: 320px;
  width: 80%;
  box-shadow: var(--zl-shadow-lg, 0 8px 24px rgba(0,0,0,0.12));
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-sm, 8px);
  margin-bottom: var(--zl-space-lg, 24px);
}

.header-icon {
  font-size: 48px;
}

.header-title {
  font-size: var(--zl-font-size-xxl, 24px);
  color: var(--zl-brand, #87C8B4);
  font-weight: 500;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md, 16px);
  margin-bottom: var(--zl-space-lg, 24px);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--zl-space-sm, 8px) var(--zl-space-md, 16px);
  background: var(--zl-bg-soft, #F0F5F2);
  border-radius: var(--zl-radius-md, 12px);
}

.stat-label {
  font-size: var(--zl-font-size-base, 16px);
  color: var(--zl-text-hint, #636E72);
}

.stat-value {
  font-size: var(--zl-font-size-lg, 18px);
  color: var(--zl-text-primary, #000000);
  font-weight: 500;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-sm, 8px);
}

.btn-restart {
  width: 100%;
  padding: var(--zl-space-sm, 8px) var(--zl-space-md, 16px);
  background: var(--zl-brand, #87C8B4);
  color: var(--zl-text-secondary, #FFFFFF);
  border: none;
  border-radius: var(--zl-radius-md, 12px);
  font-size: var(--zl-font-size-base, 16px);
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-restart:hover {
  opacity: 0.9;
}

.btn-home {
  width: 100%;
  padding: var(--zl-space-sm, 8px) var(--zl-space-md, 16px);
  background: transparent;
  color: var(--zl-brand, #87C8B4);
  border: 1px solid var(--zl-brand, #87C8B4);
  border-radius: var(--zl-radius-md, 12px);
  font-size: var(--zl-font-size-base, 16px);
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-home:hover {
  opacity: 0.9;
}
</style>
```

---

## 🎨 样式规范（遵循 Design Tokens）

| CSS 变量 | 值 | 用途 |
|---------|-----|------|
| `--zl-brand` | `#87C8B4` | 选中态/分数/品牌色 |
| `--zl-bg` | `#FFFAF1` | 页面背景 |
| `--zl-text-primary` | `#000000` | 标题/主要文字 |
| `--zl-text-secondary` | `#636E72` | 辅助文字 |
| `--zl-radius-md` | `12px` | 格子圆角 |
| `--zl-radius-lg` | `16px` | 游戏 board 圆角 |
| `--zl-space-sm` | `8px` | 小间距 |
| `--zl-space-md` | `16px` | 中间距 |
| `--zl-game-gap` | `5px` | 格子间距 |
| `--zl-game-board-max` | `420px` | 棋盘最大宽度 |
| `--zl-game-board-vw` | `92vw` | 棋盘视口占比 |

---

## ⚠️ 重要注意事项

1. **零 API 调用** —— 游戏逻辑完全本地，不调用任何后端接口
2. **动效必须保留** —— 墨色溢出（clear）+ 抖动（mismatch）+ 新字填入（refill）
3. **字体使用阿里巴巴普惠体** —— 通过 CSS 变量 `font-family: 'ZiLingFont', ...`
4. **自适应** —— 棋盘宽度用 `min(92vw, 420px)`，字体用 `min(6vw, 26px)`
5. **TabBar 高亮** —— 互动 Tab 图标（爪子）用品牌色 `#87C8B4`
6. **游戏难度递增（后期迭代）** —— 第一期先固定 8×8，后期可加 10×10 / 12×12
7. **游戏状态保持** —— 使用 `<keep-alive>` 缓存 `InteractPage` 组件（已在 `AppLayout.vue` 中配置）
8. **导航栏动画** —— 使用方案 B（图标缩放 + 颜色变化），详见 `ZlTabbar.vue` 代码
9. **TabBar 元素固定** —— 5个图标（首页/互动/添加/日历/个人），**不允许修改**

---

## ✅ 执行清单（执行机器人逐项勾选）

- [ ] **检查 `src/components/common/ZlTabbar.vue`**（TabBar 组件，已存在，需增量修改）
  - [ ] 添加方案 B 动画样式（`.tab-item:active` + `.tab-item.active`）
  - [ ] 修改 `isActive` 逻辑（改成自动判断 `route.path.startsWith(tabPath)`）
  - [ ] 修改 `switchTab` 方法（接收 `tabPath` 参数）
  - [ ] 修改 template（`:class` 和 `@click` 绑定）
- [ ] 创建 `src/game/game-logic.js`（游戏核心逻辑，上面有完整代码）
- [ ] 创建 `src/components/game/GameCell.vue`（单个格子，上面有完整代码）
- [ ] 创建 `src/components/game/GameBoard.vue`（8×8网格，上面有完整代码）
- [ ] 创建 `src/pages/interact/InteractPage.vue`（主页面，上面有完整代码）
- [ ] 创建 `src/components/game/GameComplete.vue`（通关弹窗，上面有完整代码）
- [ ] 在 `src/styles/game.css` 中补充游戏全局样式（动效 keyframes）
- [ ] 在 `src/router/index.js` 中添加 `/interact` 路由（上面有完整代码）
  - [ ] 修正登录页路径（`/login` → `/auth/login`）
  - [ ] 修正路由守卫中的重定向（`/login` → `/auth/login`）
- [ ] 在 `src/layout/AppLayout.vue` 中添加 `<keep-alive>` 缓存（上面有完整代码）
- [ ] **测试：点击选中 → 点相同字 → 消除 + 得分**
- [ ] **测试：点不同字 → 抖动 → 取消选中**
- [ ] **测试：全部消除 → 通关弹窗**
- [ ] **测试：切换到首页再返回 → 游戏状态保持（分数/时间不变）**
- [ ] **测试：TabBar 切换动画（选中时放大 + 变色）**

---

## 📊 数据来源汇总

| 数据 | 来源 | 说明 |
|------|------|------|
| 汉字池 | `src/game/chars.js` → `CHAR_POOL`（166字） | 从 ziling_new 提取 |
| 游戏状态 | `GameLogic` 类（本地 reactive） | 分数/时间/选中态 |
| 通关判定 | 本地计算（全部 cleared === true） | 零 API |

---

## 🔗 与首页的关系

- 从首页底部 TabBar 点击"互动"图标 → 路由跳转到 `/interact`
- 互动页底部 TabBar 保持选中态（爪子图标高亮，scale(1.1) + 品牌色）
- 可以从互动页返回首页（TabBar 切换）
- **游戏状态保持**：从互动页切换到首页再返回，游戏进度不变（使用 `<keep-alive>` 缓存）

---

## 📤 执行完成后必须反馈的内容

**执行机器人：完成上述所有任务后，请反馈以下信息：**

1. **文件目录结构**（已创建/修改的文件列表）：
   ```
   src/
   ├── pages/interact/
   │   └── InteractPage.vue
   ├── components/game/
   │   ├── GameBoard.vue
   │   ├── GameCell.vue
   │   └── GameComplete.vue
   ├── game/
   │   └── game-logic.js
   ├── styles/
   │   └── game.css
   ├── router/index.js（已修改）
   ├── layout/AppLayout.vue（已修改）
   └── components/common/ZlTabbar.vue（已修改）
   ```

2. **架构说明**：
   - 游戏核心逻辑：`GameLogic` 类（本地状态管理）
   - 组件通信：`GameBoard` → `GameLogic`（通过 `ref` 调用）
   - 状态保持：`<keep-alive>` 缓存 `InteractPage` 组件
   - 动画实现：CSS animation（ink-burst / shake）

3. **测试报告**：
   - 游戏基本功能（选中/消除/抖动）是否正常
   - 游戏状态保持（切换页面再返回）是否正常
   - TabBar 动画（选中时放大 + 变色）是否正常

---

**执行机器人：请严格按照以上代码和规格实现互动页。如有疑问，停止并说明，不要猜测。**

---

## 📝 修订记录

| 日期 | 修订内容 | 修订人 |
|------|---------|--------|
| 2026-06-08 | 补全路由配置（具体代码） | AI Consultant |
| 2026-06-08 | 补全 TabBar 切换逻辑（ZlTabbar.vue 组件代码） | AI Consultant |
| 2026-06-08 | 补全游戏状态保持（`<keep-alive>` 用法） | AI Consultant |
| 2026-06-08 | 设计导航栏图标动画方案（方案 B：缩放 + 颜色变化） | AI Consultant |
| 2026-06-08 | 修复 `defineOptions` 设置组件名（供 keep-alive 识别） | AI Consultant |
| 2026-06-08 | 添加 `defineExpose` 暴露 restart 方法（供父组件调用） | AI Consultant |
| 2026-06-08 | 修正路由路径（`/login` → `/auth/login`） | AI Consultant |
| 2026-06-08 | 修正 TabBar 配置（5个图标，含"+"） | AI Consultant |
| 2026-06-08 | 添加执行反馈要求（文件目录 + 架构说明 + 测试报告） | AI Consultant |
| 2026-06-08 | 修复所有 `cubic-bezier` 拼写错误 | AI Consultant |
| 2026-06-08 | 确认 TabBar 元素固定（不允许再次变化） | AI Consultant |
