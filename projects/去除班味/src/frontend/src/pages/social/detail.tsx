import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Card, Tag } from '@/components'
import './detail.scss'

const mockPostDetail = {
  id: 'POST_001',
  userId: 'USER_001',
  userName: '加班仓鼠',
  avatar: '',
  isAnonymous: true,
  type: 'detect_share' as const,
  text: '今天检测出班味浓度89分，腌入味了...工位上3个外卖盒+2杯咖啡+黑眼圈已经到下巴了😭 求救！',
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
}

const mockComments = [
  {
    id: 'C001',
    userName: '摸鱼大师',
    avatar: '',
    isAnonymous: true,
    content: '这班味已经腌入味了，建议直接辞职去放羊 🐑',
    likeCount: 32,
    createdAt: '5分钟前'
  },
  {
    id: 'C002',
    userName: '养生达人',
    avatar: '',
    isAnonymous: true,
    content: '先别慌！试试「5分钟工位急救术」，我三天就从85降到60了',
    likeCount: 18,
    createdAt: '8分钟前'
  },
  {
    id: 'C003',
    userName: '班味绝缘体',
    avatar: '',
    isAnonymous: false,
    content: '看到你这工位照片，我已经开始窒息了...加油！',
    likeCount: 56,
    createdAt: '10分钟前'
  }
]

export default function PostDetailPage() {
  const [post, setPost] = useState(mockPostDetail)
  const [comments] = useState(mockComments)
  const [commentInput, setCommentInput] = useState('')

  useEffect(() => {
    // 实际应该从路由参数获取postId并请求数据
    const instance = Taro.getCurrentInstance()
    const postId = instance.router?.params?.id
    console.log('Post ID:', postId)
  }, [])

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
    }))
  }

  const handleCollect = () => {
    setPost(prev => ({
      ...prev,
      isCollected: !prev.isCollected,
      collectCount: prev.isCollected ? prev.collectCount - 1 : prev.collectCount + 1
    }))
  }

  const handleSubmitComment = () => {
    if (!commentInput.trim()) return
    Taro.showToast({ title: '评论成功', icon: 'success' })
    setCommentInput('')
  }

  return (
    <View className='page post-detail-page'>
      <ScrollView className='post-detail-page__scroll' scrollY>
        {/* 帖子内容 */}
        <Card variant='elevated' padding='md' className='post-detail-page__content'>
          <View className='post-detail-page__header'>
            <View className='post-detail-page__user'>
              <View className='post-detail-page__avatar'>
                <Text>{post.isAnonymous ? '🐹' : '👤'}</Text>
              </View>
              <View className='post-detail-page__meta'>
                <Text className='post-detail-page__name'>{post.userName}</Text>
                <Text className='post-detail-page__time'>{post.createdAt}</Text>
              </View>
            </View>
          </View>

          {/* 检测卡片 */}
          {post.type === 'detect_share' && post.score !== undefined && (
            <View className='post-detail-page__detect-card' style={{ backgroundColor: post.levelColor + '15' }}>
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

          <Text className='post-detail-page__text'>{post.text}</Text>

          <View className='post-detail-page__tags'>
            {post.topicTags.map(tag => (
              <View key={tag} className='post-detail-page__tag'>
                <Text>{tag}</Text>
              </View>
            ))}
          </View>

          {/* 互动数据 */}
          <View className='post-detail-page__stats'>
            <Text className='stats-item'>❤️ {post.likeCount} 赞</Text>
            <Text className='stats-item'>💬 {post.commentCount} 评论</Text>
            <Text className='stats-item'>⭐ {post.collectCount} 收藏</Text>
          </View>
        </Card>

        {/* 评论区 */}
        <View className='post-detail-page__comments-section'>
          <Text className='comments-section__title'>💬 评论 ({comments.length})</Text>
          {comments.map(comment => (
            <Card key={comment.id} variant='default' padding='sm' className='comment-card'>
              <View className='comment-card__header'>
                <View className='comment-card__avatar'>
                  <Text>{comment.isAnonymous ? '🐱' : '👤'}</Text>
                </View>
                <View className='comment-card__meta'>
                  <Text className='comment-card__name'>{comment.userName}</Text>
                  <Text className='comment-card__time'>{comment.createdAt}</Text>
                </View>
              </View>
              <Text className='comment-card__content'>{comment.content}</Text>
              <View className='comment-card__footer'>
                <Text className='comment-card__likes'>❤️ {comment.likeCount}</Text>
              </View>
            </Card>
          ))}
        </View>

        <View className='post-detail-page__bottom' />
      </ScrollView>

      {/* 底部操作栏 */}
      <View className='post-detail-page__action-bar'>
        <View
          className={`action-bar__btn ${post.isLiked ? 'action-bar__btn--active' : ''}`}
          onClick={handleLike}
        >
          <Text>{post.isLiked ? '❤️' : '🤍'}</Text>
          <Text className='action-bar__btn-text'>点赞</Text>
        </View>
        <View className='action-bar__btn' onClick={handleCollect}>
          <Text>{post.isCollected ? '⭐' : '☆'}</Text>
          <Text className='action-bar__btn-text'>收藏</Text>
        </View>
        <View className='action-bar__btn'>
          <Text>↗️</Text>
          <Text className='action-bar__btn-text'>分享</Text>
        </View>
      </View>
    </View>
  )
}
