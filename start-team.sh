#!/bin/bash
# 多代理开发团队系统 - 快速启动脚本
# Usage: ./start-team.sh [项目名] [角色]

WORKSPACE="$HOME/.openclaw/workspace"
SCRIPTS="$WORKSPACE/scripts"
PROJECTS="$WORKSPACE/projects"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

printf "${BLUE}\n"
printf "╔══════════════════════════════════════════════════════════════╗\n"
printf "║          🚀 多代理开发团队系统 - Quick Start                ║\n"
printf "╚══════════════════════════════════════════════════════════════╝\n"
printf "${NC}\n"

# 帮助信息
show_help() {
    echo "用法: ./start-team.sh [命令] [参数]"
    echo ""
    echo "命令:"
    echo "  create <项目名> <类型> [描述]  - 创建新项目"
    echo "  list                           - 列出所有项目"
    echo "  status <项目名>                - 查看项目状态"
    echo "  start <项目名> <角色>          - 启动角色会话"
    echo "  roles                          - 列出所有角色"
    echo "  guide                          - 查看使用指南"
    echo ""
    echo "角色:"
    echo "  pm          - 产品经理"
    echo "  designer    - UI/UX设计师"
    echo "  frontend    - 前端开发"
    echo "  backend     - 后端开发"
    echo "  qa          - 测试工程师"
    echo "  devops      - 运维工程师"
    echo "  ops         - 运营专员"
    echo ""
    echo "示例:"
    echo "  ./start-team.sh create \"电商小程序\" \"电商\" \"社区团购平台\""
    echo "  ./start-team.sh start \"电商小程序\" pm"
    echo "  ./start-team.sh list"
}

# 检查依赖
check_deps() {
    if ! command -v python3 &> /dev/null; then
        echo "❌ 错误: 需要安装 Python3"
        exit 1
    fi
    
    if ! python3 -c "import yaml" 2>/dev/null; then
        echo "⚠️  正在安装依赖..."
        pip3 install pyyaml
    fi
}

# 创建项目
create_project() {
    if [ $# -lt 2 ]; then
        echo "❌ 参数不足: create <项目名> <类型> [描述]"
        exit 1
    fi
    
    project_name="$1"
    project_type="$2"
    description="${3:-}"
    
    echo "📝 创建项目: $project_name"
    python3 "$SCRIPTS/team-manager.py" create "$project_name" "$project_type" "$description"
}

# 列出项目
list_projects() {
    echo "📁 项目列表"
    python3 "$SCRIPTS/team-manager.py" list
}

# 查看状态
show_status() {
    if [ $# -lt 1 ]; then
        echo "❌ 参数不足: status <项目名>"
        exit 1
    fi
    
    echo "📊 项目状态: $1"
    python3 "$SCRIPTS/team-manager.py" status "$1"
}

# 启动角色
start_role() {
    if [ $# -lt 2 ]; then
        echo "❌ 参数不足: start <项目名> <角色>"
        exit 1
    fi
    
    project_name="$1"
    role="$2"
    
    echo "🎭 启动角色: $role @ $project_name"
    echo "正在生成角色提示..."
    
    python3 "$SCRIPTS/team-launcher.py" "$project_name" "$role"
}

# 列出角色
list_roles() {
    echo "👥 可用角色"
    python3 "$SCRIPTS/team-launcher.py" roles
}

# 显示指南
show_guide() {
    if [ -f "$WORKSPACE/TEAM_GUIDE.md" ]; then
        cat "$WORKSPACE/TEAM_GUIDE.md"
    else
        echo "❌ 指南文件不存在"
    fi
}

# 主逻辑
check_deps

case "${1:-help}" in
    create|new)
        shift
        create_project "$@"
        ;;
    list|ls)
        list_projects
        ;;
    status|st)
        shift
        show_status "$@"
        ;;
    start|run|launch)
        shift
        start_role "$@"
        ;;
    roles|role)
        list_roles
        ;;
    guide|help|h)
        show_help
        ;;
    *)
        echo "❌ 未知命令: $1"
        show_help
        exit 1
        ;;
esac
