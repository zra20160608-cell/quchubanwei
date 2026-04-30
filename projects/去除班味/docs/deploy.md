# 去除班味 — 部署文档

> **版本**: v1.0  
> **更新日期**: 2026-04-30  
> **环境**: 生产环境

---

## 一、架构概览

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   微信小程序  │────→│   Nginx     │────→│  NestJS API │
│   (Taro)     │     │  (反向代理)  │     │   (Node.js) │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                       ┌────────────────────────┼────────────────────────┐
                       │                        │                        │
                       ▼                        ▼                        ▼
                  ┌─────────┐            ┌─────────┐            ┌─────────┐
                  │PostgreSQL│            │  Redis  │            │  OSS    │
                  │(主数据库)│            │ (缓存)  │            │(图片存储)│
                  └─────────┘            └─────────┘            └─────────┘
```

---

## 二、服务器配置

### 2.1 云服务器规格

| 组件 | 规格 | 数量 | 说明 |
|------|------|------|------|
| ECS | 2核4G | 2台 | API服务器（负载均衡） |
| PostgreSQL | 4核8G | 1台 | 主数据库 |
| Redis | 2核4G | 1台 | 缓存服务 |
| OSS | 标准存储 | - | 图片/文件存储 |

### 2.2 系统环境

```bash
# 操作系统
Ubuntu 22.04 LTS

# 基础软件
Node.js v18+
PostgreSQL 14+
Redis 7+
Nginx 1.20+
PM2 5+

# 安装命令
apt update && apt upgrade -y
apt install -y nginx postgresql redis-server git curl

# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g pm2
```

---

## 三、部署流程

### 3.1 后端部署

```bash
# 1. 克隆代码
git clone https://github.com/zra20160608-cell/quchubanwei.git
cd quchubanwei/projects/去除班味/src/backend

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.production
# 编辑 .env.production 填写生产配置

# 4. 数据库迁移
npm run migration:run

# 5. 构建
npm run build

# 6. PM2启动
pm2 start dist/main.js --name "banwei-api"
pm2 save
pm2 startup
```

### 3.2 Nginx配置

```nginx
server {
    listen 80;
    server_name api.banwei.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.banwei.app;

    ssl_certificate /etc/nginx/ssl/banwei.crt;
    ssl_certificate_key /etc/nginx/ssl/banwei.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location /static {
        alias /var/www/banwei/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3.3 前端部署

```bash
# 1. 构建微信小程序
cd projects/去除班味/src/frontend
npm install
npm run build:weapp

# 2. 使用微信开发者工具上传
# 或 CI/CD 自动上传
```

---

## 四、环境变量配置

```env
# 数据库
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=banwei
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=banwei_prod

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

# OSS
OSS_REGION=oss-cn-hangzhou
OSS_BUCKET=banwei-prod
OSS_ACCESS_KEY_ID=your_access_key
OSS_ACCESS_KEY_SECRET=your_secret

# AI服务
AI_VISION_API_KEY=your_vision_key
AI_TEXT_API_KEY=your_text_key
AI_MODERATION_API_KEY=your_moderation_key

# 微信
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret

# 日志
LOG_LEVEL=info
```

---

## 五、监控告警

### 5.1 PM2监控

```bash
pm2 monit
pm2 logs
```

### 5.2 关键指标

| 指标 | 阈值 | 告警方式 |
|------|------|----------|
| CPU使用率 | >80% | 钉钉/企业微信 |
| 内存使用率 | >85% | 钉钉/企业微信 |
| 磁盘使用率 | >90% | 钉钉/企业微信 |
| API响应时间 | >500ms | 钉钉/企业微信 |
| 错误率 | >1% | 钉钉/企业微信 |
| 数据库连接数 | >80% | 钉钉/企业微信 |

### 5.3 日志收集

```bash
# 使用云厂商日志服务或自建ELK
# 日志路径
/var/log/banwei/
├── app.log        # 应用日志
├── error.log      # 错误日志
├── access.log     # 访问日志
└── sql.log        # SQL慢查询日志
```

---

## 六、备份策略

### 6.1 数据库备份

```bash
# 每日自动备份
0 2 * * * pg_dump -U banwei banwei_prod | gzip > /backup/db/banwei_$(date +\%Y\%m\%d).sql.gz

# 保留7天
find /backup/db -name "banwei_*.sql.gz" -mtime +7 -delete
```

### 6.2 文件备份

```bash
# OSS跨区域复制
# 配置OSS生命周期规则
```

---

## 七、扩容方案

### 7.1 水平扩容

```
用户增长 → 单台API服务器压力增大
    ↓
增加ECS实例（3台 → 5台）
    ↓
配置负载均衡（SLB）
    ↓
数据库读写分离
```

### 7.2 垂直扩容

```
数据库性能瓶颈
    ↓
升级PostgreSQL配置（4核8G → 8核16G）
    ↓
增加Redis集群
    ↓
CDN加速静态资源
```

---

## 八、应急预案

### 8.1 服务宕机

```bash
# 1. 检查服务状态
pm2 status
systemctl status nginx
systemctl status postgresql
systemctl status redis

# 2. 重启服务
pm2 restart banwei-api
systemctl restart nginx

# 3. 查看日志
pm2 logs banwei-api --lines 100
```

### 8.2 数据库故障

```bash
# 1. 切换到备用数据库
# 2. 恢复最近备份
# 3. 数据一致性校验
```

### 8.3 回滚方案

```bash
# 代码回滚
git revert HEAD
npm run build
pm2 restart banwei-api

# 数据库回滚
npm run migration:revert
```

---

## 九、域名与SSL

| 域名 | 用途 | SSL |
|------|------|-----|
| api.banwei.app | API接口 | ✅ |
| static.banwei.app | 静态资源 | ✅ |
| admin.banwei.app | 管理后台 | ✅ |

---

## 十、上线检查清单

- [ ] 服务器环境配置完成
- [ ] 数据库迁移成功
- [ ] 环境变量配置正确
- [ ] Nginx配置生效
- [ ] SSL证书有效
- [ ] 监控告警配置完成
- [ ] 备份策略生效
- [ ] 负载测试通过
- [ ] 安全扫描通过
- [ ] 微信小程序审核通过

---

> **部署负责人**: 运维工程师  
> **预计上线时间**: 2026-05-15  
> **紧急联系**: devops@banwei.app
