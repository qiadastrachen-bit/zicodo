<script setup>
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showBack: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['back'])
</script>

<template>
  <div class="zl-topbar">
    <div class="zl-topbar__left">
      <button 
        v-if="showBack"
        class="zl-topbar__back-btn"
        @click="emit('back')"
      >
        <ZlIcon name="ChevronLeft" :size="18" color="var(--zl-text-primary)" />
      </button>
    </div>
    <div class="zl-topbar__title">
      {{ title }}
    </div>
    <div class="zl-topbar__right"></div>
  </div>
</template>

<style scoped>
.zl-topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  background: var(--zl-bg);
  padding: 0 var(--zl-space-md);
}

.zl-topbar__left,
.zl-topbar__right {
  width: 40px;
  display: flex;
  align-items: center;
}

.zl-topbar__back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: var(--zl-radius-full);
}

.zl-topbar__back-btn:active {
  background: var(--zl-bg-cool);
}

.zl-topbar__title {
  flex: 1;
  text-align: center;
  font-size: var(--zl-font-lg);
  font-weight: 600;
  color: var(--zl-text-primary);
  line-height: 44px;
}
</style>
