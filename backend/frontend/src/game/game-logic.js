/**
 * zicodo · 汉字消消乐 — 游戏核心逻辑（找相同字版）
 * 移植自 ziling_new/js/game/wordmatch.js
 * 改动：去掉 AI 判定，改为"找相同字"逻辑
 */
import { generateGameChars } from './chars.js';

export class GameLogic {
  /**
   * @param {object} opts
   *   - size: 网格一边长度（默认8 → 8×8=64格）
   *   - onScoreChange: 分数变化回调
   *   - onGameComplete: 通关回调
   */
  constructor(opts = {}) {
    this.size = opts.size || 8;
    this.onScoreChange = opts.onScoreChange || (() => {});
    this.onGameComplete = opts.onGameComplete || (() => {});

    this.score = 0;
    this.time = 0;        // 秒数（可选计时功能）
    this.timer = null;
    this.sel = null;        // 当前选中的 {row, col, char}
    this.busy = false;     // 动画期间禁止点击
    this.cells = [];       // size×size 网格，每项 {char, cleared}
    
    this._init();
  }

  // 初始化 / 重新开始
  _init() {
    const chars = generateGameChars(this.size * this.size / 2); // 64格 → 32种×2
    this.cells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        this.cells.push({
          row: r,
          col: c,
          char: chars[r * this.size + c],
          cleared: false,
          active: false,   // 是否被选中
        });
      }
    }
    this.sel = null;
    this.busy = false;
    this.score = 0;
  }

  /** 重新开始 */
  restart() {
    this._init();
    this.onScoreChange(this.score);
  }

  /** 点击格子 */
  tap(row, col) {
    if (this.busy) return null;
    const idx = row * this.size + col;
    const cell = this.cells[idx];
    if (cell.cleared) return null;

    // 第一次点击 → 选中
    if (!this.sel) {
      cell.active = true;
      this.sel = { row, col, char: cell.char };
      return { type: 'select', cell };
    }

    // 第二次点击 → 判定
    const first = this.sel;

    // 点同一个格子 → 取消选中
    if (first.row === row && first.col === col) {
      cell.active = false;
      this.sel = null;
      return { type: 'deselect', cell };
    }

    // 判定：相同字 → 消除
    if (first.char === cell.char) {
      this.busy = true;
      cell.active = true;

      // 延迟执行消除动画
      setTimeout(() => {
        const idx1 = first.row * this.size + first.col;
        const idx2 = row * this.size + col;
        this.cells[idx1].cleared = true;
        this.cells[idx2].cleared = true;

        this.score += 10;
        this.onScoreChange(this.score);

        this.sel = null;
        this.busy = false;

        // 检查是否全部消除
        if (this.cells.every(c => c.cleared)) {
          this.onGameComplete(this.score, this.time);
        }
      }, 300); // 等待墨色溢出动效

      return {
        type: 'match',
        cells: [first, { row, col, char: cell.char }],
      };
    }

    // 判定：不同字 → 抖动
    cell.active = true;
    this.busy = true;
    setTimeout(() => {
      const idx1 = first.row * this.size + first.col;
      const idx2 = row * this.size + col;
      this.cells[idx1].active = false;
      this.cells[idx2].active = false;
      this.sel = null;
      this.busy = false;
    }, 400); // 等待抖动动效

    return {
      type: 'mismatch',
      cells: [first, { row, col, char: cell.char }],
    };
  }

  /** 开始计时（可选） */
  startTimer() {
    this.timer = setInterval(() => {
      this.time++;
    }, 1000);
  }

  /** 停止计时 */
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /** 销毁 */
  destroy() {
    this.stopTimer();
  }
}
