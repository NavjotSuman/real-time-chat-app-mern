import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { addMessage } from "@/store/chatSlice";


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
            socket.current = io("http://localhost:4000", {
                // socket.current =  io(String(import.meta.env.SERVER_ORIGI), {
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
                    console.log("Msssage Recieve : ", message)
                    dispatch(addMessage(message))
                }
            };

            socket.current.on("recieveMessage", handleRecieveMessage);

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

