/**
 * api.js - API 基础配置
 * 后端 API 地址和超时配置
 */

export const API_BASE_URL = 'http://120.53.11.84'
export const API_TIMEOUT = 10000 // 10秒超时

// 注意：开发环境下通过 vite.config.js 的 proxy 代理转发
// 生产环境需要改为实际部署地址
export const API_PROXY_PREFIX = '/api'
export const ZILING_PROXY_PREFIX = '/ziling'
