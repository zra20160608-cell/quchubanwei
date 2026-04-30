import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Card } from '@/components'
import './my-posts.scss'

interface MyPostItem {
  id: string
  type: 'post' | 'detect'
  content: string
  createdAt: string
  likeCount: number
  commentCount: number
  score?: number
  level?: string
}

const mockMyPosts: MyPostItem[] = [
  {
    id: 'P001',
    type: 'detect',
    content: '班味浓度检测：78分，班味浓郁',
    createdAt: '04-28 14:30',
    likeCount: 23,
    commentCount: 5,
    score: 78,
    level: '班味浓郁'
  },
  {
    id: 'P002',
    type: 'post',
    content: '今天成功打卡「5分钟工位急救术」第3天！桌面终于能看了 😭',
    createdAt: '04-27 18:20',
    likeCount: 56,
    commentCount: 12
  },
  {
    id: 'P003',
    type: 'post',
    content: '挑战最乱工位，不服来战',
    createdAt: '04-25 09:15',
    likeCount: 128,
    commentCount: 45
  },
  {
    id: 'P004',
    type: 'detect',
    content: '班味浓度检测：65分，微醺班味',
    createdAt: '04-22 11:00',
    likeCount: 12,
    commentCount: 3,
    score: 65,
    level: '微醺班味'
  }
]

export default function MyPostsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'detects'>('all')

  const filteredPosts = mockMyPosts.filter(post => {
    if (activeTab === 'all') return true
    if (activeTab === 'posts') return post.type === 'post'
    return post.type === 'detect'
  })

  return (
    <View className='page my-posts-page'>
      <View className='my-posts-page__header'>
        <Text className='my-posts-page__title font-display'>📝 我的内容</Text>
      </View>

      {/* Tab */}
      <View className='my-posts-page__tabs'>
        {[
          { key: 'all', label: '全部' },
          { key: 'posts', label: '帖子' },
          { key: 'detects', label: '检测' }
        ].map(tab => (
          <View
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? 'tab-item--active' : ''}`}
            onClick={() => setActiveTab(tab.key as any)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView className='my-posts-page__scroll' scrollY>
        <View className='my-posts-page__list'>
          {filteredPosts.map(post => (
            <Card key={post.id} variant='elevated' padding='md' className='my-post-card'>
              <View className='my-post-card__header'>
                <View className='my-post-card__type-badge'>
                  <Text>{post.type === 'detect' ? '📊' : '📝'}</Text>
                  <Text className='type-text'>{post.type === 'detect' ? '检测记录' : '社区帖子'}</Text>
                </View>
                <Text className='my-post-card__time'>{post.createdAt}</Text>
              </View>

              <Text className='my-post-card__content'>{post.content}</Text>

              {post.type === 'detect' && post.score !== undefined && (
                <View className='my-post-card__score-row'>
                  <Text className='score-num' style={{ color: post.score > 60 ? '#E67E22' : '#4ECDC4' }}>
                    {post.score}分
                  </Text>
                  <Text className='level-tag'>{post.level}</Text>
                </View>
              )}

              <View className='my-post-card__footer'>
                <Text className='footer-stat'>❤️ {post.likeCount}</Text>
                <Text className='footer-stat'>💬 {post.commentCount}</Text>
              </View>
            </Card>
          ))}
        </View>

        <View className='my-posts-page__bottom' />
      </ScrollView>
    </View>
  )
}
