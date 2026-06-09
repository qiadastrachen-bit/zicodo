/**
 * pet.js - 宠物相关 API
 * 获取/更新宠物信息（与后端路由严格对齐）
 */

import request from './request'

// 获取当前用户的宠物
export const getMyPet = () => {
  return request.get('/pets/mine')
}

// 获取指定用户的宠物（查看他人宠物）
export const getPetByUserId = (userId) => {
  return request.get(`/pets/${userId}`)
}

// 更新宠物设置（昵称/性格/情绪）
// body: { name?, personality?, mood? }
export const updatePet = (data) => {
  return request.put('/pets/mine', data)
}

// 更新宠物昵称
// body: { name }
export const renamePet = (name) => {
  return request.put('/pets/mine/name', { name })
}

// 更新宠物情绪
// body: { mood }
export const updatePetMood = (mood) => {
  return request.put('/pets/mine/mood', { mood })
}

// 喂养宠物（增加亲密值）
export const feedPet = () => {
  return request.post('/pets/mine/feed')
}

// 获取宠物等级进度
export const getPetProgress = () => {
  return request.get('/pets/mine/progress')
}
