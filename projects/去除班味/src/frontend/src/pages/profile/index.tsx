import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useCallback } from 'react'
import { Card, Tag } from '@/components'
import './index.scss'

export interface UserProfile {
  nickname: string
  avatar: string
  level: number
  levelTitle: string
  exp: number
  nextExp: number
  totalDetections: number
  avgScore: number
  checkInStreak: number
  totalPosts: number
  totalLikes: number
  achievements: { code: string; name: string; icon: string }[]
}

export interface DetectionRecord {
  id: string
  date: string
  score: number
  level: string
  levelColor: string
}

const mockUser: UserProfile = {
  nickname: '打工人小王',
  avatar: '',
  level: 4,
  levelTitle: '班味斗士',
  exp: 650,
  nextExp: 1000,
  totalDetections: 12,
  avgScore: 68,
  checkInStreak: 5,
  totalPosts: 8,
  totalLikes: 234,
  achievements: [
    { code: 'FIRST_DETECT', name: '初次检测', icon: '🎯' },
    { code: 'SHARE_MASTER', name: '分享达人', icon: '📤' },
    { code: 'STREAK_7', name: '坚持之星', icon: '⭐' },
    { code: 'LEVEL_4', name: '班味斗士', icon: '🛡️' }
  ]
}

const mockHistory: DetectionRecord[] = [
  { id: 'D001', date: '04-28', score: 72, level: '班味浓郁', levelColor: '#E67E22' },
  { id: 'D002', date: '04-25', score: 65, level: '微醺班味', levelColor: '#F39C12' },
  { id: 'D003', date: '04-20', score: 80, level: '班味浓郁', levelColor: '#E67E22' },
  { id: 'D004', date: '04-15', score: 58, level: '微醺班味', levelColor: '#F39C12' },
  { id: 'D005', date: '04-10', score: 85, level: '班味浓郁', levelColor: '#E67E22' }
]

export default function ProfileIndex() {
  const [user] = useState(mockUser)
  const [history] = useState(mockHistory)

  const expPercent = Math.round((user.exp / user.nextExp) * 100)

  const handleNavigate = useCallback((url: string) => {
    Taro.navigateTo({ url })
  }, [])

  const handleSettings = () => {
    Taro.navigateTo({ url: '/pages/profile/settings' })
  }

  return (
    <ScrollView className='page profile-page' scrollY>
      {/* 用户信息卡片 */}
      <Card variant='elevated' padding='lg' className='profile-page__user-card'>
        <View className='user-card__header'>
          <View className='user-card__avatar'>
            <Text>👤</Text>
          </View>
          <View className='user-card__info'>
            <Text className='user-card__name'>{user.nickname}</Text>
            <View className='user-card__level'>
              <Tag variant='brand' size='sm'>
                Lv.{user.level} {user.levelTitle}
              </Tag>
            </View>
          </View>
          <View className='user-card__settings' onClick={handleSettings}>
            <Text>⚙️</Text>
          </View>
        </View>

        {/* 经验条 */}
        <View className='user-card__exp'>
          <View className='exp-track'>
            <View className='exp-fill' style={{ width: `${expPercent}%` }} />
          </View>
          <Text className='exp-text'>{user.exp} / {user.nextExp} XP</Text>
        </View>
      </Card>

      {/* 统计数据 */}
      <View className='profile-page__stats'>
        {[
          { value: user.totalDetections, label: '检测次数', icon: '📊' },
          { value: user.avgScore, label: '平均班味', icon: '📈' },
          { value: user.checkInStreak, label: '连续打卡', icon: '🔥' },
          { value: user.totalPosts, label: '发布帖子', icon: '📝' }
        ].map((stat, i) => (
          <View key={i} className='stat-item' onClick={() => {
            if (stat.label === '检测次数') handleNavigate('/pages/profile/my-posts')
          }}>
            <Text className='stat-item__icon'>{stat.icon}</Text>
            <Text className='stat-item__value'>{stat.value}</Text>
            <Text className='stat-item__label'>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* 成就 */}
      <View className='profile-page__section'>
        <Text className='section-title font-display'>🏆 我的成就</Text>
        <View className='achievements-list'>
          {user.achievements.map(ach => (
            <View key={ach.code} className='achievement-item'>
              <View className='achievement-item__icon'>
                <Text>{ach.icon}</Text>
              </View>
              <Text className='achievement-item__name'>{ach.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 检测趋势 */}
      <View className='profile-page__section'>
        <Text className='section-title font-display'>📈 班味趋势</Text>
        <Card variant='elevated' padding='md' className='trend-card'>
          <View className='trend-chart'>
            {history.map((item, index) => (
              <View key={index} className='trend-bar'>
                <View className='trend-bar__track'>
                  <View
                    className='trend-bar__fill'
                    style={{
                      height: `${item.score}%`,
                      backgroundColor: item.levelColor
                    }}
                  />
                </View>
                <Text className='trend-bar__date'>{item.date}</Text>
                <Text className='trend-bar__score' style={{ color: item.levelColor }}>{item.score}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* 操作入口 */}
      <View className='profile-page__section'>
        <Text className='section-title font-display'>📂 我的内容</Text>
        <Card variant='default' padding='md' className='action-list'>
          {[
            { label: '检测历史', icon: '📋', url: '/pages/profile/my-posts' },
            { label: '我的方案', icon: '🎯', url: '/pages/profile/my-plans' },
            { label: '我的帖子', icon: '📝', url: '/pages/profile/my-posts' },
            { label: '我的收藏', icon: '⭐', url: '/pages/profile/my-posts' }
          ].map(item => (
            <View key={item.label} className='action-item' onClick={() => handleNavigate(item.url)}>
              <View className='action-item__left'>
                <Text className='action-item__icon'>{item.icon}</Text>
                <Text className='action-item__label'>{item.label}</Text>
              </View>
              <Text className='action-item__arrow'>→</Text>
            </View>
          ))}
        </Card>
      </View>

      {/* 其他入口 */}
      <View className='profile-page__section'>
        <Card variant='default' padding='md' className='action-list'>
          {[
            { label: '邀请好友', icon: '📤' },
            { label: '意见反馈', icon: '💬' },
            { label: '关于我们', icon: 'ℹ️' }
          ].map(item => (
            <View key={item.label} className='action-item'>
              <View className='action-item__left'>
                <Text className='action-item__icon'>{item.icon}</Text>
                <Text className='action-item__label'>{item.label}</Text>
              </View>
              <Text className='action-item__arrow'>→</Text>
            </View>
          ))}
        </Card>
      </View>

      <View className='profile-page__bottom' />
    </ScrollView>
  )
}
