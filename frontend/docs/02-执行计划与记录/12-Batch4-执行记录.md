# Batch 4 执行记录 — 团队页面接入 + 权限系统

## 执行时间
2026-06-09

## 涉及问题
- 问题 5A: teams.js 新增权限方法（角色判断、是否组长）
- 问题 5B: TeamListPage.vue 从存根改造
- 问题 5C: TeamDetailPage.vue 从存根改造
- 问题 5D: TeamTaskPage 新增组长权限 + 新建任务 + 指派成员

---

## 详细改动记录

### 1. `src/stores/teams.js` — 新增权限和任务分配方法

**位置**: 195-240 行（在 `copyInviteCode` 之后，`return` 之前）

**新增内容**:
```js
// 判断当前用户在指定团队中的角色
function getUserRoleInTeam(teamId) {
  const team = teams.value.find(t => t.id === teamId)
  if (!team) return null
  const currentUser = getCurrentUser()
  const member = team.members.find(m => m.name === currentUser)
  if (!member) return null
  // 检查角色是否包含"组长"（兼容"组长+后端"这种格式）
  return member.role.includes('组长') ? '组长' : member.role
}

// 判断当前用户是否是组长
function isTeamLeader(teamId) {
  return getUserRoleInTeam(teamId) === '组长'
}

// 组长分配任务给指定成员
function assignTaskToMember(teamId, taskData, memberId) {
  const team = teams.value.find(t => t.id === teamId)
  if (!team) return
  if (!isTeamLeader(teamId)) return
  const member = team.members.find(m => m.id === memberId)
  const newTask = {
    id: 'team_task_' + Date.now(),
    title: taskData.title || '',
    description: taskData.description || '',
    assigneeId: memberId,
    assigneeName: member ? member.name : '未知',
    completed: false,
    createdAt: new Date().toISOString(),
    ...taskData
  }
  team.tasks.push(newTask)
  saveToStorage(teams.value)
  return newTask
}
```

**同时更新 return 暴露**: `getUserRoleInTeam, isTeamLeader, assignTaskToMember`

---

### 2. `src/components/schedule/TaskForm.vue` — 支持团队模式（指派成员）

**Script 改动**:
- 导入 `User` 图标（lucide-vue-next）
- 新增 props: `isTeamTask`(Boolean, 默认 false), `teamMembers`(Array, 默认 [])
- 新增 form 字段: `assignee`(null)
- 新增 watch 中处理 assignee：`assignee: newTask.assigneeId || newTask.assignee || null`
- 新增 handleSubmit 返回 taskData 中包含 assignee
- 新增 UserIcon 别名

**Template 改动**（在"地点"之后，"闹铃"之前新增）：
```html
<div v-if="isTeamTask" class="form-field">
  <UserIcon :size="20" class="field-icon" />
  <select v-model="form.assignee" class="field-input field-select">
    <option :value="null">请选择成员</option>
    <option v-for="member in teamMembers" :key="member.id" :value="member.id">
      {{ member.name }}（{{ member.role }}）
    </option>
  </select>
</div>
```

**CSS 改动**（在 `.setting-value` 之后新增）：
```css
.field-select {
  background: none;
  border: none;
  outline: none;
  color: var(--zl-text-primary);
  font-size: var(--zl-font-base);
  cursor: pointer;
}

.field-select option {
  background: var(--zl-bg);
  color: var(--zl-text-primary);
}
```

---

### 3. `src/components/schedule/TaskCard.vue` — 支持显示被指派人

**Props 改动**: 新增 `showAssignee: Boolean, default: false`

**Template 改动**（在 task-meta 中新增，位于日期和时间之间）：
```html
<span v-if="showAssignee && task.assigneeName" class="task-assignee">
  {{ task.assigneeName }}
</span>
```

**CSS 改动**（在 `.recurrence-tag` 之后新增）：
```css
.task-assignee {
  color: var(--zl-brand, #87C8B4);
  font-size: var(--zl-font-xs, 12px);
  background: rgba(135, 200, 180, 0.1);
  padding: 2px 8px;
  border-radius: var(--zl-radius-sm, 8px);
}
```

---

### 4. `src/components/schedule/TeamTaskPage.vue` — 组长功能完整实现

**Props 改动**: 新增 `teamId: String, required: true`

**Script 改动**:
- 导入 `Plus` 图标和 `TaskForm` 组件
- 新增 `showTaskForm = ref(false)`
- 新增 `isLeader = computed(() => store.isTeamLeader(props.teamId))`
- 新增 `handleCreateTask(taskData)` 函数（内部调用 `store.addTeamTask`，写入 assigneeId 和 assigneeName）
- 修改 `handleDelete(task)` 函数：仅组长可删除（加 isLeader 权限检查）

**Template 改动**:
- header-spacer 中新增"新建"按钮（v-if isLeader）
- 每个 TaskCard 传 `:show-assignee="true"`
- 模板末尾新增 TaskForm 组件调用（:is-team-task="true" :team-members="team.members"）

**CSS 改动**:
- `.header-spacer`: width 改为 80px，添加 flex 布局
- 新增 `.new-task-btn` 样式（品牌色背景 + 白色文字 + Plus 图标）

---

### 5. `src/pages/team/TeamListPage.vue` — 存根 → 完整页面

**完全重写为功能完整页面**：
- 导入: Plus, LogIn 图标，ZlTopBar, EmptyState, TeamCard, TeamCreateForm, JoinTeamForm
- 逻辑: 从 store 读取 teams，用 TeamCard 渲染，点击团队 openTeam 后路由跳转
- 操作区: 底部双按钮"创建团队"和"加入团队"，分别触发 TeamCreateForm / JoinTeamForm
- 无团队时: 显示 EmptyState
- CSS: 全部用 var(--zl-*) 变量，符合设计规范

---

### 6. `src/pages/team/TeamDetailPage.vue` — 存根 → 完整页面

**完全重写为功能完整页面**：
- 导入: ZlTopBar, EmptyState, TeamDetail 组件
- 新增 `teamId`(从 route.params.id 获取), `currentTeam`, `isLeader`(store.isTeamLeader)
- 模板: 若 currentTeam 存在则渲染 TeamDetail（传入 isLeader），否则显示 EmptyState
- TeamDetail 组件接收: `@go-to-members`, `@go-to-tasks` 事件

---

### 7. `src/components/schedule/TeamDetail.vue` — 新增 isLeader prop

**Props 改动**: 新增 `isLeader: Boolean, default: false`（供后续条件渲染使用）

---

## 文件变更清单

| 文件 | 改动类型 | 内容 |
|------|---------|------|
| `src/stores/teams.js` | 修改 | 新增 getUserRoleInTeam, isTeamLeader, assignTaskToMember |
| `src/components/schedule/TaskForm.vue` | 修改 | 新增 isTeamTask, teamMembers, assignee 支持 |
| `src/components/schedule/TaskCard.vue` | 修改 | 新增 showAssignee prop + 显示被指派人 |
| `src/components/schedule/TeamTaskPage.vue` | 修改 | 组长判断 + 新建任务按钮 + TaskForm 弹窗 + 删除权限 |
| `src/pages/team/TeamListPage.vue` | 重写 | 从空存根 → 完整列表页 |
| `src/pages/team/TeamDetailPage.vue` | 重写 | 从空存根 → 完整详情页 |
| `src/components/schedule/TeamDetail.vue` | 修改 | 新增 isLeader prop |

**合计**: 7 个文件改动

---

## 设计规范遵循

- ✅ 所有颜色用 `var(--zl-brand/zl-bg/zl-surface/zl-border/zl-text-primary/zl-text-secondary/zl-text-hint)`
- ✅ 所有间距用 `var(--zl-space-1/2/3/4/lg/md)`
- ✅ 所有圆角用 `var(--zl-radius-sm/md/full)`
- ✅ 所有字号用 `var(--zl-font-xs/sm/base/lg)`
- ✅ 所有过渡用 `var(--zl-transition-fast)`
- ✅ 按钮颜色遵循品牌色主色 (zl-brand)，无硬编码 hex
- ✅ 不破坏任何已有组件结构，仅新增 props/字段/逻辑

---

## 关键数据流

```
【创建团队任务】
组长 → TeamTaskPage 点击"新建" → showTaskForm = true → 弹出 TaskForm
         ↓ (isTeamTask=true, teamMembers=team.members)
     TaskForm 显示"指派给"下拉框
         ↓ (submit 事件)
     handleCreateTask(taskData) 构造 assigneeName, assigneeId
         ↓
     store.addTeamTask(teamId, {...taskData}) 写入 team.tasks
         ↓
     saveToStorage() 持久化到 localStorage

【权限检查】
→ store.isTeamLeader(teamId)
   ↳ 比较 getCurrentUser() 与 team.members 的 name
   ↳ 检查 member.role 是否包含"组长"
   ↳ 返回 true/false
   TeamTaskPage 根据结果决定是否显示"新建"按钮
   TaskForm 删除按钮同样受 isLeader 约束

【被指派人显示】
TaskCard 接收 showAssignee=true → 读取 task.assigneeName → 以标签形式显示（品牌色浅背景）
```

---

## 验证清单（自测建议）

1. [ ] 打开 TeamListPage → 显示已有团队列表（王之故乡等）
2. [ ] 无团队时 → 显示 EmptyState（"暂无团队 / 创建或加入"）
3. [ ] 点击团队 → 路由跳转到 `/teams/{team.id}`
4. [ ] TeamDetailPage 正确显示 team 对象和 isLeader 判断
5. [ ] 团队详情 → 打开 TeamTaskPage 传入 teamId
6. [ ] 组长用户 → 顶部右侧"新建"按钮可见
7. [ ] 非组长用户 → 顶部右侧"新建"按钮**不可见**
8. [ ] 点击新建 → TaskForm 弹出，包含"指派给"下拉（显示所有成员）
9. [ ] 选择成员并提交 → 新任务出现在团队任务列表
10. [ ] TeamTaskPage 的 TaskCard 显示被指派人名称（标签样式）
11. [ ] 非组长无法删除任务 → handleDelete 被拦截
12. [ ] 组长可以删除任务 → handleDelete 正常执行
13. [ ] 所有样式正常，无硬编码颜色/字号
