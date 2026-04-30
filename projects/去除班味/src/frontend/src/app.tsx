import Taro, { useLaunch } from '@tarojs/taro'
import { useState } from 'react'
import './styles/global.scss'

function App({ children }) {
  useLaunch(() => {
    console.log('App launched.')
  })

  return children
}

export default App