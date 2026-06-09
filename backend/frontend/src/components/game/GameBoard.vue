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
