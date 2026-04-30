#!/usr/bin/env python3
"""
小程序开发团队启动器
根据用户输入的需求，自动生成团队任务分配和项目排期
"""

import json
import sys
from datetime import datetime, timedelta

def create_project(project_name, app_type, features, timeline_weeks=6):
    """创建项目计划"""
    
    stages = [
        {
            "stage": "需求与规划",
            "week": 1,
            "owner": "产品经理",
            "tasks": [
                "需求调研与分析",
                "竞品分析报告",
                "PRD文档撰写",
                "功能优先级排序",
                "数据埋点设计",
                "需求评审会议"
            ],
            "deliverables": ["PRD文档", "用户故事", "功能列表", "迭代计划"]
        },
        {
            "stage": "设计",
            "week": 2,
            "owner": "UI/UX设计师",
            "tasks": [
                "信息架构设计",
                "交互流程图",
                "高保真设计稿",
                "设计规范制定",
                "切图与标注",
                "设计评审会议"
            ],
            "deliverables": ["设计稿", "原型图", "设计规范", "切图资源"]
        },
        {
            "stage": "开发",
            "week": "3-4",
            "owner": "前后端开发",
            "tasks": [
                "数据库设计",
                "API接口开发",
                "页面开发",
                "组件封装",
                "接口联调",
                "代码审查"
            ],
            "deliverables": ["源代码", "API文档", "组件库"]
        },
        {
            "stage": "测试",
            "week": 5,
            "owner": "测试工程师",
            "tasks": [
                "测试用例编写",
                "功能测试",
                "兼容性测试",
                "性能测试",
                "Bug修复验证",
                "测试报告"
            ],
            "deliverables": ["测试报告", "测试用例集", "Bug清单"]
        },
        {
            "stage": "上线",
            "week": 6,
            "owner": "运维工程师",
            "tasks": [
                "生产环境部署",
                "监控告警配置",
                "域名SSL配置",
                "数据备份策略",
                "提交小程序审核",
                "上线检查"
            ],
            "deliverables": ["上线检查清单", "运维手册", "监控配置"]
        }
    ]
    
    team = {
        "产品经理": {
            "responsibilities": ["需求分析", "PRD撰写", "迭代规划", "数据埋点"],
            "skills": ["Axure", "Xmind", "数据分析"]
        },
        "UI/UX设计师": {
            "responsibilities": ["交互设计", "视觉设计", "原型设计", "设计规范"],
            "skills": ["Figma", "Sketch", "PS", "AI"]
        },
        "前端开发": {
            "responsibilities": ["页面开发", "组件封装", "性能优化", "多端适配"],
            "skills": ["微信小程序", "Taro", "uni-app", "Vue/React"]
        },
        "后端开发": {
            "responsibilities": ["API设计", "数据库设计", "业务逻辑", "安全防护"],
            "skills": ["Node.js", "Python", "Go", "MySQL", "Redis"]
        },
        "测试工程师": {
            "responsibilities": ["测试用例", "自动化测试", "Bug追踪", "性能测试"],
            "skills": ["Jest", "Selenium", "Postman", "JMeter"]
        },
        "运维工程师": {
            "responsibilities": ["CI/CD", "服务器管理", "监控告警", "容器化"],
            "skills": ["Docker", "K8s", "Jenkins", "Linux"]
        },
        "运营专员": {
            "responsibilities": ["数据分析", "用户增长", "内容运营", "活动策划"],
            "skills": ["Excel", "SQL", "GA", "神策数据"]
        }
    }
    
    project = {
        "project_name": project_name,
        "app_type": app_type,
        "features": features,
        "timeline": f"{timeline_weeks}周",
        "team": team,
        "stages": stages,
        "start_date": datetime.now().strftime("%Y-%m-%d"),
        "estimated_end": (datetime.now() + timedelta(weeks=timeline_weeks)).strftime("%Y-%m-%d")
    }
    
    return project

def print_project_plan(project):
    """打印项目计划"""
    print(f"\n{'='*60}")
    print(f"🚀 项目启动：{project['project_name']}")
    print(f"{'='*60}")
    print(f"\n📱 小程序类型：{project['app_type']}")
    print(f"📅 项目周期：{project['timeline']} ({project['start_date']} ~ {project['estimated_end']})")
    print(f"\n🎯 核心功能：")
    for feature in project['features']:
        print(f"  • {feature}")
    
    print(f"\n{'='*60}")
    print(f"👥 团队成员")
    print(f"{'='*60}")
    for role, info in project['team'].items():
        print(f"\n【{role}】")
        print(f"  职责：{', '.join(info['responsibilities'])}")
        print(f"  技能：{', '.join(info['skills'])}")
    
    print(f"\n{'='*60}")
    print(f"📋 项目排期")
    print(f"{'='*60}")
    for stage in project['stages']:
        print(f"\n【第{stage['week']}周】{stage['stage']} - 负责人：{stage['owner']}")
        print(f"  任务：")
        for task in stage['tasks']:
            print(f"    • {task}")
        print(f"  交付物：{', '.join(stage['deliverables'])}")
    
    print(f"\n{'='*60}")
    print(f"✅ 项目计划已生成！准备启动开发流程。")
    print(f"{'='*60}\n")

def main():
    if len(sys.argv) < 4:
        print("Usage: python3 team-launcher.py <project_name> <app_type> <feature1,feature2,...> [timeline_weeks]")
        print("Example: python3 team-launcher.py 电商小程序 电商 商品展示,购物车,支付,订单管理 6")
        sys.exit(1)
    
    project_name = sys.argv[1]
    app_type = sys.argv[2]
    features = sys.argv[3].split(',')
    timeline = int(sys.argv[4]) if len(sys.argv) > 4 else 6
    
    project = create_project(project_name, app_type, features, timeline)
    print_project_plan(project)
    
    # 输出JSON供其他工具使用
    print("\n📊 项目数据 (JSON格式)：")
    print(json.dumps(project, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
