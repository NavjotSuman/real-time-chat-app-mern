import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    selectedChatType: undefined,  // chat type for -- contact / 
    selectedChatData: undefined,  // information of the selected user for chat 
    selectedChatMessages: [],     // all the messages with the selectedChatData._id
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: []
};

const chatSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSelectedChatType: (state, action) => {
            state.selectedChatType = action.payload
        },
        setSelectedChatData: (state, action) => {
            state.selectedChatData = action.payload
        },
        setSelectedChatMessages: (state, action) => {
            state.selectedChatMessages = action.payload
        },
        addMessage: (state, action) => {
            const message = action.payload
            state.selectedChatMessages = [
                ...state.selectedChatMessages, {
                    ...message,
                    recipient:
                        state.selectedChatType === "channel" ? message.recipient : message.recipient._id,
                    sender:
                        state.selectedChatType === "channel" ? message.sender : message.sender._id,
                }
            ]
        },
        setDirectMessagesContacts: (state, action) => {
            state.directMessagesContacts = action.payload
        },
        setIsUploading: (state, action) => {
            state.isUploading = action.payload
        },
        setIsDownloading: (state, action) => {
            state.isDownloading = action.payload
        },
        setFileUploadProgress: (state, action) => {
            state.fileUploadProgress = action.payload
        },
        setFileDownloadProgress: (state, action) => {
            state.fileDownloadProgress = action.payload
        },
        setChannels: (state, action) => {
            state.channels = action.payload
        },
        addChannel: (state, action) => {
            const channels = state.channels
            state.channels = [action.payload, ...channels]
        },
        arrangeChannelsinChannelList: (state, action) => {
            const message = action.payload;
            const data = state.channels.find((channel) => channel._id === message.channelId);
            const index = state.channels.findIndex((channel) => channel._id === message.channelId);

            if (index !== -1 && data) {
                state.channels.splice(index, 1); // Remove the existing channel
                state.channels.unshift(data);   // Add the channel at the start
            }

        },
        arrangeContactsinContactList: (state, action) => {
            const { message } = action.payload
            const { userId } = action.payload
            const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;
            const fromData = message.sender._id === userId ? message.recipient : message.sender;
            const dmContacts = state.directMessagesContacts;
            const data = dmContacts.find((contact) => contact._id === fromId);
            const index = dmContacts.findIndex((contact) => contact._id === fromId);

            if (index !== -1 && index !== undefined) {
                console.log("in if condition", data, index, dmContacts, userId, message, fromData);
                dmContacts.splice(index, 1); // Remove contact if it already exists
                dmContacts.unshift(data); // Add the contact to the top of the list
            } else {
                console.log("in else condition", fromData);
                dmContacts.unshift(fromData); // Add new contact if not found
            }
        },
        closeChat: (state) => {
            state.selectedChatType = undefined;
            state.selectedChatData = undefined;
            state.selectedChatMessages = [];
        }
    },
});


export const { setSelectedChatType, setSelectedChatData, setSelectedChatMessages, addMessage, setDirectMessagesContacts, setIsUploading, setIsDownloading, setFileDownloadProgress, setFileUploadProgress, setChannels, addChannel, arrangeChannelsinChannelList, arrangeContactsinContactList, closeChat } = chatSlice.actions
export default chatSlice.reducer;