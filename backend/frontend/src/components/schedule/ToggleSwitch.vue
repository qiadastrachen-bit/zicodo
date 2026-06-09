<template>
  <div 
    class="toggle-switch" 
    :class="{ active: modelValue }"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div class="toggle-thumb"></div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.toggle-switch {
  width: 48px;
  height: 26px;
  background: var(--zl-text-disabled);
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: background var(--zl-transition-fast);
}

.toggle-switch.active {
  background: var(--zl-brand);
}

.toggle-thumb {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform var(--zl-transition-fast);
  box-shadow: var(--zl-shadow-sm);
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(22px);
}
</style>
