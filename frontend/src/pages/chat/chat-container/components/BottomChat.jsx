import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from "react-icons/ri"
import EmojiPicker from 'emoji-picker-react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '@/context/SocketContext'
import axios from 'axios'
import { addMessage, setFileUploadProgress, setIsUploading } from '@/store/chatSlice'

const BottomChat = () => {
    // setIsUploading
    // setFileUploadProgress
    const emojiRef = useRef()
    const fileInputRef = useRef()
    const { selectedChatType, selectedChatData } = useSelector(store => store.chat)
    const { userInfo } = useSelector(store => store.auth)
    const socket = useSocket()
    const [message, setMessage] = useState("")
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
    const dispatch = useDispatch()
    // const socket = useContext(SocketContext)

    useEffect(() => {
        function handleClickOutside(e) {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setEmojiPickerOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        dispatch(setIsUploading(false))
        dispatch(setFileUploadProgress(0))
        return () => { document.removeEventListener('mousedown', handleClickOutside) }
    }, [emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage(msg => msg + emoji.emoji)
    }

    const handleSendMessage = async () => {
        if (selectedChatType === "contact") {
            // console.log(socket.emit)
            socket.emit("sendMessage", {
                sender: userInfo._id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined
            })
        } else if (selectedChatType === "channel") {
            // console.log("handleSendMessage at BottomChat : message is being send... to server")
            socket.emit("sendChannelMessage", {
                sender: userInfo._id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id
            })
        }
        setMessage("")
        setEmojiPickerOpen(false)
    }

    const handeAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handeAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0]
            if (file) {
                const formData = new FormData()
                formData.append("file", file)
                dispatch(setIsUploading(true))
                const res = await axios.post("/api/messages/upload-file", formData, {
                    withCredentials: true,
                    onUploadProgress: (data) => {
                        const progress = Math.round(100 * (data.loaded / data.total));
                        dispatch(setFileUploadProgress(progress));
                        // dispatch(setFileUploadProgress(Math.round(100 * data.loaded) / data.total))
                    }
                })
                // console.log("File Uploaded Res : ", res)

                if (res.status === 200 && res.data.success) {
                    dispatch(setIsUploading(false))
                    dispatch(setFileUploadProgress(0))
                    if (selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo._id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileName: res.data.fileName,
                            fileUrl: res.data.filePath
                        })
                    } else if (selectedChatType === "channel") {
                        // console.log("handeAttachmentChange at BottomChat : file is being send... to server")
                        socket.emit("sendChannelMessage", {
                            sender: userInfo._id,
                            content: undefined,
                            messageType: "file",
                            fileName: res.data.fileName,
                            fileUrl: res.data.filePath,
                            channelId: selectedChatData._id
                        })
                    }
                    setMessage("")
                    setEmojiPickerOpen(false)
                }
            }
        } catch (error) {
            dispatch(setIsUploading(false))
            dispatch(setFileUploadProgress(0))
            console.log(error)
        }
    }

    return (
        <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6'>
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input type="text" className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none' placeholder='Enter Message' value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:to-white duration-300 transition-all' onClick={handeAttachmentClick} >
                    <GrAttachment className="text-2xl" />
                </button>
                <input type="file" className='hidden' ref={fileInputRef} onChange={handeAttachmentChange} />
                <div className="relative">
                    <button className='text-neutral-500 focus:border-none focus:outline-none focus:to-white duration-300 transition-all' onClick={() => setEmojiPickerOpen(prev => !prev)} >
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker theme='dark' open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
                    </div>
                </div>
            </div>
            <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none focus:outline-none hover:bg-[#741bda] focus:bg-[#741bda] focus:text-white duration-300 transition-all' onClick={handleSendMessage}>
                <IoSend className='text-2xl' />
            </button>
        </div>
    )
}

export default BottomChat