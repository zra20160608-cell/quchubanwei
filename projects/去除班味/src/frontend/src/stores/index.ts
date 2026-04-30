import { atom } from 'recoil'

// 用户信息
export const userState = atom({
  key: 'userState',
  default: null as any
})

// 当前检测任务
export const detectTaskState = atom({
  key: 'detectTaskState',
  default: {
    status: 'idle', // idle/image_selected/uploading/analyzing/completed
    imageUrl: '',
    taskId: '',
    progress: 0,
    report: null as any
  }
})

// 当前方案
export const currentPlanState = atom({
  key: 'currentPlanState',
  default: null as any
})

// 圈子信息流
export const feedState = atom({
  key: 'feedState',
  default: {
    list: [],
    page: 1,
    hasMore: true,
    loading: false
  } as any
})

// 全局UI状态
export const uiState = atom({
  key: 'uiState',
  default: {
    loading: false,
    toast: null as any,
    theme: 'light'
  }
})
