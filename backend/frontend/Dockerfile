# ============================================
# zicodo 前端 Dockerfile - 多阶段构建
# Stage 1: 使用 Node.js 构建静态资源
# Stage 2: 使用 Nginx 提供静态服务 + 反向代理
# ============================================

# ---------- Stage 1: 构建阶段 ----------
FROM node:20-alpine AS builder

WORKDIR /app

# 1. 先复制 package 文件以利用 Docker 缓存
COPY package*.json ./

# 2. 安装依赖（跳过可选依赖以加快构建）
RUN npm ci --no-optional || npm install --no-optional

# 3. 复制所有源代码
COPY . .

# 4. 创建生产环境配置（确保 API 路径为相对路径）
RUN echo "VITE_API_BASE_URL=" > .env.production && \
    echo "VITE_APP_NAME=zicodo" >> .env.production && \
    echo "VITE_APP_VERSION=0.0.0" >> .env.production

# 5. 执行生产构建（生成 dist/ 目录）
RUN npm run build

# ---------- Stage 2: 运行阶段 ----------
FROM nginx:alpine

LABEL maintainer="zicodo Team"
LABEL description="zicodo Frontend - Vue 3 SPA served by Nginx"

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

# 从构建阶段复制静态资源到 Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 HTTP 端口
EXPOSE 80

# 健康检查：验证首页可访问
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

# 启动 Nginx（前台运行）
CMD ["nginx", "-g", "daemon off;"]
