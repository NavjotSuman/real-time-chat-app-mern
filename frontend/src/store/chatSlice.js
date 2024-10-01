import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedChatType: undefined,  // chat type for -- contact / 
    selectedChatData: undefined,  // information of the selected user for chat 
    selectedChatMessages: [],     // all the messages with the selectedChatData._id
    directMessagesContacts: []
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
        closeChat: (state) => {
            state.selectedChatType = undefined;
            state.selectedChatData = undefined;
            state.selectedChatMessages = [];
        }
    },
});


export const { setSelectedChatType, setSelectedChatData, setSelectedChatMessages, addMessage, setDirectMessagesContacts, closeChat } = chatSlice.actions
export default chatSlice.reducer;