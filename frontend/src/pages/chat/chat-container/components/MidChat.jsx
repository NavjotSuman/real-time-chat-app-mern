import {
  setFileDownloadProgress,
  setIsDownloading,
  setSelectedChatMessages,
} from "@/store/chatSlice";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { getColor } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MidChat = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, selectedChatMessages,channels } =
    useSelector((store) => store.chat);
  const { userInfo } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  // console.log("Selected Chat Message : ", selectedChatMessages);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.post(
          "/api/messages/get-message",
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (res.data.messages) {
          dispatch(setSelectedChatMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getChannelMessages = async () => {
      try {
        const res = await axios.get(
          `/api/channel/get-channel-messages/${selectedChatData._id}`,
          { withCredentials: true }
        );
        // console.log("GET CHANNEL MESSAGES FOR : ", res.data)
        if (res.data.messages) {
          dispatch(setSelectedChatMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    }


    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessages()
      }
    }
  }, [selectedChatData, selectedChatType, dispatch, selectedChatMessages, channels]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic)$/i;
    return imageRegex.test(filePath);
  };
  const checkIfVideo = (filePath) => {
    const imageRegex = /\.(mp4|mov|avi|mkv|webm)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessages = () => {
    let lastDate = null;
    // console.log("selectedChatMessages : ", selectedChatMessages)
    // console.log("selectedChatData : ", selectedChatData)
    return selectedChatMessages && selectedChatMessages?.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      // console.log("MessageData : ",messageDate)
      const showDate = messageDate !== lastDate;

      if (showDate) {
        lastDate = messageDate; // Update lastDate for the next message
      }

      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const downloadFile = async (fileUrl) => {
    // alert("downloading...")
    dispatch(setIsDownloading(true));
    dispatch(setFileDownloadProgress(0));
    // console.log("FILE URL : ", fileUrl);
    try {
      const res = await axios.get(fileUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          dispatch(setFileDownloadProgress(percentCompleted));
        },
      });
      const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
      // console.log("res at download File : ", urlBlob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", fileUrl.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      dispatch(setIsDownloading(false));
      dispatch(setFileDownloadProgress(0));
    } catch (error) {
      dispatch(setIsDownloading(false));
      dispatch(setFileDownloadProgress(0));
      // console.error(error);
      console.log(error);
    }
  };

  const renderDMMessages = (message) => {
    // console.log("renderDMMessages : ", message)
    return (
      <div
        className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"
          }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33] text-white/80 border-[#fff]/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {/* video ui is pending now */}
        {message.messageType === "file" && (
          <div
            className={`${message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33] text-white/80 border-[#fff]/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img src={message.fileUrl} height={300} width={300} alt="" />
              </div>
            ) : checkIfVideo(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowVideo(true);
                  setVideoUrl(message.fileUrl);
                }}
              >
                <video src={message.fileUrl} ></video>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>
                  {message.fileName ||
                    "..." +
                    message.fileUrl
                      .split("/")
                      .pop()
                      .slice(message.fileUrl.split("/").pop().length - 17)}
                </span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    // console.log("renderChannelMessages message : ", message);
    // console.log(
    //   "renderChannelMessages conditions : ",
    //   message.sender._id,
    //   userInfo
    // );

    return message?.sender?._id && (
      <div
        className={`mt-5 ${message.sender._id !== userInfo._id ? "text-left" : "text-right"
          }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${message.sender._id === userInfo._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33] text-white/80 border-[#fff]/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-4`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${message.sender._id === userInfo._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33] text-white/80 border-[#fff]/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img src={message.fileUrl} height={300} width={300} alt="" />
              </div>
            ) : checkIfVideo(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowVideo(true);
                  setVideoUrl(message.fileUrl);
                }}
              >
                <video src={message.fileUrl} muted></video>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>
                  {message.fileName ||
                    "..." +
                    message.fileUrl
                      .split("/")
                      .pop()
                      .slice(message.fileUrl.split("/").pop().length - 17)}
                </span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowDown />
                </span>
              </div>
            )}
          </div>
        )}
        {message.sender._id !== userInfo._id ? (
          <div className="flex justify-start items-center gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={message.sender.image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-sm text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-sm text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={imageUrl}
              className="h-[80vh] w-full bg-cover"
              alt=""
              srcset=""
            />
          </div>
          <div className="flex gap-5 top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdArrowDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
      {showVideo && (
        // <div>
          <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
            <div>
              <video
                src={videoUrl}
                className="h-[85vh] w-full bg-cover"
                controls
                autoPlay
              />
              {/* <video src={videoUrl}></video> */}
            </div>
            <div className=" flex gap-5 mt-4">
              <button
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(videoUrl)}
              >
                <IoMdArrowDown />
              </button>
              <button
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => {
                  setShowVideo(false);
                  setVideoUrl(null);
                }}
              >
                <IoCloseSharp />
              </button>
            </div>
          </div>
        // </div>
      )}
    </div>
  );
};

export default MidChat;
