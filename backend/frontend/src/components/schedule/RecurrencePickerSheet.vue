<script setup>
import { ref, computed, watch } from 'vue'
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  repeatAlarm: {
    type: Boolean,
    default: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'update:repeatAlarm', 'close'])

const recurrenceOptions = [
  { value: null, label: '仅一次' },
  { value: 'daily', label: '每天' },
  { value: 'weekdays', label: '工作日（周一至周五）' },
  { value: 'weekly', label: '每周' }
]

const weekDays = [
  { value: 1, label: '一' },
  { value: 2, label: '二' },
  { value: 3, label: '三' },
  { value: 4, label: '四' },
  { value: 5, label: '五' },
  { value: 6, label: '六' },
  { value: 0, label: '日' }
]

const localRecurrence = ref(props.modelValue)
const localRepeatAlarm = ref(props.repeatAlarm)
const selectedWeekDays = ref([])

// Watch and initialize selected week days
watch(() => props.modelValue, (newVal) => {
  localRecurrence.value = newVal
  if (newVal && newVal.startsWith('weekly:')) {
    selectedWeekDays.value = newVal.replace('weekly:', '').split(',').map(Number)
  } else {
    selectedWeekDays.value = []
  }
}, { immediate: true })

watch(() => props.repeatAlarm, (newVal) => {
  localRepeatAlarm.value = newVal
}, { immediate: true })

const handleSelect = (option) => {
  if (option.value === 'weekly') {
    // 选中"每周"但不立即关闭，让用户选择周几
    localRecurrence.value = 'weekly'
  } else {
    localRecurrence.value = option.value
    handleConfirm()
  }
}

const toggleWeekDay = (dayValue) => {
  const index = selectedWeekDays.value.indexOf(dayValue)
  if (index > -1) {
    selectedWeekDays.value.splice(index, 1)
  } else {
    selectedWeekDays.value.push(dayValue)
  }
}

const handleConfirm = () => {
  let finalRecurrence = localRecurrence.value
  
  if (finalRecurrence === 'weekly' && selectedWeekDays.value.length > 0) {
    finalRecurrence = 'weekly:' + selectedWeekDays.value.sort().join(',')
  } else if (finalRecurrence === 'weekly' && selectedWeekDays.value.length === 0) {
    finalRecurrence = null // 未选择周几时，默认为不重复
  }
  
  emit('update:modelValue', finalRecurrence)
  emit('update:repeatAlarm', localRepeatAlarm.value)
  emit('close')
}

const handleClose = () => {
  emit('close')
}

const isOptionSelected = (option) => {
  if (option.value === null) {
    return localRecurrence.value === null
  }
  if (option.value === 'weekly') {
    return localRecurrence.value === 'weekly' || 
           (localRecurrence.value && localRecurrence.value.startsWith('weekly:'))
  }
  return localRecurrence.value === option.value
}

const isWeekDaySelected = (dayValue) => {
  return selectedWeekDays.value.includes(dayValue)
}
</script>

<template>
  <div v-if="show" class="recurrence-picker-overlay" @click.self="handleClose">
    <div class="recurrence-picker-sheet">
      <div class="sheet-header">
        <button class="sheet-close-btn" @click="handleClose">
          <ZlIcon name="X" :size="20" color="var(--zl-text-secondary)" />
        </button>
        <h3 class="sheet-title">重复</h3>
        <button class="sheet-confirm-btn" @click="handleConfirm">
          <ZlIcon name="Check" :size="20" color="var(--zl-brand)" />
        </button>
      </div>
      
      <div class="sheet-content">
        <div class="recurrence-options">
          <div
            v-for="option in recurrenceOptions"
            :key="option.value || 'none'"
            class="recurrence-option"
            :class="{ 'recurrence-option--selected': isOptionSelected(option) }"
            @click="handleSelect(option)"
          >
            <span class="option-label">{{ option.label }}</span>
            <div v-if="isOptionSelected(option)" class="option-check">
              <ZlIcon name="Check" :size="16" color="var(--zl-brand)" />
            </div>
          </div>
        </div>
        
        <!-- 周选择 -->
        <div v-if="localRecurrence === 'weekly' || (localRecurrence && localRecurrence.startsWith('weekly:'))" class="week-selector">
          <p class="week-selector-label">选择星期：</p>
          <div class="week-days">
            <div
              v-for="day in weekDays"
              :key="day.value"
              class="week-day"
              :class="{ 'week-day--selected': isWeekDaySelected(day.value) }"
              @click="toggleWeekDay(day.value)"
            >
              {{ day.label }}
            </div>
          </div>
        </div>
        
        <!-- 重复提醒 -->
        <div class="alarm-toggle">
          <span class="alarm-label">重复时提醒</span>
          <button
            class="alarm-switch"
            :class="{ 'alarm-switch--on': localRepeatAlarm }"
            @click="localRepeatAlarm = !localRepeatAlarm"
          >
            <span class="alarm-switch-thumb"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recurrence-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--zl-overlay);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.recurrence-picker-sheet {
  width: 100%;
  max-width: 430px;
  background-color: var(--zl-bg);
  border-radius: var(--zl-radius-lg) var(--zl-radius-lg) 0 0;
  padding: var(--zl-space-lg);
  padding-bottom: calc(var(--zl-space-xl) + env(safe-area-inset-bottom));
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--zl-space-lg);
}

.sheet-title {
  font-size: var(--zl-font-lg);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0;
}

.sheet-close-btn,
.sheet-confirm-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--zl-radius-full);
  transition: background-color var(--zl-transition-fast);
}

.sheet-close-btn:hover,
.sheet-confirm-btn:hover {
  background-color: var(--zl-surface);
}

.sheet-content {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-lg);
}

.recurrence-options {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-sm);
}

.recurrence-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--zl-space-md);
  background-color: var(--zl-surface);
  border-radius: var(--zl-radius-md);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.recurrence-option:hover {
  background-color: var(--zl-bg-cool);
}

.recurrence-option--selected {
  background-color: var(--zl-brand-tint);
}

.option-label {
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
}

.option-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.week-selector {
  margin-top: var(--zl-space-sm);
}

.week-selector-label {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  margin: 0 0 var(--zl-space-md) 0;
}

.week-days {
  display: flex;
  gap: var(--zl-space-sm);
}

.week-day {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--zl-surface);
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.week-day:hover {
  background-color: var(--zl-bg-cool);
}

.week-day--selected {
  background-color: var(--zl-brand);
  color: var(--zl-text-secondary);
}

.alarm-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--zl-space-md);
  border-top: 1px solid var(--zl-border);
}

.alarm-label {
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
}

.alarm-switch {
  width: 52px;
  height: 32px;
  background-color: var(--zl-border);
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  border: none;
  transition: background-color var(--zl-transition-fast);
}

.alarm-switch--on {
  background-color: var(--zl-brand);
}

.alarm-switch-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--zl-shadow-sm);
  transition: transform var(--zl-transition-fast);
}

.alarm-switch--on .alarm-switch-thumb {
  transform: translateX(20px);
}
</style>
