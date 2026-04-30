export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/detect/index',
    'pages/detect/confirm',
    'pages/detect/analyzing',
    'pages/detect/report',
    'pages/detect/history',
    'pages/plans/index',
    'pages/plans/detail',
    'pages/social/index',
    'pages/social/publish',
    'pages/social/detail',
    'pages/profile/index',
    'pages/profile/settings',
    'pages/profile/my-plans',
    'pages/profile/my-posts',
    'pages/share/poster',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '去除班味',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#E67E22',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '检测',
        iconPath: 'assets/icons/tab-detect.png',
        selectedIconPath: 'assets/icons/tab-detect-active.png'
      },
      {
        pagePath: 'pages/plans/index',
        text: '方案',
        iconPath: 'assets/icons/tab-plan.png',
        selectedIconPath: 'assets/icons/tab-plan-active.png'
      },
      {
        pagePath: 'pages/social/index',
        text: '圈子',
        iconPath: 'assets/icons/tab-circle.png',
        selectedIconPath: 'assets/icons/tab-circle-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/icons/tab-me.png',
        selectedIconPath: 'assets/icons/tab-me-active.png'
      }
    ]
  }
})
