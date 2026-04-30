import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Button, Card, Tag } from '@/components'
import './detail.scss'

interface ActionItem {
  id: string
  day: number
  title: string
  description: string
  isCompleted: boolean
  tip: string
}

interface CheckInRecord {
  date: string
  day: number
  isDone: boolean
}

const mockPlanDetail = {
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
  currentDay: 3,
  totalCheckIns: 3,
  isJoined: true,
  actions: [
    {
      id: 'A001', day: 1, title: '清理桌面垃圾', description: '扔掉所有外卖盒、空杯子、废纸团', isCompleted: true,
      tip: '💡 准备一个小垃圾桶放在手边，方便随时清理'
    },
    {
      id: 'A002', day: 2, title: '文件分类归档', description: '把散落的文件按项目/时间分类，放入文件夹', isCompleted: true,
      tip: '💡 彩色文件夹标签让你一眼找到需要的文件'
    },
    {
      id: 'A003', day: 3, title: '线缆收纳整理', description: '用扎带/理线器整理乱成一团的电源线和数据线', isCompleted: false,
      tip: '💡 买几个便宜的数据线固定夹，贴桌底超好用'
    },
    {
      id: 'A004', day: 4, title: '添加绿植点缀', description: '在工位放一盆小绿植（多肉/绿萝都OK）', isCompleted: false,
      tip: '💡 绿萝最好养，一周浇一次水就行'
    },
    {
      id: 'A005', day: 5, title: '建立收纳系统', description: '给常用物品设定固定位置，用完归位', isCompleted: false,
      tip: '💡 "哪里拿的放回哪里"是保持整洁的核心秘诀'
    },
    {
      id: 'A006', day: 6, title: '断舍离挑战', description: '扔掉/拿走至少5件不需要的东西', isCompleted: false,
      tip: '💡 问自己：这件东西半年内用过吗？'
    },
    {
      id: 'A007', day: 7, title: '最终验收', description: '拍照记录整洁工位，对比第一天的照片', isCompleted: false,
      tip: '💡 把对比图分享到圈子，激励更多人！'
    }
  ] as ActionItem[],
  checkInRecords: [
    { date: '04-25', day: 1, isDone: true },
    { date: '04-26', day: 2, isDone: true },
    { date: '04-27', day: 3, isDone: false }
  ] as CheckInRecord[]
}

export default function PlanDetailPage() {
  const [plan, setPlan] = useState(mockPlanDetail)
  const [actions, setActions] = useState<ActionItem[]>(mockPlanDetail.actions)
  const [showRetest, setShowRetest] = useState(false)

  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const planId = instance.router?.params?.id
    console.log('Plan ID:', planId)
  }, [])

  const handleCheckIn = (actionId: string) => {
    setActions(prev => prev.map(a =>
      a.id === actionId ? { ...a, isCompleted: !a.isCompleted } : a
    ))
    Taro.showToast({ title: '打卡成功！', icon: 'success' })
  }

  const handleRetest = () => {
    Taro.navigateTo({ url: '/pages/detect/index' })
  }

  const completedCount = actions.filter(a => a.isCompleted).length
  const progressPercent = Math.round((completedCount / actions.length) * 100)

  return (
    <View className='page plan-detail-page'>
      <ScrollView className='plan-detail-page__scroll' scrollY>
        {/* 头部信息 */}
        <View className='plan-detail-page__header' style={{ backgroundColor: plan.categoryColor + '18' }}>
          <View className='plan-detail-page__header-top'>
            <Tag variant='default' size='sm' style={{ backgroundColor: plan.categoryColor + '25', color: plan.categoryColor }}>
              {plan.categoryLabel}
            </Tag>
            <View className='plan-detail-page__difficulty'>
              <Text className='difficulty-label'>难度</Text>
              {Array.from({ length: 5 }).map((_, i) => (
                <Text key={i} className={`difficulty-dot ${i < plan.difficulty ? 'difficulty-dot--active' : ''}`}>
                  ●
                </Text>
              ))}
            </View>
          </View>

          <Text className='plan-detail-page__name font-display'>{plan.name}</Text>
          <Text className='plan-detail-page__desc'>{plan.description}</Text>

          <View className='plan-detail-page__meta'>
            <View className='meta-item'>
              <Text className='meta-item__icon'>⏱️</Text>
              <Text className='meta-item__text'>{plan.duration}天疗程</Text>
            </View>
            <View className='meta-item'>
              <Text className='meta-item__icon'>📉</Text>
              <Text className='meta-item__text'>预计降低{plan.expectedEffect.reduceScore}分班味</Text>
            </View>
          </View>

          {/* 总进度 */}
          <View className='plan-detail-page__overall-progress'>
            <View className='progress-info'>
              <Text className='progress-label'>总体进度</Text>
              <Text className='progress-value'>{completedCount}/{plan.duration}天 · {progressPercent}%</Text>
            </View>
            <View className='progress-track'>
              <View className='progress-fill' style={{ width: `${progressPercent}%`, backgroundColor: plan.categoryColor }} />
            </View>
          </View>
        </View>

        {/* 打卡日历 */}
        <View className='plan-detail-page__calendar'>
          <Text className='section-title'>📅 打卡记录</Text>
          <View className='calendar-grid'>
            {plan.checkInRecords.map(record => (
              <View key={record.day} className={`calendar-day ${record.isDone ? 'calendar-day--done' : ''}`}>
                <Text className='calendar-day__date'>{record.date}</Text>
                <Text className='calendar-day__icon'>{record.isDone ? '✅' : '⭕'}</Text>
                <Text className='calendar-day__label'>第{record.day}天</Text>
              </View>
            ))}
            {Array.from({ length: plan.duration - plan.checkInRecords.length }).map((_, i) => (
              <View key={`empty-${i}`} className='calendar-day calendar-day--future'>
                <Text className='calendar-day__date'>--</Text>
                <Text className='calendar-day__icon'>⚪</Text>
                <Text className='calendar-day__label'>待打卡</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 行动项列表 */}
        <View className='plan-detail-page__actions'>
          <Text className='section-title'>📋 每日行动</Text>
          {actions.map(action => (
            <Card
              key={action.id}
              variant={action.isCompleted ? 'default' : 'elevated'}
              padding='md'
              className={`action-card ${action.isCompleted ? 'action-card--completed' : ''}`}
            >
              <View className='action-card__header'>
                <View className='action-card__day-badge' style={{ backgroundColor: plan.categoryColor + '20' }}>
                  <Text style={{ color: plan.categoryColor }}>Day {action.day}</Text>
                </View>
                <View
                  className={`action-card__check ${action.isCompleted ? 'action-card__check--done' : ''}`}
                  onClick={() => handleCheckIn(action.id)}
                >
                  <Text>{action.isCompleted ? '✅' : '⬜'}</Text>
                </View>
              </View>

              <Text className='action-card__title'>{action.title}</Text>
              <Text className='action-card__desc'>{action.description}</Text>

              <View className='action-card__tip'>
                <Text className='tip-text'>{action.tip}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* 效果复测 */}
        {completedCount >= 3 && (
          <View className='plan-detail-page__retest'>
            <Card variant='elevated' padding='lg' className='retest-card'>
              <Text className='retest-card__title'>🎯 效果复测</Text>
              <Text className='retest-card__desc'>你已经完成了{completedCount}天，来看看班味降低了多少吧！</Text>
              <Button variant='primary' fullWidth onClick={handleRetest}>
                📊 重新检测班味
              </Button>
            </Card>
          </View>
        )}

        <View className='plan-detail-page__bottom' />
      </ScrollView>
    </View>
  )
}
