/**
 * ziling.js - 宠物端核心交互 API
 * ⚠️ 注意：/ziling/api/* 接口无需登录即可调用（可选传 Token）
 * 用于获取个性化宠物信息
 */

import axios from 'axios'
import request from './request'

// 基础 URL 不使用 /api 前缀，直接在 Vite 代理中配置 /ziling 前缀
const zilingRequest = axios.create({
  baseURL: '/ziling/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：可选注入 Token
zilingRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zl_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一错误处理
// 后端 ok() 返回格式: { code: 0, message: "success", data: {...} }
// 兼容两种成功状态：code === 0（业务成功） 和 code === 200（HTTP 成功）
zilingRequest.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 0 || res.code === 200) {
      return res.data
    } else {
      console.error('[Ziling API Error]', res.message)
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  (error) => {
    console.error('[Ziling HTTP Error]', error)
    return Promise.reject(new Error('网络连接失败'))
  }
)

// 健康检查
export const ping = () => {
  return zilingRequest.get('/ping')
}

// 核心对话接口
export const chatWithPet = (data) => {
  return zilingRequest.post('/chat', data)
  /*
    请求体：
    {
      "message": "用户消息",
      "history": [
        { "role": "user", "content": "上一轮用户消息" },
        { "role": "assistant", "content": "上一轮助手回复" }
      ],
      "persona": "gentle",  // 可选，宠物性格
      "schedule": {           // 可选，当前日程状态
        "completed": 3,
        "pending": 2,
        "overdue": 1
      }
    }

    响应格式：
    {
      "quickReply": "简洁回复（≤20字）",
      "megachar": {
        "chars": ["字", "灵"],     // 1~4个汉字
        "direction": "horizontal",  // ≤2字 vertical，≥3字 horizontal
        "rotateInterval": 0,
        "duration": 3000
      },
      "stream": [
        { "text": "一段话", "emoji": "^_^", "word": "展示词" },
        // ... 3~5段
      ]
    }
   */
}

// 日程反馈接口
export const sendScheduleFeedback = (data) => {
  return zilingRequest.post('/schedule', data)
  /*
    请求体：
    {
      "completed": 5,  // 已完成任务数
      "pending": 2,    // 待办任务数
      "overdue": 0      // 延期任务数
    }

    响应格式：
    {
      "message": "陪伴语≤30字",
      "emoji": "^_^"
    }
   */
}

// 游戏态组词判定接口
export const validateWord = (data) => {
  return zilingRequest.post('/validate', data)
  /*
    请求体：
    { "chars": ["字", "灵"], "word": "字灵" }

    响应格式：
    { "valid": true, "word": "字灵" }
   */
}

export default {
  ping,
  chatWithPet,
  sendScheduleFeedback,
  validateWord
}
