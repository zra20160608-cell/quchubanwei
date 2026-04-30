import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState, useEffect, useCallback } from 'react'
import { Card, Tag } from '@/components'
import './index.scss'

export type PostType = 'detect_share' | 'checkin' | 'normal'

export interface PostItem {
  id: string
  userId: string
  userName: string
  avatar: string
  isAnonymous: boolean
  type: PostType
  text: string
  images: string[]
  score?: number
  level?: string
  levelColor?: string
  planName?: string
  checkInDays?: number
  topicTags: string[]
  likeCount: number
  commentCount: number
  collectCount: number
  isLiked: boolean
  isCollected: boolean
  createdAt: string
}

const mockPosts: PostItem[] = [
  {
    id: 'POST_001',
    userId: 'USER_001',
    userName: '加班仓鼠',
    avatar: '',
    isAnonymous: true,
    type: 'detect_share',
    text: '今天检测出班味浓度89分，腌入味了...工位上3个外卖盒+2杯咖啡+黑眼圈已经到下巴了😭',
    images: [],
    score: 89,
    level: '腌入味了',
    levelColor: '#C0392B',
    topicTags: ['#工位大赏', '#班味超标'],
    likeCount: 128,
    commentCount: 45,
    collectCount: 12,
    isLiked: false,
    isCollected: false,
    createdAt: '10分钟前'
  },
  {
    id: 'POST_002',
    userId: 'USER_002',
    userName: '摸鱼猫',
    avatar: '',
    isAnonymous: true,
    type: 'checkin',
    text: '坚持打卡第7天「到点下班秘籍」！班味从75降到了52，效果明显！今天准点18:00打卡走人 ✌️',
    images: [],
    score: 52,
    level: '微醺班味',
    levelColor: '#F39C12',
    planName: '到点下班秘籍',
    checkInDays: 7,
    topicTags: ['#去班味打卡', '#前后对比'],
    likeCount: 256,
    commentCount: 89,
    collectCount: 67,
    isLiked: true,
    isCollected: false,
    createdAt: '30分钟前'
  },
  {
    id: 'POST_003',
    userId: 'USER_003',
    userName: '职场仙人',
    avatar: '',
    isAnonymous: false,
    type: 'normal',
    text: '挑战「最乱工位大赛」，我这桌面能申请非物质文化遗产吗？🗂️📎☕🥡🖥️',
    images: [],
    score: 95,
    level: '腌入味了',
    levelColor: '#C0392B',
    topicTags: ['#最乱工位大赛'],
    likeCount: 512,
    commentCount: 234,
    collectCount: 156,
    isLiked: false,
    isCollected: true,
    createdAt: '1小时前'
  },
  {
    id: 'POST_004',
    userId: 'USER_004',
    userName: '班味绝缘体',
    avatar: '',
    isAnonymous: true,
    type: 'detect_share',
    text: '新鲜出炉！班味浓度23分，清新脱俗~ 绿植+整洁桌面+准时下班=快乐打工人 🌿',
    images: [],
    score: 23,
    level: '清新脱俗',
    levelColor: '#4ECDC4',
    topicTags: ['#清新脱俗', '#工位改造'],
    likeCount: 89,
    commentCount: 32,
    collectCount: 45,
    isLiked: false,
    isCollected: false,
    createdAt: '2小时前'
  }
]

export default function SocialIndex() {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('hot')

  useEffect(() => {
    loadPosts()
  }, [activeTab])

  const loadPosts = async () => {
    setLoading(true)
    // 模拟API请求
    setTimeout(() => {
      setPosts(mockPosts)
      setLoading(false)
    }, 300)
  }

  const handleLike = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newLiked = !post.isLiked
        return {
          ...post,
          isLiked: newLiked,
          likeCount: newLiked ? post.likeCount + 1 : post.likeCount - 1
        }
      }
      return post
    }))
    Taro.showToast({ title: '点赞成功', icon: 'success', duration: 800 })
  }, [])

  const handleCollect = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newCollected = !post.isCollected
        return {
          ...post,
          isCollected: newCollected,
          collectCount: newCollected ? post.collectCount + 1 : post.collectCount - 1
        }
      }
      return post
    }))
  }, [])

  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/social/publish' })
  }

  const handlePostDetail = (postId: string) => {
    Taro.navigateTo({ url: `/pages/social/detail?id=${postId}` })
  }

  const getPostTypeLabel = (type: PostType) => {
    switch (type) {
      case 'detect_share': return '检测结果'
      case 'checkin': return '方案打卡'
      case 'normal': return ''
    }
  }

  return (
    <View className='page social-page'>
      {/* 顶部标题区 */}
      <View className='social-page__header'>
        <Text className='social-page__title font-display'>班味圈子</Text>
        <Text className='social-page__subtitle'>看看大家的班味有多重</Text>
      </View>

      {/* Tab切换 */}
      <View className='social-page__tabs'>
        {[
          { key: 'hot', label: '🔥 热门' },
          { key: 'new', label: '✨ 最新' },
          { key: 'topic', label: '🏷️ 话题' }
        ].map(tab => (
          <View
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? 'tab-item--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className='tab-text'>{tab.label}</Text>
          </View>
        ))}
      </View>

      {/* 帖子列表 */}
      <ScrollView
        className='social-page__scroll'
        scrollY
        refresherEnabled
        refresherTriggered={loading}
        onRefresherRefresh={loadPosts}
      >
        <View className='social-page__list'>
          {posts.map((post, index) => (
            <Card
              key={post.id}
              variant='elevated'
              padding='md'
              className={`post-card animate-slide-up`}
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => handlePostDetail(post.id)}
            >
              {/* 头部：用户信息 */}
              <View className='post-card__header'>
                <View className='post-card__user'>
                  <View className='post-card__avatar'>
                    <Text>{post.isAnonymous ? '🐹' : '👤'}</Text>
                  </View>
                  <View className='post-card__meta'>
                    <Text className='post-card__name'>{post.userName}</Text>
                    <Text className='post-card__time'>{post.createdAt}</Text>
                  </View>
                </View>

                {/* 检测分享/打卡标签 */}
                {post.type !== 'normal' && (
                  <View className='post-card__type-badge'>
                    <Text className='post-card__type-text'>{getPostTypeLabel(post.type)}</Text>
                  </View>
                )}
              </View>

              {/* 内容区 */}
              <View className='post-card__body'>
                {/* 检测结果卡片（内嵌） */}
                {post.type === 'detect_share' && post.score !== undefined && (
                  <View className='post-card__detect-card' style={{ backgroundColor: post.levelColor + '15' }}>
                    <View className='detect-card__score-row'>
                      <Text className='detect-card__score' style={{ color: post.levelColor }}>{post.score}</Text>
                      <View className='detect-card__info'>
                        <Text className='detect-card__label'>班味浓度</Text>
                        <Tag variant={post.score <= 30 ? 'fresh' : post.score <= 60 ? 'tipsy' : post.score <= 85 ? 'strong' : 'extreme'} size='sm'>
                          {post.level}
                        </Tag>
                      </View>
                    </View>
                  </View>
                )}

                {/* 打卡卡片（内嵌） */}
                {post.type === 'checkin' && (
                  <View className='post-card__checkin-card'>
                    <View className='checkin-card__icon'>📅</View>
                    <View className='checkin-card__info'>
                      <Text className='checkin-card__plan'>{post.planName}</Text>
                      <Text className='checkin-card__days'>已连续打卡 <Text className='checkin-card__highlight'>{post.checkInDays}</Text> 天</Text>
                    </View>
                  </View>
                )}

                <Text className='post-card__text'>{post.text}</Text>

                {/* 图片 */}
                {post.images.length > 0 && (
                  <View className='post-card__images'>
                    {post.images.map((img: string, i: number) => (
                      <Image key={i} className='post-card__image' src={img} mode='aspectFill' />
                    ))}
                  </View>
                )}

                {/* 话题标签 */}
                <View className='post-card__tags'>
                  {post.topicTags.map((tag: string) => (
                    <View key={tag} className='post-card__tag'>
                      <Text className='post-card__tag-text'>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* 底部互动 */}
              <View className='post-card__footer'>
                <View
                  className={`action-btn ${post.isLiked ? 'action-btn--active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike(post.id)
                  }}
                >
                  <Text className='action-btn__icon'>{post.isLiked ? '❤️' : '🤍'}</Text>
                  <Text className='action-btn__count'>{post.likeCount}</Text>
                </View>

                <View className='action-btn' onClick={(e) => e.stopPropagation()}>
                  <Text className='action-btn__icon'>💬</Text>
                  <Text className='action-btn__count'>{post.commentCount}</Text>
                </View>

                <View
                  className={`action-btn ${post.isCollected ? 'action-btn--active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCollect(post.id)
                  }}
                >
                  <Text className='action-btn__icon'>{post.isCollected ? '⭐' : '☆'}</Text>
                  <Text className='action-btn__count'>{post.collectCount}</Text>
                </View>

                <View className='action-btn' onClick={(e) => e.stopPropagation()}>
                  <Text className='action-btn__icon'>↗️</Text>
                  <Text className='action-btn__count'>分享</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* 底部留白 */}
        <View className='social-page__bottom' />
      </ScrollView>

      {/* 浮动发布按钮 */}
      <View className='fab-publish' onClick={handlePublish}>
        <Text className='fab-publish__icon'>✏️</Text>
        <Text className='fab-publish__text'>发布</Text>
      </View>
    </View>
  )
}
