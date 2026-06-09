<template>
  <div class="task-form-overlay" @click.self="$emit('close')">
    <ZlToast 
      :visible="toastVisible" 
      :message="toastMessage" 
      :type="toastType"
      @update:visible="toastVisible = $event"
    />
    <div class="task-form-modal">
      <!-- 标题栏：× | 标题 | 删除 + 复选框 -->
      <div class="form-header">
        <button class="header-btn close-btn" @click="$emit('close')">
          <ZlIcon name="X" :size="24" />
        </button>
        <h3 class="form-title">{{ form.title || '新建任务' }}</h3>
        <div class="header-actions">
          <span v-if="isEditing" class="delete-text" @click="$emit('delete', form.id)">删除</span>
          <div v-if="isEditing" class="header-checkbox" :class="{ checked: form.completed }" @click="toggleComplete">
            <ZlIcon v-if="form.completed" name="Check" :size="14" />
          </div>
        </div>
      </div>

      <!-- 表单内容 -->
      <div class="form-body">
        <!-- 任务标题 -->
        <div class="form-field">
          <ZlIcon name="FileText" :size="20" class="field-icon" />
          <input
            type="text"
            v-model="form.title"
            placeholder="输入任务标题"
            class="field-input"
            autofocus
          />
        </div>
        
        <!-- 日期 -->
        <div class="form-field">
          <ZlIcon name="Calendar" :size="20" class="field-icon" />
          <input
            type="date"
            v-model="form.date"
            class="field-input"
          />
        </div>

        <!-- 时间（并排） -->
        <div class="form-row">
          <div class="form-field">
            <ZlIcon name="Clock" :size="20" class="field-icon" />
            <input
              type="time"
              v-model="form.startTime"
              class="field-input"
            />
          </div>
          <div class="form-field">
            <ZlIcon name="Clock" :size="20" class="field-icon" />
            <input
              type="time"
              v-model="form.endTime"
              class="field-input"
            />
          </div>
        </div>

        <!-- 备注 -->
        <div class="form-field">
          <ZlIcon name="FileText" :size="20" class="field-icon" />
          <input
            type="text"
            v-model="form.note"
            placeholder="添加备注"
            class="field-input"
          />
        </div>

        <!-- 地点 -->
        <div class="form-field">
          <ZlIcon name="MapPin" :size="20" class="field-icon" />
          <input
            type="text"
            v-model="form.location"
            placeholder="添加地点"
            class="field-input"
          />
        </div>

        <!-- 指派给（仅团队任务显示） -->
        <div v-if="isTeamTask" class="form-field">
          <ZlIcon name="User" :size="20" class="field-icon" />
          <select v-model="form.assignee" class="field-input field-select">
            <option :value="null">请选择成员</option>
            <option
              v-for="member in teamMembers"
              :key="member.id"
              :value="member.id"
            >
              {{ member.name }}（{{ member.role }}）
            </option>
          </select>
        </div>

        <!-- 闹铃 -->
        <div class="form-field alarm-field">
          <div class="alarm-left">
            <ZlIcon name="Bell" :size="20" class="field-icon" />
            <span class="field-label">闹铃</span>
          </div>
          <ToggleSwitch v-model="form.alarmEnabled" />
        </div>

        <!-- 闹钟设置区（alarmEnabled = true 时展开） -->
        <div v-if="form.alarmEnabled" class="alarm-settings">
          <!-- 铃声选择 -->
          <div class="alarm-setting-row" @click="showRingtonePicker = true">
            <div class="alarm-setting-left">
              <ZlIcon name="Music" :size="20" class="field-icon" />
              <span class="field-label">铃声</span>
            </div>
            <div class="alarm-setting-right">
              <span class="file-name">{{ form.ringtoneFile.replace('.mp3', '') }}</span>
              <ZlIcon name="ChevronRight" :size="16" class="chevron-icon" />
            </div>
          </div>

          <!-- 振动 -->
          <div class="alarm-setting-row">
            <div class="alarm-setting-left">
              <ZlIcon name="Smartphone" :size="20" class="field-icon" />
              <span class="field-label">振动</span>
            </div>
            <ToggleSwitch v-model="form.vibrate" />
          </div>

          <!-- 重复 -->
          <div class="alarm-setting-row" @click="showRecurrencePicker = true">
            <div class="alarm-setting-left">
              <ZlIcon name="Repeat" :size="20" class="field-icon" />
              <span class="field-label">重复</span>
            </div>
            <div class="alarm-setting-right">
              <span class="setting-value">{{ recurrenceLabel }}</span>
              <ZlIcon name="ChevronRight" :size="16" class="chevron-icon" />
            </div>
          </div>

          <!-- 响后删除 -->
          <div class="alarm-setting-row">
            <div class="alarm-setting-left">
              <ZlIcon name="Trash2" :size="20" class="field-icon" />
              <span class="field-label">响后删除</span>
            </div>
            <ToggleSwitch v-model="form.deleteAfterRing" />
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="form-footer">
        <button
          v-if="isEditing && !form.completed"
          class="zl-btn zl-btn--lg zl-btn--primary"
          style="width: 100%;"
          @click="$emit('checkin', form)"
        >
          前往打卡
        </button>
        <button
          v-else
          class="zl-btn zl-btn--lg zl-btn--primary"
          style="width: 100%;"
          @click="handleSubmit"
        >
          {{ isEditing ? '保存' : '确认' }}
        </button>
      </div>
    </div>

    <!-- 铃声选择弹窗 -->
    <RingtonePickerSheet
      v-if="showRingtonePicker"
      v-model="form.ringtoneFile"
      @close="showRingtonePicker = false"
    />

    <!-- 重复选择弹窗 -->
    <RecurrencePickerSheet
      v-if="showRecurrencePicker"
      v-model="form.recurrence"
      :repeat-alarm="form.repeatAlarm"
      :show="true"
      @update:repeat-alarm="form.repeatAlarm = $event"
      @close="showRecurrencePicker = false"
    />
  </div>
</template>

<script setup>
import { reactive, computed, watch, ref } from 'vue'
import ZlIcon from '@/components/common/ZlIcon.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import RingtonePickerSheet from '../notifications/RingtonPickerSheet.vue'
import RecurrencePickerSheet from './RecurrencePickerSheet.vue'
import ZlToast from '../common/ZlToast.vue'

const props = defineProps({
  task: { type: Object, default: null },
  isTeamTask: { type: Boolean, default: false },
  teamMembers: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'submit', 'delete', 'checkin'])

// 弹窗状态
const showRingtonePicker = ref(false)
const showRecurrencePicker = ref(false)

const isEditing = computed(() => !!props.task)
const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref('error')

const form = reactive({
  id: '',
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  note: '',
  location: '',
  alarmEnabled: false,
  ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
  vibrate: true,
  repeatAlarm: true,
  recurrence: null,
  deleteAfterRing: false,
  completed: false,
  assignee: null
})

// 重复标签显示
const recurrenceLabel = computed(() => {
  if (!form.recurrence) {
    return '仅一次'
  }
  if (form.recurrence === 'daily') {
    return '每天'
  }
  if (form.recurrence === 'weekdays') {
    return '工作日'
  }
  if (form.recurrence.startsWith('weekly:')) {
    const days = form.recurrence.replace('weekly:', '').split(',').map(Number)
    const dayLabels = ['日', '一', '二', '三', '四', '五', '六']
    const selectedLabels = days.map(d => '周' + dayLabels[d]).join(',')
    return selectedLabels
  }
  return '仅一次'
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    Object.assign(form, {
      id: newTask.id || '',
      title: newTask.title || '',
      date: newTask.date || '',
      startTime: newTask.startTime || '',
      endTime: newTask.endTime || '',
      note: newTask.note || '',
      location: newTask.location || '',
      alarmEnabled: newTask.alarmEnabled || false,
      // 新增闹钟字段（含迁移默认值）
      ringtoneFile: newTask.ringtoneFile || 'facetalk_ringtone_incoming_default.mp3',
      vibrate: newTask.vibrate !== undefined ? newTask.vibrate : true,
      repeatAlarm: newTask.repeatAlarm !== undefined ? newTask.repeatAlarm : true,
      recurrence: newTask.recurrence !== undefined ? newTask.recurrence : null,
      deleteAfterRing: newTask.deleteAfterRing !== undefined ? newTask.deleteAfterRing : false,
      completed: newTask.completed || false,
      assignee: newTask.assigneeId || newTask.assignee || null
    })
  } else {
    Object.assign(form, {
      id: '',
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      note: '',
      location: '',
      alarmEnabled: false,
      ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
      vibrate: true,
      repeatAlarm: true,
      recurrence: null,
      deleteAfterRing: false,
      completed: false,
      assignee: null
    })
  }
}, { immediate: true })

function toggleComplete() {
  form.completed = !form.completed
}

function showToast(message, type = 'error') {
  toastMessage.value = message
  toastType.value = type
  toastVisible.value = true
}

function handleSubmit() {
  const title = form.title?.trim()
  if (!title) {
    showToast('请输入任务标题', 'warning')
    return
  }
  const data = {
    title,
    date: form.date,
    startTime: form.startTime,
    endTime: form.endTime,
    note: form.note,
    location: form.location,
    alarmEnabled: form.alarmEnabled,
    ringtoneFile: form.ringtoneFile,
    vibrate: form.vibrate,
    repeatAlarm: form.repeatAlarm,
    recurrence: form.recurrence,
    deleteAfterRing: form.deleteAfterRing,
    completed: form.completed,
    assignee: form.assignee
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
  background: var(--zl-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--zl-space-4);
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
  padding: var(--zl-space-4) var(--zl-space-4) var(--zl-space-3);
}

.header-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--zl-text-secondary);
  cursor: pointer;
  border-radius: var(--zl-radius-full);
  transition: background var(--zl-transition-fast);
}

.header-btn:active {
  background: var(--zl-border);
}

.form-title {
  font-size: var(--zl-font-lg);
  font-weight: var(--zl-weight-medium);
  color: var(--zl-text-primary);
  flex: 1;
  text-align: center;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2);
  min-width: 44px;
  justify-content: flex-end;
}

.delete-text {
  font-size: var(--zl-font-sm);
  color: var(--zl-error);
  cursor: pointer;
}

.header-checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid var(--zl-border);
  border-radius: var(--zl-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  color: white;
  transition: all var(--zl-transition-fast);
}

.header-checkbox.checked {
  background: var(--zl-brand);
  border-color: var(--zl-brand);
}

.form-body {
  padding: var(--zl-space-3) var(--zl-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-3);
}

.form-row {
  display: flex;
  gap: var(--zl-space-3);
}

.form-row .form-field {
  flex: 1;
}

.form-field {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2);
  padding: 0 var(--zl-space-3);
  height: var(--zl-input-height-lg);
  background: var(--zl-surface);
  border-radius: var(--zl-radius-md);
  border: 1px solid var(--zl-border);
  transition: border-color var(--zl-transition-fast);
}

.form-field:focus-within {
  border-color: var(--zl-brand);
}

.field-icon {
  color: var(--zl-text-hint);
  flex-shrink: 0;
}

.field-input {
  flex: 1;
  border: none;
  background: none;
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  outline: none;
  height: 100%;
  width: 100%;
}

.field-input::placeholder {
  color: var(--zl-text-hint);
}

.alarm-field {
  justify-content: space-between;
  border: none;
  background: transparent;
  padding: 0;
  height: auto;
}

.alarm-left {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2);
}

.field-label {
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
}

.form-footer {
  padding: var(--zl-space-4);
  display: flex;
  justify-content: center;
}

/* ===== 闹钟设置区 ===== */
.alarm-settings {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-2);
  padding: var(--zl-space-2) 0;
}

.alarm-setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--zl-space-3);
  height: var(--zl-input-height-lg);
  background: var(--zl-surface);
  border-radius: var(--zl-radius-md);
  border: 1px solid var(--zl-border);
  cursor: pointer;
  transition: border-color var(--zl-transition-fast);
}

.alarm-setting-row:active {
  border-color: var(--zl-brand);
}

.alarm-setting-left {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2);
}

.alarm-setting-right {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2);
}

.file-name {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-secondary);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron-icon {
  color: var(--zl-text-hint);
  flex-shrink: 0;
}

.setting-value {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
}

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
</style>
