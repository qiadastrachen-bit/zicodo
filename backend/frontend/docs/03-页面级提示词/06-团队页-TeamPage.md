# 字灵(ZiLing) · +页面/团队功能详细提示词
# 适用：执行机器人（新对话，只写代码不讨论）
# 对应功能：/add 路由的"团队"Tab
# 创建日期：2026-06-08
#
# ✅ 确认标记（2026-06-08）
# - 成员角色：✅ 已确认（陈锦彤=组长+后端，郭定夺=宠物，甘乐乐=UI，孙子儒=硬件，杨舒惠=统筹）
# - 任务同步：✅ 团队任务可同步到个人任务
# - 聊天功能：❌ 仅显示任务分配，不实现聊天
# - 空状态动画：✅ 使用加载动画（无数据）+ 错误动画（出错时）
# - 打卡页面尺寸：✅ 已修正（圆形进度条 180px）
#

---


## 功能定位

团队功能是 **/add 页面"团队"Tab** 的内容，用户在这里：
1. 查看已加入的团队列表
2. 新建团队（名称、备注、座右铭）
3. 查看团队详情（任务卡片 + 成员列表）
4. 查看成员详情（姓名 + 角色分工）
5. 管理团队任务（打卡、删除，与个人任务交互一致）
6. 将团队任务同步到个人任务

**嵌套位置：** `TaskCreatePage.vue` 的 `v-if="currentView === 'team'"` 分支
**不需要新路由：** 所有团队功能在 /add 页面内切换显示
**背景色：** `var(--zl-bg)` (#FFFAF1)


---


## 页面结构（从截图）


### 团队列表视图（有团队）

```
┌─────────────────────────────┐
│  BellIcon  个人  │ 团队   SearchIcon │  ← 顶部栏（已在 TaskCreatePage 实现）
│           ━━━━                   │
│                             │
│  团队列表                [+]   │  ← 标题 + 新建按钮
│  ┌─────────────────────┐   │
│  │ 英语阅读社          │   │
│  │ 89人              �⋯ │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ 毛概小组            │   │
│  │ 5人               �⋯ │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ 数字视效设计小组    │   │
│  │ 6人               �⋯ │   │
│  └─────────────────────┘   │
│                             │
├─────────────────────────────┤
│ 首页 │互动│+ │日历│个人      │
└─────────────────────────────┘
```


### 新建团队弹窗

```
┌─────────────────────────────┐
│  ×      新建团队             │
│                             │
│  ┌─────────────────────┐   │
│  │ 王之故乡            │   │  ← 名称
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ 智能开源硬件基础     │   │  ← 备注
│  └─────────────────────┘   │
│  ┌────────────────────────┐ │
│  │ 分别各自为主，合同   │   │  ← 座右铭
│  │ 天下无双            │   │
│  └────────────────────────┘ │
│                             │
│        ┌─────────┐         │
│        │   确认   │         │  ← 品牌色按钮
│        └─────────┘         │
└─────────────────────────────┘
```


### 团队详情视图

```
┌─────────────────────────────┐
│  ←  王之故乡               │  ← 返回按钮 + 团队名
│                             │
│  ┌─────────────────────┐   │
│  │ 任务             0 BellIcon │   │  ← 任务卡片（大卡片，带通知点）
│  └─────────────────────┘   │
│                             │
│  成员列表              >   │  ← 点击进入成员详情
│  ┌─────────────────────┐   │
│  │ 页面              MessageCircleIcon │   │  ← 成员 + 当前任务
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ 统筹              MessageCircleIcon │   │
│  └─────────────────────┘   │
│                             │
├─────────────────────────────┤
│ 首页 │互动│+ │日历│个人      │
└─────────────────────────────┘
```


### 成员详情页

```
┌─────────────────────────────┐
│  ←  王之故乡               │
│                             │
│  成员列表                   │
│  ┌─────────────────────┐   │
│  │ UserIcon 陈锦彤                 │   │
│  │    组长+后端           │   │  ← 姓名 + 角色
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ UserIcon 郭定夺                 │   │
│  │    宠物               │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ UserIcon 甘乐乐                 │   │
│  │    UI                │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ UserIcon 孙子儒                 │   │
│  │    硬件               │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ UserIcon 杨舒惠                 │   │
│  │    统筹               │   │
│  └─────────────────────┘   │
│                             │
├─────────────────────────────┤
│ 首页 │互动│+ │日历│个人      │
└─────────────────────────────┘
```


### 空状态（未加入团队）

```
┌─────────────────────────────┐
│  BellIcon  个人  │ 团队   SearchIcon │
│           ━━━━                   │
│                             │
│                             │
│        (·∀·)(·∇·)(·▿·*)     │  ← 颜文字（团队色）
│                             │
│       您还没有加入团队          │
│                             │
│                             │
├─────────────────────────────┤
│ 首页 │互动│+ │日历│个人      │
└─────────────────────────────┘
```


### 空状态（无任务）

```
┌─────────────────────────────┐
│  ←  王之故乡               │
│                             │
│  今日任务                [+] │
│                             │
│                             │
│        (·∀·)(·∇·)(·▿·*)     │  ← 颜文字
│                             │
│       您还没有添加任务          │
│                             │
│                             │
├─────────────────────────────┤
│ 首页 │互动│+ │日历│个人      │
└─────────────────────────────┘
```


---


## 数据模型


### Team 对象（localStorage 存储）

```js
{
  id: 'team_1717824000000',        // 唯一 ID（时间戳）
  name: '王之故乡',               // 团队名称
  description: '智能开源硬件基础',  // 备注/描述
  slogan: '分别各自为主，合同天下无双', // 座右铭
  members: [                      // 成员列表
    { id: 'm1', name: '陈锦彤', role: '组长+后端' },
    { id: 'm2', name: '郭定夺', role: '宠物' },
    { id: 'm3', name: '甘乐乐', role: 'UI' },
    { id: 'm4', name: '孙子儒', role: '硬件' },
    { id: 'm5', name: '杨舒惠', role: '统筹' }
  ],
  tasks: [                        // 团队任务列表
    {
      id: 'team_task_1',
      title: 'can you send us the template please?',
      assignee: '页面',          // 分配给谁
      completed: false,
      // ... 其他字段同个人任务
    }
  ],
  createdAt: '2026-06-08T10:00:00Z'
}
```


### localStorage Key

```js
const TEAMS_STORAGE_KEY = 'ziling_teams'
```


### 示例数据（初始化用）

```js
const DEFAULT_TEAMS = [
  {
    id: 'team_demo',
    name: '王之故乡',
    description: '智能开源硬件基础',
    slogan: '分别各自为主，合同天下无双',
    members: [
      { id: 'm1', name: '陈锦彤', role: '组长+后端' },
      { id: 'm2', name: '郭定夺', role: '宠物' },
      { id: 'm3', name: '甘乐乐', role: 'UI' },
      { id: 'm4', name: '孙子儒', role: '硬件' },
      { id: 'm5', name: '杨舒惠', role: '统筹' }
    ],
    tasks: [],
    createdAt: '2026-06-08T10:00:00Z'
  }
]
```


---


## 组件结构


### 文件清单

```
src/stores/
├── teams.js                     ← 团队 Store（localStorage）

src/components/schedule/
├── TeamCard.vue                ← 团队卡片（名称、人数、菜单）
├── TeamCreateForm.vue          ← 新建团队弹窗
├── TeamDetail.vue              ← 团队详情（任务卡片 + 成员列表）
├── TeamTaskPage.vue            ← 团队任务列表（复用个人任务组件）
├── MemberList.vue              ← 成员详情页（姓名 + 角色）
└── EmptyState.vue              ← 通用空状态（颜文字 + 文字）

⚠️ 修改文件：
├── TaskCreatePage.vue          ← 在 team 分支中添加团队功能
```


### 组件关系

```
TaskCreatePage.vue (currentView === 'team')
├── TeamList.vue (团队列表)
│   ├── TeamCard.vue (循环)
│   └── EmptyState.vue (无团队时)
├── TeamCreateForm.vue (新建团队弹窗)
├── TeamDetail.vue (团队详情)
│   ├── TaskCard.vue (任务卡片，复用)
│   └── MemberList.vue (成员列表)
└── TeamTaskPage.vue (团队任务列表，复用 TaskCard)
```



---


## 状态管理


### `src/stores/teams.js` — 团队 Store

```js
/**
 * teams.js - 团队管理 Store
 * 使用 localStorage 持久化
 * 与个人任务 Store 独立
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useScheduleStore } from './schedule.js'

const TEAMS_STORAGE_KEY = 'ziling_teams'

const DEFAULT_TEAMS = [
  {
    id: 'team_demo',
    name: '王之故乡',
    description: '智能开源硬件基础',
    slogan: '分别各自为主，合同天下无双',
    members: [
      { id: 'm1', name: '陈锦彤', role: '组长+后端' },
      { id: 'm2', name: '郭定夺', role: '宠物' },
      { id: 'm3', name: '甘乐乐', role: 'UI' },
      { id: 'm4', name: '孙子儒', role: '硬件' },
      { id: 'm5', name: '杨舒惠', role: '统筹' }
    ],
    tasks: [],
    createdAt: new Date().toISOString()
  }
]

// 从 localStorage 读取
function loadFromStorage() {
  try {
    const data = localStorage.getItem(TEAMS_STORAGE_KEY)
    return data ? JSON.parse(data) : DEFAULT_TEAMS
  } catch {
    return DEFAULT_TEAMS
  }
}

// 保存到 localStorage
function saveToStorage(teams) {
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams))
}

export const useTeamsStore = defineStore('teams', () => {
  // State
  const teams = ref(loadFromStorage())
  const showCreateForm = ref(false)
  const currentTeam = ref(null)  // 当前查看的团队
  const currentView = ref('list')  // 'list' | 'detail' | 'members' | 'tasks'

  // Getters
  const teamCount = computed(() => teams.value.length)
  
  const currentTeamTasks = computed(() => {
    if (!currentTeam.value) return []
    return currentTeam.value.tasks || []
  })

  // Actions
  function createTeam(formData) {
    const newTeam = {
      id: 'team_' + Date.now(),
      ...formData,
      members: formData.members || [],
      tasks: [],
      createdAt: new Date().toISOString()
    }
    teams.value.unshift(newTeam)
    saveToStorage(teams.value)
    return newTeam
  }

  function updateTeam(teamId, updates) {
    const index = teams.value.findIndex(t => t.id === teamId)
    if (index !== -1) {
      teams.value[index] = {
        ...teams.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToStorage(teams.value)
    }
  }

  function deleteTeam(teamId) {
    teams.value = teams.value.filter(t => t.id !== teamId)
    saveToStorage(teams.value)
  }

  function addTeamTask(teamId, taskData) {
    const team = teams.value.find(t => t.id === teamId)
    if (team) {
      const newTask = {
        id: 'team_task_' + Date.now(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString()
      }
      team.tasks.push(newTask)
      saveToStorage(teams.value)
      return newTask
    }
  }

  function syncTaskToPersonal(taskData) {
    // 将团队任务同步到个人任务
    const scheduleStore = useScheduleStore()
    scheduleStore.addTask({
      ...taskData,
      type: 'personal',
      fromTeam: currentTeam.value?.name || ''
    })
  }

  function openTeam(team) {
    currentTeam.value = team
    currentView.value = 'detail'
  }

  function closeTeam() {
    currentTeam.value = null
    currentView.value = 'list'
  }

  function openMembers() {
    currentView.value = 'members'
  }

  function openTasks() {
    currentView.value = 'tasks'
  }

  function closeDetail() {
    currentView.value = 'list'
  }

  return {
    teams,
    currentTeam,
    currentView,
    showCreateForm,
    teamCount,
    currentTeamTasks,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamTask,
    syncTaskToPersonal,
    openTeam,
    closeTeam,
    openMembers,
    openTasks,
    closeDetail
  }
})
```


---


## 核心代码（直接给执行机器人用）


### 1. `src/components/schedule/TeamCard.vue` — 团队卡片

```vue
<template>
  <div class="team-card" @click="$emit('click', team)">
    <div class="team-info">
      <h3 class="team-name">{{ team.name }}</h3>
      <p class="team-members">{{ team.members?.length || 0 }}人</p>
    </div>
    <button class="menu-btn" @click.stop="$emit('menu', team)">
      <MoreHorizontalIcon :size="20" />
    </button>
  </div>
</template>

<script setup>
import { MoreHorizontal } from 'lucide-vue-next'

const props = defineProps({
  team: { type: Object, required: true }
})

const emit = defineEmits(['click', 'menu'])
</script>

<style scoped>
.team-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zl-space-md);
  background: white;
  border-radius: var(--zl-radius-md);
  margin-bottom: var(--zl-space-sm);
  box-shadow: var(--zl-shadow-sm);
  cursor: pointer;
  transition: transform var(--zl-transition-fast);
}

.team-card:active {
  transform: scale(0.98);
}

.team-info {
  flex: 1;
  min-width: 0;
}

.team-name {
  font-size: var(--zl-font-base);
  font-weight: 500;
  color: var(--zl-text-primary);
  margin-bottom: 4px;
}

.team-members {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-secondary);
}

.menu-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--zl-text-hint);
  border-radius: 50%;
  transition: background var(--zl-transition-fast);
}

.menu-btn:hover {
  background: var(--zl-bg);
}
</style>
```


### 2. `src/components/schedule/TeamCreateForm.vue` — 新建团队弹窗

```vue
<template>
  <div class="team-form-overlay" @click.self="$emit('close')">
    <div class="team-form-modal">
      <!-- 标题栏 -->
      <div class="form-header">
        <button class="close-btn" @click="$emit('close')">×</button>
        <h3 class="form-title">新建团队</h3>
        <div class="header-spacer"></div>
      </div>
      
      <!-- 表单内容 -->
      <div class="form-body">
        <!-- 名称 -->
        <div class="form-field">
          <input 
            type="text" 
            v-model="form.name" 
            placeholder="团队名称"
            class="field-input"
          />
        </div>
        
        <!-- 备注 -->
        <div class="form-field">
          <input 
            type="text" 
            v-model="form.description" 
            placeholder="备注（可选）"
            class="field-input"
          />
        </div>
        
        <!-- 座右铭 -->
        <div class="form-field">
          <textarea 
            v-model="form.slogan" 
            placeholder="座右铭（可选）"
            class="field-textarea"
            rows="3"
          ></textarea>
        </div>
      </div>
      
      <!-- 底部按钮 -->
      <div class="form-footer">
        <button 
          class="btn-primary" 
          @click="handleSubmit"
          :disabled="!form.name"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useTeamsStore } from '@/stores/teams.js'

const emit = defineEmits(['close', 'submit'])
const store = useTeamsStore()

const form = reactive({
  name: '',
  description: '',
  slogan: ''
})

function handleSubmit() {
  if (!form.name) return
  store.createTeam({ ...form })
  emit('submit')
  emit('close')
}
</script>

<style scoped>
.team-form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--zl-space-md);
}

.team-form-modal {
  background: var(--zl-bg);
  border-radius: var(--zl-radius-lg);
  width: 100%;
  max-width: 400px;
  padding: var(--zl-space-lg);
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--zl-space-lg);
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

.form-title {
  font-size: var(--zl-font-lg);
  font-weight: 500;
  color: var(--zl-text-primary);
  flex: 1;
  text-align: center;
}

.header-spacer {
  width: 40px;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
  margin-bottom: var(--zl-space-lg);
}

.form-field {
  width: 100%;
}

.field-input,
.field-textarea {
  width: 100%;
  padding: var(--zl-space-sm) var(--zl-space-md);
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  background: white;
  transition: border-color var(--zl-transition-fast);
}

.field-input:focus,
.field-textarea:focus {
  outline: none;
  border-color: var(--zl-brand);
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-footer {
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

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}
</style>
```


### 3. `src/components/schedule/EmptyState.vue` — 通用空状态

```vue
<template>
  <div class="empty-state">
    <div class="empty-emoji">(·∀·)(·∇·)(·▿·*)</div>
    <p class="empty-text">{{ message }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: String, default: '暂无数据' }
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--zl-space-xxl) var(--zl-space-md);
}

.empty-emoji {
  font-size: 32px;
  margin-bottom: var(--zl-space-md);
  color: var(--zl-brand);
}

.empty-text {
  font-size: var(--zl-font-base);
  color: var(--zl-text-hint);
}
</style>
```


---


## 🎨 样式规范


### Design Tokens（必须使用）

| Token | 值 | 用途 |
|-------|-----|------|
| `--zl-brand` | `#87C8B4` | 品牌色（按钮、选中状态） |
| `--zl-bg` | `#FFFAF1` | 背景色 |
| `--zl-text-primary` | `#2D3436` | 主文字 |
| `--zl-text-secondary` | `#636E72` | 辅助文字 |
| `--zl-text-hint` | `#ADB5BD` | 占位文字 |
| `--zl-border` | `#E9ECEF` | 边框 |
| `--zl-radius-md` | `12px` | 圆角（卡片） |
| `--zl-radius-lg` | `20px` | 圆角（弹窗） |
| `--zl-space-sm` | `8px` | 小间距 |
| `--zl-space-md` | `16px` | 中间距 |
| `--zl-space-lg` | `24px` | 大间距 |
| `--zl-font-base` | `16px` | 基础字号 |
| `--zl-font-sm` | `14px` | 小字号 |
| `--zl-font-lg` | `20px` | 大字号 |
| `--zl-shadow-sm` | `0 2px 8px rgba(0,0,0,0.08)` | 卡片阴影 |


---


## ✅ 执行清单


### 创建文件

- [ ] 创建 `src/stores/teams.js` — 团队 Store
- [ ] 创建 `src/components/schedule/TeamCard.vue` — 团队卡片
- [ ] 创建 `src/components/schedule/TeamCreateForm.vue` — 新建团队弹窗
- [ ] 创建 `src/components/schedule/TeamDetail.vue` — 团队详情
- [ ] 创建 `src/components/schedule/TeamTaskPage.vue` — 团队任务列表
- [ ] 创建 `src/components/schedule/MemberList.vue` — 成员详情页
- [ ] 创建 `src/components/schedule/EmptyState.vue` — 通用空状态

### 修改文件

- [ ] 修改 `TaskCreatePage.vue` — 在 `currentView === 'team'` 分支添加团队功能

### 测试

- [ ] **测试：打开 /add 页面 → 切换到"团队"Tab → 显示团队列表**
- [ ] **测试：点击 + 按钮 → 打开新建团队弹窗 → 填写 → 确认 → 团队添加到列表**
- [ ] **测试：点击团队卡片 → 进入团队详情 → 显示任务卡片 + 成员列表**
- [ ] **测试：点击"成员列表" → 进入成员详情页 → 显示姓名 + 角色**
- [ ] **测试：点击"任务"卡片 → 进入团队任务列表 → 任务卡片可打卡/删除**
- [ ] **测试：任务可同步到个人任务（任务卡片添加"同步"按钮）**
- [ ] **测试：无团队时显示空状态（颜文字 + 文字）**


---


## 📤 执行完成后必须反馈的内容


**执行机器人：完成上述所有任务后，请反馈以下信息：**

1. **文件目录结构**（已创建/修改的文件列表）
2. **架构说明**（团队核心逻辑、组件通信、状态管理、与个人任务的同步）
3. **测试报告**（团队列表、新建团队、团队详情、成员详情、任务同步）


---


**提示词结束 — 执行机器人请立即开始写代码。**
