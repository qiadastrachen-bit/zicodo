'use strict';

/**
 * 系统自检 smoke-test
 *
 * 运行：
 *   node src/_smoke-test.js
 *   或：node src/_smoke-test.js "本次检查标题"
 *
 * 执行流程：
 *   1. 顺序调用关键接口
 *   2. 汇总通过 / 失败数
 *   3. 调用 POST /api/inspection-runs 把结果写入数据库
 */

const http = require('http');

const HOST = 'localhost';
const PORT = 3000;
const DEFAULT_TITLE = '统一错误处理与 502 问题解决后 · 自检';

function request(path, { method = 'GET', body = null, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: HOST,
      port: PORT,
      path,
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
    };
    const req = http.request(opts, res => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => { data += c; });
      res.on('end', () => {
        let json = null;
        try { json = data ? JSON.parse(data) : null; }
        catch { json = { _raw: data }; }
        resolve({ status: res.statusCode, body: json });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

let pass = 0, fail = 0;
const cases = [];

function assert(name, cond, detail) {
  const ok = !!cond;
  if (ok) pass++; else fail++;
  cases.push({ name, status: ok ? 'pass' : 'fail', detail: detail || '' });
  console.log(`  ${ok ? '✔' : '✘'}  ${name}${detail ? `  ${detail}` : ''}`);
}

async function main() {
  const title = (process.argv[2] || DEFAULT_TITLE).trim();
  const startedAt = Date.now();

  console.log(`\n== ${title} ==`);

  // 先确认后端是否可用
  try {
    const health = await request('/api/health');
    assert('健康检查返回 200', health.status === 200, `status=${health.status}`);
  } catch (err) {
    console.error(`无法连接后端 http://${HOST}:${PORT} —— 请先启动服务`);
    console.error(err.message);
    process.exit(2);
  }

  console.log('\n== 认证模块 ==');
  const reg = await request('/api/auth/register', {
    method: 'POST',
    body: { username: 'test_' + Date.now(), password: 'Abc12345' },
  });
  assert('注册成功', reg.status === 201 && reg.body?.code === 0, `status=${reg.status}`);

  const token = reg.body?.data?.token;
  assert('返回 token', !!token);

  const shortPwd = await request('/api/auth/register', {
    method: 'POST', body: { username: 'weak_' + Date.now(), password: '123' },
  });
  assert('短密码抛出业务错误', shortPwd.status === 400 && shortPwd.body?.code === 1103,
    `status=${shortPwd.status} code=${shortPwd.body?.code}`);

  const dup = await request('/api/auth/register', {
    method: 'POST', body: { username: reg.body.data.user.username, password: 'Abc12345' },
  });
  assert('重名用户返回 1101', dup.status === 409 && dup.body.code === 1101,
    `status=${dup.status} code=${dup.body.code}`);

  const badLogin = await request('/api/auth/login', {
    method: 'POST', body: { username: 'nope', password: 'nope' },
  });
  assert('错误密码返回 1102', badLogin.status === 401 && badLogin.body.code === 1102,
    `status=${badLogin.status} code=${badLogin.body.code}`);

  console.log('\n== 鉴权中间件 ==');
  const noToken = await request('/api/pets/mine');
  assert('无 token 访问返回 401 + code=1001',
    noToken.status === 401 && noToken.body.code === 1001,
    `status=${noToken.status} code=${noToken.body.code}`);

  const badToken = await request('/api/pets/mine', {
    headers: { Authorization: 'Bearer invalid-token' },
  });
  assert('非法 token 返回 401 + code=1002',
    badToken.status === 401 && badToken.body.code === 1002,
    `status=${badToken.status} code=${badToken.body.code}`);

  console.log('\n== 宠物模块 ==');
  const pet = await request('/api/pets/mine', {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert('获取我的宠物', pet.status === 200 && pet.body.code === 0, `status=${pet.status}`);

  console.log('\n== 积分模块 ==');
  const bal = await request('/api/points/balance', {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert('获取积分余额', bal.status === 200 && bal.body.code === 0);

  console.log('\n== 未知路由 -> 404 统一 JSON ==');
  const notFound = await request('/api/does-not-exist');
  assert('返回 404 且格式正确',
    notFound.status === 404 && notFound.body && notFound.body.message !== undefined,
    `status=${notFound.status} message=${notFound.body?.message}`);

  console.log('\n== 字灵宠物端 API ==');
  const zilingPing = await request('/ziling/api/ping');
  assert('/ziling/api/ping 健康检查', zilingPing.status === 200 && zilingPing.body?.status === 'ok');

  const zilingChat = await request('/ziling/api/chat', {
    method: 'POST', body: { message: '你好' },
  });
  assert('/ziling/api/chat 返回统一格式',
    zilingChat.status === 200 && zilingChat.body?.code === 0 && zilingChat.body.data,
    `status=${zilingChat.status}`);

  console.log('\n== 自动登录（老用户直接进入） ==');
  const autoLogin = await request('/api/auth/auto-login', { method: 'POST' });
  assert('自动登录返回 token',
    autoLogin.status === 201 && autoLogin.body?.code === 0 && autoLogin.body.data?.token,
    `status=${autoLogin.status}`);

  const durationMs = Date.now() - startedAt;
  const total = pass + fail;
  const summary = `${pass} / ${total} 通过` + (fail ? '，存在失败用例' : '');

  console.log(`\n──────────────`);
  console.log(`通过: ${pass} / 总数: ${total}   耗时: ${durationMs}ms`);
  console.log(summary);

  // ─── 写入执行记录 ─────────────────────────────────
  try {
    const save = await request('/api/inspection-runs', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: {
        title,
        total,
        passed: pass,
        durationMs,
        cases,
        summary,
        operator: 'smoke-test.js',
      },
    });
    if (save.status === 201 && save.body?.code === 0) {
      console.log(`\n✅ 本次检查已写入执行记录 (id=${save.body.data.id.slice(0, 8)}...)`);
      console.log(`   可调用：GET /api/inspection-runs/${save.body.data.id} 查看详情`);
    } else {
      console.log(`\n⚠️  执行记录接口未按预期返回：status=${save.status}`);
      console.log('   response body:', JSON.stringify(save.body));
    }
  } catch (err) {
    console.log(`\n⚠️  写入执行记录失败：${err.message}`);
  }

  if (fail > 0) process.exit(1);
}

main().catch(err => {
  console.error('[smoke-test 异常]', err);
  process.exit(2);
});
