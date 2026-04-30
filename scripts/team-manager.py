#!/usr/bin/env python3
"""
开发团队管理系统
多角色协作项目管理工具
"""

import os
import sys
import yaml
import json
import shutil
from datetime import datetime
from pathlib import Path

# 基础路径
BASE_DIR = Path.home() / ".openclaw" / "workspace"
TEAMS_DIR = BASE_DIR / "teams"
PROJECTS_DIR = BASE_DIR / "projects"
TEAM_CONFIG = TEAMS_DIR / "dev-team" / "team.yml"
ROLES_DIR = TEAMS_DIR / "dev-team" / "roles"

def load_role_config(role_name):
    """加载角色配置（只读取YAML frontmatter）"""
    role_file = ROLES_DIR / f"{role_name}.yml"
    if role_file.exists():
        with open(role_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # 找到第一个和第二个 --- 之间的内容作为YAML
            parts = content.split('---')
            if len(parts) >= 3:
                yaml_content = parts[1].strip()
                return yaml.safe_load(yaml_content)
            else:
                # 如果没有 ---，尝试直接解析
                return yaml.safe_load(content)
    return None

def create_project(project_name, project_type, description=""):
    """创建新项目空间"""
    project_dir = PROJECTS_DIR / project_name
    
    if project_dir.exists():
        print(f"⚠️ 项目 {project_name} 已存在！")
        return False
    
    # 创建目录结构
    dirs = [
        "docs/prd",
        "docs/design", 
        "docs/api",
        "docs/qa",
        "src/frontend",
        "src/backend",
        "src/shared",
        "memory",
        "sessions",
        "archive"
    ]
    
    for d in dirs:
        (project_dir / d).mkdir(parents=True, exist_ok=True)
    
    # 创建 README.md
    readme_content = f"""# {project_name}

## 项目信息
- **名称**: {project_name}
- **类型**: {project_type}
- **创建时间**: {datetime.now().strftime('%Y-%m-%d %H:%M')}
- **描述**: {description}

## 团队角色
| 角色 | 负责人 | 状态 |
|------|--------|------|
| 产品经理 | 待分配 | 🔴 未启动 |
| 设计师 | 待分配 | 🔴 未启动 |
| 前端开发 | 待分配 | 🔴 未启动 |
| 后端开发 | 待分配 | 🔴 未启动 |
| 测试工程师 | 待分配 | 🔴 未启动 |
| 运维工程师 | 待分配 | 🔴 未启动 |
| 运营专员 | 待分配 | 🔴 未启动 |

## 项目阶段
- [ ] 需求与规划
- [ ] 设计
- [ ] 开发
- [ ] 测试
- [ ] 上线
- [ ] 运营

## 快速导航
- [项目记忆](PROJECT.md)
- [当前状态](STATUS.md)
- [需求文档](docs/prd/)
- [设计文档](docs/design/)
- [接口文档](docs/api/)
- [测试文档](docs/qa/)

## 记忆文件
- [产品经理](memory/pm.md)
- [设计师](memory/designer.md)
- [前端开发](memory/frontend.md)
- [后端开发](memory/backend.md)
- [测试工程师](memory/qa.md)
- [运维工程师](memory/devops.md)
- [运营专员](memory/ops.md)
"""
    
    with open(project_dir / "README.md", 'w', encoding='utf-8') as f:
        f.write(readme_content)
    
    # 创建 PROJECT.md（项目主记忆）
    project_memory = f"""# PROJECT.md - {project_name}

> ⚠️ 这是项目主记忆文件，所有角色共享。记录项目关键信息、决策、状态。

## 项目基本信息
- **名称**: {project_name}
- **类型**: {project_type}
- **创建**: {datetime.now().strftime('%Y-%m-%d')}
- **状态**: 🔴 需求阶段

## 项目目标
[待PM填写]

## 当前阶段
阶段: 需求与规划
进度: 0%
负责人: 产品经理

## 关键决策
[记录重要决策，格式：日期 - 决策内容 - 决策人]

## 风险与问题
| 日期 | 问题 | 影响 | 负责人 | 状态 |
|------|------|------|--------|------|

## 里程碑
| 阶段 | 计划日期 | 实际日期 | 状态 |
|------|----------|----------|------|
| 需求 | | | 🔴 未开始 |
| 设计 | | | 🔴 未开始 |
| 开发 | | | 🔴 未开始 |
| 测试 | | | 🔴 未开始 |
| 上线 | | | 🔴 未开始 |

## 会议记录
[格式：日期 - 主题 - 参与人 - 结论]

## 变更记录
| 日期 | 变更内容 | 影响 | 批准人 |
|------|----------|------|--------|
"""
    
    with open(project_dir / "PROJECT.md", 'w', encoding='utf-8') as f:
        f.write(project_memory)
    
    # 创建 STATUS.md（当前状态）
    status_content = f"""# STATUS.md - 项目状态看板

更新于: {datetime.now().strftime('%Y-%m-%d %H:%M')}

## 总体进度
```
[░░░░░░░░░░] 0% 需求与规划
```

## 角色状态

### 🔴 产品经理
- **当前任务**: 等待启动
- **阻塞问题**: 无
- **下一步**: 需求调研

### 🔴 设计师
- **当前任务**: 等待启动
- **阻塞问题**: 等待PRD
- **下一步**: 设计准备

### 🔴 前端开发
- **当前任务**: 等待启动
- **阻塞问题**: 等待设计稿
- **下一步**: 技术选型

### 🔴 后端开发
- **当前任务**: 等待启动
- **阻塞问题**: 等待需求
- **下一步**: 架构设计

### 🔴 测试工程师
- **当前任务**: 等待启动
- **阻塞问题**: 等待开发
- **下一步**: 测试计划

### 🔴 运维工程师
- **当前任务**: 等待启动
- **阻塞问题**: 等待上线
- **下一步**: 环境准备

### 🔴 运营专员
- **当前任务**: 等待启动
- **阻塞问题**: 等待上线
- **下一步**: 运营方案

## 近期事项
- [ ] PM启动需求调研
- [ ] 团队Kickoff会议

## 阻塞问题
暂无
"""
    
    with open(project_dir / "STATUS.md", 'w', encoding='utf-8') as f:
        f.write(status_content)
    
    # 创建角色记忆模板
    roles = ["pm", "designer", "frontend", "backend", "qa", "devops", "ops"]
    for role in roles:
        role_config = load_role_config(role)
        role_name = role_config.get('role', role) if role_config else role
        
        memory_template = f"""# {role_name}记忆 - {project_name}

> 📝 这是你的个人记忆空间，记录你的工作、决策、问题和学习。
> 其他角色不会直接读取此文件，除非你主动分享。

## 项目信息
- **角色**: {role_name}
- **项目**: {project_name}
- **加入时间**: {datetime.now().strftime('%Y-%m-%d')}
- **当前阶段**: 未启动

## 工作记录

### [{datetime.now().strftime('%Y-%m-%d')}] 加入项目
- 状态: 准备就绪
- 待办: 等待项目经理启动

## 重要决策
[记录你做的重要技术/业务决策]

## 遇到的问题
[记录遇到的问题和解决方案]

## 学习收获
[记录项目中学到的新知识]

## 待办事项
- [ ] 熟悉项目背景
- [ ] 阅读PROJECT.md
- [ ] 准备 kickoff

## 备注
[其他需要记录的内容]
"""
        
        with open(project_dir / "memory" / f"{role}.md", 'w', encoding='utf-8') as f:
            f.write(memory_template)
    
    # 创建 .gitignore
    gitignore_content = """# 依赖
node_modules/
vendor/
*.lock

# 构建输出
dist/
build/
*.exe
*.dll

# 环境配置
.env
.env.local

# 日志
logs/
*.log

# 临时文件
tmp/
temp/
*.tmp

# IDE
.vscode/
.idea/
*.swp

# 系统文件
.DS_Store
Thumbs.db
"""
    
    with open(project_dir / ".gitignore", 'w', encoding='utf-8') as f:
        f.write(gitignore_content)
    
    print(f"✅ 项目 {project_name} 创建成功！")
    print(f"📁 项目路径: {project_dir}")
    print(f"\n下一步:")
    print(f"  1. 查看项目: cd {project_dir}")
    print(f"  2. 编辑项目信息: {project_dir}/PROJECT.md")
    print(f"  3. 启动团队: @pm 开始需求调研")
    
    return True

def list_projects():
    """列出所有项目"""
    if not PROJECTS_DIR.exists():
        print("暂无项目")
        return []
    
    projects = [d.name for d in PROJECTS_DIR.iterdir() if d.is_dir()]
    
    if not projects:
        print("暂无项目")
        return []
    
    print(f"\n📁 项目列表 ({len(projects)}个):")
    print("=" * 50)
    
    for p in projects:
        project_dir = PROJECTS_DIR / p
        readme = project_dir / "README.md"
        status_file = project_dir / "STATUS.md"
        
        # 尝试读取状态
        status = "🔴 未启动"
        if status_file.exists():
            with open(status_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if '🟢' in content:
                    status = "🟢 进行中"
                elif '🟡' in content:
                    status = "🟡 部分完成"
        
        print(f"  • {p} {status}")
        print(f"    路径: {project_dir}")
    
    print("=" * 50)
    return projects

def show_project_status(project_name):
    """显示项目状态"""
    project_dir = PROJECTS_DIR / project_name
    
    if not project_dir.exists():
        print(f"❌ 项目 {project_name} 不存在")
        return False
    
    status_file = project_dir / "STATUS.md"
    if status_file.exists():
        with open(status_file, 'r', encoding='utf-8') as f:
            print(f.read())
    else:
        print("⚠️ 状态文件不存在")
    
    return True

def update_role_status(project_name, role, status, task="", blocker="", next_step=""):
    """更新角色状态"""
    project_dir = PROJECTS_DIR / project_name
    status_file = project_dir / "STATUS.md"
    
    if not status_file.exists():
        print(f"❌ 项目 {project_name} 不存在")
        return False
    
    with open(status_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 更新角色状态（简单的文本替换）
    role_emoji = {"pm": "🔴", "designer": "🔴", "frontend": "🔴", "backend": "🔴", 
                  "qa": "🔴", "devops": "🔴", "ops": "🔴"}
    
    # 这里简化处理，实际应该用更智能的方式
    print(f"📝 更新 {role} 状态: {status}")
    print(f"   任务: {task}")
    print(f"   阻塞: {blocker}")
    print(f"   下一步: {next_step}")
    
    return True

def generate_team_brief(project_name):
    """生成团队简报"""
    project_dir = PROJECTS_DIR / project_name
    
    if not project_dir.exists():
        print(f"❌ 项目 {project_name} 不存在")
        return None
    
    # 读取项目信息
    project_md = project_dir / "PROJECT.md"
    status_md = project_dir / "STATUS.md"
    
    brief = {
        "project_name": project_name,
        "project_dir": str(project_dir),
        "created": datetime.now().strftime('%Y-%m-%d'),
        "status": "活跃"
    }
    
    if project_md.exists():
        with open(project_md, 'r', encoding='utf-8') as f:
            content = f.read()
            # 简单解析
            if "状态" in content:
                brief["project_status"] = content.split("状态")[1].split("\n")[0].strip()
    
    return brief

def main():
    if len(sys.argv) < 2:
        print("开发团队管理系统")
        print("\n用法:")
        print("  python3 team-manager.py create <项目名> <类型> [描述]")
        print("  python3 team-manager.py list")
        print("  python3 team-manager.py status <项目名>")
        print("  python3 team-manager.py brief <项目名>")
        print("\n示例:")
        print('  python3 team-manager.py create "电商小程序" "电商" "社区团购电商平台"')
        print("  python3 team-manager.py list")
        print("  python3 team-manager.py status 电商小程序")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "create":
        if len(sys.argv) < 4:
            print("❌ 参数不足: create <项目名> <类型> [描述]")
            sys.exit(1)
        
        project_name = sys.argv[2]
        project_type = sys.argv[3]
        description = sys.argv[4] if len(sys.argv) > 4 else ""
        
        create_project(project_name, project_type, description)
    
    elif command == "list":
        list_projects()
    
    elif command == "status":
        if len(sys.argv) < 3:
            print("❌ 参数不足: status <项目名>")
            sys.exit(1)
        
        show_project_status(sys.argv[2])
    
    elif command == "brief":
        if len(sys.argv) < 3:
            print("❌ 参数不足: brief <项目名>")
            sys.exit(1)
        
        brief = generate_team_brief(sys.argv[2])
        if brief:
            print(json.dumps(brief, ensure_ascii=False, indent=2))
    
    else:
        print(f"❌ 未知命令: {command}")
        print("可用命令: create, list, status, brief")
        sys.exit(1)

if __name__ == "__main__":
    main()
