<template>
  <div class="timer-overlay" @click.self="$emit('close')">
    <div class="timer-content">
      <!-- 头部 -->
      <div class="timer-header">
        <button class="close-btn" @click="$emit('close')">
        <ZlIcon name="X" :size="24" />
      </button>
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
          <span class="timer-duration" v-if="plannedDuration > 0">{{ plannedDuration }} min</span>
          <span class="timer-duration" v-else>进行中</span>
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
import ZlIcon from '@/components/common/ZlIcon.vue'

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
  if (!props.task?.startTime || !props.task?.endTime) return 0
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
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--zl-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--zl-radius-full);
  transition: background var(--zl-transition-fast);
}

.close-btn:active {
  background: var(--zl-border);
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
  width: var(--zl-timer-size);
  height: var(--zl-timer-size);
  margin: 0 auto var(--zl-space-8);
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring-bg {
  fill: none;
  stroke: var(--zl-border);
  stroke-width: 8;
}

.progress-ring-fill {
  fill: none;
  stroke: var(--zl-brand);
  stroke-width: 8;
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
