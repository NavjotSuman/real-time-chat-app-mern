import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ChatPage = () => {
  
  const { userInfo } = useSelector(store => store.auth)
  const naviagte = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.info("Please setup your profile to continue.")
      naviagte("/profile");
    }
  }, [userInfo, naviagte])
  return (
    <div>ChatPage</div>
  )
}

export default ChatPage