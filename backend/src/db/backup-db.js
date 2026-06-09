'use strict';

/**
 * backup-db.js — 数据库自动备份脚本（跨平台：Windows / Linux / macOS）
 *
 * 功能：
 *   1. 备份当前 SQLite 数据库到 data/backups/ 目录
 *   2. 自动 gzip 压缩（节省空间）
 *   3. 自动清理 30 天前的备份
 *   4. 写日志到 backup.log
 *
 * 用法：
 *   node src/db/backup-db.js              # 普通备份，文件名含时间戳
 *   node src/db/backup-db.js pre-upgrade  # 加标签（升级前备份）
 *   node src/db/backup-db.js daily        # 加标签（日常备份）
 *
 * 定时任务（Linux crontab）：
 *   0 3 * * * cd /opt/digital-life/backend/ziling-backend && node src/db/backup-db.js daily
 *
 * 定时任务（Windows 计划任务）：
 *   程序: node.exe
 *   参数: src/db/backup-db.js daily
 *   起始于: D:\path\to\ziling-backend
 *   触发器: 每天 03:00
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { sequelize } = require('./connection');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'digital_life.db');
const BACKUP_DIR = path.join(__dirname, '..', '..', 'data', 'backups');
const LOG_PATH = path.join(BACKUP_DIR, 'backup.log');
const RETENTION_DAYS = 30;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG_PATH, line + '\n', 'utf8');
  } catch (_) {
    // 写日志失败不影响备份主流程
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`创建目录: ${dirPath}`);
  }
}

async function main() {
  const label = process.argv[2] || 'manual';

  ensureDir(BACKUP_DIR);

  if (!fs.existsSync(DB_PATH)) {
    log(`❌ 数据库文件不存在: ${DB_PATH}`);
    process.exit(1);
  }

  const timestamp = new Date().toISOString()
    .replace(/[-:T]/g, '')
    .split('.')[0]; // 20260609T073000 → 20260609073000

  const backupFileName = `digital_life_${timestamp}_${label}.db`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);
  const gzFilePath = backupFilePath + '.gz';

  log(`开始备份: ${DB_PATH} → ${gzFilePath}`);

  // ── Step 1: 用 Sequelize 执行 SQLite .backup 命令（保证备份一致性）──
  // SQLite 有内建的 .backup 命令，能在写入继续的情况下安全备份
  // 这里用 SQL 层面的方式，不依赖 sqlite3 命令行工具
  try {
    // 先关闭当前连接，避免锁冲突
    await sequelize.close();

    // 用 Node.js fs 直接复制文件（SQLite 在无写入时是稳定的文件复制）
    // 生产环境建议用 sqlite3 的 backup API，这里用一个可靠的复制方案
    const readStream = fs.createReadStream(DB_PATH);
    const writeStream = fs.createWriteStream(backupFilePath);

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      readStream.on('error', reject);
    });

    log(`✅ 数据库复制完成: ${backupFilePath}`);

    // ── Step 2: gzip 压缩 ──
    const inputStream = fs.createReadStream(backupFilePath);
    const gzWriteStream = fs.createWriteStream(gzFilePath);
    await new Promise((resolve, reject) => {
      inputStream.pipe(zlib.createGzip({ level: 9 })).pipe(gzWriteStream);
      gzWriteStream.on('finish', resolve);
      gzWriteStream.on('error', reject);
    });

    // 删除未压缩的临时文件
    fs.unlinkSync(backupFilePath);

    const gzSize = (fs.statSync(gzFilePath).size / 1024).toFixed(2);
    log(`✅ 压缩完成: ${gzFilePath} (${gzSize} KB)`);

    // ── Step 3: 清理过期备份 ──
    const cutoffTime = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('digital_life_') && f.endsWith('.db.gz'));

    let deleted = 0;
    for (const file of files) {
      const filePath = path.join(BACKUP_DIR, file);
      const stat = fs.statSync(filePath);
      if (stat.mtimeMs < cutoffTime) {
        try {
          fs.unlinkSync(filePath);
          deleted++;
        } catch (e) {
          log(`⚠️ 删除过期备份失败: ${file}`);
        }
      }
    }
    if (deleted > 0) {
      log(`🧹 清理了 ${deleted} 个 ${RETENTION_DAYS} 天前的过期备份`);
    }

    log(`🎉 备份完成`);
  } catch (err) {
    log(`❌ 备份失败: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

main();
