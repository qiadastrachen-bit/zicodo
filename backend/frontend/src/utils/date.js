/**
 * 日期工具函数
 * 供 stores、components、pages 共享使用
 */

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/**
 * 判断两个日期是否为同一天
 */
export function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

/**
 * 判断重复规则是否匹配指定日期
 * @param {string} recurrence - 如 'daily'、'weekdays'、'weekly:3,5'
 * @param {Date} date
 */
export function matchesRecurrence(recurrence, date) {
  if (!recurrence) return false
  
  // 支持旧格式（向后兼容）
  const todayName = DAY_NAMES[date.getDay()]
  if (recurrence === '每天') return true
  if (recurrence.includes(todayName)) return true
  
  // 新格式
  if (recurrence === 'daily') return true
  
  if (recurrence === 'weekdays') {
    const dayOfWeek = date.getDay() // 0 = 周日
    return dayOfWeek >= 1 && dayOfWeek <= 5 // 周一到周五
  }
  
  if (recurrence.startsWith('weekly:')) {
    const daysStr = recurrence.replace('weekly:', '')
    const selectedDays = daysStr.split(',').map(Number)
    const todayDayOfWeek = date.getDay() // 0 = 周日
    return selectedDays.includes(todayDayOfWeek)
  }
  
  return false
}

/**
 * 将 Date 格式化为 YYYY-MM-DD（本地时区）
 */
export function formatLocalDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 将年月日格式化为 YYYY-MM-DD
 */
export function formatDateStr(y, m, d) {
  const mm = String(m + 1).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

/**
 * 格式化日期为人类可读标签：2026年6月21日 周日
 */
export function formatDateLabel(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const week = DAY_NAMES[d.getDay()]
  return `${d.getFullYear()}年${month}月${day}日 ${week}`
}

/**
 * 将 24 小时制时间转为 12 小时制：08:30 → 8:30 AM
 */
export function formatTime12(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
  return `${displayHour}:${m} ${ampm}`
}

/**
 * 格式化日期为简洁形式：6月21日
 */
export function formatShortDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
