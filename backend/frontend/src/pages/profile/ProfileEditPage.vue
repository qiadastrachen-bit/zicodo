<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlCard from '@/components/common/ZlCard.vue'
import ZlInput from '@/components/common/ZlInput.vue'
import ZlButton from '@/components/common/ZlButton.vue'
import ZlModal from '@/components/common/ZlModal.vue'
import ZlToast from '@/components/common/ZlToast.vue'
import defaultAvatar from '@/assets/default-avatar.png'

const router = useRouter()
const userStore = useUserStore()

const showAvatarModal = ref(false)
const showPasswordModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const form = ref({
  nickname: userStore.user?.nickname || '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showAvatarModalHandler = () => {
  showAvatarModal.value = true
}

const handleSaveNickname = () => {
  // 【接口位】PUT /api/users/me 更新用户资料，后端未建，目前仅本地更新
  if (userStore.user) {
    userStore.updateUser({ nickname: form.value.nickname })
  }
  toastMessage.value = '昵称已更新'
  toastType.value = 'success'
  showToast.value = true
}

const handleChangePassword = () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    toastMessage.value = '两次输入的密码不一致'
    toastType.value = 'error'
    showToast.value = true
    return
  }

  if (form.value.newPassword.length < 6) {
    toastMessage.value = '新密码至少6位'
    toastType.value = 'error'
    showToast.value = true
    return
  }

  // 【接口位】POST /api/users/me/password { oldPassword, newPassword }，后端未建，目前仅前端校验
  toastMessage.value = '密码已更新'
  toastType.value = 'success'
  showToast.value = true
  form.value.oldPassword = ''
  form.value.newPassword = ''
  form.value.confirmPassword = ''
}
</script>

<template>
  <div class="profile-edit-page">
    <ZlTopBar title="编辑资料" @back="router.back()" />

    <div class="profile-edit-content">
      <ZlCard class="profile-edit-section">
        <div class="avatar-edit-wrapper">
          <!-- 【接口位】PUT /api/users/me/avatar，后端未建，目前仅弹出"功能开发中" -->
          <div class="avatar-edit" @click="showAvatarModalHandler">
            <img
              :src="defaultAvatar"
              class="avatar-edit-img"
              alt="头像"
            />
            <div class="avatar-edit-label">更换头像</div>
          </div>
        </div>

        <div class="form-item">
          <div class="form-label">昵称</div>
          <ZlInput
            v-model="form.nickname"
            placeholder="请输入昵称"
          />
          <ZlButton
            type="primary"
            size="small"
            class="save-btn-inline"
            @click="handleSaveNickname"
          >
            保存
          </ZlButton>
        </div>
      </ZlCard>

      <ZlCard class="profile-edit-section">
        <div class="section-title">修改密码</div>
        <div class="form-item">
          <div class="form-label">原密码</div>
          <ZlInput
            v-model="form.oldPassword"
            type="password"
            placeholder="请输入原密码"
          />
        </div>
        <div class="form-item">
          <div class="form-label">新密码</div>
          <ZlInput
            v-model="form.newPassword"
            type="password"
            placeholder="请输入新密码"
          />
        </div>
        <div class="form-item">
          <div class="form-label">确认密码</div>
          <ZlInput
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
          />
        </div>
        <ZlButton
          type="primary"
          size="lg"
          class="change-password-btn"
          @click="handleChangePassword"
        >
          修改密码
        </ZlButton>
      </ZlCard>
    </div>

    <ZlModal
      v-model:visible="showAvatarModal"
      title="提示"
      confirm-text="确定"
    >
      头像上传功能开发中
    </ZlModal>

    <ZlToast
      :visible="showToast"
      :message="toastMessage"
      :type="toastType"
      @update:visible="showToast = $event"
    />
  </div>
</template>

<style scoped>
.profile-edit-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.profile-edit-content {
  padding: var(--zl-space-lg) var(--zl-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-lg);
}

.profile-edit-section {
  padding: var(--zl-space-lg);
}

.avatar-edit-wrapper {
  display: flex;
  justify-content: center;
  padding-bottom: var(--zl-space-lg);
}

.avatar-edit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-md);
  cursor: pointer;
}

.avatar-edit-img {
  width: 88px;
  height: 88px;
  border-radius: var(--zl-radius-full);
  object-fit: cover;
}

.avatar-edit-label {
  font-size: var(--zl-font-sm);
  color: var(--zl-primary);
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-sm);
  margin-bottom: var(--zl-space-lg);
}

.form-label {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
}

.save-btn-inline {
  align-self: flex-end;
}

.section-title {
  font-size: var(--zl-font-lg);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin-bottom: var(--zl-space-lg);
}

.change-password-btn {
  margin-top: var(--zl-space-md);
  width: 100%;
}
</style>
