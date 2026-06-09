<template>
  <div
    class="game-cell"
    :class="{
      'is-active': cell.active,
      'is-cleared': cell.cleared,
      'ink-burst': animType === 'clear',
      'shake': animType === 'mismatch',
    }"
    @click="$emit('tap', cell.row, cell.col)"
  >
    <span class="cell-char" v-if="!cell.cleared">{{ cell.char }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  cell: { type: Object, required: true },
});

const emit = defineEmits(['tap']);
const animType = ref('');

// 监听 cell 变化，触发动效
watch(() => props.cell.cleared, (cleared) => {
  if (cleared) {
    animType.value = 'clear';
    setTimeout(() => { animType.value = ''; }, 300);
  }
});

watch(() => props.cell.active, (active) => {
  if (!active && props.cell.cleared === false) {
    // 取消选中时不触发动效
  }
});
</script>

<style scoped>
.game-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  background: var(--zl-cell-bg, rgba(127,127,127,0.10));
  border: var(--zl-cell-border, 1px solid rgba(127,127,127,0.25));
  border-radius: var(--zl-radius-md, 12px);
  cursor: pointer;
  transition: transform 0.1s;
  font-size: var(--zl-cell-font-size, min(6vw, 26px));
  font-family: 'ZicodoFont', '阿里巴巴普惠体', sans-serif;
  color: var(--zl-brand, #87C8B4);
  user-select: none;
}

.game-cell.is-active {
  box-shadow: var(--zl-cell-active-ring, 0 0 0 2px var(--zl-brand) inset);
  transform: scale(var(--zl-cell-active-scale, 1.06));
}

.game-cell.is-cleared {
  visibility: hidden;
}

/* 墨色溢出动效 */
.game-cell.ink-burst {
  animation: inkBurst 0.3s ease-out;
}

@keyframes inkBurst {
  0%   { transform: scale(1); opacity: 1; }
  50%  { transform: scale(1.2); opacity: 0.5; }
  100% { transform: scale(0); opacity: 0; }
}

/* 抖动动效 */
.game-cell.shake {
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-4px); }
  40%      { transform: translateX(4px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(4px); }
}
</style>
