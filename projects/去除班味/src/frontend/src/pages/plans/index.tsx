import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import './index.scss'

export default function PlansIndex() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    setLoading(true)
    // Mock数据
    setPlans([
      {
        id: 'PLAN_001',
        name: '5分钟工位急救术',
        category: 'DESK_TRANSFORM',
        categoryLabel: '工位改造',
        difficulty: 2,
        duration: 7,
        coverImage: '',
        description: '快速整理工位，找回工作仪式感',
        matchReason: '因为检测到外卖盒+凌乱桌面',
        expectedEffect: { reduceScore: 15 }
      },
      {
        id: 'PLAN_002',
        name: '打工人自救指南',
        category: 'BODY_MIND',
        categoryLabel: '身心调节',
        difficulty: 3,
        duration: 14,
        coverImage: '',
        description: '全方位身心调节，告别职业病',
        matchReason: '因为检测到黑眼圈+颈椎贴',
        expectedEffect: { reduceScore: 20 }
      },
      {
        id: 'PLAN_003',
        name: '到点下班秘籍',
        category: 'EFFICIENCY',
        categoryLabel: '效率提升',
        difficulty: 2,
        duration: 7,
        coverImage: '',
        description: '提升效率，准点下班不是梦',
        matchReason: '因为检测到多屏幕+深夜灯光',
        expectedEffect: { reduceScore: 10 }
      }
    ])
    setLoading(false)
  }

  const handleSelectPlan = (planId: string) => {
    Taro.navigateTo({ url: `/pages/plans/detail?id=${planId}` })
  }

  const getCategoryColor = (category: string) => {
    const colors: any = {
      DESK_TRANSFORM: '#4ECDC4',
      BODY_MIND: '#FF6B6B',
      EFFICIENCY: '#FFE66D',
      FISH_ART: '#9B59B6',
      SOCIAL: '#3498DB'
    }
    return colors[category] || '#999'
  }

  return (
    <View className='plans-page'>
      <View className='header'>
        <Text className='title'>🎯 推荐去班味方案</Text>
        <Text className='subtitle'>基于你的检测结果智能推荐</Text>
      </View>

      <ScrollView className='plans-list' scrollY>
        {plans.map(plan => (
          <View key={plan.id} className='plan-card' onClick={() => handleSelectPlan(plan.id)}>
            <View className='plan-header' style={{ backgroundColor: getCategoryColor(plan.category) }}>
              <Text className='plan-category'>{plan.categoryLabel}</Text>
              <View className='plan-difficulty'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text key={i} className={`difficulty-dot ${i < plan.difficulty ? 'active' : ''}`}>●</Text>
                ))}
              </View>
            </View>
            
            <View className='plan-body'>
              <Text className='plan-name'>{plan.name}</Text>
              <Text className='plan-desc'>{plan.description}</Text>
              <View className='plan-meta'>
                <Text className='meta-item'>⏱️ {plan.duration}天</Text>
                <Text className='meta-item'>📉 预计降低{plan.expectedEffect.reduceScore}分</Text>
              </View>
              <View className='match-reason'>
                <Text className='match-text'>💡 {plan.matchReason}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
