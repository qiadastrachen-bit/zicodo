<template>
  <div class="team-form-overlay" @click.self="$emit('close')">
    <div class="team-form-modal">
      <!-- 标题栏：× | 新建团队 | 占位 -->
      <div class="form-header">
        <button class="header-btn" @click="$emit('close')">
          <ZlIcon name="X" :size="24" />
        </button>
        <h3 class="form-title">新建团队</h3>
        <div class="header-spacer"></div>
      </div>

      <!-- 表单内容 -->
      <div class="form-body">
        <!-- 名称 -->
        <div class="form-field">
          <ZlIcon name="Pencil" :size="20" class="field-icon" />
          <input
            type="text"
            v-model="form.name"
            placeholder="王之故乡"
            class="field-input"
          />
          <span class="field-label">名称</span>
        </div>

        <!-- 备注 -->
        <div class="form-field">
          <ZlIcon name="FileText" :size="20" class="field-icon" />
          <input
            type="text"
            v-model="form.description"
            placeholder="智能开源硬件基础"
            class="field-input"
          />
          <span class="field-label">备注</span>
        </div>

        <!-- 座右铭 -->
        <div class="form-field">
          <ZlIcon name="List" :size="20" class="field-icon" />
          <input
            type="text"
            v-model="form.slogan"
            placeholder="分则各自为王，合则天下无双"
            class="field-input"
          />
          <span class="field-label">座右铭</span>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="form-footer">
        <button
          class="zl-btn zl-btn--lg zl-btn--primary"
          style="min-width: 120px;"
          @click="handleSubmit"
          :disabled="!form.name"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useTeamsStore } from '@/stores/teams.js'
import ZlIcon from '@/components/common/ZlIcon.vue'

const emit = defineEmits(['close', 'submit'])
const store = useTeamsStore()

const form = reactive({
  name: '',
  description: '',
  slogan: ''
})

function handleSubmit() {
  if (!form.name) return
  store.createTeam({ ...form })
  emit('submit')
  emit('close')
}
</script>

<style scoped>
.team-form-overlay {
  position: fixed;
  inset: 0;
  background: var(--zl-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--zl-space-4);
}

.team-form-modal {
  background: var(--zl-bg);
  border-radius: var(--zl-radius-lg);
  width: 100%;
  max-width: 400px;
  padding: var(--zl-space-4);
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--zl-space-6);
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

.header-spacer {
  width: 44px;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-3);
  margin-bottom: var(--zl-space-6);
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
}

.field-input::placeholder {
  color: var(--zl-text-hint);
}

.field-label {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  flex-shrink: 0;
  margin-left: var(--zl-space-2);
}

.form-footer {
  display: flex;
  justify-content: center;
}
</style>
