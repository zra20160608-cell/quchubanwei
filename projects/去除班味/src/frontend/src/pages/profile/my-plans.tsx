import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Card, Tag } from '@/components'
import './my-plans.scss'

interface MyPlan {
  id: string
  name: string
  category: string
  categoryLabel: string
  categoryColor: string
  duration: number
  progress: number
  isCompleted: boolean
  completedDate?: string
  lastCheckIn?: string
}

const mockMyPlans: MyPlan[] = [
  {
    id: 'PLAN_001',
    name: '5分钟工位急救术',
    category: 'DESK_TRANSFORM',
    categoryLabel: '工位改造',
    categoryColor: '#4ECDC4',
    duration: 7,
    progress: 3,
    isCompleted: false,
    lastCheckIn: '04-27'
  },
  {
    id: 'PLAN_004',
    name: '带薪养生大法',
    category: 'BODY_MIND',
    categoryLabel: '身心调节',
    categoryColor: '#FF6B6B',
    duration: 21,
    progress: 12,
    isCompleted: false,
    lastCheckIn: '04-28'
  },
  {
    id: 'PLAN_003',
    name: '到点下班秘籍',
    category: 'EFFICIENCY',
    categoryLabel: '效率提升',
    categoryColor: '#F39C12',
    duration: 7,
    progress: 7,
    isCompleted: true,
    completedDate: '04-20',
    lastCheckIn: '04-20'
  }
]

export default function MyPlansPage() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing')
  const [plans, setPlans] = useState<MyPlan[]>([])

  useEffect(() => {
    const filtered = mockMyPlans.filter(p =>
      activeTab === 'ongoing' ? !p.isCompleted : p.isCompleted
    )
    setPlans(filtered)
  }, [activeTab])

  const handlePlanDetail = (planId: string) => {
    Taro.navigateTo({ url: `/pages/plans/detail?id=${planId}` })
  }

  return (
    <View className='page my-plans-page'>
      <View className='my-plans-page__header'>
        <Text className='my-plans-page__title font-display'>🎯 我的方案</Text>
      </View>

      {/* Tab */}
      <View className='my-plans-page__tabs'>
        <View
          className={`tab-item ${activeTab === 'ongoing' ? 'tab-item--active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          <Text>进行中</Text>
        </View>
        <View
          className={`tab-item ${activeTab === 'completed' ? 'tab-item--active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <Text>已完成</Text>
        </View>
      </View>

      <ScrollView className='my-plans-page__scroll' scrollY>
        <View className='my-plans-page__list'>
          {plans.map(plan => (
            <Card
              key={plan.id}
              variant='elevated'
              padding='md'
              className='my-plan-card'
              onClick={() => handlePlanDetail(plan.id)}
            >
              <View className='my-plan-card__header' style={{ backgroundColor: plan.categoryColor + '18' }}>
                <Tag variant='default' size='sm' style={{ backgroundColor: plan.categoryColor + '25', color: plan.categoryColor }}>
                  {plan.categoryLabel}
                </Tag>
                {plan.isCompleted && (
                  <View className='completed-badge'>
                    <Text>🎉 已完成</Text>
                  </View>
                )}
              </View>

              <Text className='my-plan-card__name'>{plan.name}</Text>

              <View className='my-plan-card__progress'>
                <View className='progress-info'>
                  <Text className='progress-label'>进度</Text>
                  <Text className='progress-value'>{plan.progress}/{plan.duration}天</Text>
                </View>
                <View className='progress-track'>
                  <View
                    className='progress-fill'
                    style={{ width: `${(plan.progress / plan.duration) * 100}%`, backgroundColor: plan.categoryColor }}
                  />
                </View>
              </View>

              <View className='my-plan-card__meta'>
                {plan.lastCheckIn && (
                  <Text className='meta-text'>📅 上次打卡: {plan.lastCheckIn}</Text>
                )}
                {plan.completedDate && (
                  <Text className='meta-text'>🏆 完成日期: {plan.completedDate}</Text>
                )}
              </View>

              {!plan.isCompleted && (
                <View className='my-plan-card__action'>
                  <Text className='action-btn' style={{ color: plan.categoryColor }}>
                    继续打卡 →
                  </Text>
                </View>
              )}
            </Card>
          ))}
        </View>

        {plans.length === 0 && (
          <View className='empty-state'>
            <Text className='empty-state__icon'>📋</Text>
            <Text className='empty-state__text'>
              {activeTab === 'ongoing' ? '暂无进行中的方案，去方案页看看吧！' : '还没有完成的方案，加油打卡！'}
            </Text>
          </View>
        )}

        <View className='my-plans-page__bottom' />
      </ScrollView>
    </View>
  )
}
