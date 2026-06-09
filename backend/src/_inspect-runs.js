'use strict';

const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: 'localhost', port: 3000, path, method: 'GET' }, res => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, raw: data }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const list = await get('/api/inspection-runs');
  if (list.status === 200 && list.body?.code === 0) {
    const rows = list.body.data.rows || [];
    console.log(`总记录数: ${list.body.data.total || rows.length}`);
    rows.forEach(r => {
      const when = new Date(r.createdAt).toLocaleString('zh-CN');
      console.log(`  [${when}] ${r.title}  →  ${r.passed}/${r.total}  耗时 ${r.durationMs || '-'}ms`);
    });
    if (rows.length > 0) {
      const first = await get('/api/inspection-runs/' + rows[0].id);
      console.log('\n=== 最新一条详情 ===');
      console.log(JSON.stringify(first.body?.data, null, 2));
    }
  } else {
    console.log('列表接口失败', JSON.stringify(list));
  }
}

main();
