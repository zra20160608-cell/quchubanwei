# 🚀 多代理开发团队系统 - 使用指南

## 系统架构

```
┌─────────────────────────────────────────────┐
│                 你（用户）                    │
│              项目经理 / 协调者               │
└────────────────┬────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌───────┐  ┌───────┐  ┌───────┐
│ 产品经理 │  │ 设计师  │  │ 前端开发 │
│  (PM)  │  │(Designer)│  │ (FE)  │
└───────┘  └───────┘  └───────┘
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌───────┐  ┌───────┐  ┌───────┐
│ 后端开发 │  │ 测试工程师│  │ 运维工程师│
│  (BE)  │  │  (QA)  │  │(DevOps)│
└───────┘  └───────┘  └───────┘
                    │
                    ▼
              ┌───────┐
              │ 运营专员 │
              │  (Ops)  │
              └───────┘
```

## 快速开始

### 1. 创建新项目

```bash
python3 ~/.openclaw/workspace/scripts/team-manager.py create "项目名" "项目类型" "描述"
```

**示例：**
```bash
python3 ~/.openclaw/workspace/scripts/team-manager.py create \
  "电商小程序" \
  "电商" \
  "社区团购电商平台，支持团长管理、团购下单、配送跟踪"
```

### 2. 查看项目列表

```bash
python3 ~/.openclaw/workspace/scripts/team-manager.py list
```

### 3. 查看项目状态

```bash
python3 ~/.openclaw/workspace/scripts/team-manager.py status "项目名"
```

### 4. 启动角色会话

```bash
python3 ~/.openclaw/workspace/scripts/team-launcher.py "项目名" "角色ID"
```

**可用角色：**
- `pm` - 产品经理
- `designer` - UI/UX设计师
- `frontend` - 前端开发
- `backend` - 后端开发
- `qa` - 测试工程师
- `devops` - 运维工程师
- `ops` - 运营专员

**示例：**
```bash
# 启动产品经理
python3 ~/.openclaw/workspace/scripts/team-launcher.py "社区团购小程序" pm

# 启动设计师
python3 ~/.openclaw/workspace/scripts/team-launcher.py "社区团购小程序" designer

# 启动前端开发
python3 ~/.openclaw/workspace/scripts/team-launcher.py "社区团购小程序" frontend
```

## 🎯 使用模式

### 模式一：单人协调模式

你自己作为项目经理，分别与各个角色对话，传递信息和任务。

**流程：**
1. 启动产品经理角色，进行需求分析
2. 拿到PRD后，启动设计师角色进行设计
3. 设计完成后，启动前端和后端开发
4. 开发完成后，启动测试工程师
5. 测试通过后，启动运维工程师上线
6. 上线后，启动运营专员

**示例对话：**
```
你: @pm 我要做一个社区团购小程序，功能是...
PM: （输出PRD）

你: @designer 基于这个PRD设计界面
Designer: （输出设计稿）

你: @frontend 基于设计稿开发前端
Frontend: （输出代码）

你: @backend 设计API和数据库
Backend: （输出API）
```

### 模式二：团队会议模式

召集多个角色一起讨论，模拟真实的团队会议。

**示例：**
```
你: @team meeting
PM: 我来主持今天的站会
Frontend: 我昨天完成了首页开发
Backend: API还有2个没完成
QA: 我已经准备好测试用例了
```

### 模式三：项目托管模式

你把项目交给AI团队，由AI自主推进项目。

**示例：**
```
你: 我要开发一个社区团购小程序，你们团队负责全部流程
PM: 收到，我来安排。首先进行需求调研...
（系统自动推进各阶段）
```

## 📁 项目空间结构

每个项目有独立的工作空间：

```
projects/社区团购小程序/
├── README.md              # 项目概览
├── PROJECT.md             # 项目主记忆（所有角色共享）
├── STATUS.md              # 当前状态看板
│
├── docs/                  # 项目文档
│   ├── prd/               # 产品需求文档
│   ├── design/            # 设计文档
│   ├── api/               # 接口文档
│   └── qa/                # 测试文档
│
├── src/                   # 源代码
│   ├── frontend/          # 前端代码
│   ├── backend/           # 后端代码
│   └── shared/            # 共享资源
│
├── memory/                # 角色记忆
│   ├── pm.md              # 产品经理记忆
│   ├── designer.md        # 设计师记忆
│   ├── frontend.md        # 前端记忆
│   ├── backend.md         # 后端记忆
│   ├── qa.md              # 测试记忆
│   ├── devops.md          # 运维记忆
│   └── ops.md             # 运营记忆
│
├── sessions/              # 会话记录
└── archive/               # 归档文件
```

## 🧠 记忆系统

### 三层记忆架构

1. **项目记忆**（PROJECT.md）
   - 所有角色共享
   - 记录项目目标、决策、里程碑
   - 同步团队状态

2. **角色记忆**（memory/<role>.md）
   - 每个角色独立
   - 记录个人工作、决策、问题
   - 保持角色连续性

3. **会话记录**（sessions/）
   - 每次对话的完整记录
   - 可追溯历史上下文
   - 便于复盘和交接

### 记忆更新规则

- **项目记忆**：重要决策、里程碑完成、风险问题
- **角色记忆**：工作内容、技术决策、遇到的问题
- **状态文件**：实时更新进度和阻塞问题

## 👥 团队协作协议

### 消息格式

```
[发件人] -> [收件人]
[类型]: 需求 / 反馈 / 通知 / 求助
[优先级]: P0 / P1 / P2 / P3
[内容]: ...
```

### 状态同步

每个角色完成任务后更新：
1. 自己的 memory/<role>.md
2. 项目的 STATUS.md
3. 必要时更新 PROJECT.md

### 协作接口

| 从 | 到 | 交付物 |
|---|---|--------|
| PM | Designer | PRD文档、用户故事 |
| PM | Frontend | 技术需求、验收标准 |
| PM | Backend | 业务需求、API需求 |
| PM | QA | 测试用例需求、验收标准 |
| Designer | Frontend | 设计稿、切图、规范 |
| Backend | Frontend | API文档、接口联调 |
| Frontend | QA | 测试版本、功能说明 |
| Backend | QA | 接口文档、测试环境 |
| QA | PM | 测试报告、质量评估 |
| DevOps | 全员 | 环境信息、部署状态 |
| Ops | PM | 用户反馈、数据洞察 |

## 🔄 工作流程

### 标准6阶段流程

```
Week 1: 需求与规划
  PM主导 -> 输出PRD
  
Week 2: 设计
  Designer主导 -> 输出设计稿
  
Week 3-4: 开发
  FE + BE并行 -> 输出代码
  
Week 5: 测试
  QA主导 -> 输出测试报告
  
Week 6: 上线
  DevOps主导 -> 上线部署
  
Ongoing: 运营
  Ops主导 -> 持续运营
```

## 🛠️ 技术栈支持

### 前端
- 微信小程序（原生）
- Taro（React/Vue）
- uni-app
- React Native
- Flutter

### 后端
- Node.js（Express/NestJS）
- Python（Django/FastAPI）
- Go（Gin/Echo）
- Java（Spring Boot）

### 数据库
- MySQL / PostgreSQL
- MongoDB
- Redis
- Elasticsearch

### 运维
- Docker / Kubernetes
- CI/CD（Jenkins/GitLab CI/GitHub Actions）
- 监控（Prometheus/Grafana）
- 日志（ELK Stack）

## 🎮 实战示例

### 示例1：开发社区团购小程序

```bash
# 1. 创建项目
python3 scripts/team-manager.py create \
  "社区团购小程序" \
  "O2O电商" \
  "社区团购平台，支持团长管理、团购下单、配送跟踪"

# 2. 启动产品经理进行需求分析
python3 scripts/team-launcher.py "社区团购小程序" pm
# 然后对PM说：我要做一个社区团购小程序，功能是...

# 3. PRD完成后，启动设计师
python3 scripts/team-launcher.py "社区团购小程序" designer
# 然后对Designer说：基于PRD设计首页、商品页、订单页

# 4. 设计完成后，启动前端和后端
python3 scripts/team-launcher.py "社区团购小程序" frontend
python3 scripts/team-launcher.py "社区团购小程序" backend
# 并行开发

# 5. 开发完成后，启动测试
python3 scripts/team-launcher.py "社区团购小程序" qa
# 然后对QA说：开始测试所有功能

# 6. 测试通过后，启动运维上线
python3 scripts/team-launcher.py "社区团购小程序" devops
# 然后对DevOps说：部署到生产环境

# 7. 上线后，启动运营
python3 scripts/team-launcher.py "社区团购小程序" ops
# 然后对Ops说：制定上线推广方案
```

### 示例2：快速启动开发任务

```bash
# 已有项目，直接启动开发角色
python3 scripts/team-launcher.py "社区团购小程序" frontend
# 对Frontend说：实现购物车功能，需求是...
```

## 📊 项目状态查看

### 查看所有项目
```bash
python3 scripts/team-manager.py list
```

### 查看项目详情
```bash
python3 scripts/team-manager.py brief "项目名"
```

### 查看项目状态看板
```bash
python3 scripts/team-manager.py status "项目名"
```

或直接读取文件：
```bash
cat projects/社区团购小程序/STATUS.md
cat projects/社区团购小程序/PROJECT.md
```

## 🔧 高级功能

### 添加自定义角色

1. 创建角色配置文件：`teams/dev-team/roles/<role>.yml`
2. 参照现有角色格式编写
3. 重新启动即可使用

### 创建项目模板

1. 在 `teams/dev-team/templates/` 创建模板
2. 包含预设的目录结构和文件
3. 创建项目时使用 `--template` 参数

### 团队配置扩展

编辑 `teams/dev-team/team.yml`：
- 添加/删除角色
- 修改工作流程
- 调整协作规则

## 💡 最佳实践

### 1. 项目命名
- 使用有意义的名称
- 避免特殊字符
- 例如："电商小程序V2"、"企业官网2024"

### 2. 记忆维护
- 定期更新角色记忆
- 重要决策记录到PROJECT.md
- 完成后归档会话记录

### 3. 协作效率
- 一次只激活一个主要角色
- 完成当前阶段再进入下一阶段
- 及时同步状态避免阻塞

### 4. 质量保证
- 每个阶段设置评审点
- 关键交付物需要确认
- Bug和问题及时记录

## 🆘 故障排除

### 问题1：项目创建失败
**解决：** 检查项目名是否已存在，或路径是否有权限

### 问题2：角色启动失败
**解决：** 检查项目是否存在，角色ID是否正确

### 问题3：记忆不连续
**解决：** 确保每次对话后更新memory文件

### 问题4：协作混乱
**解决：** 明确指定当前激活的角色，避免多角色同时对话

## 📚 文件参考

| 文件 | 说明 |
|------|------|
| `scripts/team-manager.py` | 项目管理脚本 |
| `scripts/team-launcher.py` | 角色启动脚本 |
| `teams/dev-team/team.yml` | 团队定义 |
| `teams/dev-team/roles/*.yml` | 角色定义 |
| `projects/<name>/README.md` | 项目概览 |
| `projects/<name>/PROJECT.md` | 项目记忆 |
| `projects/<name>/STATUS.md` | 状态看板 |

## 🎉 开始使用

准备好开始你的项目了吗？

1. 创建你的第一个项目
2. 启动产品经理进行需求分析
3. 逐步推进各阶段工作
4. 享受AI团队协作的便利！

---

**提示：** 本指南文件位于 `~/.openclaw/workspace/TEAM_GUIDE.md`
