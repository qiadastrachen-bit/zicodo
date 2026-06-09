<template>
  <div class="team-form-overlay" @click.self="$emit('close')">
    <div class="team-form-modal">
      <div class="form-header">
        <button class="header-btn" @click="$emit('close')">
          <ZlIcon name="X" :size="24" />
        </button>
        <h3 class="form-title">新建团队</h3>
        <div class="header-spacer"></div>
      </div>

      <div class="form-body">
        <div class="form-field">
          <ZlIcon name="Pencil" :size="20" class="field-icon" />
          <input
            type="text"
            v-model="form.name"
            placeholder="团队名称"
            class="field-input"
          />
          <span class="field-label">名称</span>
        </div>

        <div class="form-field">
          <ZlIcon name="FileText" :size="20" class="field-icon" />
          <input
            type="text"
            v-model="form.description"
            placeholder="团队简介（选填）"
            class="field-input"
          />
          <span class="field-label">备注</span>
        </div>

        <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>
      </div>

      <div class="form-footer">
        <button
          class="zl-btn zl-btn--lg zl-btn--primary"
          style="min-width: 120px;"
          @click="handleSubmit"
          :disabled="!form.name || loading"
        >
          {{ loading ? '创建中...' : '确认' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useTeamsStore } from '@/stores/teams.js'
import ZlIcon from '@/components/common/ZlIcon.vue'

const emit = defineEmits(['close', 'submit'])
const store = useTeamsStore()
const loading = ref(false)
const errorMsg = ref('')

const form = reactive({
  name: '',
  description: '',
})

async function handleSubmit() {
  if (!form.name.trim()) return
  loading.value = true
  errorMsg.value = ''
  try {
    await store.createTeam({
      name: form.name.trim(),
      description: form.description.trim(),
    })
    emit('submit')
    emit('close')
  } catch (e) {
    errorMsg.value = e.message || '创建失败'
  } finally {
    loading.value = false
  }
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
}

.form-title {
  font-size: var(--zl-font-lg);
  font-weight: var(--zl-weight-medium);
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
  height: var(--zl-input-height-lg, 48px);
  background: var(--zl-surface);
  border-radius: var(--zl-radius-md);
  border: 1px solid var(--zl-border);
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
  outline: none;
}

.field-label {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  flex-shrink: 0;
}

.error-text {
  color: var(--zl-danger);
  font-size: var(--zl-font-sm);
  text-align: center;
}

.form-footer {
  display: flex;
  justify-content: center;
}
</style>
