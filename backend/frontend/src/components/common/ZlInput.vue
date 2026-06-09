<script setup>
/**
 * ZlInput.vue - 通用输入框组件
 * Props: { modelValue, type, placeholder, disabled, error, prefixIcon, suffixIcon, rows }
 */
import { computed } from 'vue'
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text' // 'text' | 'password' | 'email' | 'number' | 'textarea'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  prefixIcon: {
    type: String,
    default: ''
  },
  suffixIcon: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 4
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'clear'])

// 双向绑定
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 清除输入
const clearInput = () => {
  emit('update:modelValue', '')
}

// 聚焦/失焦
const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}

// 是否为 textarea
const isTextarea = computed(() => props.type === 'textarea')
</script>

<template>
  <div class="zl-input-wrapper" :class="{ 'has-error': error, 'is-disabled': disabled, 'is-textarea': isTextarea }">
    <!-- 前缀图标（仅非 textarea） -->
    <span v-if="prefixIcon && !isTextarea" class="zl-input__prefix">
      <i :class="prefixIcon"></i>
    </span>

    <!-- 输入框 -->
    <input
      v-if="!isTextarea"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      class="zl-input"
      @input="value = $event.target.value"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <!-- 文本域 -->
    <textarea
      v-else
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      class="zl-textarea"
      @input="value = $event.target.value"
      @focus="handleFocus"
      @blur="handleBlur"
    ></textarea>

    <!-- 清除按钮（仅非 textarea） -->
    <span
      v-if="value && !disabled && !isTextarea"
      class="zl-input__clear"
      @click="clearInput"
    >
      <ZlIcon name="X" :size="12" />
    </span>

    <!-- 后缀图标（仅非 textarea） -->
    <span v-if="suffixIcon && !isTextarea" class="zl-input__suffix">
      <i :class="suffixIcon"></i>
    </span>

    <!-- 错误信息 -->
    <p v-if="error" class="zl-input__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.zl-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 44px;
  padding: 0 var(--zl-space-md);
  background: var(--zl-bg-cool);
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-lg);
  transition: all var(--zl-transition-fast);
  position: relative;
}

.zl-input-wrapper.is-textarea {
  align-items: flex-start;
  padding: var(--zl-space-md);
}

.zl-input-wrapper:focus-within {
  border-color: var(--zl-brand);
  box-shadow: 0 0 0 3px rgba(135, 200, 180, 0.1);
}

.zl-input-wrapper.has-error {
  border-color: var(--zl-danger);
}

.zl-input-wrapper.has-error:focus-within {
  box-shadow: 0 0 0 3px rgba(239, 71, 111, 0.1);
}

.zl-input-wrapper.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--zl-bg);
}

.zl-input {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  outline: none;
}

.zl-textarea {
  flex: 1;
  width: 100%;
  min-height: 80px;
  border: none;
  background: transparent;
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  outline: none;
  resize: vertical;
  line-height: var(--zl-line-normal);
  font-family: var(--zl-font-family);
}

.zl-input::placeholder,
.zl-textarea::placeholder {
  color: var(--zl-text-hint);
}

.zl-input:disabled,
.zl-textarea:disabled {
  cursor: not-allowed;
}

.zl-input__prefix,
.zl-input__suffix {
  display: flex;
  align-items: center;
  color: var(--zl-text-hint);
  font-size: var(--zl-font-md);
}

.zl-input__prefix {
  margin-right: var(--zl-space-sm);
}

.zl-input__suffix {
  margin-left: var(--zl-space-sm);
}

.zl-input__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: var(--zl-space-sm);
  color: var(--zl-text-hint);
  font-size: 12px;
  cursor: pointer;
  border-radius: var(--zl-radius-full);
  transition: all var(--zl-transition-fast);
}

.zl-input__clear:hover {
  background: var(--zl-border);
  color: var(--zl-text-secondary);
}

.zl-input__error {
  position: absolute;
  bottom: -20px;
  left: var(--zl-space-md);
  font-size: var(--zl-font-xs);
  color: var(--zl-danger);
  margin: 0;
}
</style>
