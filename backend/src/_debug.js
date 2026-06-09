'use strict';

/** 调试：打印关键错误路径的实际响应体 */
const http = require('http');

function request(path, { method = 'GET', body = null, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost', port: 3000, path, method,
      headers: { 'Content-Type': 'application/json', ...headers },
    };
    const req = http.request(opts, res => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, raw: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // 1. 登录失败
  console.log('[1] 错误密码');
  const a = await request('/api/auth/login', {
    method: 'POST', body: { username: 'nope', password: 'nope' },
  });
  console.log(JSON.stringify(a, null, 2));

  // 2. 短密码
  console.log('\n[2] 短密码');
  const b = await request('/api/auth/register', {
    method: 'POST', body: { username: 'weak', password: '123' },
  });
  console.log(JSON.stringify(b, null, 2));

  // 3. 自动登录
  console.log('\n[3] 自动登录');
  const c = await request('/api/auth/auto-login', { method: 'POST' });
  console.log(JSON.stringify(c, null, 2));

  // 4. 404
  console.log('\n[4] 404');
  const d = await request('/api/does-not-exist');
  console.log(JSON.stringify(d, null, 2));

  // 5. 无 token 访问
  console.log('\n[5] 无 token 访问 /api/pets/mine');
  const e = await request('/api/pets/mine');
  console.log(JSON.stringify(e, null, 2));
}

main();
