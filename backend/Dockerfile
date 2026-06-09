# 使用 Node.js 18 Alpine 镜像（轻量，适合生产环境）
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 先复制 package 文件，利用 Docker 缓存层（依赖不变时不重装）
COPY package.json package-lock.json ./

# 安装生产依赖
RUN npm install --omit=dev

# 复制源代码
COPY src/ ./src/

# SQLite 数据目录（运行时由 volume 挂载持久化）
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 3000

# 环境变量
ENV NODE_ENV=production

# 启动命令
CMD ["node", "src/app.js"]
