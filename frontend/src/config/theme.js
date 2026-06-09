/**
 * theme.js - 主题配置
 * 管理亮色/暗色模式
 * 颜色 key 必须与 tokens.css 中的 CSS 变量名匹配（去掉 --zl- 前缀）
 */

export const themes = {
  light: {
    name: 'light',
    label: '浅色',
    colors: {
      'bg': '#FFFAF1',
      'bg-warm': '#FFFAF1',
      'bg-cool': '#F5F5F5',
      'text-primary': '#000000',
      'text-secondary': '#666666',
      'text-hint': '#999999',
      'brand': '#87C8B4',
      'surface': '#FFFFFF',
      'border': '#E5E5E5'
    }
  },
  dark: {
    name: 'dark',
    label: '深色',
    colors: {
      'bg': '#1A1A2E',
      'bg-warm': '#2D2D44',
      'bg-cool': '#16213E',
      'text-primary': '#E0E0E0',
      'text-secondary': '#B0B0B0',
      'text-hint': '#808080',
      'brand': '#87C8B4',
      'surface': '#2D2D44',
      'border': '#444444'
    }
  }
}

export const defaultTheme = 'light'
