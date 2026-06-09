/**
 * pet.js - 宠物 Store
 * 管理宠物信息、互动状态
 */

import { defineStore } from 'pinia'
import * as petApi from '@/api/pet'
import { STORAGE_KEYS } from '@/config/constants'

export const usePetStore = defineStore('pet', {
  state: () => ({
    pet: JSON.parse(localStorage.getItem(STORAGE_KEYS.PET) || 'null'),
    loading: false,
    error: null
  }),

  getters: {
    petName: (state) => state.pet?.name || 'zicodo',
    petLevel: (state) => state.pet?.level || 1,
    petPersonality: (state) => state.pet?.personality || '温柔',
    petExp: (state) => state.pet?.exp || 0,
    hasPet: (state) => !!state.pet
  },

  actions: {
    // 获取我的宠物
    async fetchMyPet() {
      this.loading = true
      this.error = null
      try {
        const pet = await petApi.getMyPet()
        this.pet = pet
        localStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(pet))
        return pet
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取指定用户的宠物
    async fetchPetByUserId(userId) {
      try {
        const pet = await petApi.getPetByUserId(userId)
        return pet
      } catch (error) {
        throw error
      }
    },

    // 更新宠物信息（昵称/性格/情绪）
    async updatePet(data) {
      if (!this.pet) return
      try {
        const updated = await petApi.updatePet(data)
        this.pet = updated
        localStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(updated))
        return updated
      } catch (error) {
        throw error
      }
    },

    // 喂养宠物（增加亲密值）
    async feed() {
      if (!this.pet) return
      try {
        const result = await petApi.feedPet()
        if (this.pet) {
          this.pet.intimacy = result.intimacy || (this.pet.intimacy || 0) + 1
          localStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(this.pet))
        }
        return result
      } catch (error) {
        throw error
      }
    },

    // 清除宠物数据（登出时）
    clearPet() {
      this.pet = null
      localStorage.removeItem(STORAGE_KEYS.PET)
    },

    // 本地更新宠物信息（不调用 API）
    updatePetLocal(partialPet) {
      this.pet = { ...this.pet, ...partialPet }
      localStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(this.pet))
    }
  }
})
