<template>
  <div class="ringtone-picker-overlay" @click.self="$emit('close')">
    <div class="ringtone-picker-sheet">
      <div class="sheet-header">
        <span class="sheet-title">选择闹钟铃声</span>
        <button class="sheet-confirm" @click="$emit('close')">确认</button>
      </div>
      <div class="sheet-body">
        <div
          v-for="file in alarmFiles"
          :key="file"
          class="ringtone-item"
          :class="{ 'is-active': modelValue === file }"
          @click="selectRingtone(file)"
        >
          <span class="ringtone-name">{{ file.replace('.mp3', '') }}</span>
          <button class="preview-btn" @click.stop="previewPlay(file)">▶ 预览</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 直接使用文件名列表，无映射
const alarmFiles = [
  'facetalk_ringtone_incoming_default.mp3',
  'facetalk_ringtone_incoming_violin.mp3',
  'facetalk_ringtone_outgoing_default.mp3',
  'facetalk_ringtone_outgoing_violin.mp3',
  'voicetalk_ringtone_incoming_default.mp3',
  'voicetalk_ringtone_incoming_piano.mp3'
]

const props = defineProps({
  modelValue: String // 当前选中的文件名
})

const emit = defineEmits(['update:modelValue', 'close'])

const previewAudio = ref(null)

const selectRingtone = (file) => {
  emit('update:modelValue', file)
}

const previewPlay = (file) => {
  if (previewAudio.value) {
    previewAudio.value.pause()
  }
  previewAudio.value = new Audio(`/ringtones/alarm/${file}`)
  previewAudio.value.play().catch(err => console.warn('音频预览失败:', err))
}
</script>

<style scoped>
.ringtone-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.ringtone-picker-sheet {
  width: 100%;
  max-width: 430px;
  background: var(--zl-bg-primary, #FFFAF1);
  border-radius: var(--zl-radius-lg, 16px) var(--zl-radius-lg, 16px) 0 0;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--zl-shadow-lg, 0 -4px 20px rgba(0,0,0,0.15));
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--zl-space-md, 16px);
  border-bottom: 1px solid var(--zl-border-light, #E8D8C8);
}

.sheet-title {
  font-size: var(--zl-font-lg, 18px);
  font-weight: 600;
  color: var(--zl-text-primary, #2C1810);
}

.sheet-confirm {
  background: var(--zl-primary, #87C8B4);
  color: white;
  border: none;
  border-radius: var(--zl-radius-md, 8px);
  padding: var(--zl-space-xs, 4px) var(--zl-space-md, 16px);
  font-size: var(--zl-font-sm, 14px);
  cursor: pointer;
}

.sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--zl-space-sm, 8px) 0;
}

.ringtone-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--zl-space-md, 16px) var(--zl-space-lg, 24px);
  height: 44px; /* 符合移动端触摸标准 */
  cursor: pointer;
  transition: background 0.2s;
}

.ringtone-item:hover {
  background: var(--zl-bg-cool, #F0F0F0);
}

.ringtone-item.is-active {
  background: var(--zl-primary-50, #E8F4F0);
}

.ringtone-name {
  font-size: var(--zl-font-base, 16px);
  color: var(--zl-text-primary, #2C1810);
}

.ringtone-item.is-active .ringtone-name {
  color: var(--zl-primary, #87C8B4);
  font-weight: 500;
}

.preview-btn {
  background: transparent;
  border: 1px solid var(--zl-border, #D8C8B8);
  border-radius: var(--zl-radius-full, 999px);
  padding: var(--zl-space-xs, 4px) var(--zl-space-sm, 8px);
  font-size: var(--zl-font-sm, 14px);
  color: var(--zl-text-secondary, #5A4A3A);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.preview-btn:hover {
  background: var(--zl-bg-cool, #F0F0F0);
}
</style>
