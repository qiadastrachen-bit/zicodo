# zicodo - 智能宠物互动与任务管理平台

> **版本**: v0.0.0 (开发版)
> **状态**: 🔵 活跃开发中
> **更新日期**: 2026-06-09

---

## 📋 目录

1. [产品概述](#1-产品概述)
2. [核心功能](#2-核心功能)
3. [技术架构](#3-技术架构)
4. [设计规范](#4-设计规范)
5. [组件库体系](#5-组件库体系)
6. [项目文件架构](#6-项目文件架构)
7. [开发环境配置](#7-开发环境配置)
8. [构建与部署](#8-构建与部署)
9. [API 接口文档](#9-api-接口文档)
10. [贡献指南](#10-贡献指南)
11. [常见问题](#11-常见问题-faq)
12. [许可证](#12-许可证)

---

## 1. 产品概述

### 1.1 产品定位

**zicodo** 是一款面向个人和小团队的智能任务管理与互动平台，融合了任务管理、宠物养成和 AI 对话三大核心能力。通过游戏化的方式激励用户完成目标，并提供温暖的陪伴式体验。

### 1.2 核心价值

- **🎯 高效任务管理**：个人/团队双模式任务管理，支持打卡、重复任务、日历视图
- **🐱 虚拟宠物陪伴**：通过完成任务获得积分，养育和成长虚拟宠物
- **🤖 智能 AI 对话**：基于 DeepSeek 的智能对话系统，提供情感化陪伴和建议
- **👥 轻量团队协作**：支持团队创建、成员邀请、任务共享、积分排名
- **📱 移动端优先**：专为移动端设计的响应式界面，支持 PWA 离线访问

### 1.3 目标用户群体

| 用户类型 | 典型特征 | 核心需求 |
|---------|---------|---------|
| **学生党** | 有大量作业/学习目标需要管理 | 打卡激励、学习计划、成就感 |
| **职场新人** | 需要管理日常任务和学习成长 | 高效工具、正向反馈 |
| **自由职业者** | 独立工作，需要自我监督和激励 | 任务追踪、成就系统 |
| **小团队** | 3-10人小团队，需要轻量协作工具 | 团队任务、积分排名 |
| **宠物爱好者** | 喜欢虚拟宠物养成游戏 | 陪伴感、成长体验 |

### 1.4 产品特色

- **零摩擦启动**：支持"体验服模式"，无需注册即可完整体验所有功能
- **SSE 流式对话**：AI 回复逐字展示，提供自然流畅的对话体验
- **轻量 RAG 记忆**：自动记录对话关键词，实现上下文感知回复
- **多端适配**：PC、平板、手机自适应布局，体验一致
- **离线可用**：PWA 特性，支持离线访问和数据缓存

---

## 2. 核心功能

### 2.1 任务管理系统

| 功能 | 说明 | 状态 |
|------|------|------|
| 📝 **任务创建** | 支持标题、描述、截止日期、地点、提醒设置 | ✅ |
| ✅ **任务打卡** | 点击完成任务，自动获得积分奖励 | ✅ |
| 🔄 **重复任务** | 支持每日/每周/自定义周期的重复任务 | ✅ |
| 📅 **日历视图** | 按月查看任务分布和完成情况 | ✅ |
| 📊 **任务统计** | 完成率、连续打卡天数、历史记录 | ✅ |
| 🎮 **游戏化激励** | 积分系统、成就徽章、等级成长 | ✅ |

### 2.2 宠物养成系统

| 功能 | 说明 | 状态 |
|------|------|------|
| 🐣 **宠物成长** | 20 级等级体系，5 个成长阶段（蛋→幼体→成长体→成熟体→觉醒体） | ✅ |
| 🎨 **多彩外观** | 5 种色调，多种组合方式 | ✅ |
| 😊 **情绪系统** | 5 种情绪状态，随互动和任务完成情况动态变化 | ✅ |
| ✨ **积分兑换** | 任务完成获取积分，用于宠物成长和道具 | ✅ |
| 💬 **互动对话** | 与宠物进行 AI 对话，获得情感支持 | ✅ |
| 🏆 **成就系统** | 多种成就徽章，记录用户成长轨迹 | ✅ |

### 2.3 AI 智能对话

| 功能 | 说明 | 状态 |
|------|------|------|
| 💭 **流式对话** | SSE 技术实现逐字显示，自然流畅的回复体验 | ✅ |
| 🧠 **上下文记忆** | 自动记录对话关键词，实现长期记忆 | ✅ |
| 🔐 **智能模式** | 可切换不同 AI 角色（鼓励/理性/温暖等） | ✅ |
| 📜 **对话历史** | 自动保存历史对话，可随时查看 | ✅ |
| 🔑 **API 配置** | 支持自定义 DeepSeek API Key，灵活接入 | ✅ |

### 2.4 团队协作系统

| 功能 | 说明 | 状态 |
|------|------|------|
| 👥 **团队创建** | 一键创建团队，自动生成邀请码 | ✅ |
| 🔑 **邀请加入** | 通过邀请码快速加入团队 | ✅ |
| 📋 **团队任务** | 团队共享任务列表，成员可查看和参与 | ✅ |
| 🏆 **积分排名** | 团队成员积分排行榜，激发竞争意识 | ✅ |
| 👤 **成员管理** | 查看团队成员信息和贡献度 | ✅ |
| 🚪 **退出/隐藏** | 支持退出团队或隐藏团队 | ✅ |

### 2.5 个人中心

| 功能 | 说明 | 状态 |
|------|------|------|
| 👤 **个人信息** | 头像、昵称、简介等信息管理 | ✅ |
| 🔒 **账号安全** | 登录密码、API Key 安全管理 | ✅ |
| 🎨 **主题设置** | 支持明/暗主题，自定义色调 | ✅ |
| 📈 **数据统计** | 任务完成率、积分获取、成长曲线等 | ✅ |
| 🏅 **成就徽章** | 展示已获得和未获得的徽章 | ✅ |
| 📜 **对话记录** | 历史对话查看和管理 | ✅ |

---

## 3. 技术架构

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        zicodo 应用层                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  前端 SPA   │  │  后端 API   │  │  数据库     │          │
│  │  (Vue 3)   │  │ (Express)   │  │  (SQLite)   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 前端技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **核心框架** | Vue.js | 3.5+ | 前端主框架（Composition API） |
| **路由管理** | Vue Router | 4.6+ | 单页面应用路由 |
| **状态管理** | Pinia | 3.0+ | 全局状态管理，替代 Vuex |
| **构建工具** | Vite | 8.0+ | 快速开发和构建 |
| **HTTP 客户端** | Axios | 1.17+ | API 请求 |
| **图标库** | Lucide Vue | 0.577+ | 简洁一致的图标系统 |
| **代码压缩** | Terser | 5.48+ | JavaScript 压缩 |

### 3.3 后端技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **运行时** | Node.js | 18+ | JavaScript 运行时 |
| **Web 框架** | Express.js | 4.x | HTTP 服务和路由 |
| **数据库** | SQLite 3 | - | 轻量关系型数据库 |
| **ORM** | Sequelize | 6.x | 数据库 ORM 框架 |
| **认证** | JWT (bcryptjs + jsonwebtoken) | - | Token 认证（无 Session） |
| **密码加密** | bcryptjs | 2.x | 密码安全加密（bcryptjs 轻量实现） |
| **AI 集成** | DeepSeek API | - | 智能对话服务 |

### 3.4 核心设计原则

1. **🎨 设计优先**：所有功能开发从设计规范出发，确保视觉一致性
2. **⚡ 性能优先**：使用 Vite 构建，按需加载，最小化资源体积
3. **📱 移动端优先**：从一开始就考虑移动端体验，响应式设计
4. **🔧 可扩展性**：模块化架构，清晰的 API 边界，便于功能扩展
5. **🧩 组件化**：UI 组件高度可复用，统一 Props 设计
6. **🔒 安全性**：密码加密、权限控制、数据验证

---

## 4. 设计规范

### 4.1 设计理念

- **简洁至上**：去除不必要的装饰，让内容成为焦点
- **温暖友好**：使用柔和色彩和圆润设计，营造舒适氛围
- **高效实用**：每个功能都经过实际使用场景验证，拒绝华而不实
- **一致统一**：全平台遵循统一的设计语言和交互模式

### 4.2 色彩系统

#### 主色调 (Primary Colors)

| 颜色 | 色值 | 用途 |
|------|------|------|
| **主品牌色** | `#6366f1` (Indigo) | 主要按钮、强调文字、关键图标 |
| **主品牌深色** | `#4f46e5` | Hover 状态、强调元素 |
| **主品牌浅色** | `#818cf8` | 辅助强调、背景色 |

#### 功能色 (Functional Colors)

| 颜色 | 色值 | 用途 |
|------|------|------|
| **成功色** | `#10b981` | 成功状态、完成标记、正面反馈 |
| **警告色** | `#f59e0b` | 警告提示、待处理状态 |
| **错误色** | `#ef4444` | 错误状态、危险操作、负面反馈 |
| **信息色** | `#3b82f6` | 信息提示、链接 |

#### 中性色 (Neutral Colors)

| 颜色 | 色值 | 用途 |
|------|------|------|
| **主文字** | `#1f2937` | 标题、正文、重要内容 |
| **次文字** | `#6b7280` | 描述文字、次要信息 |
| **提示文字** | `#9ca3af` | 占位符、禁用状态文字 |
| **分隔线** | `#e5e7eb` | 分隔线、边框 |
| **浅背景** | `#f3f4f6` | 卡片背景、列表分隔 |
| **页面背景** | `#ffffff` | 主背景色（明主题） |

#### 宠物色调 (Pet Colors)

| 色调 | 主色 | 辅助色 | 说明 |
|------|------|--------|------|
| **经典紫** | `#6366f1` | `#818cf8` | 默认色调，温暖神秘 |
| **活力橙** | `#f97316` | `#fb923c` | 温暖活力，积极向上 |
| **清新绿** | `#10b981` | `#34d399` | 自然清新，平静舒适 |
| **天空蓝** | `#0ea5e9` | `#38bdf8` | 冷静理性，清澈透明 |
| **温柔粉** | `#ec4899` | `#f472b6` | 温柔可爱，甜美温馨 |

### 4.3 字体排版

#### 字体层级

| 层级 | 字号 (px) | 字重 | 行高 | 用途 |
|------|-----------|------|------|------|
| **H1** | 32 | 700 (Bold) | 1.2 | 页面主标题 |
| **H2** | 24 | 600 (Semibold) | 1.3 | 模块标题、卡片标题 |
| **H3** | 20 | 600 (Semibold) | 1.4 | 次级标题 |
| **正文** | 16 | 400 (Regular) | 1.6 | 段落、主要文字 |
| **小字** | 14 | 400 (Regular) | 1.5 | 辅助文字、描述 |
| **提示** | 12 | 400 (Regular) | 1.5 | 标签、时间戳 |

#### 字体规范

```css
/* 主字体 - 阿里巴巴普惠体（如不可用则降级为系统字体） */
font-family: 'Alibaba PuHuiTi', 'PingFang SC', 'Microsoft YaHei', -apple-system, 
             BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* 数字字体 - 用于数据展示 */
font-variant-numeric: tabular-nums;  /* 等宽数字，保持对齐 */
```

### 4.4 间距系统 (8pt Grid)

| 名称 | 数值 (px) | 使用场景 |
|------|-----------|---------|
| **xs** | 4 | 元素内部边距、小图标间距 |
| **sm** | 8 | 紧密相关元素间距 |
| **md** | 16 | 标准组件内边距、列表项间距 |
| **lg** | 24 | 模块间距、卡片外边距 |
| **xl** | 32 | 大模块间距、页面上下边距 |
| **2xl** | 48 | 大标题区、强调区域 |

### 4.5 圆角规范

| 类型 | 半径 (px) | 使用场景 |
|------|-----------|---------|
| **小圆角** | 6 | 标签、徽章、小按钮 |
| **标准圆角** | 12 | 按钮、输入框、普通卡片 |
| **大圆角** | 16 | 主要卡片、弹窗内容区 |
| **特大圆角** | 24 | 顶部导航、底部栏、大型容器 |

### 4.6 阴影系统

| 层级 | CSS 值 | 使用场景 |
|------|--------|---------|
| **轻阴影** | `0 2px 8px rgba(0,0,0,0.06)` | 输入框、小卡片 |
| **标准阴影** | `0 4px 12px rgba(0,0,0,0.1)` | 按钮、普通卡片、悬浮元素 |
| **强阴影** | `0 8px 24px rgba(0,0,0,0.12)` | 弹窗、重要卡片、下拉菜单 |
| **悬浮阴影** | `0 12px 32px rgba(0,0,0,0.15)` | 拖拽元素、Hover 强调 |

### 4.7 交互规范

#### 按钮交互

| 状态 | 样式变化 |
|------|---------|
| **默认** | 标准样式 |
| **Hover** | 背景色加深 10%，轻微放大 (1.02x) |
| **Active** | 背景色加深 20%，轻微缩小 (0.98x) |
| **Disabled** | 透明度 50%，光标禁用，无交互 |
| **Loading** | 文字隐藏，显示加载动画 |

#### 动画时长

| 类型 | 时长 (ms) | 缓动函数 | 使用场景 |
|------|-----------|---------|---------|
| **快速** | 150 | ease-out | 微交互、按钮点击 |
| **标准** | 250 | ease-out | 页面切换、Tab 切换 |
| **慢速** | 400 | ease-in-out | 大型动画、过渡效果 |
| **渐显** | 300 | ease-out | 元素出现、淡入淡出 |

---

## 5. 组件库体系

### 5.1 组件分类体系

```
组件库
├── 🧩 通用基础组件 (Common)
│   ├── ZlButton         - 按钮（主按钮、次按钮、文本按钮等）
│   ├── ZlCard           - 卡片容器（含标题、内容、操作区）
│   ├── ZlInput          - 输入框（支持多种类型）
│   ├── ZlModal          - 弹窗/对话框
│   ├── ZlTopBar         - 顶部导航栏（返回按钮+标题）
│   ├── ZlTabbar         - 底部标签栏（主导航）
│   ├── ZlListItem       - 列表项组件（图标+标题+描述+箭头）
│   ├── ZlToast          - 消息提示（成功/警告/错误/信息）
│   ├── ZlIcon           - 统一图标封装（基于 Lucide）
│   ├── EmptyState       - 空状态（图片+提示+操作按钮）
│   ├── LoadingState     - 加载中状态
│   ├── ErrorState       - 错误状态（可重试）
│   └── EmojiCarousel    - 颜文字轮播（装饰性组件）
│
├── 🐱 宠物组件 (Pet)
│   ├── PetAvatar         - 宠物头像展示
│   ├── MegacharDisplay   - 宠物字符图形
│   ├── PointsDisplay     - 积分显示组件
│   ├── StreamMessage     - 流式消息展示
│   ├── UserMessageBubble - 用户消息气泡
│   ├── QuickReplyBubble  - 快捷回复气泡
│   └── KaomojiCarousel   - 颜文字表情轮播
│
├── 📋 任务/团队组件 (Schedule)
│   ├── TaskCard          - 任务卡片（标题+状态+操作）
│   ├── TaskForm          - 任务表单（创建/编辑）
│   ├── TeamCard          - 团队卡片
│   ├── TeamDetail        - 团队详情页
│   ├── TeamTaskPage      - 团队任务页
│   ├── TeamCreateForm    - 创建团队表单
│   ├── JoinTeamForm      - 加入团队表单
│   ├── MemberList        - 成员列表
│   ├── CheckInTimer      - 打卡计时器
│   ├── RecurrencePickerSheet - 重复任务选择器
│   ├── ToggleSwitch      - 开关组件
│   └── EmptyState        - 任务/团队空状态
│
├── 🎮 游戏组件 (Game)
│   ├── GameBoard         - 游戏主面板
│   ├── GameCell          - 游戏单元格
│   └── GameComplete      - 游戏完成界面
│
└── 🔔 通知组件 (Notification)
    └── RingtonPickerSheet - 铃声选择弹窗
```

### 5.2 核心组件详细说明

#### ZlButton 按钮组件

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | String | `'primary'` | 按钮类型：primary / secondary / text / danger |
| `size` | String | `'md'` | 尺寸：sm / md / lg |
| `disabled` | Boolean | `false` | 是否禁用 |
| `loading` | Boolean | `false` | 是否显示加载状态 |
| `block` | Boolean | `false` | 是否块级元素（占满宽度） |

**事件**: `@click` - 点击事件

**使用示例**:
```vue
<ZlButton type="primary" @click="handleSubmit">
  确认提交
</ZlButton>

<ZlButton type="secondary" :disabled="!canSubmit">
  取消
</ZlButton>
```

#### ZlCard 卡片组件

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | String | `''` | 卡片标题 |
| `padding` | String | `'md'` | 内边距：sm / md / lg |

**插槽**:
- `default` - 主要内容区
- `actions` - 底部操作区

**使用示例**:
```vue
<ZlCard title="今日任务">
  <p>您今天有 5 个待完成任务</p>
  <template #actions>
    <ZlButton type="primary" size="sm">查看详情</ZlButton>
  </template>
</ZlCard>
```

#### ZlModal 弹窗组件

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `visible` | Boolean | `false` | 是否显示（支持 v-model） |
| `title` | String | `''` | 弹窗标题 |
| `closable` | Boolean | `true` | 是否显示关闭按钮 |
| `showFooter` | Boolean | `true` | 是否显示底部按钮区 |
| `confirmText` | String | `'确认'` | 确认按钮文字 |
| `cancelText` | String | `'取消'` | 取消按钮文字 |

**事件**:
- `@update:visible` - 显示状态变化
- `@confirm` - 点击确认按钮
- `@cancel` - 点击取消按钮

**使用示例**:
```vue
<ZlModal
  v-model:visible="showDeleteModal"
  title="确认删除"
  confirm-text="删除"
  @confirm="handleDelete"
>
  <p>确定要删除这个任务吗？此操作不可撤销。</p>
</ZlModal>
```

#### ZlToast 消息提示组件

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `visible` | Boolean | `false` | 是否显示 |
| `message` | String | `''` | 提示消息内容 |
| `type` | String | `'info'` | 类型：success / warning / error / info |
| `duration` | Number | `2000` | 自动关闭时间（毫秒） |

**使用示例**:
```vue
<ZlToast
  :visible="showToast"
  :message="toastMessage"
  :type="toastType"
  @update:visible="showToast = $event"
/>

<!-- JS 中触发 -->
showToast('操作成功', 'success')
```

#### EmptyState 空状态组件

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | String | `'暂无数据'` | 主标题 |
| `description` | String | `''` | 描述文字（可选） |

**插槽**:
- `actions` - 操作按钮区（可选）

**使用示例**:
```vue
<!-- 简洁空状态 -->
<EmptyState title="您还没有任务" description="点击下方按钮创建第一个任务" />

<!-- 带操作的空状态 -->
<EmptyState title="团队列表为空">
  <template #actions>
    <ZlButton type="primary" @click="createTeam">创建团队</ZlButton>
    <ZlButton type="secondary" @click="joinTeam">加入团队</ZlButton>
  </template>
</EmptyState>
```

#### ZlListItem 列表项组件

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | String | `''` | 主标题 |
| `description` | String | `''` | 描述文字（可选） |
| `icon` | String | `''` | 左侧图标名称（Lucide 图标名） |
| `showArrow` | Boolean | `true` | 是否显示右侧箭头 |
| `clickable` | Boolean | `true` | 是否可点击（显示交互反馈） |

**事件**: `@click` - 点击事件

**使用示例**:
```vue
<ZlListItem
  title="个人中心"
  description="查看和编辑个人信息"
  icon="User"
  @click="goToProfile"
/>

<ZlListItem
  title="设置"
  icon="Settings"
  @click="goToSettings"
/>
```

---

## 6. 项目文件架构

### 6.1 整体目录结构

```
zicodo/
├── backend/                          # 后端 + 前端（同目录，便于协作开发）
│   ├── src/                          # 后端源码（Express + Sequelize）
│   │   ├── controllers/              # 控制器（6个模块）
│   │   │   ├── authController.js     # 认证：register / login / me
│   │   │   ├── tasksController.js    # 任务：CRUD + 打卡
│   │   │   ├── petsController.js     # 宠物：getMyPet / renamePet / updateMood
│   │   │   ├── pointsController.js   # 积分：balance / logs / leaderboard
│   │   │   ├── teamsController.js    # 团队：创建/加入/退出/详情/排行
│   │   │   └── aiController.js       # AI：chat（SSE）/ memory
│   │   ├── models/                   # Sequelize 数据模型
│   │   │   ├── User.js               # 用户模型
│   │   │   ├── Task.js               # 任务模型
│   │   │   ├── Pet.js                # 宠物模型
│   │   │   ├── PointLog.js           # 积分记录
│   │   │   ├── Team.js               # 团队模型
│   │   │   └── index.js              # 模型聚合导出
│   │   ├── routes/                   # 路由定义（7个路由模块）
│   │   │   ├── auth.js               # /api/auth 前缀
│   │   │   ├── tasks.js              # /api/tasks 前缀
│   │   │   ├── pets.js               # /api/pets 前缀
│   │   │   ├── points.js             # /api/points 前缀
│   │   │   ├── teams.js              # /api/teams 前缀
│   │   │   ├── ai.js                 # /api/ai 前缀
│   │   │   └── ziling.js             # /ziling/api 前缀（旧版对接通道）
│   │   ├── middleware/               # 中间件
│   │   │   └── auth.js               # JWT 认证中间件（唯一中间件）
│   │   ├── utils/                    # 工具函数
│   │   │   ├── helpers.js            # 通用工具：ok/fail 响应包装、时间格式化等
│   │   │   └── ragService.js         # RAG 记忆服务（AI 对话上下文）
│   │   ├── db/                       # 数据库相关
│   │   │   └── connection.js         # Sequelize 连接与初始化（无 src/config/）
│   │   └── app.js                    # Express 应用入口（集成了启动逻辑，无 server.js）
│   ├── data/                         # SQLite 数据库文件目录（运行时自动生成）
│   ├── .env.example                  # 环境变量模板
│   ├── package.json                  # 后端依赖
│   ├── Dockerfile                    # 后端 Docker 镜像
│   └── nginx.conf                    # Nginx 反向代理配置
│
│   └── frontend/                     # 前端项目（Vue 3 + Vite）
│       ├── src/
│       │   ├── pages/                # 页面组件
│       │   │   ├── auth/             # 认证页面（LoginPage, RegisterPage, AuthPage, SplashPage）
│       │   │   ├── home/             # 首页 / 宠物主页
│       │   │   ├── interact/         # AI 互动页面
│       │   │   ├── tasks/            # 任务页面（TaskListPage, TaskCreatePage, TaskDetailPage, CalendarPage）
│       │   │   ├── team/             # 团队页面（TeamListPage, TeamDetailPage, TeamRankingPage）
│       │   │   ├── notifications/    # 通知中心（NotificationPage）
│       │   │   └── profile/          # 个人中心（11个页面：Profile/PetSettings/Points/Theme/Settings/About*4/DialogueHistory/Achievements）
│       │   ├── components/           # 可复用组件（4大类，共36+个组件）
│       │   │   ├── common/           # 通用基础组件（ZlButton, ZlCard, ZlModal, ZlInput, ZlTopBar, ZlTabbar, ZlListItem, ZlToast, ZlIcon, EmptyState, LoadingState, ErrorState, EmojiCarousel）
│       │   │   ├── pet/              # 宠物组件（PetAvatar, MegacharDisplay, PointsDisplay, StreamMessage, UserMessageBubble, QuickReplyBubble, KaomojiCarousel）
│       │   │   ├── schedule/         # 任务团队组件（TaskCard, TaskForm, TeamCard, TeamDetail, TeamTaskPage, TeamCreateForm, JoinTeamForm, MemberList, CheckInTimer, RecurrencePickerSheet, ToggleSwitch, EmptyState）
│       │   │   ├── game/             # 游戏组件（GameBoard, GameCell, GameComplete）
│       │   │   └── notifications/    # 通知组件（RingtonPickerSheet）
│       │   ├── stores/               # Pinia 状态管理（7个 Store）
│       │   │   ├── user.js           # 用户信息
│       │   │   ├── pet.js            # 宠物状态
│       │   │   ├── task.js           # 任务状态（注意：单数，非 tasks.js）
│       │   │   ├── teams.js          # 团队信息
│       │   │   ├── schedule.js       # 日程状态
│       │   │   ├── point.js          # 积分状态
│       │   │   └── theme.js          # 主题状态
│       │   ├── api/                  # API 接口层（9个模块 + request封装）
│       │   │   ├── request.js        # Axios 封装（拦截器/错误处理）
│       │   │   ├── auth.js           # 认证接口
│       │   │   ├── user.js           # 用户接口
│       │   │   ├── task.js           # 任务接口
│       │   │   ├── pet.js            # 宠物接口
│       │   │   ├── point.js          # 积分接口
│       │   │   ├── team.js           # 团队接口
│       │   │   ├── ai.js             # AI 对话接口
│       │   │   └── ziling.js         # /ziling/api 对接接口
│       │   ├── config/               # 前端配置
│       │   │   ├── api.js            # API 基础配置
│       │   │   ├── constants.js      # 应用常量
│       │   │   └── theme.js          # 主题配置
│       │   ├── game/                 # 游戏逻辑
│       │   │   ├── chars.js          # 汉字素材
│       │   │   └── game-logic.js     # 游戏判定逻辑
│       │   ├── utils/                # 工具函数
│       │   │   ├── date.js           # 日期时间工具
│       │   │   └── yanwenzi.js       # 颜文字工具
│       │   ├── layout/               # 布局组件
│       │   │   ├── AppLayout.vue     # 主应用布局（带底部导航 Tabbar）
│       │   │   ├── AuthLayout.vue    # 认证页面布局
│       │   │   └── SplashLayout.vue  # 启动页布局
│       │   ├── styles/               # 全局样式
│       │   │   ├── global.css        # 全局样式（注意：非 main.css）
│       │   │   ├── reset.css         # 样式重置
│       │   │   └── tokens.css        # Design Tokens（色彩/间距/圆角变量，非 variables.css）
│       │   ├── router/               # 路由配置
│       │   │   ├── index.js          # 主路由定义
│       │   │   └── guards.js         # 路由守卫
│       │   ├── assets/               # 静态资源
│       │   │   ├── logo_clear.png
│       │   │   ├── logo_vector_strict.svg
│       │   │   ├── default-avatar.png
│       │   │   ├── hero.png
│       │   │   ├── blink.png
│       │   │   └── vue.svg / vite.svg
│       │   ├── App.vue               # 根组件
│       │   ├── main.js               # 应用入口
│       │   └── registerSW.js         # PWA Service Worker 注册
│       ├── public/                   # 公开静态资源
│       │   ├── fonts/                # 字体文件（阿里巴巴普惠体）
│       │   ├── icons/                # PWA 图标（各尺寸）
│       │   ├── logo/                 # Logo 素材
│       │   ├── ringtones/            # 铃声资源（alarm/notification/sfx）
│       │   ├── splash/               # 启动页资源
│       │   ├── favicon.svg           # 浏览器图标
│       │   ├── icons.svg             # 图标精灵
│       │   ├── manifest.json         # PWA 应用清单
│       │   └── service-worker.js     # Service Worker
│       ├── index.html                # HTML 入口
│       ├── vite.config.js            # Vite 构建配置
│       ├── package.json              # 前端依赖
│       └── Dockerfile                # 前端 Docker 镜像（Nginx）
│
├── 项目用品/                          # 设计素材/品牌资源（非代码部分）
│   ├── thezilinglogo/               # Logo 相关素材
│   └── ziling-splash-package/       # 启动页组件包
│
├── .gitignore                        # Git 忽略规则
├── docker-compose.yml                # 主 Docker Compose 配置（部署用）
└── README.md                         # 本文件（项目主文档）
```

### 6.2 前端核心架构说明

#### 页面流程

```
启动 (SplashPage)
  ↓
登录/注册 (LoginPage / RegisterPage)
  ↓
主应用 (AppLayout - 带底部导航)
  ├── 首页 (PetHomePage)
  │   └── 宠物互动 (InteractPage)
  ├── 任务 (TaskListPage)
  │   ├── 创建任务 (TaskCreatePage)
  │   ├── 任务详情 (TaskDetailPage)
  │   └── 日历视图 (CalendarPage)
  ├── 团队 (TeamListPage)
  │   ├── 团队详情 (TeamDetailPage)
  │   └── 团队任务 (TeamTaskPage)
  └── 我的 (ProfilePage)
      ├── 个人信息编辑 (ProfileEditPage)
      ├── 宠物设置 (PetSettingsPage)
      ├── 积分中心 (PointsPage)
      ├── 主题设置 (ThemePage)
      ├── 系统设置 (SettingsPage)
      ├── 对话历史 (DialogueHistoryPage)
      ├── 成就徽章 (AchievementsPage)
      └── 关于系统 (AboutPage / AboutHelp 等)
```

#### 数据流向

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   页面组件   │────▶│  Pinia Store │────▶│   API 层    │
│  (Pages)    │     │   (Stores)   │     │  (API)     │
└────────────┘     └────────────┘     └────────────┘
       ▲                  ▲                  │
       │                  │                  ▼
       │                  │          ┌────────────┐
       │                  │          │  Axios 请求 │
       │                  │          └────────────┘
       │                  │                  │
       │                  │                  ▼
       │                  │          ┌────────────┐
       │                  │          │   后端 API  │
       │                  │          │  (Express)  │
       │                  │          └────────────┘
       │                  │                  │
       │                  │                  ▼
       │                  │          ┌────────────┐
       └──────────────────┼──────────│   SQLite    │
                          │          └────────────┘
                          │
                   ┌────────────┐
                   │ localStorage│（本地缓存/离线数据）
                   └────────────┘
```

---

## 7. 开发环境配置

### 7.1 环境要求

| 工具 | 最低版本 | 推荐版本 | 说明 |
|------|---------|---------|------|
| **Node.js** | 18.0 | 20.x LTS | JavaScript 运行时 |
| **npm** | 9.0 | 10.x | 包管理器（或使用 pnpm/yarn） |
| **Git** | 2.0 | 最新版 | 版本控制工具 |
| **操作系统** | - | Windows 10+/macOS 11+/Linux | 开发系统 |

### 7.2 推荐开发工具

| 工具 | 用途 | 推荐配置/插件 |
|------|------|-------------|
| **VS Code** | 代码编辑器 | Volar、ESLint、Prettier、GitLens |
| **Chrome/Edge** | 浏览器调试 | Vue DevTools 扩展 |
| **Postman/Thunder Client** | API 测试 | 接口调试和测试 |
| **SQLite Browser** | 数据库查看 | 查看和编辑 SQLite 数据库 |

### 7.3 安装步骤

#### 步骤 1：克隆项目

```bash
git clone https://github.com/qiadastrachen-bit/zicodo.git
cd zicodo
```

#### 步骤 2：安装后端依赖

```bash
cd backend
npm install

# 验证安装
npm list --depth=0
```

#### 步骤 3：安装前端依赖

```bash
cd frontend                # 注意：前端在根目录下的 frontend/，不在 backend/frontend/
npm install

# 验证安装
npm list --depth=0
```

#### 步骤 4：配置环境变量

**后端配置** (`backend/.env`)：

```env
# 服务配置
PORT=3000
HOST=0.0.0.0

# 数据库配置（SQLite 无需额外配置）
DB_PATH=./data/zicodo.db

# 安全配置（注意：项目只使用 JWT，不使用 Session）
JWT_SECRET=your-jwt-secret-key-change-in-production

# AI 配置（可选）
DEEPSEEK_API_KEY=your-deepseek-api-key-here
DEEPSEEK_API_URL=https://api.deepseek.com

# CORS 配置（允许的前端地址）
CORS_ORIGIN=http://localhost:5173

# 环境标识
NODE_ENV=development
```

**前端配置** (`frontend/.env.development`)：

```env
# API 基础地址
VITE_API_BASE_URL=http://localhost:3000/api

# 应用名称
VITE_APP_NAME=zicodo

# 版本号
VITE_APP_VERSION=0.0.0
```

#### 步骤 5：启动开发服务器

**方式 A：分别启动（推荐用于开发调试）**

```bash
# 终端 1：启动后端
cd backend
npm run dev
# 服务将运行在 http://localhost:3000

# 终端 2：启动前端（前端在根目录下的 frontend/）
cd frontend
npm run dev
# 前端将运行在 http://localhost:5173
```

**方式 B：同时启动（根目录运行）**

```bash
# 在项目根目录
npm run dev
# 或使用 concurrently
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

#### 步骤 6：验证安装

1. 访问 `http://localhost:5173` 查看前端页面
2. 访问 `http://localhost:3000/api/health` 检查后端 API
3. 测试注册/登录功能（支持体验服模式：自动创建不存在的用户）

---

### 7.4 常用开发命令

#### 前端命令

```bash
cd frontend

# 启动开发服务器（热更新）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建结果
npm run preview

# 检查代码风格（如配置了 ESLint）
npm run lint

# 运行测试（如配置了测试框架）
npm run test
```

#### 后端命令

```bash
cd backend

# 启动开发服务器（自动重启）
npm run dev

# 生产模式启动
npm start

# 运行数据库迁移（如有）
npm run migrate

# 生成测试数据（如有）
npm run seed
```

---

## 8. 构建与部署

### 8.1 本地生产构建

#### 前端构建

```bash
cd frontend                  # 注意：前端在根目录下的 frontend/，不在 backend/frontend/

# 清理旧的构建产物
rm -rf dist

# 执行生产构建
npm run build

# 构建产物位置：frontend/dist/
# 包含文件：
#   - index.html          # HTML 入口
#   - assets/             # JS 和 CSS 资源
#   - favicon.svg         # 图标
#   - manifest.json       # PWA 清单
#   - ... (其他静态资源)
```

#### 后端构建

后端基于 Node.js，无需编译步骤，直接部署源码即可。但建议进行以下检查：

```bash
cd backend

# 检查生产依赖是否完整
npm install --production

# 验证配置文件是否齐全
ls -la .env

# 测试启动
npm start
```

### 8.2 Docker 容器化部署

详细部署方案请参见 [阶段 3：腾讯云部署](#13-阶段-3腾讯云服务器部署指南) 的完整指南。

---

## 9. API 接口文档

### 9.1 API 基础信息

| 项目 | 说明 |
|------|------|
| **基础 URL** | `http://localhost:3000/api` |
| **协议** | HTTP / HTTPS |
| **数据格式** | JSON (UTF-8 编码) |
| **认证方式** | JWT Bearer Token（无 Session） |
| **字符编码** | UTF-8 |
| **旧版对接通道** | `/ziling/api` 前缀（保留，用于历史功能） |

### 9.2 通用响应格式

#### 成功响应

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    // 具体数据结构
  }
}
```

#### 错误响应

```json
{
  "success": false,
  "code": 400,
  "message": "参数错误",
  "error": "详细错误描述",
  "details": {
    // 错误详情（可选）
  }
}
```

#### HTTP 状态码

| 状态码 | 说明 | 使用场景 |
|--------|------|---------|
| **200** | OK | 请求成功 |
| **201** | Created | 资源创建成功 |
| **400** | Bad Request | 参数错误、格式不正确 |
| **401** | Unauthorized | 未登录或登录已过期 |
| **403** | Forbidden | 无权限访问 |
| **404** | Not Found | 资源不存在 |
| **500** | Internal Server Error | 服务器内部错误 |

### 9.3 接口列表（节选）

以下路由为实际实现的接口，与 `backend/src/routes/` 中的文件一一对应。

#### 认证模块 (Auth)

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | 公开 |
| POST | `/api/auth/login` | 用户登录 | 公开 |
| GET | `/api/auth/me` | 获取当前用户信息 | 需要登录 |
| ⚠️ | `/api/auth/logout` | 未实现（前端清除本地 token 即可） | - |

#### 任务模块 (Tasks)

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/tasks/` | 获取任务列表 | 需要登录 |
| POST | `/api/tasks/` | 创建新任务 | 需要登录 |
| GET | `/api/tasks/:id` | 获取任务详情 | 需要登录 |
| PUT | `/api/tasks/:id` | 更新任务信息 | 需要登录 |
| DELETE | `/api/tasks/:id` | 删除任务 | 需要登录 |
| POST | `/api/tasks/:id/check` | 打卡/完成任务 | 需要登录 |
| ⚠️ | `/api/tasks/calendar` | 未实现（日历数据由前端本地聚合生成） | - |

#### 宠物模块 (Pets)

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/pets/mine` | 获取当前用户宠物信息 | 需要登录 |
| PUT | `/api/pets/mine/name` | 修改宠物名字 | 需要登录 |
| PUT | `/api/pets/mine/mood` | 修改宠物心情 | 需要登录 |
| GET | `/api/pets/:userId` | 获取其他用户宠物信息 | 需要登录 |
| ⚠️ | `/api/pets/` | 未实现（直接通过 /mine 获取） | - |

#### 积分模块 (Points)

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/points/balance` | 获取当前积分余额 | 需要登录 |
| GET | `/api/points/logs` | 获取积分变动记录 | 需要登录 |
| GET | `/api/points/leaderboard` | 积分排行榜（团队内/全局） | 需要登录 |

#### 团队模块 (Teams)

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/teams/` | 创建团队 | 需要登录 |
| POST | `/api/teams/join` | 通过邀请码加入团队 | 需要登录 |
| POST | `/api/teams/leave` | 退出当前团队 | 需要登录 |
| GET | `/api/teams/mine` | 获取当前用户所在团队 | 需要登录 |
| GET | `/api/teams/ranking` | 团队排行榜 | 需要登录 |
| GET | `/api/teams/:id` | 获取团队详情 | 需要登录 |

#### AI 对话模块 (AI)

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/ai/chat` | AI 对话（SSE 流式响应） | 需要登录 |
| POST | `/api/ai/memory` | 添加/更新 RAG 记忆 | 需要登录 |
| GET | `/api/ai/memory` | 查询当前用户的记忆列表 | 需要登录 |
| ⚠️ | `/api/ai/history` | 未实现（对话历史由前端本地管理） | - |
| ⚠️ | `/api/ai/config` | 未实现（API Key 由后端环境变量配置） | - |

#### 旧版对接通道 (Ziling - 保留)

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/ziling/api/ping` | 健康检查（旧版） | 公开 |
| POST | `/ziling/api/schedule` | 日程反馈（生成陪伴语） | 可选登录 |
| POST | `/ziling/api/chat` | 旧版对话接口（返回 JSON，非 SSE） | 可选登录 |
| POST | `/ziling/api/validate` | 组词游戏判定（本地词库 + LLM 兜底） | 公开 |

---

## 10. 贡献指南

### 10.1 代码风格

#### JavaScript / Vue 规范

- 使用 **ES6+** 语法
- 统一 **2 空格**缩进
- 语句末尾 **不加分号**（或根据项目配置统一）
- 使用 **单引号** 表示字符串
- **变量命名**使用驼峰式（camelCase）
- **组件命名**使用 PascalCase（如 `PetHomePage`）
- **常量**使用全大写蛇形式（如 `MAX_POINTS = 9999`）

#### Git 提交规范

采用 **Conventional Commits** 规范：

```
<类型>(<范围>): <主题>

<正文>

<页脚>
```

**提交类型**:

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加任务打卡功能` |
| `fix` | 修复 bug | `fix: 修复团队退出后列表不刷新问题` |
| `docs` | 文档更新 | `docs: 更新 README 中的部署说明` |
| `style` | 代码格式调整 | `style: 统一按钮圆角大小` |
| `refactor` | 代码重构 | `refactor: 重写任务列表渲染逻辑` |
| `test` | 添加/更新测试 | `test: 添加任务创建测试用例` |
| `chore` | 构建/工具链调整 | `chore: 更新依赖版本` |
| `perf` | 性能优化 | `perf: 优化首页加载速度` |

**提交示例**:
```bash
# 简单提交
git commit -m "feat: 添加宠物互动页面"

# 带范围和详细说明的提交
git commit -m "fix(pet): 修复积分不更新问题

- 在 PetHomePage 中添加积分变化监听
- 优化 PointsDisplay 组件的响应式更新
- 添加单元测试覆盖积分变化场景"
```

### 10.2 开发流程

1. **Fork 项目** 到个人仓库
2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/issue-number
   ```
3. **编写代码**，确保：
   - 代码风格符合项目规范
   - 添加必要的注释（复杂逻辑处）
   - 考虑边界情况和异常处理
4. **本地测试**
   ```bash
   # 前端测试
   cd frontend && npm run dev
   
   # 后端测试
   cd backend && npm run dev
   ```
5. **提交代码**（遵循上述提交规范）
6. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **创建 Pull Request**，详细说明：
   - 改动内容和目的
   - 相关 Issue 链接（如有）
   - 截图/录屏（UI 相关改动）
   - 测试验证结果

### 10.3 分支策略

| 分支 | 用途 | 说明 |
|------|------|------|
| `main` | 主分支 | 生产环境代码，必须保持稳定 |
| `develop` | 开发分支 | 最新开发状态，合并所有新功能 |
| `feature/*` | 新功能分支 | 从 develop 切出，开发完成后合并回 develop |
| `fix/*` | Bug 修复分支 | 从 develop 或 main 切出，修复后合并 |
| `release/*` | 发布分支 | 用于版本发布准备，从 develop 切出 |
| `hotfix/*` | 紧急修复 | 从 main 切出，紧急修复生产问题 |

### 10.4 Issue 报告

提交 Issue 时请包含：

1. **清晰的标题** - 简短描述问题
2. **环境信息** - Node.js 版本、浏览器、操作系统
3. **复现步骤** - 一步步如何触发问题
4. **期望行为** - 应该是什么样的
5. **实际行为** - 实际发生了什么
6. **截图/录屏** - 如有需要，附上直观的展示
7. **相关代码** - 出错位置的代码片段（如有）

---

## 11. 常见问题 (FAQ)

### Q1: 首次启动时数据库如何初始化？

**A**: 首次启动后端时，系统会自动：
- 创建 `backend/data/` 目录
- 初始化 SQLite 数据库文件
- 创建所有必要的数据表
- （可选）插入一些演示数据

无需手动执行数据库迁移脚本。

---

### Q2: 如何配置 AI 对话功能？

**A**: 有两种方式：

**方式 1：环境变量配置**
在 `backend/.env` 中设置：
```env
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com
```

**方式 2：应用内配置**
- 登录应用 → 进入「我的」→「设置」
- 找到「AI 配置」选项
- 输入您的 DeepSeek API Key 并保存

**注意**：未配置 API Key 时，系统会自动使用 Mock 模式，提供演示对话。

---

### Q3: 忘记密码怎么办？

**A**: 目前支持以下方式：

1. **体验服模式**（开发环境默认开启）：如果登录的用户不存在，会自动创建一个新用户，您可以用新密码重新登录
2. **重置数据库**：删除 `backend/data/zicodo.db`，重新初始化（会丢失所有数据）
3. **管理员重置**：生产环境请联系系统管理员

---

### Q4: 如何切换主题（明/暗模式）？

**A**: 进入「我的」→「主题设置」（ThemePage），可选择：
- 自动跟随系统
- 明亮模式（浅色）
- 暗黑模式（深色）

主题设置会自动保存并在下次访问时恢复。

---

### Q5: 数据存储在哪里？会丢失吗？

**A**: 根据部署方式不同：

| 方式 | 存储位置 | 持久化 |
|------|---------|-------|
| **本地开发** | `backend/data/zicodo.db` (SQLite) | ✅ 持久化到磁盘 |
| **Docker 部署** | 容器内挂载的 volume | ✅ 持久化 |
| **浏览器缓存** | localStorage（前端临时数据） | ⚠️ 清除浏览器数据会丢失 |

建议定期备份数据库文件。

---

### Q6: 如何将项目部署到服务器？

**A**: 请参见 [第 13 章：腾讯云服务器部署指南](#13-阶段-3腾讯云服务器部署指南)，或使用项目提供的 Docker 部署脚本：

```bash
# 使用 Docker Compose 一键部署
docker-compose up -d

# 或查看详细部署步骤
cat docs/02-执行计划与记录/14-云服务器部署指南.md
```

---

### Q7: 支持多用户同时使用吗？

**A**: 是的，系统设计支持多用户：
- 每个用户有独立的账号和密码
- 用户数据完全隔离
- 支持团队功能（多人加入同一团队，共享任务和排行）
- SQLite 在并发量不大的场景下完全可用
- 如需更高并发，可将 SQLite 替换为 MySQL/PostgreSQL

---

### Q8: 如何自定义项目的 LOGO 和品牌信息？

**A**: 修改以下文件：

| 项目 | 文件位置 | 说明 |
|------|---------|------|
| 主 LOGO | `frontend/src/assets/logo_clear.png` | PNG 格式，建议 512x512 |
| 矢量 LOGO | `frontend/src/assets/logo_vector_strict.svg` | SVG 格式 |
| 浏览器图标 | `frontend/public/favicon.svg` | 浏览器标签图标 |
| 应用名称 | `frontend/package.json` 中的 `name` 字段 | 项目标识 |
| 显示名称 | `frontend/.env.*` 中的 `VITE_APP_NAME` | 页面标题展示 |

---

## 12. 许可证

### 12.1 项目许可证

**zicodo** 项目采用 **MIT 许可证**。

```
MIT License

Copyright (c) 2026 zicodo Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 12.2 第三方依赖声明

本项目使用以下开源软件，感谢其贡献者：

| 项目 | 许可证 | 用途 |
|------|--------|------|
| **Vue.js** | MIT | 前端框架 |
| **Vue Router** | MIT | 路由管理 |
| **Pinia** | MIT | 状态管理 |
| **Vite** | MIT | 构建工具 |
| **Express.js** | MIT | 后端 Web 框架 |
| **SQLite** | Public Domain | 数据库 |
| **Sequelize** | MIT | ORM 框架 |
| **Axios** | MIT | HTTP 客户端 |
| **Lucide Icons** | ISC | 图标库 |
| **bcrypt** | MIT | 密码加密 |

完整的依赖列表请参见 `backend/package.json` 和 `frontend/package.json`。

---

## 13. 阶段 3：腾讯云服务器部署指南

> **目标服务器**：已安装 Docker CE 的腾讯云服务器  
> **IP 地址**：120.53.11.84  
> **操作系统**：Linux（推荐 Ubuntu 22.04 LTS 或 CentOS 7+）

### 13.1 部署架构概览

```
┌─────────────────────────────────────────────────────┐
│                 腾讯云服务器 (120.53.11.84)          │
│                                                          │
│   ┌──────────────────────────────────────────┐         │
│   │              Docker Engine                 │         │
│   │                                              │         │
│   │   ┌─────────────┐   ┌─────────────┐         │
│   │   │   Frontend  │   │   Backend   │         │
│   │   │  (Nginx)    │──▶│ (Express)   │         │
│   │   │  Port: 80   │   │ Port: 3000  │         │
│   │   └─────────────┘   └─────────────┘         │
│   │                              │                   │
│   │                              ▼                   │
│   │                      ┌─────────────┐            │
│   │                      │   SQLite    │            │
│   │                      │  (Volume)   │            │
│   │                      └─────────────┘            │
│   └──────────────────────────────────────────┘         │
│                                                          │
└─────────────────────────────────────────────────────┘
            │                │
            ▼                ▼
   用户访问 https://120.53.11.84
```

### 13.2 前置准备检查清单

在开始部署前，请确保以下条件已满足：

- [x] **服务器可访问** - 能通过 SSH 登录到 `120.53.11.84`
- [x] **Docker CE 已安装** - 执行 `docker --version` 验证
- [x] **Docker Compose 可用** - 执行 `docker-compose --version` 或 `docker compose version`
- [x] **足够的磁盘空间** - 至少 5GB 可用（`df -h` 检查）
- [x] **足够的内存** - 至少 2GB 内存（`free -h` 检查）
- [x] **端口开放** - 确保 80/443/3000 端口未被占用且防火墙放行
- [x] **Git 客户端** - 能拉取代码仓库

**验证命令**:
```bash
# 登录服务器
ssh root@120.53.11.84

# 检查 Docker
docker --version          # 应输出类似：Docker version 24.x.x
docker info               # 查看 Docker 详细信息

# 检查 Docker Compose
docker compose version    # 应输出：Docker Compose version v2.x.x

# 检查系统资源
df -h                     # 磁盘空间
free -h                   # 内存使用
top                       # CPU 使用（按 q 退出）

# 检查端口占用
netstat -tlnp | grep -E ':(80|443|3000)'
# 或
ss -tlnp | grep -E ':(80|443|3000)'
```

### 13.3 部署步骤详解

#### 步骤 1：连接到服务器

```bash
# SSH 连接（根据你的实际用户名替换 root）
ssh root@120.53.11.84

# 或使用密钥认证（推荐）
ssh -i /path/to/your-key.pem root@120.53.11.84

# 进入工作目录
cd /opt
mkdir -p zicodo && cd zicodo
```

#### 步骤 2：拉取项目代码

```bash
# 克隆 GitHub 仓库
git clone https://github.com/qiadastrachen-bit/zicodo.git .

# 或更新已有代码
git pull origin main

# 查看当前目录结构
ls -la
```

#### 步骤 3：准备环境配置文件

**创建后端环境变量文件**:

```bash
# 进入后端目录
cd /opt/zicodo/backend

# 创建 .env 文件（生产环境）
cat > .env << 'EOF'
# ============================================
# zicodo 后端生产环境配置
# ============================================

# 服务配置
PORT=3000
HOST=0.0.0.0

# 数据库配置 - SQLite 文件路径（容器内路径）
DB_PATH=/app/data/zicodo.db

# 安全配置 - 生产环境务必修改！
SESSION_SECRET=change_this_to_a_long_random_string_production
JWT_SECRET=change_this_to_another_long_random_string_production

# AI 配置（可选，填入后可启用真实 AI 对话）
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com

# CORS 配置 - 允许所有来源（生产环境建议指定具体域名）
CORS_ORIGIN=*

# 环境标识
NODE_ENV=production

# 日志级别
LOG_LEVEL=info
EOF

# 验证文件内容
cat .env
```

**创建前端环境变量文件**:

```bash
# 进入前端目录
cd /opt/zicodo/frontend

# 创建生产环境配置
cat > .env.production << 'EOF'
# ============================================
# zicodo 前端生产环境配置
# ============================================

# API 基础地址（使用相对路径，由 Nginx 反向代理）
VITE_API_BASE_URL=/api

# 应用名称
VITE_APP_NAME=zicodo

# 版本号
VITE_APP_VERSION=0.0.0

# WebSocket/流式请求配置
VITE_ENABLE_SSE=true
EOF

# 验证文件
cat .env.production
```

#### 步骤 4：创建 Dockerfile（前端）

```bash
cd /opt/zicodo/frontend

cat > Dockerfile << 'EOF'
# ============================================
# 构建阶段 - Build Stage
# ============================================
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件（利用缓存）
COPY package*.json ./

# 安装依赖（生产模式，仅安装必要依赖）
RUN npm ci --omit=dev || npm install --production

# 复制所有源代码
COPY . .

# 创建生产环境配置文件（如果不存在）
RUN if [ ! -f .env.production ]; then \
      echo "VITE_API_BASE_URL=/api" > .env.production && \
      echo "VITE_APP_NAME=zicodo" >> .env.production && \
      echo "VITE_APP_VERSION=0.0.0" >> .env.production; \
    fi

# 执行生产构建
RUN npm run build

# ============================================
# 运行阶段 - Production Stage
# ============================================
FROM nginx:alpine

# 设置维护者信息
LABEL maintainer="zicodo Team"
LABEL description="zicodo Frontend - Vue 3 SPA with Nginx"

# 设置时区（修正容器时间）
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

# 从构建阶段复制静态资源
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

# 启动 Nginx（前台运行）
CMD ["nginx", "-g", "daemon off;"]
EOF

echo "✅ Frontend Dockerfile 创建完成"
```

**创建 Nginx 配置文件**:

```bash
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    # 根路径和字符编码
    root /usr/share/nginx/html;
    charset utf-8;
    
    # 日志格式
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml;
    
    # Vue Router 的 history 模式支持（404 回退到 index.html）
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存（JS/CSS/图片等）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # API 反向代理到后端服务
    location /api/ {
        # 转发到后端容器（名称为 backend，端口 3000）
        proxy_pass http://backend:3000;
        
        # 请求头设置
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # SSE（Server-Sent Events）流式响应支持
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        
        # 超时设置（AI 对话可能需要较长时间）
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
    
    # 禁止隐藏文件访问
    location ~ /\. {
        deny all;
    }
}
EOF

echo "✅ Nginx 配置文件创建完成"
```

#### 步骤 5：创建 Dockerfile（后端）

```bash
cd /opt/zicodo/backend

cat > Dockerfile << 'EOF'
# ============================================
# zicodo 后端 Dockerfile
# ============================================
FROM node:20-alpine

# 设置维护者
LABEL maintainer="zicodo Team"
LABEL description="zicodo Backend - Express.js API Server with SQLite"

# 设置环境变量
ENV PORT=3000 \
    HOST=0.0.0.0 \
    NODE_ENV=production \
    DB_PATH=/app/data/zicodo.db

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装生产依赖
RUN npm ci --omit=dev || npm install --production

# 复制源代码
COPY . .

# 创建数据目录（SQLite 数据库存放位置）
RUN mkdir -p /app/data

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/api/health || exit 1

# 启动命令
CMD ["npm", "start"]
EOF

echo "✅ Backend Dockerfile 创建完成"
```

#### 步骤 6：创建 docker-compose.yml（项目根目录）

```bash
cd /opt/zicodo

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # ==============================================
  # 前端服务 (Nginx 提供静态资源 + 反向代理)
  # ==============================================
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: zicodo-frontend
    restart: unless-stopped
    ports:
      - "80:80"        # HTTP 端口映射到主机 80
      # - "443:443"    # 如启用 HTTPS 需配置 SSL 证书后取消注释
    depends_on:
      - backend
    networks:
      - zicodo-net
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

  # ==============================================
  # 后端 API 服务 (Express + SQLite)
  # ==============================================
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: zicodo-backend
    restart: unless-stopped
    expose:
      - "3000"                      # 仅在内部网络暴露端口
    volumes:
      - ./backend/.env:/app/.env:ro # 挂载环境变量配置（只读）
      - zicodo-data:/app/data       # 持久化 SQLite 数据库文件
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOST=0.0.0.0
      - DB_PATH=/app/data/zicodo.db
    networks:
      - zicodo-net
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 15s

# ==============================================
# 网络与数据卷
# ==============================================
networks:
  zicodo-net:
    driver: bridge                 # 默认桥接网络

volumes:
  zicodo-data:                     # 用于持久化 SQLite 数据库
    driver: local
EOF

echo "✅ docker-compose.yml 创建完成"
```

#### 步骤 7：构建并启动所有容器

```bash
cd /opt/zicodo

# 1. 第一次构建并启动（-d 表示后台运行）
docker compose up -d --build

# 2. 查看容器状态
docker compose ps

# 3. 查看构建和启动日志（确认无错误）
docker compose logs --tail=100

# 4. 单独查看某服务日志
docker compose logs frontend --tail=50
docker compose logs backend --tail=50
```

**预期输出：**
```
[+] Running 3/3
 ✔ Network zicodo_zicodo-net    Created
 ✔ Container zicodo-backend     Started
 ✔ Container zicodo-frontend    Started
```

#### 步骤 8：验证服务运行状态

```bash
# 1. 查看容器状态（健康状态应为 healthy）
docker compose ps

# 2. 检查后端健康检查端点
curl http://localhost:3000/api/health
# 预期响应: {"success":true,"code":200,"message":"OK"}

# 3. 检查前端页面
curl -I http://localhost/
# 预期响应: HTTP/1.1 200 OK

# 4. 浏览器访问（在本地电脑浏览器打开）
#    http://120.53.11.84
```

#### 步骤 9：开放腾讯云防火墙端口

> **重要**：如果 `curl http://120.53.11.84` 无法访问，需要在腾讯云控制台配置安全组。

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入【云服务器】→ 找到你的服务器（公网 IP: 120.53.11.84）
3. 点击【安全组】→ 选择已绑定的安全组或新建一个
4. 添加入站规则：

| 协议端口 | 来源 | 策略 | 说明 |
|---------|------|------|------|
| **TCP:80** | 0.0.0.0/0 | 允许 | HTTP 访问 |
| **TCP:443** | 0.0.0.0/0 | 允许 | HTTPS 访问（如有） |
| **TCP:22** | 0.0.0.0/0 | 允许 | SSH 管理（建议限制 IP） |
| **TCP:3000** | 0.0.0.0/0 | 允许 | 后端 API 调试（可选） |

5. 保存后等待约 1 分钟生效。

### 13.4 服务健康检查与状态监控

#### 容器健康状态查询

```bash
# 1. 查看所有容器健康状态
docker compose ps

# 2. 查看某一个容器详细健康状态
docker inspect zicodo-backend | grep -A 10 "Health"
docker inspect zicodo-frontend | grep -A 10 "Health"
```

#### 容器资源使用情况

```bash
# 1. 实时查看容器资源（CPU / 内存 / 网络 / IO）
docker stats

# 2. 退出：Ctrl + C
```

#### API 健康检查（应用级）

```bash
# 1. 检查后端 API 是否存活
curl http://localhost:3000/api/health

# 2. 检查数据库连接（通过业务接口）
curl http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

### 13.5 日志查看与问题排查

#### 基础日志查看

```bash
# 1. 查看所有服务实时日志（Ctrl+C 退出）
docker compose logs -f

# 2. 只查看后端日志
docker compose logs backend -f

# 3. 只查看前端 Nginx 日志
docker compose logs frontend -f

# 4. 查看最近 100 行日志
docker compose logs --tail=100

# 5. 查看最近 10 分钟内产生的日志
docker compose logs --since 10m
```

#### 高级排查：进入容器

```bash
# 1. 进入后端容器（Node.js 服务）
docker exec -it zicodo-backend sh

#  进入后可以执行：
#    ls -la /app           # 查看代码文件
#    cat /app/.env         # 查看环境变量
#    ls -la /app/data      # 查看 SQLite 数据库文件

# 2. 进入前端容器（Nginx）
docker exec -it zicodo-frontend sh

#  进入后可以执行：
#    ls -la /usr/share/nginx/html   # 查看前端静态资源
#    cat /etc/nginx/conf.d/default.conf  # 查看 Nginx 配置

# 3. 退出容器
exit
```

#### 常见问题排查清单

| 问题现象 | 排查步骤 | 可能原因 |
|---------|---------|---------|
| **浏览器无法访问** `http://120.53.11.84` | 1. `curl http://localhost/` 在服务器测试<br>2. `docker compose ps` 检查容器状态<br>3. 检查腾讯云安全组是否开放 80 端口<br>4. `netstat -tlnp` 检查 80 端口占用 | 安全组未放行 / 80 端口被占用 |
| **页面返回 502 Bad Gateway** | 1. `docker compose logs backend`<br>2. `curl http://localhost:3000/api/health`<br>3. 确认后端容器是否 healthy | 后端服务未启动 / API 路径错误 |
| **后端无法连接数据库** | 1. `docker compose logs backend`<br>2. `docker exec zicodo-backend ls -la /app/data`<br>3. 检查 DB_PATH 环境变量 | SQLite 目录不存在 / 权限问题 |
| **登录/注册失败** | 1. 检查浏览器 Console 错误<br>2. `docker compose logs backend`<br>3. 检查 `.env` 中 CORS 配置 | CORS 限制 / 数据库未初始化 |
| **AI 对话返回错误** | 1. `docker compose logs backend`<br>2. 检查 `.env` 中的 DEEPSEEK_API_KEY<br>3. 确认网络能否访问 DeepSeek | API Key 未配置 / 网络无法访问 DeepSeek |
| **容器频繁重启** | 1. `docker inspect zicodo-backend \| grep -A 5 "RestartCount"`<br>2. `docker compose logs backend --tail=50` | 启动脚本错误 / 配置错误 / 资源不足 |

### 13.6 日常运维命令速查

#### 启动 / 停止 / 重启

```bash
# 启动所有服务
docker compose up -d

# 停止所有服务
docker compose down

# 重启所有服务
docker compose restart

# 单独重启某一个服务
docker compose restart backend
docker compose restart frontend
```

#### 更新代码并重新部署

```bash
# 1. 拉取最新代码
cd /opt/zicodo
git pull origin main

# 2. 重新构建并启动（只重建变更的服务）
docker compose up -d --build

# 3. 验证服务状态
docker compose ps
docker compose logs --tail=50
```

#### 备份数据库

```bash
# 1. 查看数据库文件位置
docker volume ls | grep zicodo-data
docker volume inspect zicodo-data

# 2. 备份到本地（复制 SQLite 文件）
docker exec zicodo-backend cp /app/data/zicodo.db /app/data/zicodo.backup.$(date +%Y%m%d).db

# 3. 从容器复制到宿主机
docker cp zicodo-backend:/app/data/zicodo.db ./backup-$(date +%Y%m%d).db

# 4. （可选）压缩备份文件
tar -czf zicodo-db-backup-$(date +%Y%m%d).tar.gz ./backup-*.db
```

#### 清理无用镜像

```bash
# 1. 清理悬空镜像和停止的容器
docker image prune -f
docker container prune -f

# 2. 查看磁盘使用情况
docker system df
```

### 13.7 首次部署完整流程（一键命令）

如果您是 **第一次部署**，可以按以下步骤执行（复制粘贴到服务器即可）：

```bash
# ============================================
# 第 1 步：准备工作目录并拉取代码
# ============================================
mkdir -p /opt/zicodo
cd /opt/zicodo
git clone https://github.com/qiadastrachen-bit/zicodo.git .

# ============================================
# 第 2 步：创建后端环境配置
# ============================================
cd /opt/zicodo/backend
cat > .env << 'ENVEOF'
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
DB_PATH=/app/data/zicodo.db
SESSION_SECRET=please_change_this_random_string_to_something_secure_888
JWT_SECRET=please_change_this_another_random_string_something_secure_999
DEEPSEEK_API_KEY=your_api_key_here_or_leave_blank_for_mock
DEEPSEEK_API_URL=https://api.deepseek.com
CORS_ORIGIN=*
LOG_LEVEL=info
ENVEOF

# ============================================
# 第 3 步：启动所有服务（首次构建会稍慢）
# ============================================
cd /opt/zicodo
docker compose up -d --build

# ============================================
# 第 4 步：等待 30 秒后检查容器健康状态
# ============================================
echo "⏳ 等待服务启动中..." && sleep 30
docker compose ps

# ============================================
# 第 5 步：验证服务
# ============================================
echo "=== 前端检查 ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost/
echo " （应为 200）"

echo "=== 后端 API 检查 ==="
curl -s http://localhost:3000/api/health
echo ""

echo ""
echo "🎉 部署完成！请在浏览器访问：http://120.53.11.84"
```

### 13.8 安全加固建议（可选，生产环境建议）

1. **修改默认密钥**：将 `.env` 中的 `SESSION_SECRET` 和 `JWT_SECRET` 改为随机长字符串
2. **限制 SSH 访问**：在安全组将 SSH 端口 22 限制为仅您的办公 IP
3. **定期备份**：设置每周自动备份 SQLite 数据库文件
4. **启用 HTTPS**：申请 SSL 证书（如 Let's Encrypt 免费证书），配置 Nginx 启用 HTTPS
5. **容器安全**：定期执行 `docker pull` 更新基础镜像，获取安全补丁
6. **日志审计**：定期查看 Nginx 访问日志和后端错误日志

---

## 附录 A：关键配置参考

### A.1 目录结构（部署后）

```
/opt/zicodo/
├── frontend/                    # 前端项目
│   ├── Dockerfile               # 前端 Dockerfile（已创建）
│   ├── nginx.conf               # Nginx 配置（已创建）
│   ├── .env.production          # 前端生产环境配置
│   └── src/ dist/ ...           # 源代码和构建产物
├── backend/                     # 后端项目
│   ├── Dockerfile               # 后端 Dockerfile（已创建）
│   ├── .env                     # 后端环境变量（已创建）
│   └── src/ ...                 # 源代码
├── docker-compose.yml           # 容器编排配置
└── data/ (由 volume 管理)       # SQLite 数据库目录
```

### A.2 端口映射表

| 服务 | 容器内端口 | 主机端口 | 协议 | 说明 |
|------|-----------|---------|------|------|
| **frontend (Nginx)** | 80 | 80 | TCP | 前端页面 + API 反向代理 |
| **backend (Express)** | 3000 | -（不直接暴露） | TCP | 后端 API（通过 Nginx 转发） |

### A.3 Docker Compose 命令速查

| 目标 | 命令 |
|------|------|
| 启动所有服务 | `docker compose up -d` |
| 启动并重新构建 | `docker compose up -d --build` |
| 查看状态 | `docker compose ps` |
| 查看实时日志 | `docker compose logs -f` |
| 停止所有服务 | `docker compose down` |
| 重启所有服务 | `docker compose restart` |
| 进入后端容器 | `docker exec -it zicodo-backend sh` |
| 进入前端容器 | `docker exec -it zicodo-frontend sh` |
| 更新代码并重建 | `git pull && docker compose up -d --build` |

---

**文档版本**：v0.0.0 (2026-06-09)  
**适用版本**：zicodo 0.0.x  
**维护者**：zicodo Team
