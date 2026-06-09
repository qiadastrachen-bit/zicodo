/**
 * request.js - Axios 封装
 * 统一处理请求/响应拦截器、Token 注入、错误提示
 */

import axios from 'axios'
import { API_TIMEOUT } from '@/config/api'
import { STORAGE_KEYS } from '@/config/constants'

// 创建 Axios 实例
const request = axios.create({
  baseURL: '/api', // 通过 Vite 代理转发
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：注入 Token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：统一错误处理
request.interceptors.response.use(
  (response) => {
    const res = response.data

    // 后端统一返回格式：{ code, message, data }
    if (res.code === 0 || res.code === 200) {
      return res.data
    } else {
      // 业务错误
      console.error('[API Error]', res.message)
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  (error) => {
    // HTTP 错误
    if (error.response) {
      const { status, data } = error.response
      let message = '网络错误'

      switch (status) {
        case 401:
          message = '未授权，请重新登录'
          // Token 过期，清除本地存储并跳转登录页
          localStorage.removeItem(STORAGE_KEYS.TOKEN)
          window.location.href = '/auth'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 502:
        case 503:
        case 504:
          message = '服务器暂不可用，请稍后重试'
          console.error(`[HTTP Error] ${status} - 后端服务未启动或异常`)
          return Promise.reject(new Error(message))
        default:
          message = data?.message || `连接出错(${status})`
      }

      console.error('[HTTP Error]', status, message)
      return Promise.reject(new Error(message))
    } else if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时，请检查网络'))
    } else if (error.message && error.message.includes('Network Error')) {
      return Promise.reject(new Error('无法连接服务器，请检查网络'))
    } else {
      return Promise.reject(new Error('网络连接失败'))
    }
  }
)

export default request
