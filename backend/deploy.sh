#!/bin/bash
# deploy.sh - 字灵部署脚本
# 用法：在云服务器上执行此脚本

set -e

SERVER_IP="120.53.11.84"
DEPLOY_USER="root"  # 根据实际情况修改
DEPLOY_PATH="/opt/ziling-app"

echo "=== 字灵部署脚本 ==="
echo "目标服务器: $SERVER_IP"
echo "部署路径: $DEPLOY_PATH"
echo ""

# 1. 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    echo "安装命令: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# 2. 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装"
    echo "安装命令: apt-get install docker-compose-plugin"
    exit 1
fi

# 3. 创建部署目录
echo "📁 创建部署目录..."
mkdir -p $DEPLOY_PATH
cd $DEPLOY_PATH

# 4. 复制文件到服务器（需要在本地执行）
echo "⚠️  请在本地执行以下命令上传文件："
echo ""
echo "scp -r D:/Ziling-app/backend/* ${DEPLOY_USER}@${SERVER_IP}:${DEPLOY_PATH}/"
echo ""
echo "或者手动上传以下文件/目录："
echo "  - docker-compose.yml"
echo "  - ziling-backend/ (整个目录)"
echo "  - frontend/dist/ (构建产物)"
echo "  - nginx.conf"
echo ""

# 5. 创建 .env 文件
echo "🔧 创建环境变量文件..."
cat > .env << EOF
DASHSCOPE_API_KEY=your_api_key_here
AI_PROVIDER=deepseek
AI_MODEL=deepseek-chat
JWT_SECRET=your_jwt_secret_here
EOF

echo "⚠️  请编辑 .env 文件，填入真实的 API Key 和 JWT Secret"

# 6. 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 7. 检查服务状态
echo "✅ 检查服务状态..."
docker-compose ps

echo ""
echo "=== 部署完成 ==="
echo "前端访问地址: http://${SERVER_IP}"
echo "后端 API 地址: http://${SERVER_IP}/api"
echo ""
echo "查看日志: docker-compose logs -f"
echo "停止服务: docker-compose down"
