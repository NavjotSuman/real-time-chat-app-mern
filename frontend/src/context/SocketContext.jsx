import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { addMessage, arrangeChannelsinChannelList, arrangeContactsinContactList } from "@/store/chatSlice";


const SocketContext = createContext(null);


export const useSocket = () => {
    return useContext(SocketContext)
}

const SocketProvider = ({ children }) => {
    const [socketInstance, setSocketInstance] = useState(null);
    const socket = useRef();
    const dispatch = useDispatch()
    const { userInfo } = useSelector((store) => store.auth);
    const { selectedChatData, selectedChatType } = useSelector((store) => store.chat);


    useEffect(() => {
        if (userInfo) {
            socket.current = io("https://real-time-chat-app-mern-mjjd.onrender.com", {
                withCredentials: true,
                query: { userId: userInfo._id },
            });

            socket.current.on("connect", () => {
                console.log("Connected to server");
            });


            const handleRecieveMessage = (message) => {
                // console.log("handleReciveMessage : ",message)
                if (
                    selectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id ||
                        selectedChatData._id === message.recipient._id)
                ) {
                    // console.log("Msssage Recieve : ", message)
                    dispatch(addMessage(message))
                }
                dispatch(arrangeContactsinContactList({message, userId: userInfo._id}))
            };

            const handleRecieveChannelMessage = async (message) => {
                if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    // console.log("handleRecieveChannelMessage : seting message of channel to Reducer.")
                    dispatch(addMessage(message))
                }
                dispatch(arrangeChannelsinChannelList(message))
            }

            socket.current.on("recieveMessage", handleRecieveMessage);
            socket.current.on("recieveChannelMessage",handleRecieveChannelMessage)

            // Store the initialized socket in the state so it can be passed via context
            setSocketInstance(socket.current);
            return () => {
                socket.current.disconnect();
            };
        }
        // console.log("Socket.current : ", socket.current)
    }, [userInfo, dispatch]);
    return (
        <SocketContext.Provider value={socketInstance}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;

