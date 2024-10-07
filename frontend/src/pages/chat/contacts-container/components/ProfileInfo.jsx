import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getColor } from '@/lib/utils'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { TbLogout2 } from "react-icons/tb";
import axios from 'axios'
import { setUserInfo } from '@/store/authSlice'
import { toast } from 'sonner'
import { setSelectedChatData, setSelectedChatType } from '@/store/chatSlice'

const ProfileInfo = () => {
    const { userInfo } = useSelector(store => store.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogoutClick = async () => {
        try {
            const res = await axios.post("/api/auth/logout")
            if (res.data.success && res.status === 200) {
                dispatch(setUserInfo(null))
                dispatch(setSelectedChatData(undefined))
                dispatch(setSelectedChatType(undefined))
                toast.success(res.data.message)
                navigate("/auth")
            }
        } catch (error) {
            toast.error("Somthing went wrong")
        }

    }

    return (
        <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
            <div className="flex gap-3 items-center justify-center">
                <div className='h-12 w-12 relative'>
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage
                                src={userInfo.image}
                                alt="Profile"
                                className="object-cover h-12 w-12 rounded-full bg-black"
                            />
                        ) : (
                            <div
                                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                                    userInfo.color
                                )}`}
                            >
                                {userInfo.firstName
                                    ? userInfo.firstName.split("").shift()
                                    : userInfo.email.split("").shift()}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""}
                </div>
            </div>
            <div className='flex gap-5'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><FiEdit2 onClick={() => navigate("/profile")} className='text-purple-500 hover:text-purple-700 duration-150 transition-all text-xl font-medium' /></TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
                            <p >Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><TbLogout2 onClick={handleLogoutClick} className='text-red-300 hover:text-red-500 duration-150 transition-all text-xl font-medium' /></TooltipTrigger>
                        <TooltipContent className='bg-red-600 border-none text-white'>
                            <p >Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    )
}

export default ProfileInfo