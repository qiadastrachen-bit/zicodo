# 字灵(ZiLing) · +页面/日程任务页详细提示词
# 适用：执行机器人（新对话，只写代码不讨论）
# 对应页面：/add — 个人日程任务管理（日程 + 打卡计时器）
# 创建日期：2026-06-08
#
# ✅ 确认标记（2026-06-08）
# - TabBar 元素：✅ 已固定（5个图标，不允许再次变化）
# - 个人任务优先：✅ 已确认（团队 Tab 为 UI 占位）
# - 数据存储：✅ 使用 localStorage（MVP 最快实现）
# - 闹铃功能：✅ 仅视觉开关（无实际推送通知）
# - 打卡计时器：✅ 仅前台运行（不依赖 Service Worker）
# - 现有任务 API：⚠️ 保留（用于未来的家长-孩子任务系统，日程任务独立存储）
#

---

## 页面定位

+页面是**个人日程任务管理页**，用户在这里：
1. 查看今日/本周/其他任务列表
2. 新建任务（时间、地点、备注、闹铃）
3. 勾选完成任务
4. 点击任务进入详情/编辑
5. 前往打卡（计时器）

**页面路径：** `src/pages/tasks/TaskCreatePage.vue`（⚠️ 重写已有占位文件）
**路由：** `/add` （TabBar 第3个图标，+ 号特殊按钮）
**背景色：** `var(--zl-bg)` (#FFFAF1)

---

## 页面结构（从 Figma 截图）

### 主页面 — 任务列表（截图1/3/8）

```
┌─────────────────────────────┐
│  BellIcon  个人    团队   SearchIcon │  ← 顶部栏
│      ━━━━                   │  ← 个人下方有选中下划线
│                             │
│  今日任务              [+]   │  ← 左侧标题，右侧添加按钮
│  ┌─────────────────────┐   │
│  │ CheckIcon 晨起           │   │
│  │ 7:20 AM  ClockIcon  BellIcon │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ CircleIcon 午休          │   │
│  │ 12:00PM-12:40PM ClockIcon BellIcon│   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ CircleIcon 背单词（备战六级）│   │
│  │ 18:40PM-19:00PM ClockIcon BellIcon│   │
│  └─────────────────────┘   │
│                             │
│  本周/本月任务              │
│  ┌─────────────────────┐   │
│  │ CircleIcon 去洗衣房       │   │
│  │ 每周周三  ClockIcon  BellIcon│   │
│  └─────────────────────┘   │
│                             │
│  其他                       │
│  ┌─────────────────────┐   │
│  │ CircleIcon 倒垃圾         │   │
│  │ 每周三，周五 ClockIcon BellIcon│   │
│  └─────────────────────┘   │
│                             │
│ （底部留白给 TabBar）        │
├─────────────────────────────┤
│ 首页 │互动│+ │日历│个人      │  ← + 按钮高亮（圆形品牌色背景）
└─────────────────────────────┘
```

### 新建任务弹窗（截图2）

```
┌─────────────────────────────┐
│  ×      新建任务             │  ← 左上角关闭，居中标题
│                             │
│  ┌─────────────────────┐   │
│  │ CalendarIcon 4月1日-5月1日（每天）│  ← 日期范围选择
│  └─────────────────────┘   │
│  ┌─────────┐ ┌─────────┐  │
│  │ ClockIcon 19:30 PM│ │ ClockIcon 20:30 PM│  ← 开始/结束时间
│  └─────────┘ └─────────┘  │
│  ┌─────────────────────┐   │
│  │ FileTextIcon 记得带水杯        │  ← 备注
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ MapPinIcon 操场             │  ← 地点
│  └─────────────────────┘   │
│  ┌────────────────────────┐ │
│  │ BellIcon 闹铃           [toggle]│  ← 开关（默认关闭）
│  └────────────────────────┘ │
│                             │
│        ┌─────────┐         │
│        │   确认   │         │  ← 品牌色按钮
│        └─────────┘         │
└─────────────────────────────┘
```

### 任务详情/编辑弹窗（截图4/5）

```
┌─────────────────────────────┐
│  ×    跑步锻炼    删除 ☐   │  ← 关闭 | 标题 | 删除+完成勾选
│                             │
│  ┌─────────────────────┐   │
│  │ CalendarIcon 21 Jun 2026      │   │
│  └─────────────────────┘   │
│  ┌─────────┐ ┌─────────┐  │
│  │ ClockIcon 8:30 AM│ │ ClockIcon 9:30 AM│
│  └─────────┘ └─────────┘  │
│  ┌─────────────────────┐   │
│  │ FileTextIcon 记得带水杯        │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ MapPinIcon 操场             │
│  └─────────────────────┘   │
│  ┌────────────────────────┐ │
│  │ BellIcon 闹铃           [toggle]│
│  └────────────────────────┘ │
│                             │
│        ┌─────────┐         │
│        │ 前往打卡 │         │  ← 品牌色按钮
│        └─────────┘         │
└─────────────────────────────┘
```

### 打卡计时器页面（截图6/7）

```
┌─────────────────────────────┐
│  ×    跑步锻炼    删除 ☐   │
│                             │
│                             │
│         ╭───────╮          │
│        ╱         ╲         │
│       │   60 min  │        │  ← 圆形进度条
│        ╲         ╱         │
│         ╰───────╯          │
│                             │
│    ═══════════════════      │  ← 线性进度条
│                             │
│        ┌─────────┐         │
│        │ 开始打卡 │         │  ← / 结束打卡
│        └─────────┘         │
└─────────────────────────────┘
```

---

## 功能需求

### 1. 顶部栏
- **左侧**：BellIcon 闹铃图标（点击打开通知列表，MVP 可仅作 UI）
- **中间**："个人" / "团队" 切换 Tab
  - 默认选中 "个人"（下方有品牌色下划线）
  - "团队" 为灰色未选中态（MVP 点击可提示"即将上线"或显示占位内容）
- **右侧**：SearchIcon 搜索图标（MVP 可仅作 UI）

### 2. 任务列表分区（自动分类）

任务按时间自动分为三个区域：

| 区域 | 条件 | 示例 |
|------|------|------|
| **今日任务** | 任务日期为今天，或重复规则包含今天 | 晨起 7:20 AM |
| **本周/本月任务** | 任务日期在本周/本月内，但不是今天 | （截图中本周/本月任务示例较少） |
| **其他** | 重复任务（非今天），或未来任务 | 每周周三、每周三/周五 |

**自动分类逻辑**：
```js
function categorizeTask(task) {
  const today = new Date()
  const taskDate = new Date(task.date)
  
  // 检查是否是今天
  if (isSameDay(taskDate, today)) return 'today'
  
  // 检查重复规则是否包含今天
  if (task.recurrence && matchesRecurrence(task.recurrence, today)) {
    return 'today'
  }
  
  // 检查是否在本月
  if (isSameMonth(taskDate, today)) return 'month'
  
  // 其他
  return 'other'
}
```

### 3. 任务卡片

每个任务显示：
- **左侧**：复选框（☑️ 完成 / ☐ 未完成）
- **标题**：任务名称（如"背单词（备战六级）"）
- **时间**：
  - 单点时间：`7:20 AM`
  - 时间段：`18:40PM - 19:00PM`
  - 重复规则：`每周周三`、`每周三，周五`
- **ClockIcon 图标**：时间图标（装饰）
- **BellIcon 图标**：闹铃开启时显示（灰色=关闭，品牌色=开启）
- **✏️ 图标**：进行中的任务显示编辑/打卡图标（截图8中"跑步锻炼"有铅笔图标）

**点击行为**：
- 点击复选框 → 切换完成状态
- 点击卡片区域 → 打开任务详情/编辑弹窗

### 4. 新建任务弹窗

**触发**：点击右上角 + 按钮

**表单字段**（全部可输入）：

| 字段 | 图标 | 类型 | 示例 |
|------|------|------|------|
| 日期范围 | CalendarIcon | 日期选择器 | 4月1日-5月1日（每天）|
| 开始时间 | ClockIcon | 时间选择器 | 19:30 PM |
| 结束时间 | ClockIcon | 时间选择器 | 20:30 PM |
| 备注 | FileTextIcon | 文本输入 | 记得带水杯 |
| 地点 | MapPinIcon | 文本输入 | 操场 |
| 闹铃 | BellIcon | Toggle 开关 | 开/关 |

**日期范围格式**：
- 单次任务：`21 Jun 2026`
- 重复任务：`4月1日-5月1日（每天）`、`每周周三`

**按钮**：
- "确认" → 创建任务 → 自动分类 → 关闭弹窗 → 列表更新

### 5. 任务详情/编辑弹窗

**触发**：点击任务卡片

**内容**：与新建任务相同的表单，但预填充数据

**额外操作**：
- 右上角"删除"文字按钮 → 删除任务
- 右上角复选框 → 标记完成/未完成
- 底部按钮：
  - 未开始 → "前往打卡"
  - 已完成 → "确认"（保存修改）

### 6. 打卡计时器

**触发**：点击"前往打卡"

**界面**：
- 圆形进度条（SVG 或 CSS conic-gradient）
- 中间显示计划时长（如"60 min"）
- 下方线性进度条
- "开始打卡" / "结束打卡" 按钮

**逻辑**：
1. 点击"开始打卡" → 开始计时
2. 圆形进度条和线性进度条随时间填充
3. 点击"结束打卡" → 停止计时
4. 自动标记任务为已完成
5. 返回任务列表

**计时器状态**：
- 未开始：进度为空，按钮="开始打卡"
- 进行中：进度实时更新，按钮="结束打卡"
- 已完成：任务卡片显示 ✅ + ✏️ 图标

---

## 数据模型

### Task 对象（localStorage 存储）

```js
{
  id: 'task_1717824000000',        // 唯一 ID（时间戳）
  title: '跑步锻炼',               // 任务标题
  date: '2026-06-08',              // 任务日期（YYYY-MM-DD）
  dateRange: {                      // 日期范围（可选）
    start: '2026-04-01',
    end: '2026-05-01'
  },
  recurrence: '每天',               // 重复规则：'每天' | '每周X' | null
  startTime: '19:30',              // 开始时间（HH:mm）
  endTime: '20:30',                // 结束时间（HH:mm，可选）
  note: '记得带水杯',               // 备注
  location: '操场',                // 地点
  alarmEnabled: false,             // 闹铃开关
  completed: false,                // 是否完成
  checkInStart: null,              // 打卡开始时间（ISO 字符串）
  checkInEnd: null,                // 打卡结束时间（ISO 字符串）
  type: 'personal',                // 'personal' | 'team'（MVP 仅 personal）
  createdAt: '2026-06-08T10:00:00Z',
  updatedAt: '2026-06-08T10:00:00Z'
}
```

### localStorage Key

```js
const STORAGE_KEY = 'ziling_schedule_tasks'
```

### 示例数据（初始化用）

```js
const DEFAULT_TASKS = [
  {
    id: 'task_1',
    title: '晨起',
    date: '2026-06-08',
    startTime: '07:20',
    endTime: null,
    note: '',
    location: '',
    alarmEnabled: true,
    completed: true,
    type: 'personal'
  },
  {
    id: 'task_2',
    title: '背单词（备战六级）',
    date: '2026-06-08',
    startTime: '18:40',
    endTime: '19:00',
    note: '',
    location: '',
    alarmEnabled: false,
    completed: false,
    type: 'personal'
  },
  {
    id: 'task_3',
    title: '午休',
    date: '2026-06-08',
    startTime: '12:00',
    endTime: '12:40',
    note: '',
    location: '',
    alarmEnabled: false,
    completed: false,
    type: 'personal'
  },
  {
    id: 'task_4',
    title: '跑步锻炼',
    date: '2026-06-08',
    startTime: '19:30',
    endTime: '20:30',
    note: '记得带水杯',
    location: '操场',
    alarmEnabled: false,
    completed: false,
    type: 'personal'
  },
  {
    id: 'task_5',
    title: '去洗衣房',
    date: '2026-06-10',
    recurrence: '每周周三',
    startTime: null,
    endTime: null,
    note: '',
    location: '',
    alarmEnabled: false,
    completed: false,
    type: 'personal'
  },
  {
    id: 'task_6',
    title: '倒垃圾',
    date: '2026-06-11',
    recurrence: '每周三，周五',
    startTime: null,
    endTime: null,
    note: '',
    location: '',
    alarmEnabled: false,
    completed: false,
    type: 'personal'
  }
]
```

---

## 组件结构

### 文件清单

```
src/pages/tasks/
├── TaskCreatePage.vue          ← ⚠️ 重写已有占位文件（/add 路由）
src/components/schedule/
├── ScheduleHeader.vue         ← 顶部栏（通知/个人团队切换/搜索）
├── TaskSection.vue            ← 任务分区标题（今日任务/本周/其他）
├── TaskCard.vue               ← 单个任务卡片
├── TaskForm.vue               ← 新建/编辑任务弹窗（共享组件）
├── CheckInTimer.vue           ← 打卡计时器弹窗
└── ToggleSwitch.vue           ← 通用 Toggle 开关组件
src/stores/
├── schedule.js                ← 日程任务 Store（localStorage）
```

> ⚠️ **重要**：`TaskCreatePage.vue` 已有占位文件，需**完全重写**。
> 现有 `TaskListPage.vue` 和 `TaskDetailPage.vue` 为其他功能预留，本次不需要修改。

---

## 路由配置（需修改）

### 在 `src/router/index.js` 中修改 `/add` 路由

```js
// ⚠️ 修改：给 /add 路由添加 showTabBar: true
{
  path: 'add',
  name: 'Add',
  component: () => import('@/pages/tasks/TaskCreatePage.vue'),
  meta: { 
    title: '添加',
    showTabBar: true  // ⚠️ 新增：显示 TabBar
  }
}
```

> **说明**：`/add` 路由已存在，只需在 `meta` 中添加 `showTabBar: true`。

---

## 核心代码（直接给执行机器人用）

### 1. `src/stores/schedule.js` — 日程任务 Store

```js
/**
 * schedule.js - 日程任务 Store
 * 使用 localStorage 持久化（MVP 方案）
 * 与现有的 task.js（家长-孩子任务系统）独立
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'ziling_schedule_tasks'

// 判断是否是同一天
function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

// 判断重复规则是否匹配今天
function matchesRecurrence(recurrence, date) {
  if (!recurrence) return false
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const todayName = dayNames[date.getDay()]
  
  if (recurrence === '每天') return true
  if (recurrence.includes(todayName)) return true
  return false
}

// 从 localStorage 读取
function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 保存到 localStorage
function saveToStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const useScheduleStore = defineStore('schedule', () => {
  // State
  const tasks = ref(loadFromStorage())
  const currentView = ref('personal') // 'personal' | 'team'
  const showForm = ref(false)
  const editingTask = ref(null)
  const showTimer = ref(false)
  const timerTask = ref(null)

  // Getters
  const todayTasks = computed(() => {
    const today = new Date()
    return tasks.value.filter(task => {
      if (task.type !== 'personal') return false
      const taskDate = new Date(task.date)
      if (isSameDay(taskDate, today)) return true
      if (matchesRecurrence(task.recurrence, today)) return true
      return false
    })
  })

  const monthTasks = computed(() => {
    const today = new Date()
    return tasks.value.filter(task => {
      if (task.type !== 'personal') return false
      const taskDate = new Date(task.date)
      if (isSameDay(taskDate, today)) return false
      if (matchesRecurrence(task.recurrence, today)) return false
      if (taskDate.getMonth() === today.getMonth() && 
          taskDate.getFullYear() === today.getFullYear()) return true
      return false
    })
  })

  const otherTasks = computed(() => {
    const today = new Date()
    return tasks.value.filter(task => {
      if (task.type !== 'personal') return false
      const taskDate = new Date(task.date)
      if (isSameDay(taskDate, today)) return false
      if (matchesRecurrence(task.recurrence, today)) return false
      if (taskDate.getMonth() === today.getMonth() && 
          taskDate.getFullYear() === today.getFullYear()) return false
      return true
    })
  })

  // Actions
  function addTask(taskData) {
    const newTask = {
      id: 'task_' + Date.now(),
      ...taskData,
      type: 'personal',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    tasks.value.unshift(newTask)
    saveToStorage(tasks.value)
    return newTask
  }

  function updateTask(taskId, updates) {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToStorage(tasks.value)
    }
  }

  function deleteTask(taskId) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    saveToStorage(tasks.value)
  }

  function toggleComplete(taskId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      task.updatedAt = new Date().toISOString()
      saveToStorage(tasks.value)
    }
  }

  function openForm(task = null) {
    editingTask.value = task
    showForm.value = true
  }

  function closeForm() {
    showForm.value = false
    editingTask.value = null
  }

  function openTimer(task) {
    timerTask.value = task
    showTimer.value = true
  }

  function closeTimer() {
    showTimer.value = false
    timerTask.value = null
  }

  return {
    tasks,
    currentView,
    showForm,
    editingTask,
    showTimer,
    timerTask,
    todayTasks,
    monthTasks,
    otherTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    openForm,
    closeForm,
    openTimer,
    closeTimer
  }
})
```

---

### 2. `src/components/schedule/ToggleSwitch.vue` — 通用开关

```vue
<template>
  <div 
    class="toggle-switch" 
    :class="{ active: modelValue }"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div class="toggle-thumb"></div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.toggle-switch {
  width: 48px;
  height: 26px;
  background: var(--zl-text-disabled);
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: background var(--zl-transition-fast);
}

.toggle-switch.active {
  background: var(--zl-brand);
}

.toggle-thumb {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform var(--zl-transition-fast);
  box-shadow: var(--zl-shadow-sm);
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(22px);
}
</style>
```

---

### 3. `src/components/schedule/TaskCard.vue` — 任务卡片

```vue
<template>
  <div class="task-card" :class="{ completed: task.completed }">
    <!-- 复选框 -->
    <div class="checkbox" @click.stop="$emit('toggle', task.id)">
      <CheckIcon v-if="task.completed" :size="14" />
    </div>
    
    <!-- 内容 -->
    <div class="task-content" @click="$emit('click', task)">
      <div class="task-title">{{ task.title }}</div>
      <div class="task-meta">
        <span class="task-time">
          <span v-if="task.startTime && task.endTime">
            {{ formatTime(task.startTime) }} - {{ formatTime(task.endTime) }}
          </span>
          <span v-else-if="task.startTime">
            {{ formatTime(task.startTime) }}
          </span>
          <span v-else-if="task.recurrence">
            {{ task.recurrence }}
          </span>
        </span>
        <ClockIcon :size="16" />
      </div>
    </div>
    
    <!-- 右侧图标 -->
    <div class="task-actions">
      <PencilIcon v-if="!task.completed && task.startTime" :size="14" />
      <!-- 闹铃图标 -->
      <BellIcon v-if="task.alarmEnabled" :size="14" class="alarm-icon active" />
      <BellIcon v-else :size="14" class="alarm-icon" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: { type: Object, required: true }
})

const emit = defineEmits(['toggle', 'click'])

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
  return `${displayHour}:${m} ${ampm}`
}
</script>

<style scoped>
.task-card {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
  padding: var(--zl-space-md);
  background: white;
  border-radius: var(--zl-radius-md);
  margin-bottom: var(--zl-space-sm);
  box-shadow: var(--zl-shadow-sm);
}

.checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid var(--zl-text-disabled);
  border-radius: var(--zl-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.task-card.completed .checkbox {
  background: var(--zl-brand);
  border-color: var(--zl-brand);
}

.check-icon {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  font-weight: 500;
  margin-bottom: 4px;
}

.task-card.completed .task-title {
  text-decoration: line-through;
  color: var(--zl-text-hint);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: var(--zl-space-xs);
  font-size: var(--zl-font-sm);
  color: var(--zl-text-secondary);
}

.time-icon {
  opacity: 0.5;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
}

.edit-icon {
  font-size: 14px;
}

.alarm-icon {
  font-size: 16px;
  opacity: 0.3;
}

.alarm-icon.active {
  opacity: 1;
  color: var(--zl-brand);
}
</style>
```

---

### 4. `src/components/schedule/TaskForm.vue` — 新建/编辑任务弹窗

```vue
<template>
  <div class="task-form-overlay" @click.self="$emit('close')">
    <div class="task-form-modal">
      <!-- 标题栏 -->
      <div class="form-header">
        <button class="close-btn" @click="$emit('close')">×</button>
        <h3 class="form-title">{{ isEditing ? '' : '新建任务' }}</h3>
        <div v-if="isEditing" class="header-actions">
          <span class="delete-btn" @click="$emit('delete', form.id)">删除</span>
          <div class="checkbox" @click="toggleComplete">
            <div v-if="form.completed" class="check-icon">✓</div>
          </div>
        </div>
        <div v-else class="header-spacer"></div>
      </div>

      <!-- 表单内容 -->
      <div class="form-body">
        <!-- 日期 -->
        <div class="form-field">
          <CalendarIcon :size="16" />
          <input 
            type="text" 
            v-model="form.dateDisplay" 
            placeholder="选择日期"
            class="field-input"
          />
        </div>

        <!-- 时间 -->
        <div class="form-row">
          <div class="form-field">
            <ClockIcon :size="16" />
            <input 
              type="time" 
              v-model="form.startTime" 
              class="field-input"
            />
          </div>
          <div class="form-field">
            <ClockIcon :size="16" />
            <input 
              type="time" 
              v-model="form.endTime" 
              class="field-input"
            />
          </div>
        </div>

        <!-- 备注 -->
        <div class="form-field">
          <FileTextIcon :size="16" />
          <input 
            type="text" 
            v-model="form.note" 
            placeholder="添加备注"
            class="field-input"
          />
        </div>

        <!-- 地点 -->
        <div class="form-field">
          <MapPinIcon :size="16" />
          <input 
            type="text" 
            v-model="form.location" 
            placeholder="添加地点"
            class="field-input"
          />
        </div>

        <!-- 闹铃 -->
        <div class="form-field alarm-field">
          <BellIcon :size="16" />
          <span class="field-label">闹铃</span>
          <ToggleSwitch v-model="form.alarmEnabled" />
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="form-footer">
        <button 
          v-if="isEditing && !form.completed"
          class="btn-primary" 
          @click="$emit('checkin', form)"
        >
          前往打卡
        </button>
        <button 
          v-else
          class="btn-primary" 
          @click="handleSubmit"
        >
          {{ isEditing ? '保存' : '确认' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { Clock, FileText, MapPin, Bell } from 'lucide-vue-next'
import ToggleSwitch from './ToggleSwitch.vue'

const ClockIcon = Clock
const FileTextIcon = FileText
const MapPinIcon = MapPin
const BellIcon = Bell

const props = defineProps({
  task: { type: Object, default: null }
})

const emit = defineEmits(['close', 'submit', 'delete', 'checkin'])

const isEditing = computed(() => !!props.task)

const form = reactive({
  id: '',
  title: '',
  date: '',
  dateDisplay: '',
  startTime: '',
  endTime: '',
  note: '',
  location: '',
  alarmEnabled: false,
  completed: false
})

// 初始化表单
watch(() => props.task, (newTask) => {
  if (newTask) {
    Object.assign(form, newTask)
    form.dateDisplay = newTask.date || ''
  } else {
    Object.assign(form, {
      id: '',
      title: '',
      date: '',
      dateDisplay: '',
      startTime: '',
      endTime: '',
      note: '',
      location: '',
      alarmEnabled: false,
      completed: false
    })
  }
}, { immediate: true })

function toggleComplete() {
  form.completed = !form.completed
}

function handleSubmit() {
  const data = {
    title: form.title || '未命名任务',
    date: form.dateDisplay,
    startTime: form.startTime,
    endTime: form.endTime,
    note: form.note,
    location: form.location,
    alarmEnabled: form.alarmEnabled,
    completed: form.completed
  }
  
  if (isEditing.value) {
    data.id = form.id
  }
  
  emit('submit', data)
}
</script>

<style scoped>
.task-form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--zl-space-md);
}

.task-form-modal {
  background: var(--zl-bg);
  border-radius: var(--zl-radius-lg);
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zl-space-md);
  border-bottom: 1px solid var(--zl-border);
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--zl-text-secondary);
}

.form-title {
  font-size: var(--zl-font-md);
  font-weight: 500;
  color: var(--zl-text-primary);
  flex: 1;
  text-align: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
}

.delete-btn {
  font-size: var(--zl-font-sm);
  color: var(--zl-danger);
  cursor: pointer;
}

.header-spacer {
  width: 32px;
}

.form-body {
  padding: var(--zl-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
}

.form-row {
  display: flex;
  gap: var(--zl-space-md);
}

.form-row .form-field {
  flex: 1;
}

.form-field {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
  padding: var(--zl-space-sm) var(--zl-space-md);
  background: white;
  border-radius: var(--zl-radius-md);
  border: 1px solid var(--zl-border);
}

.field-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.field-input {
  flex: 1;
  border: none;
  background: none;
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  outline: none;
}

.field-input::placeholder {
  color: var(--zl-text-hint);
}

.alarm-field {
  justify-content: space-between;
}

.field-label {
  flex: 1;
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
}

.form-footer {
  padding: var(--zl-space-md);
  display: flex;
  justify-content: center;
}

.btn-primary {
  padding: var(--zl-space-sm) var(--zl-space-xl);
  background: var(--zl-brand);
  color: white;
  border: none;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  cursor: pointer;
  transition: opacity var(--zl-transition-fast);
}

.btn-primary:hover {
  opacity: 0.9;
}

.checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid var(--zl-text-disabled);
  border-radius: var(--zl-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.checkbox .check-icon {
  color: var(--zl-brand);
  font-size: 14px;
  font-weight: bold;
}
</style>
```

---

### 5. `src/components/schedule/CheckInTimer.vue` — 打卡计时器

```vue
<template>
  <div class="timer-overlay" @click.self="$emit('close')">
    <div class="timer-content">
      <!-- 头部 -->
      <div class="timer-header">
        <button class="close-btn" @click="$emit('close')">×</button>
        <h3 class="timer-title">{{ task?.title || '打卡' }}</h3>
        <div class="header-spacer"></div>
      </div>

      <!-- 圆形进度 -->
      <div class="timer-circle">
        <svg class="progress-ring" viewBox="0 0 200 200">
          <!-- 背景圆环 -->
          <circle
            class="progress-ring-bg"
            cx="100"
            cy="100"
            r="90"
          />
          <!-- 进度圆环 -->
          <circle
            class="progress-ring-fill"
            cx="100"
            cy="100"
            r="90"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeOffset"
          />
        </svg>
        <div class="timer-text">
          <span class="timer-duration">{{ plannedDuration }} min</span>
          <span v-if="isRunning" class="timer-elapsed">{{ formatElapsed }}</span>
        </div>
      </div>

      <!-- 线性进度 -->
      <div class="linear-progress">
        <div class="linear-progress-bar" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <!-- 按钮 -->
      <div class="timer-actions">
        <button 
          v-if="!isRunning && !isCompleted"
          class="btn-timer"
          @click="startTimer"
        >
          开始打卡
        </button>
        <button 
          v-else-if="isRunning"
          class="btn-timer"
          @click="endTimer"
        >
          结束打卡
        </button>
        <button 
          v-else
          class="btn-timer completed"
          @click="$emit('close')"
        >
          已完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  task: { type: Object, default: null }
})

const emit = defineEmits(['close', 'complete'])

const isRunning = ref(false)
const isCompleted = ref(false)
const startTime = ref(null)
const elapsedSeconds = ref(0)
let timerInterval = null

// 计算计划时长（分钟）
const plannedDuration = computed(() => {
  if (!props.task?.startTime || !props.task?.endTime) return null  // ← 无 endTime 返回 null
  const [sh, sm] = props.task.startTime.split(':').map(Number)
  const [eh, em] = props.task.endTime.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
})

const circumference = 2 * Math.PI * 90 // ~565.48

const progressPercent = computed(() => {
  if (plannedDuration.value === 0) return 0
  const percent = (elapsedSeconds.value / (plannedDuration.value * 60)) * 100
  return Math.min(percent, 100)
})

const strokeOffset = computed(() => {
  return circumference - (progressPercent.value / 100) * circumference
})

const formatElapsed = computed(() => {
  const m = Math.floor(elapsedSeconds.value / 60)
  const s = elapsedSeconds.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

function startTimer() {
  isRunning.value = true
  startTime.value = Date.now()
  timerInterval = setInterval(() => {
    elapsedSeconds.value = Math.floor((Date.now() - startTime.value) / 1000)
  }, 1000)
}

function endTimer() {
  isRunning.value = false
  isCompleted.value = true
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  emit('complete', {
    duration: elapsedSeconds.value,
    startTime: new Date(startTime.value).toISOString(),
    endTime: new Date().toISOString()
  })
}

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.timer-overlay {
  position: fixed;
  inset: 0;
  background: var(--zl-bg);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.timer-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--zl-space-md);
}

.timer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--zl-space-xl);
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--zl-text-secondary);
}

.timer-title {
  font-size: var(--zl-font-lg);
  font-weight: 500;
  color: var(--zl-text-primary);
  flex: 1;
  text-align: center;
}

.header-spacer {
  width: 40px;
}

.timer-circle {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto var(--zl-space-xl);
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring-bg {
  fill: none;
  stroke: var(--zl-border);
  stroke-width: 12;
}

.progress-ring-fill {
  fill: none;
  stroke: var(--zl-brand);
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.timer-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-duration {
  font-size: var(--zl-font-xl);
  font-weight: 500;
  color: var(--zl-text-primary);
}

.timer-elapsed {
  font-size: var(--zl-font-md);
  color: var(--zl-brand);
  margin-top: var(--zl-space-xs);
}

.linear-progress {
  width: 80%;
  height: 6px;
  background: var(--zl-border);
  border-radius: 3px;
  margin: 0 auto var(--zl-space-xl);
  overflow: hidden;
}

.linear-progress-bar {
  height: 100%;
  background: var(--zl-brand);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.timer-actions {
  display: flex;
  justify-content: center;
  margin-top: auto;
  margin-bottom: var(--zl-space-xl);
}

.btn-timer {
  padding: var(--zl-space-sm) var(--zl-space-xl);
  background: var(--zl-brand);
  color: white;
  border: none;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  cursor: pointer;
  transition: opacity var(--zl-transition-fast);
}

.btn-timer:hover {
  opacity: 0.9;
}

.btn-timer.completed {
  background: var(--zl-text-hint);
}
</style>
```

---

### 6. `src/pages/tasks/TaskCreatePage.vue` — 主页面（⚠️ 重写占位文件）

```vue
<template>
  <div class="schedule-page">
    <!-- 顶部栏 -->
    <div class="schedule-header">
      <button class="header-btn">
        <BellIcon :size="22" />
      </button>
      
      <!-- 个人/团队切换 -->
      <div class="tab-switcher">
        <span 
          class="tab-item" 
          :class="{ active: currentView === 'personal' }"
          @click="currentView = 'personal'"
        >
          个人
        </span>
        <span 
          class="tab-item" 
          :class="{ active: currentView === 'team' }"
          @click="currentView = 'team'"
        >
          团队
        </span>
        <div class="tab-indicator" :style="indicatorStyle"></div>
      </div>
      
      <button class="header-btn">
        <SearchIcon :size="22" />
      </button>
    </div>

    <!-- 个人任务列表 -->
    <div v-if="currentView === 'personal'" class="schedule-content">
      <!-- 今日任务 -->
      <div class="task-section">
        <div class="section-header">
          <h3 class="section-title">今日任务</h3>
          <button class="add-btn" @click="openForm()">
            <PlusIcon :size="20" color="var(--zl-brand)" />
          </button>
        </div>
        <TaskCard
          v-for="task in store.todayTasks"
          :key="task.id"
          :task="task"
          @toggle="store.toggleComplete"
          @click="openForm(task)"
        />
        <div v-if="store.todayTasks.length === 0" class="empty-tip">
          今日暂无任务
        </div>
      </div>

      <!-- 本周/本月任务 -->
      <div class="task-section" v-if="store.monthTasks.length > 0">
        <div class="section-header">
          <h3 class="section-title">本周/本月任务</h3>
        </div>
        <TaskCard
          v-for="task in store.monthTasks"
          :key="task.id"
          :task="task"
          @toggle="store.toggleComplete"
          @click="openForm(task)"
        />
      </div>

      <!-- 其他 -->
      <div class="task-section" v-if="store.otherTasks.length > 0">
        <div class="section-header">
          <h3 class="section-title">其他</h3>
        </div>
        <TaskCard
          v-for="task in store.otherTasks"
          :key="task.id"
          :task="task"
          @toggle="store.toggleComplete"
          @click="openForm(task)"
        />
      </div>
    </div>

    <!-- 团队任务（MVP 占位） -->
    <div v-else class="team-placeholder">
      <UsersIcon :size="48" class="placeholder-icon" />
      <p class="placeholder-text">团队功能即将上线</p>
    </div>

    <!-- 新建/编辑任务弹窗 -->
    <TaskForm
      v-if="store.showForm"
      :task="store.editingTask"
      @close="store.closeForm"
      @submit="handleSubmit"
      @delete="handleDelete"
      @checkin="handleCheckIn"
    />

    <!-- 打卡计时器弹窗 -->
    <CheckInTimer
      v-if="store.showTimer"
      :task="store.timerTask"
      @close="store.closeTimer"
      @complete="handleCheckInComplete"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bell, Search, Plus, Check, Clock, Pencil, Calendar, FileText, MapPin } from 'lucide-vue-next'
import { useScheduleStore } from '@/stores/schedule.js'

const BellIcon = Bell
const SearchIcon = Search
const PlusIcon = Plus
const CheckIcon = Check
const ClockIcon = Clock
const PencilIcon = Pencil
const CalendarIcon = Calendar
const FileTextIcon = FileText
const MapPinIcon = MapPin
import TaskCard from '@/components/schedule/TaskCard.vue'
import TaskForm from '@/components/schedule/TaskForm.vue'
import CheckInTimer from '@/components/schedule/CheckInTimer.vue'
<\/script>

<script>
export default {
  name: 'TaskCreatePage'
}
<\/script>

<script setup>
const store = useScheduleStore()
const currentView = ref('personal')

// Tab 指示器位置
const indicatorStyle = computed(() => {
  const index = currentView.value === 'personal' ? 0 : 1
  return {
    transform: `translateX(${index * 100}%)`
  }
})

// 兼容 lucide icon 组件名
const BellIcon = Bell
const SearchIcon = Search
const PlusIcon = Plus

function openForm(task = null) {
  store.openForm(task)
}

function handleSubmit(data) {
  if (data.id) {
    store.updateTask(data.id, data)
  } else {
    store.addTask(data)
  }
  store.closeForm()
}

function handleDelete(taskId) {
  if (confirm('确定要删除这个任务吗？')) {
    store.deleteTask(taskId)
    store.closeForm()
  }
}

function handleCheckIn(task) {
  store.closeForm()
  store.openTimer(task)
}

function handleCheckInComplete(checkInData) {
  if (store.timerTask) {
    store.updateTask(store.timerTask.id, {
      completed: true,
      checkInStart: checkInData.startTime,
      checkInEnd: checkInData.endTime
    })
  }
  store.closeTimer()
}
</script>

<style scoped>
.schedule-page {
  min-height: 100vh;
  background: var(--zl-bg);
  padding-bottom: var(--zl-tabbar-height);
}

.schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zl-space-sm) var(--zl-space-md);
  background: var(--zl-bg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--zl-text-secondary);
  cursor: pointer;
}

.tab-switcher {
  display: flex;
  position: relative;
  gap: var(--zl-space-lg);
}

.tab-item {
  font-size: var(--zl-font-lg);
  color: var(--zl-text-hint);
  cursor: pointer;
  padding: var(--zl-space-xs) 0;
  transition: color var(--zl-transition-fast);
}

.tab-item.active {
  color: var(--zl-text-primary);
  font-weight: 500;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 3px;
  background: var(--zl-brand);
  border-radius: 2px;
  transition: transform var(--zl-transition-base);
}

.schedule-content {
  padding: var(--zl-space-md);
}

.task-section {
  margin-bottom: var(--zl-space-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--zl-space-sm);
}

.section-title {
  font-size: var(--zl-font-md);
  font-weight: 500;
  color: var(--zl-text-primary);
}

.add-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
}

.empty-tip {
  text-align: center;
  padding: var(--zl-space-xl);
  color: var(--zl-text-hint);
  font-size: var(--zl-font-sm);
}

.team-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: var(--zl-space-md);
}

.placeholder-icon {
  font-size: 48px;
}

.placeholder-text {
  font-size: var(--zl-font-base);
  color: var(--zl-text-hint);
}
</style>
```

---

## 样式规范（遵循 Design Tokens）

| CSS 变量 | 值 | 用途 |
|---------|-----|------|
| `--zl-brand` | `#87C8B4` | 按钮、完成态、进度条 |
| `--zl-bg` | `#FFFAF1` | 页面背景 |
| `--zl-text-primary` | `#2D3436` | 标题、主要文字 |
| `--zl-text-secondary` | `#636E72` | 辅助文字、图标 |
| `--zl-text-hint` | `#ADB5BD` | 占位文字、未选中 Tab |
| `--zl-border` | `#E0E0E0` | 边框、分割线 |
| `--zl-radius-md` | `12px` | 卡片圆角 |
| `--zl-radius-lg` | `16px` | 弹窗圆角 |
| `--zl-shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | 卡片阴影 |
| `--zl-font-base` | `16px` | 正文 |
| `--zl-font-sm` | `14px` | 辅助信息 |

---

## 重要注意事项

1. **重写占位文件**：`TaskCreatePage.vue` 已有占位文件，需**完全重写**，不要保留原有 TODO 内容
2. **TabBar 高亮**：+ 按钮在 TabBar 中是特殊样式（圆形品牌色背景），选中时保持该样式
3. **localStorage 存储**：日程任务使用独立的 localStorage key（`ziling_schedule_tasks`），不与现有 task store 冲突
4. **团队 Tab**：MVP 仅作 UI 占位，点击显示"即将上线"提示
5. **闹铃功能**：仅视觉开关（Toggle），不实现实际推送通知（超出 MVP 范围）
6. **打卡计时器**：仅前台运行，关闭页面后计时器停止（不依赖 Service Worker）
7. **日期/时间输入**：使用原生 `<input type="date">` 和 `<input type="time">`（MVP 方案）
8. **复用组件**：`TaskForm.vue` 同时处理新建和编辑两种模式
9. **自动分类**：添加/修改任务后，自动根据日期计算属于哪个分区
10. **初始化数据**：首次访问时，如果没有 localStorage 数据，使用 `DEFAULT_TASKS` 初始化

---

## 执行清单（执行机器人逐项勾选）

- [ ] 修改 `src/router/index.js` — 给 `/add` 路由添加 `showTabBar: true`
- [ ] 创建 `src/stores/schedule.js` — 日程任务 Store（localStorage）
- [ ] 创建 `src/components/schedule/ToggleSwitch.vue` — 通用开关组件
- [ ] 创建 `src/components/schedule/TaskCard.vue` — 任务卡片
- [ ] 创建 `src/components/schedule/TaskForm.vue` — 新建/编辑任务弹窗
- [ ] 创建 `src/components/schedule/CheckInTimer.vue` — 打卡计时器
- [ ] ⚠️ **重写** `src/pages/tasks/TaskCreatePage.vue` — 主页面（替换占位文件）
- [ ] **测试：打开 /add 页面 → 显示任务列表**
- [ ] **测试：点击 + 按钮 → 打开新建任务弹窗**
- [ ] **测试：填写表单 → 确认 → 任务添加到列表 → 自动分类**
- [ ] **测试：点击任务卡片 → 打开编辑弹窗**
- [ ] **测试：点击复选框 → 标记完成/未完成**
- [ ] **测试：点击"前往打卡" → 打开计时器 → 开始/结束打卡**
- [ ] **测试：切换个人/团队 Tab**
- [ ] **测试：刷新页面 → 数据从 localStorage 恢复**
- [ ] **测试：TabBar + 按钮保持高亮**

---

## 执行完成后必须反馈的内容

**执行机器人：完成上述所有任务后，请反馈以下信息：**

1. **文件目录结构**（已创建/修改的文件列表）
2. **架构说明**（数据流：localStorage → Store → Components）
3. **测试报告**（任务 CRUD、自动分类、打卡计时器、Tab 切换、数据持久化）
4. **遇到的问题**（如有，按 Case 库格式记录）

---

**执行机器人：请严格按照以上代码和规格实现+页面。如有疑问，停止并说明，不要猜测。**

---

## 修订记录

| 日期 | 修订内容 | 修订人 |
|------|---------|--------|
| 2026-06-08 | 创建+页面提示词（日程任务管理） | AI Consultant |
| 2026-06-08 | 确定 localStorage 存储方案（MVP） | AI Consultant |
| 2026-06-08 | 确定个人优先、团队占位策略 | AI Consultant |
| 2026-06-08 | 提供完整组件代码（6个组件） | AI Consultant |
