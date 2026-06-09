# ============================================
# zicodo 后端 Dockerfile
# 镜像：Node.js 20 + Express + SQLite + Sequelize
# 注意：sqlite3 是原生模块，需要编译环境（build-essential, python3 等）
# ============================================

FROM node:20-slim

LABEL maintainer="zicodo Team"
LABEL description="zicodo Backend - Express.js API Server with SQLite"

# 设置环境变量
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    DB_PATH=/app/data/digital_life.db \
    # npm 优化：跳过 postinstall scripts（某些包可能不需要）
    NPM_CONFIG_LOGLEVEL=warn

# 1. 安装系统依赖：
#    - build-essential, python3, make：用于编译 sqlite3 等原生模块
#    - wget, curl：用于健康检查和调试
#    - ca-certificates：HTTPS 证书
#    - tzdata：时区数据
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        python3 \
        make \
        gcc \
        g++ \
        wget \
        curl \
        ca-certificates \
        tzdata && \
    # 2. 设置时区为 Asia/Shanghai
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    # 3. 清理 apt 缓存，减小镜像体积
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# 设置工作目录
WORKDIR /app

# 4. 先复制 package 文件（利用 Docker 缓存，依赖不变时跳过安装）
COPY package*.json ./

# 5. 安装依赖：
#    --production：只安装 dependencies，不安装 devDependencies
RUN npm ci --production --legacy-peer-deps || \
    npm install --production --legacy-peer-deps

# 6. 复制所有源代码到容器
COPY . .

# 7. 创建数据库目录并设置权限
#    （确保 SQLite 数据文件的目录存在且可写）
RUN mkdir -p /app/data && \
    chmod -R 755 /app/data

# 8. 暴露应用端口（仅声明，实际映射由 docker-compose 管理）
EXPOSE 3000

# 9. 健康检查：访问 /api/health 端点
#    - 间隔：30 秒
#    - 超时：3 秒
#    - 重试：3 次
#    - 启动等待：15 秒（给数据库初始化时间）
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -q --spider http://localhost:3000/api/health || exit 1

# 10. 启动命令：使用 node 运行入口文件
#     （不使用 npm start，避免 npm 吃掉信号导致无法优雅停止）
CMD ["node", "src/app.js"]
