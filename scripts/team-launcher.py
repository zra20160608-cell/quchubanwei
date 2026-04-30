#!/usr/bin/env python3
"""
团队启动器 - 启动特定角色的工作会话
"""

import os
import sys
import yaml
from pathlib import Path

BASE_DIR = Path.home() / ".openclaw" / "workspace"
PROJECTS_DIR = BASE_DIR / "projects"
TEAMS_DIR = BASE_DIR / "teams"
ROLES_DIR = TEAMS_DIR / "dev-team" / "roles"

def load_role_config(role_name):
    """加载角色配置"""
    role_file = ROLES_DIR / f"{role_name}.yml"
    if role_file.exists():
        with open(role_file, 'r', encoding='utf-8') as f:
            content = f.read()
            parts = content.split('---')
            if len(parts) >= 3:
                yaml_content = parts[1].strip()
                return yaml.safe_load(yaml_content)
            else:
                return yaml.safe_load(content)
    return None

def load_project_status(project_name):
    """加载项目状态"""
    status_file = PROJECTS_DIR / project_name / "STATUS.md"
    if status_file.exists():
        with open(status_file, 'r', encoding='utf-8') as f:
            return f.read()
    return None

def load_project_memory(project_name):
    """加载项目主记忆"""
    project_md = PROJECTS_DIR / project_name / "PROJECT.md"
    if project_md.exists():
        with open(project_md, 'r', encoding='utf-8') as f:
            return f.read()
    return None

def load_role_memory(project_name, role):
    """加载角色记忆"""
    memory_file = PROJECTS_DIR / project_name / "memory" / f"{role}.md"
    if memory_file.exists():
        with open(memory_file, 'r', encoding='utf-8') as f:
            return f.read()
    return None

def generate_role_prompt(project_name, role):
    """生成角色启动提示"""
    
    # 加载角色配置
    role_config = load_role_config(role)
    if not role_config:
        print(f"❌ 角色配置 {role} 不存在")
        return None
    
    role_name = role_config.get('role', role)
    role_desc = role_config.get('description', '')
    
    # 加载项目上下文
    project_status = load_project_status(project_name)
    project_memory = load_project_memory(project_name)
    role_memory = load_role_memory(project_name, role)
    
    # 构建角色提示
    prompt = f"""# 🎭 角色激活：{role_name}

## 你的身份
你是 **{role_name}**，{role_desc}

## 当前项目
项目名称：{project_name}
工作目录：{PROJECTS_DIR / project_name}

## 项目状态
{project_status or '（暂无状态信息）'}

## 项目记忆
{project_memory or '（暂无项目记忆）'}

## 你的个人记忆
{role_memory or '（暂无个人记忆）'}

## 你的职责
"""
    
    # 添加职责列表
    if 'deliverables' in role_config:
        prompt += "\n### 交付物\n"
        for d in role_config['deliverables']:
            prompt += f"- {d}\n"
    
    if 'skills' in role_config:
        prompt += "\n### 核心技能\n"
        for s in role_config['skills']:
            prompt += f"- {s}\n"
    
    if 'tools' in role_config:
        prompt += "\n### 常用工具\n"
        for t in role_config['tools']:
            prompt += f"- {t}\n"
    
    # 添加工作指令
    prompt += f"""
## 工作指令

1. **读取文件**：先读取 PROJECT.md 和 STATUS.md 了解项目全貌
2. **查看记忆**：阅读 memory/{role}.md 了解你的历史工作
3. **执行任务**：根据项目状态执行当前阶段的工作
4. **更新状态**：完成任务后更新 STATUS.md 和 memory/{role}.md
5. **团队协作**：如有需要，在 PROJECT.md 中记录需要其他角色配合的事项

## 文件操作指南

项目文件路径：
- 项目记忆：{PROJECTS_DIR / project_name / "PROJECT.md"}
- 当前状态：{PROJECTS_DIR / project_name / "STATUS.md"}
- 你的记忆：{PROJECTS_DIR / project_name / "memory" / f"{role}.md"}
- 项目文档：{PROJECTS_DIR / project_name / "docs"}
- 源代码：{PROJECTS_DIR / project_name / "src"}

## 启动任务

请确认你已就位，并告诉我：
1. 你当前理解的项目状态
2. 你认为当前阶段应该做什么
3. 你需要什么资源或信息

让我们开始工作！
"""
    
    return prompt

def list_roles():
    """列出所有可用角色"""
    roles = []
    if ROLES_DIR.exists():
        for f in ROLES_DIR.iterdir():
            if f.suffix == '.yml':
                role_config = load_role_config(f.stem)
                if role_config:
                    roles.append({
                        'id': f.stem,
                        'name': role_config.get('role', f.stem),
                        'desc': role_config.get('description', '')
                    })
    return roles

def main():
    if len(sys.argv) < 3:
        print("团队启动器")
        print("\n用法:")
        print("  python3 team-launcher.py <项目名> <角色>")
        print("  python3 team-launcher.py roles")
        print("\n可用角色:")
        
        roles = list_roles()
        for r in roles:
            print(f"  • {r['id']:12} - {r['name']}")
        
        print("\n示例:")
        print('  python3 team-launcher.py 社区团购小程序 pm')
        print('  python3 team-launcher.py 社区团购小程序 frontend')
        sys.exit(1)
    
    if sys.argv[1] == "roles":
        print("可用角色:")
        roles = list_roles()
        for r in roles:
            print(f"  • {r['id']:12} - {r['name']}")
            print(f"    {r['desc']}")
        sys.exit(0)
    
    project_name = sys.argv[1]
    role = sys.argv[2]
    
    # 检查项目是否存在
    project_dir = PROJECTS_DIR / project_name
    if not project_dir.exists():
        print(f"❌ 项目 {project_name} 不存在")
        print(f"请先创建项目: python3 team-manager.py create \"{project_name}\" <类型>")
        sys.exit(1)
    
    # 生成角色提示
    prompt = generate_role_prompt(project_name, role)
    if prompt:
        print(prompt)
        
        # 保存到会话文件
        session_file = project_dir / "sessions" / f"{role}_startup.md"
        session_file.parent.mkdir(exist_ok=True)
        with open(session_file, 'w', encoding='utf-8') as f:
            f.write(prompt)
        
        print(f"\n✅ 角色提示已保存到: {session_file}")

if __name__ == "__main__":
    main()
