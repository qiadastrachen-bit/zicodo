/**
 * zicodo · 汉字消消乐 — 单字池
 * 来源：ziling_new/js/game/wordmatch.js 的 WORD_LIST（60个词 → 166个不重复单字）
 * 用法：
 *   import { CHAR_POOL, generateGameChars } from '@/game/chars.js';
 *   const chars = generateGameChars(32); // 生成64个字符（32种×2）
 */
export const CHAR_POOL = [
  '明', '天', '今', '昨', '空', '气', '休', '息', '加', '油',
  '快', '乐', '开', '心', '学', '习', '工', '作', '朋', '友',
  '时', '间', '完', '成', '努', '力', '进', '步', '成', '长',
  '希', '望', '未', '来', '梦', '想', '语', '言', '文', '字',
  '心', '想', '理', '美', '好', '生', '活', '温', '暖', '光',
  '阳', '微', '笑', '花', '月', '圆', '风', '云', '山', '水',
  '春', '秋', '冬', '夏', '日', '和', '气', '平', '安', '宁',
  '知', '道', '思', '考', '记', '忆', '青', '春', '勇', '敢',
  '坚', '持', '相', '信', '感', '谢', '快', '慢', '高', '低',
  '大', '小', '上', '下', '左', '右', '前', '后', '内', '外',
  '东', '西', '南', '北', '黑', '白', '日', '月', '火', '冷',
  '暖', '甘', '苦', '悲', '喜', '聚', '散', '动', '静', '问',
  '答', '来', '往', '出', '入', '朋', '辈', '同', '老', '师',
  '父', '母', '家', '人', '孩', '子', '世', '界', '城', '市',
  '道', '路', '回', '家', '吃', '饭', '喝', '水', '睡', '觉',
  '读', '书', '写', '歌', '跳', '舞', '画', '运', '动', '游',
  '戏', '健', '康', '幸', '福', '自', '由', '宁', '静', '从',
  '容', '专', '注', '清', '醒', '放', '松', '充', '实', '丰',
  '盈',
];

/**
 * 生成游戏用字符数组（每个字出现2次）
 * @param {number} n - 需要的不同字数（8×8网格 → n=32）
 * @returns {string[]} 长度为 2n 的数组
 */
export function generateGameChars(n = 32) {
  const pool = [...CHAR_POOL];
  const selected = [];

  // 随机抽取 n 个不同的字
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(idx, 1)[0]);
  }

  // 每个字出现2次
  const doubled = [...selected, ...selected];

  // Fisher-Yates 洗牌
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }

  return doubled; // length = 2n
}
