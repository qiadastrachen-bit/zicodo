'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db/connection');

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
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/tasks',   require('./routes/tasks'));
app.use('/api/pets',    require('./routes/pets'));
app.use('/api/points',  require('./routes/points'));
app.use('/api/teams',   require('./routes/teams'));
app.use('/api/ai',      require('./routes/ai'));
app.use('/ziling/api', require('./routes/ziling'));

// ─── 健康检查 ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ─── 全局错误处理 ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    code: status,
    message: err.message || '服务器内部错误',
  });
});

// ─── 启动 ─────────────────────────────────────────────────
async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log('[DB] SQLite 连接成功');
    // 体验服：普通 sync()，模型变更时手动重建数据库即可
    await sequelize.sync();
    console.log('[DB] 表结构同步完成');

    app.listen(PORT, () => {
      console.log(`\n🚀 数字生命后端已启动 → http://localhost:${PORT}`);
      console.log('   健康检查: GET /api/health\n');
    });
  } catch (err) {
    console.error('[启动失败]', err);
    process.exit(1);
  }
}

bootstrap();

module.exports = app; // Jest 测试用
