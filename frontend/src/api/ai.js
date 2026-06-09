/**
 * ai.js - AI 对话/记忆接口
 * 所有接口都需要登录鉴权（/api/* 前缀，自动附加 Token）
 */

import request from './request'

/**
 * AI 对话（SSE 流式）
 * @param {Object} data - { message, history, persona, schedule }
 * @returns {EventSource} SSE 连接
 */
export function chatWithAI(data) {
  // SSE 需要特殊处理，这里返回 EventSource
  const token = localStorage.getItem('zl_token')
  const url = '/api/ai/chat'
  
  // 使用 fetch + ReadableStream 处理 SSE
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
}

/**
 * 存储记忆
 * @param {Object} data - { content, type, importance }
 */
export function saveMemory(data) {
  return request.post('/api/ai/memory', data)
}

/**
 * 获取记忆列表
 * @param {Object} params - { page, pageSize }
 */
export function getMemories(params) {
  return request.get('/api/ai/memory', { params })
}

export default {
  chatWithAI,
  saveMemory,
  getMemories
}
