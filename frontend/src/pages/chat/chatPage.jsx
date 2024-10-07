import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './contacts-container/ContactsContainer';
import EmptyChatContainer from './empty-chat-container/EmptyChatContainer';
import ChatContainer from './chat-container/chatContainer';
// import { setIsDownloading, setIsUploading } from '@/store/chatSlice';

const ChatPage = () => {

  const { userInfo } = useSelector(store => store.auth)
  const { selectedChatType, isUploading, isDownloading, fileUploadProgress, fileDownloadProgress } = useSelector(store => store.chat)
  // console.log("Is Uploading : ", isUploading)
  // console.log("Is Downloading : ", isDownloading)
  const naviagte = useNavigate();
  // const dis = useDispatch()
  // dis(setIsUploading(false))
  // dis(setIsDownloading(false))
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.info("Please setup your profile to continue.")
      naviagte("/profile");
    }
  }, [userInfo, naviagte])
  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      {
        isUploading && <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Uploading File</h5>
          {fileUploadProgress}%
        </div>
      }
      {
        isDownloading && <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      }
      <ContactsContainer />
      {
        selectedChatType === undefined ? <EmptyChatContainer /> : <ChatContainer />
      }
    </div>
  )
}

export default ChatPage