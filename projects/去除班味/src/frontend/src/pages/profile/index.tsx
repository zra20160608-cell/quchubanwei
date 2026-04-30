import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

export default function ProfileIndex() {
  const [user] = useState({
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
  })

  const [history] = useState([
    { date: '04-28', score: 72, level: '班味浓郁' },
    { date: '04-25', score: 65, level: '微醺班味' },
    { date: '04-20', score: 80, level: '班味浓郁' },
    { date: '04-15', score: 58, level: '微醺班味' },
    { date: '04-10', score: 85, level: '班味浓郁' }
  ])

  const handleViewHistory = () => {
    Taro.navigateTo({ url: '/pages/detect/history' })
  }

  const handleSettings = () => {
    Taro.showToast({ title: '设置功能开发中', icon: 'none' })
  }

  return (
    <ScrollView className='profile-page' scrollY>
      {/* 用户信息卡片 */}
      <View className='user-card'>
        <View className='user-header'>
          <View className='avatar'>
            <Text>👤</Text>
          </View>
          <View className='user-info'>
            <Text className='nickname'>{user.nickname}</Text>
            <View className='level-badge'>
              <Text className='level-text'>Lv.{user.level} {user.levelTitle}</Text>
            </View>
          </View>
          <View className='settings-btn' onClick={handleSettings}>
            <Text>⚙️</Text>
          </View>
        </View>

        {/* 经验值 */}
        <View className='exp-bar'>
          <View className='exp-fill' style={{ width: `${(user.exp / user.nextExp) * 100}%` }} />
          <Text className='exp-text'>{user.exp}/{user.nextExp} XP</Text>
        </View>
      </View>

      {/* 统计数据 */}
      <View className='stats-grid'>
        <View className='stat-item'>
          <Text className='stat-value'>{user.totalDetections}</Text>
          <Text className='stat-label'>检测次数</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-value'>{user.avgScore}</Text>
          <Text className='stat-label'>平均班味</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-value'>{user.checkInStreak}</Text>
          <Text className='stat-label'>连续打卡</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-value'>{user.totalPosts}</Text>
          <Text className='stat-label'>发布帖子</Text>
        </View>
      </View>

      {/* 成就 */}
      <View className='achievements-section'>
        <Text className='section-title'>🏆 我的成就</Text>
        <View className='achievements-list'>
          {user.achievements.map(ach => (
            <View key={ach.code} className='achievement-item'>
              <Text className='achievement-icon'>{ach.icon}</Text>
              <Text className='achievement-name'>{ach.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 检测趋势 */}
      <View className='trend-section'>
        <Text className='section-title'>📈 班味趋势</Text>
        <View className='trend-chart'>
          {history.map((item, index) => (
            <View key={index} className='trend-bar'>
              <View 
                className='trend-fill' 
                style={{ 
                  height: `${item.score}%`,
                  backgroundColor: item.score > 60 ? '#E67E22' : '#27AE60'
                }} 
              />
              <Text className='trend-date'>{item.date}</Text>
              <Text className='trend-score'>{item.score}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 操作入口 */}
      <View className='action-list'>
        <View className='action-item' onClick={handleViewHistory}>
          <Text>📋 检测历史</Text>
          <Text>→</Text>
        </View>
        <View className='action-item'>
          <Text>🎯 我的方案</Text>
          <Text>→</Text>
        </View>
        <View className='action-item'>
          <Text>⭐ 我的收藏</Text>
          <Text>→</Text>
        </View>
        <View className='action-item'>
          <Text>📤 邀请好友</Text>
          <Text>→</Text>
        </View>
      </View>
    </ScrollView>
  )
}
