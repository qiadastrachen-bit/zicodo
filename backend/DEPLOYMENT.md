# 字灵部署文档

## 环境要求

- 服务器：120.53.11.84（腾讯云）
- 操作系统：Linux（推荐 Ubuntu 20.04+）
- Docker：20.10+
- Docker Compose：2.0+

## 部署步骤

### 1. 安装 Docker 和 Docker Compose

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
apt-get update
apt-get install docker-compose-plugin -y

# 验证安装
docker --version
docker compose version
```

### 2. 上传项目文件到服务器

**方式一：使用 SCP（在本地执行）**

```bash
# 在本地 Windows PowerShell 执行
scp -r D:\Ziling-app\backend\* root@120.53.11.84:/opt/ziling-app/
```

**方式二：使用 WinSCP（图形化）**

1. 打开 WinSCP
2. 连接到 120.53.11.84
3. 上传 `D:\Ziling-app\backend\` 目录到 `/opt/ziling-app/`

**需要上传的文件/目录：**

```
/opt/ziling-app/
├── docker-compose.yml
├── nginx.conf
├── ziling-backend/          # 后端源码
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── data/
└── frontend/dist/           # 前端构建产物
```

### 3. 配置环境变量

在服务器上编辑 `.env` 文件：

```bash
cd /opt/ziling-app
nano .env
```

填入真实值：

```env
DASHSCOPE_API_KEY=sk-your_real_key_here
AI_PROVIDER=deepseek
AI_MODEL=deepseek-chat
JWT_SECRET=your_super_secret_jwt_key
```

### 4. 启动服务

```bash
cd /opt/ziling-app
docker compose up -d
```

### 5. 验证部署

```bash
# 检查容器状态
docker compose ps

# 查看日志
docker compose logs -f

# 测试前端
curl http://120.53.11.84/

# 测试后端 API
curl http://120.53.11.84/api/health
```

## 常见问题

### 问题 1：前端无法访问

**原因：** `frontend/dist/` 目录不存在或为空

**解决：**
```bash
# 在本地重新构建前端
cd D:\Ziling-app\backend\frontend
npm install
npm run build

# 重新上传 dist/ 目录
scp -r D:\Ziling-app\backend\frontend\dist root@120.53.11.84:/opt/ziling-app/frontend/
```

### 问题 2：后端 API 返回 502

**原因：** 后端服务未启动或端口未暴露

**解决：**
```bash
# 检查后端容器日志
docker compose logs ziling-backend

# 重启服务
docker compose restart ziling-backend
```

### 问题 3：PWA 无法安装

**原因：** HTTPS 未配置（PWA 需要 HTTPS 或 localhost）

**解决：**
1. 配置 HTTPS（推荐使用 Let's Encrypt）
2. 或者在内网环境测试（localhost）

## 更新部署

当代码有更新时：

```bash
# 1. 在本地重新构建前端
cd D:\Ziling-app\backend\frontend
npm run build

# 2. 上传更新后的文件
scp -r D:\Ziling-app\backend\frontend\dist\* root@120.53.11.84:/opt/ziling-app/frontend/dist/
scp -r D:\Ziling-app\backend\ziling-backend\src root@120.53.11.84:/opt/ziling-app/ziling-backend/

# 3. 重启服务
ssh root@120.53.11.84 "cd /opt/ziling-app && docker compose restart"
```

## 停止服务

```bash
cd /opt/ziling-app
docker compose down
```

## 备份数据

```bash
# 备份 SQLite 数据库
ssh root@120.53.11.84 "cd /opt/ziling-app && tar -czf backup-$(date +%Y%m%d).tar.gz ziling-backend/data/"

# 下载备份到本地
scp root@120.53.11.84:/opt/ziling-app/backup-*.tar.gz D:\Ziling-app\backups\
```
