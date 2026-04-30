#!/bin/bash
# 一键创建GitHub仓库并推送代码

REPO_NAME="${1:-quchubanwei}"
GITHUB_USER="zra20160608-cell"

echo "🚀 创建GitHub仓库: $GITHUB_USER/$REPO_NAME"
echo ""

# 检查是否有GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 使用GitHub CLI创建仓库..."
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
else
    echo "⚠️ 未安装GitHub CLI，请手动创建："
    echo ""
    echo "1. 打开浏览器访问:"
    echo "   https://github.com/new"
    echo ""
    echo "2. 填写信息:"
    echo "   Repository name: $REPO_NAME"
    echo "   Description: 去除班味 - AI班味检测小程序"
    echo "   Visibility: Public"
    echo "   ✅ Add a README file"
    echo ""
    echo "3. 点击 Create repository"
    echo ""
    echo "4. 然后运行以下命令:"
    echo "   git remote add origin git@github.com:$GITHUB_USER/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    
    # 尝试自动打开浏览器
    if command -v open &> /dev/null; then
        open "https://github.com/new?name=$REPO_NAME&description=去除班味+-+AI班味检测小程序&visibility=public"
    fi
fi
