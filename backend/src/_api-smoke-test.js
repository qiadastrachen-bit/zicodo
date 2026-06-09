'use strict';

/**
 * API 冒烟测试 — 验证核心 /api/* 流程与数据库写入
 *
 * 用法（推荐）：
 *   终端1: npm run dev
 *   终端2: npm run smoke
 *
 * 脚本会先对本机 DB 执行 ensureDatabaseReady（与 app.js 相同逻辑），
 * 再请求 HTTP API。若后端是旧进程，请重启 npm run dev 后再跑 smoke。
 */

require('dotenv').config();
const http = require('http');
const path = require('path');
const { ensureDatabaseReady } = require('./db/migrate');
const { sequelize } = require('./db/connection');

const BASE = process.env.API_BASE || 'http://127.0.0.1:3000';

function request(method, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE);
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data || '{}') });
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || './data/zicodo.db');
  console.log('=== 0. Database ===');
  console.log(`   DB_PATH: ${dbPath}`);
  await ensureDatabaseReady();
  console.log('   表结构已就绪\n');

  const suffix = Date.now().toString().slice(-6);
  const username = `test_${suffix}`;
  const password = 'test123456';

  console.log('=== 1. Health ===');
  let health;
  try {
    health = await request('GET', '/api/health');
  } catch (e) {
    throw new Error(
      `无法连接后端 ${BASE} — 请先在另一终端运行: npm run dev\n原始错误: ${e.message}`
    );
  }
  assert(health.status === 200, `health failed: ${health.status}`);

  console.log('=== 2. Register ===');
  const reg = await request('POST', '/api/auth/register', { username, password, nickname: '测试昵称' });
  if (reg.body.code !== 0) {
    const hint = String(reg.body.message || '').includes('no such table')
      ? '\n提示: 后端可能是旧进程且未迁移。请 Ctrl+C 停掉 dev 后重新 npm run dev，再 npm run smoke'
      : '';
    throw new Error(`${reg.body.message || 'register failed'}${hint}`);
  }
  const token = reg.body.data.token;

  console.log('=== 3. Create team ===');
  const teamRes = await request('POST', '/api/teams', { name: `队_${suffix}`, description: 'smoke' }, token);
  assert(teamRes.body.code === 0, teamRes.body.message);
  const inviteCode = teamRes.body.data.inviteCode;
  assert(/^\d{6}$/.test(inviteCode), `invite must be 6 digits, got ${inviteCode}`);

  console.log('=== 4. List teams ===');
  const list = await request('GET', '/api/teams', null, token);
  assert(list.body.data.list.length === 1, 'should have 1 team');

  console.log('=== 5. Register user2 & join ===');
  const reg2 = await request('POST', '/api/auth/register', { username: `test2_${suffix}`, password });
  assert(reg2.body.code === 0, reg2.body.message);
  const token2 = reg2.body.data.token;
  const join = await request('POST', '/api/teams/join', { inviteCode }, token2);
  assert(join.body.code === 0, join.body.message);

  console.log('=== 6. Update profile ===');
  const prof = await request('PUT', '/api/users/me', { nickname: '新昵称' }, token2);
  assert(prof.body.code === 0, prof.body.message);

  console.log('=== 7. Leave team (user2) ===');
  const joinedTeamId = join.body.data.id;
  const leave = await request('POST', '/api/teams/leave', { teamId: joinedTeamId }, token2);
  assert(leave.body.code === 0, leave.body.message);
  const list2 = await request('GET', '/api/teams', null, token2);
  assert(list2.body.data.list.length === 0, 'user2 should have no team');

  console.log('\n✅ 全部 API 冒烟测试通过');
  console.log(`   测试用户: ${username} / ${password}`);
  console.log(`   邀请码样例: ${inviteCode}`);

  await sequelize.close();
}

main().catch((err) => {
  console.error('\n❌ 测试失败:', err.message);
  sequelize.close().finally(() => process.exit(1));
});
