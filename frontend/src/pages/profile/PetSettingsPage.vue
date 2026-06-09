<script setup>
/**
 * PetSettingsPage.vue - 宠物设置页
 * 允许修改宠物昵称、个性（personality）
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '@/stores/pet'
import { Heart, Zap, HeartCrack, Brain } from 'lucide-vue-next'

const router = useRouter()
const petStore = usePetStore()

// 表单状态
const petName = ref('')
const selectedPersonality = ref('温柔')
const isSaving = ref(false)
const saveMessage = ref('')

// 个性选项（与后端 Pet model 一致，统一使用中文标签）
const personalityOptions = [
  { value: '温柔', label: '温柔', desc: '温和耐心，善于倾听', icon: Heart },
  { value: '活泼', label: '活泼', desc: '活力四射，鼓励行动', icon: Zap },
  { value: '傲娇', label: '傲娇', desc: '嘴硬心软，别样可爱', icon: HeartCrack },
  { value: '沉稳', label: '沉稳', desc: '冷静理性，深度分析', icon: Brain }
]

// 初始化表单
onMounted(() => {
  if (petStore.pet) {
    petName.value = petStore.petName
    selectedPersonality.value = petStore.petPersonality
  }
})

// 保存设置
const saveSettings = async () => {
  if (!petName.value.trim() || isSaving.value) return
  isSaving.value = true
  saveMessage.value = ''

  try {
    const updateData = {
      name: petName.value.trim()
    }
    // 仅当个性改变时才更新
    if (selectedPersonality.value !== petStore.petPersonality) {
      updateData.personality = selectedPersonality.value
    }

    const updated = await petStore.updatePet(updateData)
    saveMessage.value = '保存成功！'
    setTimeout(() => { saveMessage.value = '' }, 2000)
  } catch (error) {
    saveMessage.value = '保存失败，请重试'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="pet-settings-page">
    <div class="page-header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1 class="page-title">宠物设置</h1>
      <div class="placeholder"></div>
    </div>

    <div class="settings-content">
      <!-- 宠物昵称 -->
      <div class="setting-section">
        <h2 class="section-title">宠物昵称</h2>
        <input
          v-model="petName"
          type="text"
          class="name-input"
          placeholder="给宠物取个名字"
          maxlength="20"
        />
      </div>

      <!-- 个性选择 -->
      <div class="setting-section">
        <h2 class="section-title">宠物个性</h2>
        <div class="personality-options">
          <div
            v-for="opt in personalityOptions"
            :key="opt.value"
            class="personality-card"
            :class="{ active: selectedPersonality === opt.value }"
            @click="selectedPersonality = opt.value"
          >
            <component :is="opt.icon" class="personality-icon" :size="32" />
            <div class="personality-info">
              <span class="personality-label">{{ opt.label }}</span>
              <span class="personality-desc">{{ opt.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="save-section">
        <button
          class="save-btn"
          @click="saveSettings"
          :disabled="!petName.trim() || isSaving"
        >
          {{ isSaving ? '保存中...' : '保存设置' }}
        </button>
        <p v-if="saveMessage" class="save-message" :class="{ success: saveMessage.includes('成功') }">
          {{ saveMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pet-settings-page {
  width: 100%;
  min-height: 100vh;
  background: var(--zl-bg-warm);
  padding-bottom: var(--zl-tabbar-height);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zl-space-lg);
  background: var(--zl-bg);
  border-bottom: 1px solid var(--zl-border);
}

.back-btn {
  background: none;
  border: none;
  font-size: var(--zl-font-lg);
  cursor: pointer;
  color: var(--zl-text-primary);
  padding: var(--zl-space-xs);
}

.page-title {
  font-size: var(--zl-font-lg);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0;
}

.placeholder { width: 32px; }

.settings-content {
  padding: var(--zl-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-xl);
}

.setting-section {
  background: var(--zl-bg);
  border-radius: var(--zl-radius-lg);
  padding: var(--zl-space-lg);
}

.section-title {
  font-size: var(--zl-font-base);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0 0 var(--zl-space-md) 0;
}

.name-input {
  width: 100%;
  padding: var(--zl-space-md);
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  background: var(--zl-bg-cool);
  outline: none;
  box-sizing: border-box;
}

.name-input:focus {
  border-color: var(--zl-brand);
}

.personality-options {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
}

.personality-card {
  display: flex;
  align-items: center;
  gap: var(--zl-space-md);
  padding: var(--zl-space-md);
  border: 2px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.personality-card.active {
  border-color: var(--zl-brand);
  background: var(--zl-bg-warm);
}

.personality-icon {
  color: var(--zl-brand);
  flex-shrink: 0;
}

.personality-info {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-xs);
}

.personality-label {
  font-size: var(--zl-font-base);
  font-weight: 600;
  color: var(--zl-text-primary);
}

.personality-desc {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
}

.save-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-sm);
  padding: var(--zl-space-lg) 0;
}

.save-btn {
  width: 100%;
  padding: var(--zl-space-md);
  background: var(--zl-brand);
  color: #FFFFFF;
  border: none;
  border-radius: var(--zl-radius-lg);
  font-size: var(--zl-font-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-btn:hover:not(:disabled) {
  background: var(--zl-brand-dark);
}

.save-message {
  font-size: var(--zl-font-sm);
  color: var(--zl-danger);
  margin: 0;
}

.save-message.success {
  color: var(--zl-success);
}
</style>
