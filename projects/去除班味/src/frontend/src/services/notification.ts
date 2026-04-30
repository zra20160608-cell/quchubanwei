import { get, put } from '../services/request'

// 获取通知列表
export const getNotifications = (params?: any) => get('/notifications', params)

// 标记单条已读
export const markAsRead = (id: string) => put(`/notifications/${id}/read`)

// 全部已读
export const markAllAsRead = () => put('/notifications/read-all')

// 获取未读数
export const getUnreadCount = () => get('/notifications/unread-count')
