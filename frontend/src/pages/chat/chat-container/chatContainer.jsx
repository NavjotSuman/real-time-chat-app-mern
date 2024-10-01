import React from 'react'
import TopChat from './components/TopChat'
import MidChat from './components/MidChat'
import BottomChat from './components/BottomChat'

const ChatContainer = () => {
  return (
    <div className='fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1'>
        <TopChat />
        <MidChat />
        <BottomChat />
    </div>
  )
}

export default ChatContainer