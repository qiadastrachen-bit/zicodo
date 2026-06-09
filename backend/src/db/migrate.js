'use strict';

/**
 * migrate.js — umzug 迁移管理引擎
 *
 * 职责：
 *   1. 配置 umzug（扫描 migrations/ 目录下的所有 migration 文件）
 *   2. 用 JSONStorage 记录已执行过的 migration（幂等保证）
 *   3. 提供两种使用方式：
 *      - 编程式：const { umzug } = require('./db/migrate'); await umzug.up();
 *      - CLI式：node src/db/migrate.js up | down | pending | executed
 *
 * 与现有架构的兼容性：
 *   - 复用 connection.js 中的 sequelize 实例（queryInterface 作为每个
 *     migration up/down 的 context 参数，供 queryInterface.createTable 等使用）
 *   - 不改变任何 model.js 的写法，model 仍然是 Sequelize 的标准定义
 *   - app.js 只需把原来的 sequelize.sync() 替换为 umzug.up()
 *
 * 迁移幂等保证：
 *   - 每个 migration 只执行一次（JSONStorage 里有记录就跳过）
 *   - 按文件名顺序执行（001 → 002 → 003 ...）
 *   - down 支持精确回滚到某个历史版本
 */

const path = require('path');
const { Umzug, JSONStorage } = require('umzug');
const { sequelize } = require('./connection');

const fs = require('fs');
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const STORAGE_PATH = path.join(DATA_DIR, 'migrations-log.json');

/** 确保 data 目录存在 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * 构造 umzug 实例
 *
 * context：每个 migration 文件的 up/down 函数都会接收到 { context: queryInterface, Sequelize }
 *   这样 migration 内部可以写：
 *     up: async ({ context: queryInterface }) => {
 *       await queryInterface.createTable('xxx', { ... });
 *     }
 */
const umzug = new Umzug({
  migrations: {
    glob: ['*.js', { cwd: MIGRATIONS_DIR }],
    resolve: ({ name, path: filePath, context }) => {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const migration = require(filePath);
      return {
        name,
        up: async () => migration.up(context),
        down: async () => migration.down && migration.down(context),
      };
    },
  },
  context: {
    context: sequelize.getQueryInterface(),
    Sequelize: require('sequelize'),
    sequelize,
  },
  storage: new JSONStorage({ path: STORAGE_PATH }),
  logger: console,
});

/**
 * CLI 支持
 *   node src/db/migrate.js up       —— 执行所有未跑过的 migration
 *   node src/db/migrate.js down     —— 回滚最后一个 migration
 *   node src/db/migrate.js pending  —— 列出待执行的 migration
 *   node src/db/migrate.js executed —— 列出已执行的 migration
 */
async function runCli() {
  const [,, cmd] = process.argv;
  if (!cmd) {
    console.log('[migrate] 使用方式：');
    console.log('  node src/db/migrate.js up       执行所有待执行 migration');
    console.log('  node src/db/migrate.js down     回滚最后一个 migration');
    console.log('  node src/db/migrate.js pending  列出待执行的 migration');
    console.log('  node src/db/migrate.js executed 列出已执行的 migration');
    process.exit(0);
  }

  switch (cmd) {
    case 'up':
      await umzug.up();
      console.log('[migrate] ✅ 所有 migration 已执行');
      break;
    case 'down':
      await umzug.down();
      console.log('[migrate] ✅ 已回滚最后一个 migration');
      break;
    case 'pending': {
      const pending = await umzug.pending();
      console.log('[migrate] 待执行 migration：');
      pending.forEach((m) => console.log('  -', m.name));
      if (pending.length === 0) console.log('  （无）');
      break;
    }
    case 'executed': {
      const executed = await umzug.executed();
      console.log('[migrate] 已执行 migration：');
      executed.forEach((m) => console.log('  -', m.name));
      if (executed.length === 0) console.log('  （无）');
      break;
    }
    default:
      console.error('[migrate] 未知命令：', cmd);
      process.exit(1);
  }
}

// 直接用 node 跑本文件时走 CLI；被 require 时导出 umzug 实例（供 app.js 使用）
if (require.main === module) {
  runCli().catch((err) => {
    console.error('[migrate] 执行失败：', err);
    process.exit(1);
  });
}

/**
 * 启动前数据库自检：
 * - 若 migrations-log 显示已执行但核心表缺失（如 users），重置日志并重新迁移
 */
async function ensureDatabaseReady() {
  ensureDataDir();
  await sequelize.authenticate();

  const qi = sequelize.getQueryInterface();
  const tables = await qi.showAllTables();
  const hasUsers = tables.some((t) => String(t).toLowerCase() === 'users');

  if (!hasUsers) {
    const pending = await umzug.pending();
    if (pending.length === 0) {
      console.warn('[DB] ⚠️  migrations 日志显示已完成，但 users 表不存在 — 重置迁移记录并重建表结构');
      if (fs.existsSync(STORAGE_PATH)) {
        fs.unlinkSync(STORAGE_PATH);
      }
    }
    const toRun = await umzug.pending();
    if (toRun.length > 0) {
      console.log(`[DB] 待执行 migration：${toRun.length} 个`);
      toRun.forEach((m) => console.log(`       - ${m.name}`));
      const executed = await umzug.up();
      console.log(`[DB] ✅ 已执行 ${executed.length} 个 migration`);
    }
  } else {
    const pending = await umzug.pending();
    if (pending.length > 0) {
      console.log(`[DB] 待执行 migration：${pending.length} 个`);
      pending.forEach((m) => console.log(`       - ${m.name}`));
      const executed = await umzug.up();
      console.log(`[DB] ✅ 已执行 ${executed.length} 个 migration`);
    }
  }

  const after = await qi.showAllTables();
  if (!after.some((t) => String(t).toLowerCase() === 'users')) {
    throw new Error('数据库迁移后仍缺少 users 表，请检查 migration 文件');
  }
}

module.exports = { umzug, ensureDatabaseReady, ensureDataDir, STORAGE_PATH };
