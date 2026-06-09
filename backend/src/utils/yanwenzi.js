/**
 * 颜文字库（yanwenzi）
 * 用于宠物对话回复中的情绪表达
 * 
 * 分类说明：
 *   happy   - 开心、兴奋
 *   sad     - 难过、委屈
 *   playful - 调皮、得意
 *   calm    - 平静、淡定
 *   shy     - 害羞、紧张
 */

// 所有颜文字平铺数组（用于白名单校验）
const YANWENZI_ALL = [
  '^_^', '≥▽≤', '-_-', '(^_^)/',
  'T_T', 'Q_Q', 'U_U', '>_<',
  '≥﹏≤', '¬_¬', '=_=', '⊙_⊙',
  '^o^', '^.^',
]

// 按情绪分类
const YANWENZI_BY_CATEGORY = {
  happy: [
    '^_^',     // 开心
    '≥▽≤',     // 笑哭
    '(^_^)/',  // 欢呼
    '^o^',      // 开心
    '^.^',      // 开心
  ],
  sad: [
    'T_T',      // 哭泣
    'Q_Q',      // 哭泣
    'U_U',      // 委屈
    '>_<',      // 难受
  ],
  playful: [
    '-_-',      // 调皮
    '≥﹏≤',     // 害羞笑
    '¬_¬',      // 不屑
    '=_=',      // 无语
  ],
  calm: [
    '⊙_⊙',     // 瞪眼（平静注视）
  ],
}

/**
 * 随机获取一个颜文字
 * @param {string} [category] - 可选，指定情绪分类
 * @returns {string}
 */
function getRandomYanwenzi(category) {
  const pool = category && YANWENZI_BY_CATEGORY[category]
    ? YANWENZI_BY_CATEGORY[category]
    : YANWENZI_ALL
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * 校验是否为合法颜文字（白名单）
 * @param {string} input
 * @returns {string} 合法则返回原值，否则返回默认 '^_^'
 */
function safeYanwenzi(input) {
  return YANWENZI_ALL.includes(input) ? input : '^_^'
}

module.exports = {
  YANWENZI_ALL,
  YANWENZI_BY_CATEGORY,
  getRandomYanwenzi,
  safeYanwenzi,
}
