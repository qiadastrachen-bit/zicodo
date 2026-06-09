/**
 * profile.js - 个人中心 API（对接后端）
 */

import request from './request'
import { getCurrentUser, updateProfile } from './user'

export function getProfile() {
  return getCurrentUser()
}

export function saveProfile(data) {
  return updateProfile(data)
}

export function getDialogueHistory(params) {
  return request.get('/ai/dialogues', { params })
}

export default {
  getProfile,
  saveProfile,
  getDialogueHistory,
}
