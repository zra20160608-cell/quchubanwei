import { get, post, put, del } from '../services/request'

// 获取帖子列表
export const getPosts = (params?: any) => get('/posts', params)

// 获取帖子详情
export const getPostDetail = (id: string) => get(`/posts/${id}`)

// 发布帖子
export const createPost = (data: any) => post('/posts', data)

// 更新帖子
export const updatePost = (id: string, data: any) => put(`/posts/${id}`, data)

// 删除帖子
export const deletePost = (id: string) => del(`/posts/${id}`)

// 点赞 / 取消点赞
export const toggleLike = (id: string) => post(`/posts/${id}/like`)

// 收藏 / 取消收藏
export const toggleCollect = (id: string, folderName?: string) => 
  post(`/posts/${id}/collect`, { folderName })

// 获取评论列表
export const getComments = (postId: string, params?: any) => get(`/posts/${postId}/comments`, params)

// 发表评论
export const createComment = (postId: string, content: string, parentId?: string) => 
  post(`/posts/${postId}/comments`, { content, parentId })

// 删除评论
export const deleteComment = (id: string) => del(`/comments/${id}`)

// 举报帖子
export const reportPost = (id: string, reasonType: string, reasonText?: string) => 
  post(`/posts/${id}/report`, { reasonType, reasonText })

// 搜索
export const searchPosts = (q: string, type: string = 'post', params?: any) => 
  get('/search', { q, type, ...params })

// 获取话题列表
export const getTopics = (params?: any) => get('/topics', params)

// 获取话题详情
export const getTopicDetail = (id: string, params?: any) => get(`/topics/${id}`, params)
