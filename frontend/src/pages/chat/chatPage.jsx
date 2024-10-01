import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './contacts-container/ContactsContainer';
import EmptyChatContainer from './empty-chat-container/EmptyChatContainer';
import ChatContainer from './chat-container/chatContainer';

const ChatPage = () => {

  const { userInfo } = useSelector(store => store.auth)
  const { selectedChatType } = useSelector(store => store.chat)
  const naviagte = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.info("Please setup your profile to continue.")
      naviagte("/profile");
    }
  }, [userInfo, naviagte])
  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactsContainer />
      {
        selectedChatType === undefined ? <EmptyChatContainer /> : <ChatContainer />
      }
    </div>
  )
}

export default ChatPage