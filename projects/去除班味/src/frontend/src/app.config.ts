export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/detect/index',
    'pages/detect/confirm',
    'pages/detect/analyzing',
    'pages/report/index',
    'pages/plan/index',
    'pages/circle/index',
    'pages/share/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '去除班味',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#FF6B6B',
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
        pagePath: 'pages/circle/index',
        text: '圈子',
        iconPath: 'assets/icons/tab-circle.png',
        selectedIconPath: 'assets/icons/tab-circle-active.png'
      }
    ]
  }
})
