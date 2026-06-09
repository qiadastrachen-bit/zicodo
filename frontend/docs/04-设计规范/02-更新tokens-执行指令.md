# 设计规范实施任务 - 更新 tokens.css

> **任务类型**：#11 - 基础框架搭建
>
> **执行日期**：2026-06-09
>
> **优先级**：最高（所有组件和页面依赖此文件）

---

## 任务目标

**将《字灵完整尺寸设计规范》（design-system-spec.md）中的所有 Design Tokens 写入项目的 `tokens.css` 文件，建立统一的设计变量系统。**

---

## 背景信息

### 设计规范文件位置
```
G:\陈锦彤2026上\智能开源硬件\前端\design-system-spec.md
```

### 项目信息
- **项目路径**：`G:\陈锦彤2026上\智能开源硬件\前端\ziling-frontend\`
- **技术栈**：Vue 3 + Vite + CSS Variables
- **目标设备**：移动端（最大宽度 480px）
- **设计原则**：8pt Grid System、一致性、易用性（44px 最小触摸目标）

### 已有设计变量（需要保留）
```css
/* 已有变量（不能删除） */
--zl-brand: #87C8B4;
--zl-bg: #FFFAF1;
--zl-text-primary: #000000;
--zl-text-secondary: #666666;
--zl-text-hint: #999999;
--zl-border: #E5E5E5;
```

---

## ✅ 具体要求

### Step 1：创建/更新 `src/styles/tokens.css`

#### 1.1 文件结构
```
ziling-frontend/
├── src/
│   ├── styles/
│   │   ├── tokens.css       ← 新建/更新这个文件
│   │   └── global.css       ← 引入 tokens.css
│   └── ...
└── ...
```

#### 1.2 Token 完整清单（必须包含）

**A. 颜色系统（保留已有 + 新增语义色）**
```css
:root {
  /* ==================== 保留已有颜色 ==================== */
  --zl-brand: #87C8B4;
  --zl-bg: #FFFAF1;
  --zl-text-primary: #000000;
  --zl-text-secondary: #666666;
  --zl-text-hint: #999999;
  --zl-border: #E5E5E5;
  
  /* ==================== 新增语义色 ==================== */
  --zl-success: #10B981;
  --zl-warning: #F59E0B;
  --zl-error: #EF4444;
  --zl-info: #3B82F6;
  
  /* ==================== 品牌色阶（可选，用于渐变/阴影） ==================== */
  --zl-brand-light: #A8DED0;
  --zl-brand-dark: #6BB5A0;
}
```

**B. 字体系统（7级层次）**
```css
:root {
  /* ==================== 字体 Scale ==================== */
  --zl-font-xs: 0.75rem;    /* 12px */
  --zl-font-sm: 0.875rem;   /* 14px */
  --zl-font-base: 1rem;      /* 16px */
  --zl-font-lg: 1.25rem;    /* 20px */
  --zl-font-xl: 1.5rem;     /* 24px */
  --zl-font-2xl: 1.875rem;  /* 30px */
  --zl-font-3xl: 2.25rem;   /* 36px */
  
  /* ==================== 字重 ==================== */
  --zl-weight-regular: 400;
  --zl-weight-medium: 500;
  --zl-weight-semibold: 600;
  --zl-weight-bold: 700;
  
  /* ==================== 行高 ==================== */
  --zl-line-tight: 1.25;
  --zl-line-normal: 1.5;
  --zl-line-relaxed: 1.75;
}
```

**C. 间距系统（8pt Grid）**
```css
:root {
  /* ==================== 间距 Scale ==================== */
  --zl-space-0: 0;
  --zl-space-1: 0.25rem;   /* 4px */
  --zl-space-2: 0.5rem;    /* 8px */
  --zl-space-3: 0.75rem;    /* 12px */
  --zl-space-4: 1rem;       /* 16px */
  --zl-space-5: 1.25rem;   /* 20px */
  --zl-space-6: 1.5rem;    /* 24px */
  --zl-space-8: 2rem;       /* 32px */
  --zl-space-10: 2.5rem;    /* 40px */
  --zl-space-12: 3rem;      /* 48px */
  --zl-space-16: 4rem;      /* 64px */
}
```

**D. 圆角系统**
```css
:root {
  /* ==================== 圆角 Scale ==================== */
  --zl-radius-none: 0;
  --zl-radius-sm: 0.5rem;     /* 8px */
  --zl-radius-md: 0.75rem;    /* 12px */
  --zl-radius-lg: 1.25rem;    /* 20px */
  --zl-radius-xl: 1.75rem;    /* 28px */
  --zl-radius-full: 50%;
}
```

**E. 阴影系统**
```css
:root {
  /* ==================== 阴影 Scale ==================== */
  --zl-shadow-none: none;
  --zl-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --zl-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --zl-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
  --zl-shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.20);
}
```

**F. 组件尺寸**
```css
:root {
  /* ==================== 按钮高度 ==================== */
  --zl-btn-height-sm: 32px;
  --zl-btn-height-base: 40px;
  --zl-btn-height-lg: 48px;
  --zl-btn-height-icon: 44px;  /* 图标按钮 */
  
  /* ==================== 输入框高度 ==================== */
  --zl-input-height-sm: 32px;
  --zl-input-height-base: 40px;
  --zl-input-height-lg: 48px;
  
  /* ==================== TabBar ==================== */
  --zl-tabbar-height: 56px;
  --zl-tabbar-icon-size: 24px;
  
  /* ==================== 打卡计时器 ==================== */
  --zl-timer-size: 180px;  /* 修正：之前 250px 太大 */
}
```

**G. 动画曲线**
```css
:root {
  /* ==================== 过渡动画 ==================== */
  --zl-transition-fast: 150ms ease;
  --zl-transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --zl-transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**H. 响应式断点**
```css
:root {
  /* ==================== 响应式断点 ==================== */
  --zl-breakpoint-sm: 640px;
  --zl-breakpoint-md: 768px;
  --zl-breakpoint-lg: 1024px;
  --zl-breakpoint-xl: 1280px;
}
```

#### 1.3 完整文件示例

**文件路径**：`src/styles/tokens.css`

```css
/**
 * 字灵(ZiLing) Design Tokens
 * 基于 8pt Grid System
 * 日期：2026-06-08
 */

:root {
  /* ===================================================================
     1. 颜色系统
     =================================================================== */
  
  /* 品牌色（不可更改） */
  --zl-brand: #87C8B4;
  --zl-bg: #FFFAF1;
  
  /* 文本色 */
  --zl-text-primary: #000000;
  --zl-text-secondary: #666666;
  --zl-text-hint: #999999;
  
  /* 边框色 */
  --zl-border: #E5E5E5;
  
  /* 语义色 */
  --zl-success: #10B981;
  --zl-warning: #F59E0B;
  --zl-error: #EF4444;
  --zl-info: #3B82F6;
  
  /* 品牌色阶（用于渐变/阴影） */
  --zl-brand-light: #A8DED0;
  --zl-brand-dark: #6BB5A0;
  
  
  /* ===================================================================
     2. 字体系统（7级层次）
     =================================================================== */
  
  --zl-font-xs: 0.75rem;    /* 12px */
  --zl-font-sm: 0.875rem;   /* 14px */
  --zl-font-base: 1rem;      /* 16px */
  --zl-font-lg: 1.25rem;    /* 20px */
  --zl-font-xl: 1.5rem;     /* 24px */
  --zl-font-2xl: 1.875rem;  /* 30px */
  --zl-font-3xl: 2.25rem;   /* 36px */
  
  --zl-weight-regular: 400;
  --zl-weight-medium: 500;
  --zl-weight-semibold: 600;
  --zl-weight-bold: 700;
  
  --zl-line-tight: 1.25;
  --zl-line-normal: 1.5;
  --zl-line-relaxed: 1.75;
  
  
  /* ===================================================================
     3. 间距系统（8pt Grid）
     =================================================================== */
  
  --zl-space-0: 0;
  --zl-space-1: 0.25rem;   /* 4px */
  --zl-space-2: 0.5rem;    /* 8px */
  --zl-space-3: 0.75rem;    /* 12px */
  --zl-space-4: 1rem;       /* 16px */
  --zl-space-5: 1.25rem;   /* 20px */
  --zl-space-6: 1.5rem;    /* 24px */
  --zl-space-8: 2rem;       /* 32px */
  --zl-space-10: 2.5rem;    /* 40px */
  --zl-space-12: 3rem;      /* 48px */
  --zl-space-16: 4rem;      /* 64px */
  
  
  /* ===================================================================
     4. 圆角系统
     =================================================================== */
  
  --zl-radius-none: 0;
  --zl-radius-sm: 0.5rem;     /* 8px */
  --zl-radius-md: 0.75rem;    /* 12px */
  --zl-radius-lg: 1.25rem;    /* 20px */
  --zl-radius-xl: 1.75rem;    /* 28px */
  --zl-radius-full: 50%;
  
  
  /* ===================================================================
     5. 阴影系统
     =================================================================== */
  
  --zl-shadow-none: none;
  --zl-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --zl-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --zl-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
  --zl-shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.20);
  
  
  /* ===================================================================
     6. 组件尺寸
     =================================================================== */
  
  /* 按钮 */
  --zl-btn-height-sm: 32px;
  --zl-btn-height-base: 40px;
  --zl-btn-height-lg: 48px;
  --zl-btn-height-icon: 44px;
  
  /* 输入框 */
  --zl-input-height-sm: 32px;
  --zl-input-height-base: 40px;
  --zl-input-height-lg: 48px;
  
  /* TabBar */
  --zl-tabbar-height: 56px;
  --zl-tabbar-icon-size: 24px;
  
  /* 打卡计时器 */
  --zl-timer-size: 180px;
  
  
  /* ===================================================================
     7. 动画曲线
     =================================================================== */
  
  --zl-transition-fast: 150ms ease;
  --zl-transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --zl-transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
  
  
  /* ===================================================================
     8. 响应式断点
     =================================================================== */
  
  --zl-breakpoint-sm: 640px;
  --zl-breakpoint-md: 768px;
  --zl-breakpoint-lg: 1024px;
  --zl-breakpoint-xl: 1280px;
}
```

---

### Step 2：在 `src/styles/global.css` 中引入 `tokens.css`

**文件路径**：`src/styles/global.css`

```css
/**
 * 字灵(ZiLing) Global Styles
 * 引入 Design Tokens
 */

/* 引入 Design Tokens */
@import './tokens.css';

/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', sans-serif;
  background-color: var(--zl-bg);
  color: var(--zl-text-primary);
  font-size: var(--zl-font-base);
  line-height: var(--zl-line-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 其他全局样式... */
```

---

### Step 3：在 `src/main.js` 中引入 `global.css`

**文件路径**：`src/main.js`

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局样式
import './styles/global.css'  // ← 确保这行存在

const app = createApp(App)
app.use(router)
app.mount('#app')
```

---

## 验收标准

### ✅ 必须达到的标准

1. **Token 完整性**：
   - [ ] 所有 8 个系统的 Token 都已定义
   - [ ] 保留了已有的 6 个颜色变量（`--zl-brand`、`--zl-bg` 等）
   - [ ] 新增语义色（`--zl-success`、`--zl-warning` 等）

2. **文件结构正确**：
   - [ ] `src/styles/tokens.css` 文件存在
   - [ ] `src/styles/global.css` 引入了 `tokens.css`
   - [ ] `src/main.js` 引入了 `global.css`

3. **代码规范**：
   - [ ] 使用 CSS Custom Properties（不是 Sass variables）
   - [ ] 注释清晰，按系统分组
   - [ ] 单位使用 `rem`（不是 `px`）

4. **可使用性**：
   - [ ] 在 Vue 组件中可以使用 `var(--zl-brand)` 访问
   - [ ] 热更新正常工作（修改 Token 后页面自动更新）

---

## ⚠️ 注意事项

### 1. 不要删除已有变量
```css
/* ✅ 正确：保留已有变量 */
:root {
  --zl-brand: #87C8B4;  /* 已有 */
  --zl-bg: #FFFAF1;      /* 已有 */
  --zl-text-primary: #000000;  /* 已有 */
  /* ... 新增 Token ... */
}

/* ❌ 错误：删除已有变量 */
:root {
  /* 只有新 Token，没有 --zl-brand 等 */
}
```

### 2. 单位使用 `rem`，不是 `px`
```css
/* ✅ 正确 */
--zl-font-base: 1rem;  /* 16px */
--zl-space-4: 1rem;    /* 16px */

/* ❌ 错误 */
--zl-font-base: 16px;
--zl-space-4: 16px;
```

### 3. 不要在 `tokens.css` 中写样式
```css
/* ✅ 正确：只定义 Token */
:root {
  --zl-brand: #87C8B4;
  --zl-font-base: 1rem;
}

/* ❌ 错误：不要写样式 */
:root {
  --zl-brand: #87C8B4;
}

.btn {
  color: var(--zl-brand);  /* 不要在这里写！ */
}
```

---

## 交付要求

### 执行完成后，你必须提供：

1. **文件目录结构**（确认文件位置正确）
   ```
   截图或文本：
   src/styles/tokens.css ✅
   src/styles/global.css ✅
   src/main.js ✅
   ```

2. **Token 清单**（确认所有 Token 都已定义）
   ```
   截图或文本：
   ✅ 颜色系统（13 个 Token）
   ✅ 字体系统（14 个 Token）
   ✅ 间距系统（11 个 Token）
   ...
   ```

3. **测试证明**（确认 Token 可用）
   ```vue
   <!-- 在任意 .vue 文件中测试 -->
   <template>
     <div class="test-box">测试 Token</div>
   </template>
   
   <style scoped>
   .test-box {
     color: var(--zl-brand);  /* 应该显示薄荷绿 */
     padding: var(--zl-space-4);  /* 应该有 16px 内边距 */
     border-radius: var(--zl-radius-md);  /* 应该有 12px 圆角 */
   }
   </style>
   ```
   
   **截图证明**：浏览器中元素样式显示正确的 Token 值

4. **遵守规则确认**
   ```
   我遵守了规则：
   ✅ 没有使用 anytypo 6.0 垃圾
   ✅ 没有使用模拟器
   ✅ 所有页面都从 localhost:5173 截图
   ✅ 所有截图都缩放 50%
   ✅ 每次最多处理 2 个页面
   ✅ 完成 2 个页面后立即交付
   ```

---

## 强制执行规则

### 你必须遵守这些规则（否则拒绝接收交付）

1. **❌ 禁止使用 anytypo 6.0 垃圾**
   - 不要使用 anytypo 6.0 生成设计
   - 不要使用任何"AI 设计工具"生成界面
   - 必须手写 CSS

2. **❌ 禁止使用模拟器截图**
   - 所有页面必须从 `localhost:5173` 截图
   - 不允许使用 Figma、Sketch、Adobe XD 等工具截图
   - 必须在真实浏览器中截图

3. **✅ 必须遵守截图规范**
   - 所有截图必须缩放 50%
   - 所有截图必须清晰可见
   - 截图必须包含浏览器地址栏（显示 `localhost:5173`）

4. **✅ 必须遵守分页原则**
   - 每次最多处理 2 个页面
   - 完成 2 个页面后立即交付
   - 不允许一次处理所有页面

---

## 问题反馈

### 如果遇到问题，你必须：

1. **立即停止**，不要继续
2. **描述问题**（截图 + 文字说明）
3. **等待指示**，不要自己决定

### 常见问题预案

**Q1：如果 `tokens.css` 文件已存在怎么办？**
- A1：先读取现有内容，保留已有 Token，新增缺失的 Token

**Q2：如果项目没有 `src/styles/` 目录怎么办？**
- A2：创建该目录，然后创建 `tokens.css` 和 `global.css`

**Q3：如果 `global.css` 中已经有样式怎么办？**
- A3：保留现有样式，只在文件顶部添加 `@import './tokens.css';`

---

## ✅ 完成任务后

### 你必须提供：

1. **文件目录结构**（文本或截图）
2. **Token 清单**（确认所有 Token 都已定义）
3. **测试证明**（浏览器截图，显示 Token 正常工作）
4. **遵守规则确认**（勾选所有规则）

### 交付格式

```
## 任务完成报告

### 1. 文件目录结构
```
src/styles/tokens.css ✅
src/styles/global.css ✅
src/main.js ✅
```

### 2. Token 清单
✅ 颜色系统（13 个 Token）
✅ 字体系统（14 个 Token）
...

### 3. 测试证明
[截图：浏览器中显示 Token 正常工作]

### 4. 遵守规则确认
✅ 没有使用 anytypo 6.0 垃圾
✅ 没有使用模拟器
✅ 所有页面都从 localhost:5173 截图
✅ 所有截图都缩放 50%
✅ 每次最多处理 2 个页面
✅ 完成 2 个页面后立即交付

---

**准备进入下一个任务！**
```

---

**如果你理解任务要求，请回复"我懂了"，然后开始执行。**
