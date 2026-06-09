'use strict';

/**
 * app.js — Express 应用入口
 *
 * 数据库启动流程（2026-06-09 改为 umzug 迁移系统）：
 *   1. sequelize.authenticate() — 验证数据库连接
 *   2. umzug.up() — 按顺序执行所有未跑过的 migration（幂等）
 *   3. 启动 HTTP 服务器
 *
 * 迁移系统特性：
 *   - 每个 migration 只执行一次（JSONStorage 记录已执行）
 *   - 完全替代原先的 sequelize.sync({ alter: true })
 *   - 不会出现 backup 表冲突、不会重建已有表（不破坏数据）
 *   - 支持精确回滚（npm run migrate:down）
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db/connection');
const { ensureDatabaseReady } = require('./db/migrate');

const { notFoundHandler, errorHandler } = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── 中间件 ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志（开发用）
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── 路由 ────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/tasks',    require('./routes/tasks'));
app.use('/api/pets',     require('./routes/pets'));
app.use('/api/points',   require('./routes/points'));
app.use('/api/teams',    require('./routes/teams'));
app.use('/api/ai',       require('./routes/ai'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/inspection-runs', require('./routes/inspection'));
app.use('/ziling/api',   require('./routes/ziling'));

// ─── 健康检查 ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ─── 错误处理（必须放在路由之后） ───────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── 启动 ─────────────────────────────────────────────────
// 基于 umzug 的迁移系统启动（替代原先的 sync+alter 回退逻辑）
async function bootstrap() {
  try {
    // 1–2) 连接数据库并确保 migration 与表结构一致
    await ensureDatabaseReady();
    console.log('[DB] SQLite 连接成功，表结构就绪');

    // 3) 启动 HTTP 服务器（端口占用仍给用户友好提示）
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 数字生命后端已启动 → http://localhost:${PORT}`);
      console.log('   健康检查: GET /api/health');
      console.log('   数据库: umzug 迁移系统（SQLite）\n');
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ 端口 ${PORT} 已被占用`);
        console.error(`   请先关闭其他占用 ${PORT} 端口的程序`);
        console.error(`   或在 .env 中修改 PORT 为其他端口\n`);
        process.exit(1);
      }
      console.error(err);
      process.exit(1);
    });
  } catch (err) {
    console.error('[启动失败]', err);
    process.exit(1);
  }
}

bootstrap();

module.exports = app; // Jest 测试用
