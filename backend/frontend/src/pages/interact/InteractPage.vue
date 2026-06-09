<template>
  <div class="interact-page">
    <!-- 状态栏占位 -->
    <div class="status-bar-placeholder" style="height: 44px;"></div>

    <!-- 游戏标题 -->
    <div class="game-title">
      <span class="title-icon">🐾</span>
      <span class="title-text">汉字消消乐</span>
    </div>

    <!-- 分数/时间/操作信息栏（四列均匀分布：分数 | 时间 | 开始 | 重置） -->
    <div class="game-info">
      <div class="info-item">
        <span class="info-label">分数</span>
        <span class="info-value">{{ score }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">时间</span>
        <span class="info-value">{{ formatTime(time) }}</span>
      </div>
      <div class="info-item">
        <button
          class="info-btn primary"
          @click="startGame"
          aria-label="开始或暂停"
        >
          <component :is="isPlaying ? Pause : Play" :size="20" class="btn-icon" />
        </button>
      </div>
      <div class="info-item">
        <button
          class="info-btn secondary"
          @click="resetGame"
          aria-label="重置"
        >
          <RotateCcw :size="20" class="btn-icon" />
        </button>
      </div>
    </div>

    <!-- 游戏网格（始终显示，开始/重置按钮控制重开 + 计时） -->
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

<!-- 单独设置组件名（供 keep-alive 识别） -->
<script>
export default {
  name: 'InteractPage'
}
</script>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated, nextTick } from 'vue'
import { Play, Pause, RotateCcw } from 'lucide-vue-next'
import GameBoard from '@/components/game/GameBoard.vue'
import GameComplete from '@/components/game/GameComplete.vue'

const score = ref(0)
const time = ref(0)
const showComplete = ref(false)
const gameBoardRef = ref(null)
const isPlaying = ref(false)
const isInitialized = ref(false)
let timer = null

function onScoreChange(newScore) {
  score.value = newScore
}

function onGameComplete(finalScore, finalTime) {
  showComplete.value = true
  isPlaying.value = false
  isInitialized.value = false // 通关后视为新的一局：下次点开始=清零+重开+启动计时
  stopTimer()
}

// 开始/暂停/继续：根据当前状态切换
function startGame() {
  if (!isInitialized.value) {
    // 首次开始：清零分数 + 重置棋盘 + 启动计时器
    showComplete.value = false
    score.value = 0
    time.value = 0
    isInitialized.value = true
    isPlaying.value = true
    nextTick(() => {
      if (gameBoardRef.value) gameBoardRef.value.restart()
      startTimer()
    })
  } else if (isPlaying.value) {
    // 正在播放：暂停
    isPlaying.value = false
    stopTimer()
  } else {
    // 已暂停：继续播放
    isPlaying.value = true
    startTimer()
  }
}

// 重置：清零 + 重开棋盘 + 清除计时器
function resetGame() {
  showComplete.value = false
  score.value = 0
  time.value = 0
  isPlaying.value = false
  isInitialized.value = false
  stopTimer()
  nextTick(() => {
    if (gameBoardRef.value) gameBoardRef.value.restart()
  })
}

// 通关弹窗的"再玩一局"
function restartGame() {
  startGame()
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function startTimer() {
  timer = setInterval(() => { time.value++ }, 1000)
}

function stopTimer() {
  if (timer) { clearInterval(timer); timer = null }
}

onMounted(() => {
  // 不做任何事：让 GameBoard 自己的 onMounted 生成首次字符
  // 只在用户点"开始"时才清零+重开+启动计时
})

onUnmounted(() => {
  stopTimer()
})

onDeactivated(() => {
  // 可选：离开页面时暂停计时
  // stopTimer()
})

onActivated(() => {
  // 可选：回到页面时恢复计时
  // if (!timer) startTimer()
})
</script>

<style scoped>
.interact-page {
  min-height: 100vh;
  background: var(--zl-bg);
  padding: var(--zl-space-md);
  display: flex;
  flex-direction: column;
}

.game-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--zl-space-sm);
  margin-bottom: var(--zl-space-md);
}

.title-icon {
  font-size: 28px;
}

.title-text {
  font-size: var(--zl-font-lg);
  font-weight: var(--zl-weight-medium);
  color: var(--zl-text-primary);
}

.game-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--zl-space-sm);
  margin-bottom: var(--zl-space-md);
  padding: var(--zl-space-sm) var(--zl-space-md);
  background: var(--zl-bg-cool);
  border-radius: var(--zl-radius-md);
}

.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 0;
}

.info-label {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
}

.info-value {
  font-size: var(--zl-font-lg);
  font-weight: var(--zl-weight-medium);
  color: var(--zl-brand);
}

/* 操作按钮：最小点击区 44x44（手指友好） */
.info-btn {
  min-width: 44px;
  min-height: 44px;
  padding: 0 var(--zl-space-md);
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-medium);
  cursor: pointer;
  transition: opacity var(--zl-transition-fast);
  border: 1px solid transparent;
}

.info-btn:active {
  opacity: 0.8;
}

.info-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.info-btn.primary {
  background: var(--zl-brand);
  color: #FFFFFF;
  border-color: var(--zl-brand);
}

.info-btn.primary .btn-icon {
  color: #FFFFFF;
}

.info-btn.secondary {
  background: transparent;
  color: var(--zl-brand);
  border-color: var(--zl-brand);
}

.info-btn.secondary .btn-icon {
  color: var(--zl-brand);
}
</style>
