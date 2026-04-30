# 去除班味 - 后端服务 Dockerfile
# 多阶段构建，减小镜像体积

# ==================== 构建阶段 ====================
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production=false

# 复制源代码
COPY . .

# 构建
RUN npm run build

# ==================== 生产阶段 ====================
FROM node:20-alpine AS production

# 安装必要工具
RUN apk add --no-cache dumb-init

# 创建应用用户（非root运行）
RUN addgroup -g 1001 -S banwei && \
    adduser -S banwei -u 1001 -G banwei

WORKDIR /app

# 复制生产依赖
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# 复制构建产物
COPY --from=builder /app/dist ./dist

# 创建日志目录
RUN mkdir -p /app/logs && chown -R banwei:banwei /app

# 切换到非root用户
USER banwei

# 暴露端口
EXPOSE 3000

# 使用dumb-init处理信号
ENTRYPOINT ["dumb-init", "--"]

# 启动命令
CMD ["node", "dist/main.js"]
