import {
    setSelectedChatData,
    setSelectedChatMessages,
    setSelectedChatType,
} from "@/store/chatSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
    const { selectedChatType, selectedChatData } = useSelector(
        (store) => store.chat
    );
    const dispatch = useDispatch();

    const handleClick = (contact) => {
        if (isChannel) {
            dispatch(setSelectedChatType("channel"));
        } else {
            dispatch(setSelectedChatType("contact"));
        }
        dispatch(setSelectedChatData(contact));
        if (selectedChatData && selectedChatData._id !== contact._id) {
            dispatch(setSelectedChatMessages([]));
        }
    };
    console.log("Contacts : ", contacts);
    return (
        <div className="mt-5">
            {contacts && contacts.map((contact) => (
                <div
                    key={contact._id}
                    className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id
                            ? "bg-[#8417ff] hover:bg-[#8417ff]"
                            : "hover:bg-[#f1f1f111]"
                        }`}
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {!isChannel && (
                            <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                {contact.image ? (
                                    <AvatarImage
                                        src={contact.image}
                                        alt="Profile"
                                        className="object-cover h-12 w-12 rounded-full bg-black"
                                    />
                                ) : (
                                    <div
                                        className={`${selectedChatData && selectedChatData._id === contact._id
                                                ? "bg-[#ffffff22] border border-white/70"
                                                : getColor(contact.color)
                                            } uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}
                                    >
                                        {contact.firstName
                                            ? contact.firstName.split("").shift()
                                            : contact.email.split("").shift()}
                                    </div>
                                )}
                            </Avatar>
                        )}
                        {isChannel && (
                            <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                                #
                            </div>
                        )}
                        {isChannel ? (
                            <span>{contact.name}</span>
                        ) : (
                            <span>{`${contact.firstName} ${contact.lastName}`}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContactList;
