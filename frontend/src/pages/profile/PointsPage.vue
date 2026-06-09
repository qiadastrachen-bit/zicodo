<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePointStore } from '@/stores/point'
import { Sparkles, Plus, Minus, TrendingUp, Gift } from 'lucide-vue-next'

import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlCard from '@/components/common/ZlCard.vue'
import ZlButton from '@/components/common/ZlButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ZlModal from '@/components/common/ZlModal.vue'

const router = useRouter()
const pointStore = usePointStore()

const isLoading = ref(false)
const showRechargeModal = ref(false)
const showHistoryModal = ref(false)

// 充值金额选项
const rechargeOptions = [
  { amount: 100, price: 1 },
  { amount: 500, price: 5 },
  { amount: 1000, price: 10 },
  { amount: 5000, price: 50 }
]

const selectedRecharge = ref(null)

// 当前积分余额（接入 store）
const currentBalance = computed(() => pointStore.balance)

// 积分变动历史（模拟数据）
const mockHistory = ref([
  { id: 1, action: 'earn', amount: 50, reason: '完成每日任务', time: '2026-06-08 10:30' },
  { id: 2, action: 'earn', amount: 100, reason: '连续签到7天', time: '2026-06-07 09:15' },
  { id: 3, action: 'spend', amount: 30, reason: '兑换徽章', time: '2026-06-06 14:20' },
  { id: 4, action: 'earn', amount: 20, reason: '完成小游戏', time: '2026-06-05 20:45' }
])

// 加载积分数据
const loadPoints = async () => {
  try {
    isLoading.value = true
    await pointStore.fetchPoints()
    // fetchHistory 暂时不调用，使用模拟数据
    // await pointStore.fetchHistory()
  } catch (error) {
    // 静默失败，使用默认值，不影响用户体验
    console.debug('[PointsPage] 积分API暂未实现，使用默认值')
  } finally {
    isLoading.value = false
  }
}

// 充值
const handleRecharge = (option) => {
  selectedRecharge.value = option
  // 【接口位】调用充值接口，后端暂未实现
  // const data = await rechargePoints({ amount: option.amount })
  // pointStore.balance = data.balance
  pointStore.balance += option.amount
  showRechargeModal.value = false
}

// 获取积分类型图标
const getActionIcon = (action) => {
  return action === 'earn' ? Plus : Minus
}

// 获取积分类型颜色
const getActionColor = (action) => {
  return action === 'earn' ? 'var(--zl-success)' : 'var(--zl-danger)'
}

onMounted(() => {
  loadPoints()
})
</script>

<template>
  <div class="points-page">
    <ZlTopBar title="积分中心" @back="router.back()" />

    <div class="points-content">
      <!-- 积分余额卡片 -->
      <ZlCard class="balance-card">
        <div class="balance-header">
          <Sparkles class="balance-icon" :size="24" />
          <div class="balance-label">当前积分余额</div>
        </div>
        <div class="balance-value">
          <span v-if="isLoading" class="loading-text">加载中...</span>
          <span v-else>{{ currentBalance }}</span>
        </div>
        <div class="balance-actions">
          <ZlButton class="recharge-btn" @click="showRechargeModal = true">
            <Plus :size="16" />
            <span>充值</span>
          </ZlButton>
          <ZlButton variant="outline" class="history-btn" @click="showHistoryModal = true">
            <TrendingUp :size="16" />
            <span>明细</span>
          </ZlButton>
        </div>
      </ZlCard>

      <!-- 积分获取指南 -->
      <ZlCard class="guide-card">
        <div class="guide-title">
          <Gift :size="18" />
          <span>如何获取积分</span>
        </div>
        <div class="guide-list">
          <div class="guide-item">
            <span class="guide-point">+10</span>
            <span class="guide-desc">每日签到</span>
          </div>
          <div class="guide-item">
            <span class="guide-point">+50</span>
            <span class="guide-desc">完成每日任务</span>
          </div>
          <div class="guide-item">
            <span class="guide-point">+20</span>
            <span class="guide-desc">完成小游戏</span>
          </div>
          <div class="guide-item">
            <span class="guide-point">+100</span>
            <span class="guide-desc">连续签到7天</span>
          </div>
        </div>
      </ZlCard>

      <EmptyState 
        message="更多积分功能即将上线" 
        description="敬请期待积分商城、排行榜等功能"
      />
    </div>

    <!-- 充值弹窗 -->
    <ZlModal
      v-model:visible="showRechargeModal"
      title="积分充值"
      :closable="true"
      :show-footer="false"
    >
      <div class="recharge-options">
        <div
          v-for="option in rechargeOptions"
          :key="option.amount"
          class="recharge-option"
          @click="handleRecharge(option)"
        >
          <div class="recharge-amount">{{ option.amount }} 积分</div>
          <div class="recharge-price">¥{{ option.price }}</div>
        </div>
      </div>
      <div class="modal-footer">
        <p class="recharge-notice">【接口位】充值功能 V0.1.0 开放</p>
      </div>
    </ZlModal>

    <!-- 积分明细弹窗 -->
    <ZlModal
      v-model:visible="showHistoryModal"
      title="积分明细"
      :closable="true"
      :show-footer="false"
    >
      <div class="history-list">
        <div
          v-for="item in mockHistory"
          :key="item.id"
          class="history-item"
        >
          <div class="history-icon">
            <component :is="getActionIcon(item.action)" :size="16" :color="getActionColor(item.action)" />
          </div>
          <div class="history-info">
            <div class="history-reason">{{ item.reason }}</div>
            <div class="history-time">{{ item.time }}</div>
          </div>
          <div class="history-amount" :style="{ color: getActionColor(item.action) }">
            {{ item.action === 'earn' ? '+' : '-' }}{{ item.amount }}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <p class="history-notice">【接口位】明细数据 V0.1.0 接入后端</p>
      </div>
    </ZlModal>
  </div>
</template>

<style scoped>
.points-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.points-content {
  flex: 1;
  padding: var(--zl-space-xl) var(--zl-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-lg);
}

.balance-card {
  padding: var(--zl-space-xl);
  text-align: center;
}

.balance-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--zl-space-sm);
  margin-bottom: var(--zl-space-md);
}

.balance-icon {
  color: var(--zl-brand);
}

.balance-label {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
}

.balance-value {
  font-size: var(--zl-font-display);
  font-weight: 700;
  color: var(--zl-primary);
  margin-bottom: var(--zl-space-lg);
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text {
  opacity: 0.6;
}

.balance-actions {
  display: flex;
  gap: var(--zl-space-md);
  justify-content: center;
}

.recharge-btn,
.history-btn {
  display: flex;
  align-items: center;
  gap: var(--zl-space-xs);
}

.guide-card {
  padding: var(--zl-space-lg);
}

.guide-title {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-medium);
  color: var(--zl-text-primary);
  margin-bottom: var(--zl-space-md);
}

.guide-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--zl-space-md);
}

.guide-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-xs);
  padding: var(--zl-space-md);
  background: var(--zl-bg-cool);
  border-radius: var(--zl-radius-md);
}

.guide-point {
  font-size: var(--zl-font-lg);
  font-weight: var(--zl-weight-semibold);
  color: var(--zl-brand);
}

.guide-desc {
  font-size: var(--zl-font-xs);
  color: var(--zl-text-secondary);
}

/* 充值弹窗样式 */
.recharge-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--zl-space-md);
  padding: var(--zl-space-md) 0;
}

.recharge-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-xs);
  padding: var(--zl-space-lg) var(--zl-space-md);
  background: var(--zl-surface);
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.recharge-option:hover {
  border-color: var(--zl-brand);
  background: var(--zl-bg-cool);
}

.recharge-option:active {
  transform: scale(0.98);
}

.recharge-amount {
  font-size: var(--zl-font-lg);
  font-weight: var(--zl-weight-semibold);
  color: var(--zl-text-primary);
}

.recharge-price {
  font-size: var(--zl-font-sm);
  color: var(--zl-brand);
}

/* 历史明细样式 */
.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: var(--zl-space-md);
  padding: var(--zl-space-md) 0;
  border-bottom: 1px solid var(--zl-border);
}

.history-item:last-child {
  border-bottom: none;
}

.history-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zl-bg-cool);
  border-radius: var(--zl-radius-full);
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-reason {
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  margin-bottom: 2px;
}

.history-time {
  font-size: var(--zl-font-xs);
  color: var(--zl-text-hint);
}

.history-amount {
  flex-shrink: 0;
  font-size: var(--zl-font-lg);
  font-weight: var(--zl-weight-semibold);
}

.modal-footer {
  margin-top: var(--zl-space-md);
  padding-top: var(--zl-space-md);
  border-top: 1px solid var(--zl-border);
  text-align: center;
}

.recharge-notice,
.history-notice {
  font-size: var(--zl-font-xs);
  color: var(--zl-text-hint);
  margin: 0;
}
</style>
