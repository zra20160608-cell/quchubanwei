import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import './index.scss'

export default function SocialIndex() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('hot')

  useEffect(() => {
    loadPosts()
  }, [activeTab])

  const loadPosts = async () => {
    setLoading(true)
    // Mock数据
    setPosts([
      {
        id: 'POST_001',
        userId: 'USER_001',
        userName: '加班仓鼠',
        avatar: '',
        isAnonymous: true,
        text: '今天检测出班味浓度89分，腌入味了...工位上3个外卖盒+2杯咖啡+黑眼圈已经到下巴了😭',
        images: [],
        score: 89,
        level: '腌入味了',
        topicTags: ['#工位大赏', '#班味超标'],
        likeCount: 128,
        commentCount: 45,
        collectCount: 12,
        createdAt: '10分钟前'
      },
      {
        id: 'POST_002',
        userId: 'USER_002',
        userName: '摸鱼猫',
        avatar: '',
        isAnonymous: true,
        text: '坚持打卡7天「到点下班秘籍」，班味从75降到了52！效果明显！',
        images: [],
        score: 52,
        level: '微醺班味',
        topicTags: ['#去班味打卡', '#前后对比'],
        likeCount: 256,
        commentCount: 89,
        collectCount: 67,
        createdAt: '30分钟前'
      },
      {
        id: 'POST_003',
        userId: 'USER_003',
        userName: '职场仙人',
        avatar: '',
        isAnonymous: false,
        text: '挑战「最乱工位大赛」，我这桌面能申请非物质文化遗产吗？',
        images: [],
        score: 95,
        level: '腌入味了',
        topicTags: ['#最乱工位大赛'],
        likeCount: 512,
        commentCount: 234,
        collectCount: 156,
        createdAt: '1小时前'
      }
    ])
    setLoading(false)
  }

  const handleLike = (postId: string) => {
    // 点赞动画+请求
    Taro.showToast({ title: '点赞成功', icon: 'success' })
  }

  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/social/publish' })
  }

  return (
    <View className='social-page'>
      {/* 顶部Tab */}
      <View className='tab-bar'>
        {[
          { key: 'hot', label: '热门' },
          { key: 'new', label: '最新' },
          { key: 'topic', label: '话题' }
        ].map(tab => (
          <View
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className='tab-text'>{tab.label}</Text>
          </View>
        ))}
      </View>

      {/* 发布按钮 */}
      <View className='publish-btn' onClick={handlePublish}>
        <Text>+ 发布</Text>
      </View>

      {/* 帖子列表 */}
      <ScrollView className='posts-list' scrollY>
        {posts.map(post => (
          <View key={post.id} className='post-card'>
            {/* 用户信息 */}
            <View className='post-header'>
              <View className='user-info'>
                <View className='avatar'>
                  <Text>{post.isAnonymous ? '🐹' : '👤'}</Text>
                </View>
                <View className='user-meta'>
                  <Text className='user-name'>{post.userName}</Text>
                  <Text className='post-time'>{post.createdAt}</Text>
                </View>
              </View>
              <View className='score-badge'>
                <Text className='score-text'>{post.score}分</Text>
                <Text className='level-text'>{post.level}</Text>
              </View>
            </View>

            {/* 帖子内容 */}
            <View className='post-body'>
              <Text className='post-text'>{post.text}</Text>
              {post.images.length > 0 && (
                <View className='post-images'>
                  {post.images.map((img: string, i: number) => (
                    <Image key={i} className='post-image' src={img} mode='aspectFill' />
                  ))}
                </View>
              )}
              <View className='post-tags'>
                {post.topicTags.map((tag: string) => (
                  <Text key={tag} className='tag'>{tag}</Text>
                ))}
              </View>
            </View>

            {/* 互动 */}
            <View className='post-footer'>
              <View className='action-btn' onClick={() => handleLike(post.id)}>
                <Text>❤️ {post.likeCount}</Text>
              </View>
              <View className='action-btn'>
                <Text>💬 {post.commentCount}</Text>
              </View>
              <View className='action-btn'>
                <Text>⭐ {post.collectCount}</Text>
              </View>
              <View className='action-btn'>
                <Text>↗️ 分享</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
