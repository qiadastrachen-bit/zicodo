#!/bin/bash
# zicodo 服务器首次部署脚本
# 用法：在 /opt/zicodo 目录执行 ./scripts/server-first-deploy.sh

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=========================================="
echo " zicodo 首次部署"
echo " 目录: $ROOT"
echo "=========================================="

if ! command -v docker >/dev/null 2>&1; then
  echo "❌ 未找到 docker，请确认服务器已安装 Docker CE"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "❌ 未找到 docker compose"
  exit 1
fi

if [ ! -f backend/.env ]; then
  echo "❌ 缺少 backend/.env"
  echo "   请先执行: cp backend/.env.example backend/.env"
  echo "   然后编辑填入 DEEPSEEK_API_KEY 和 JWT_SECRET"
  exit 1
fi

if grep -q 'YOUR_DEEPSEEK_API_KEY_HERE' backend/.env 2>/dev/null; then
  echo "❌ backend/.env 里仍是占位符，请填写真实的 DEEPSEEK_API_KEY"
  exit 1
fi

echo "✓ 环境检查通过，开始构建（首次约 5～15 分钟）..."
docker compose up -d --build

echo ""
echo "等待服务启动..."
sleep 8

echo ""
docker compose ps

echo ""
if curl -sf http://localhost/api/health >/dev/null 2>&1; then
  echo "✅ 健康检查通过: http://localhost/api/health"
else
  echo "⚠️  健康检查未通过，请查看日志:"
  echo "   docker compose logs backend --tail 50"
fi

echo ""
echo "=========================================="
echo " 部署完成。浏览器访问:"
echo "   http://120.53.11.84"
echo "   或 http://$(curl -s --max-time 2 ifconfig.me 2>/dev/null || echo '你的公网IP')"
echo "=========================================="
