import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Progress } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Button, Card, Tag } from '@/components'
import './index.scss'

export interface PlanItem {
  id: string
  name: string
  category: string
  categoryLabel: string
  categoryColor: string
  difficulty: number
  duration: number
  description: string
  matchReason: string
  expectedEffect: { reduceScore: number }
  isJoined: boolean
  progress: number
}

const categoryFilters = [
  { key: 'all', label: '全部', color: '#666' },
  { key: 'DESK_TRANSFORM', label: '工位改造', color: '#4ECDC4' },
  { key: 'BODY_MIND', label: '身心调节', color: '#FF6B6B' },
  { key: 'EFFICIENCY', label: '效率提升', color: '#F39C12' },
  { key: 'FISH_ART', label: '摸鱼艺术', color: '#9B59B6' }
]

const mockPlans: PlanItem[] = [
  {
    id: 'PLAN_001',
    name: '5分钟工位急救术',
    category: 'DESK_TRANSFORM',
    categoryLabel: '工位改造',
    categoryColor: '#4ECDC4',
    difficulty: 2,
    duration: 7,
    description: '快速整理工位，找回工作仪式感。每天只需5分钟，还你一个清爽的办公环境。',
    matchReason: '因为检测到外卖盒+凌乱桌面',
    expectedEffect: { reduceScore: 15 },
    isJoined: true,
    progress: 3
  },
  {
    id: 'PLAN_002',
    name: '打工人自救指南',
    category: 'BODY_MIND',
    categoryLabel: '身心调节',
    categoryColor: '#FF6B6B',
    difficulty: 3,
    duration: 14,
    description: '全方位身心调节，告别职业病。从颈椎操到眼保健操，守护打工人的健康。',
    matchReason: '因为检测到黑眼圈+颈椎贴',
    expectedEffect: { reduceScore: 20 },
    isJoined: false,
    progress: 0
  },
  {
    id: 'PLAN_003',
    name: '到点下班秘籍',
    category: 'EFFICIENCY',
    categoryLabel: '效率提升',
    categoryColor: '#F39C12',
    difficulty: 2,
    duration: 7,
    description: '提升效率，准点下班不是梦。番茄工作法+任务优先级管理，让你事半功倍。',
    matchReason: '因为检测到多屏幕+深夜灯光',
    expectedEffect: { reduceScore: 10 },
    isJoined: false,
    progress: 0
  },
  {
    id: 'PLAN_004',
    name: '带薪养生大法',
    category: 'BODY_MIND',
    categoryLabel: '身心调节',
    categoryColor: '#FF6B6B',
    difficulty: 1,
    duration: 21,
    description: '在公司也能养生！带薪喝水、带薪上厕所、带薪远眺...把养生融入工作日常。',
    matchReason: '因为检测到咖啡杯x3+缺乏绿植',
    expectedEffect: { reduceScore: 12 },
    isJoined: true,
    progress: 12
  },
  {
    id: 'PLAN_005',
    name: '摸鱼不翻车指南',
    category: 'FISH_ART',
    categoryLabel: '摸鱼艺术',
    categoryColor: '#9B59B6',
    difficulty: 4,
    duration: 30,
    description: '高级摸鱼术：如何在老板眼皮底下优雅地恢复能量。科学摸鱼，效率倍增。',
    matchReason: '因为你已连续加班7天',
    expectedEffect: { reduceScore: 18 },
    isJoined: false,
    progress: 0
  }
]

export default function PlansIndex() {
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPlans()
  }, [activeCategory])

  const loadPlans = async () => {
    setLoading(true)
    setTimeout(() => {
      const filtered = activeCategory === 'all'
        ? mockPlans
        : mockPlans.filter(p => p.category === activeCategory)
      setPlans(filtered)
      setLoading(false)
    }, 200)
  }

  const handleSelectPlan = (planId: string) => {
    Taro.navigateTo({ url: `/pages/plans/detail?id=${planId}` })
  }

  const handleJoinPlan = (planId: string, e: any) => {
    e.stopPropagation()
    setPlans(prev => prev.map(p =>
      p.id === planId ? { ...p, isJoined: true, progress: 1 } : p
    ))
    Taro.showToast({ title: '已加入方案！', icon: 'success' })
  }

  const renderDifficulty = (level: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Text key={i} className={`difficulty-dot ${i < level ? 'difficulty-dot--active' : ''}`}>
        ●
      </Text>
    ))
  }

  return (
    <View className='page plans-page'>
      {/* 顶部 */}
      <View className='plans-page__header'>
        <Text className='plans-page__title font-display'>去班味方案</Text>
        <Text className='plans-page__subtitle'>为你量身定制，科学去除班味</Text>
      </View>

      {/* 分类筛选 */}
      <ScrollView className='plans-page__categories' scrollX showScrollbar={false}>
        {categoryFilters.map(cat => (
          <View
            key={cat.key}
            className={`category-chip ${activeCategory === cat.key ? 'category-chip--active' : ''}`}
            style={activeCategory === cat.key ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
            onClick={() => setActiveCategory(cat.key)}
          >
            <Text className='category-chip__text'>{cat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 方案列表 */}
      <ScrollView className='plans-page__scroll' scrollY refresherEnabled refresherTriggered={loading} onRefresherRefresh={loadPlans}>
        <View className='plans-page__list'>
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              variant='elevated'
              padding='md'
              className={`plan-card animate-slide-up`}
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {/* 头部色条 */}
              <View className='plan-card__header' style={{ backgroundColor: plan.categoryColor + '20' }}>
                <Tag variant='default' size='sm' style={{ backgroundColor: plan.categoryColor + '25', color: plan.categoryColor }}>
                  {plan.categoryLabel}
                </Tag>
                <View className='plan-card__difficulty'>
                  <Text className='difficulty-label'>难度</Text>
                  {renderDifficulty(plan.difficulty)}
                </View>
              </View>

              <View className='plan-card__body'>
                <Text className='plan-card__name'>{plan.name}</Text>
                <Text className='plan-card__desc'>{plan.description}</Text>

                <View className='plan-card__meta'>
                  <View className='meta-item'>
                    <Text className='meta-item__icon'>⏱️</Text>
                    <Text className='meta-item__text'>{plan.duration}天</Text>
                  </View>
                  <View className='meta-item'>
                    <Text className='meta-item__icon'>📉</Text>
                    <Text className='meta-item__text'>预计降{plan.expectedEffect.reduceScore}分</Text>
                  </View>
                </View>

                <View className='plan-card__match'>
                  <Text className='match-icon'>💡</Text>
                  <Text className='match-text'>{plan.matchReason}</Text>
                </View>

                {/* 已加入进度 */}
                {plan.isJoined && (
                  <View className='plan-card__progress'>
                    <View className='progress-row'>
                      <Text className='progress-label'>打卡进度</Text>
                      <Text className='progress-value'>{plan.progress}/{plan.duration}天</Text>
                    </View>
                    <View className='progress-track'>
                      <View
                        className='progress-fill'
                        style={{
                          width: `${(plan.progress / plan.duration) * 100}%`,
                          backgroundColor: plan.categoryColor
                        }}
                      />
                    </View>
                  </View>
                )}

                {/* 操作按钮 */}
                {!plan.isJoined ? (
                  <View className='plan-card__action' onClick={(e) => handleJoinPlan(plan.id, e)}>
                    <Text className='plan-card__btn plan-card__btn--join'>✋ 加入方案</Text>
                  </View>
                ) : (
                  <View className='plan-card__action plan-card__action--joined'>
                    <Text className='plan-card__btn plan-card__btn--checkin'>✅ 今日打卡</Text>
                    <Text className='plan-card__btn plan-card__btn--detail'>查看详情 →</Text>
                  </View>
                )}
              </View>
            </Card>
          ))}
        </View>

        <View className='plans-page__bottom' />
      </ScrollView>
    </View>
  )
}
