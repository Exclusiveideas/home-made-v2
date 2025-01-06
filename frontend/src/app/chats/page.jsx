"use client";

import "./chatsPage.css";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import SendIcon from "@mui/icons-material/Send";
import useAuthStore from "@/store/authStore";
import useChatStore from "@/store/userChatStore";
import { useEffect, useRef, useState } from "react";
import SnackbarComponent from "@/app/components/snackbarComponent";
import { createMessage, fetchChatRoomDetails, fetchUserChatRooms } from "@/api";
import { Skeleton } from "@mui/material";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import MenuNav from "../components/menuNav";
import { getCurrentTime } from "@/utils/functions";

const ChatsPage = () => {
  const userInfo = useAuthStore((state) => state.user);
  const activeChatRoomID = useChatStore((state) => state.activeChatRoomID);
  const setActiveChatRoomID = useChatStore(
    (state) => state.setActiveChatRoomID
  );

  const [inputMessage, setInputMessage] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [activeRoomMessages, setActiveRoomMessages] = useState(null);
  const [allChatRooms, setAllChatRooms] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [openAllChats, setOpenAllChats] = useState(false);

  const chatMessagesWrapperRef = useRef(null);

  const enqueueFuncRef = useRef();

  const callEnqueueSnackbar = (message, variant) => {
    if (enqueueFuncRef.current) {
      enqueueFuncRef.current.enqueueSnack(message, variant);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage) return;

    const sendMssgResponse = await createMessage({
      message: inputMessage,
      senderID: userInfo?._id,
      chatRoomID: activeChatRoomID,
    });

    if (sendMssgResponse?.status == 500) {
      callEnqueueSnackbar(sendMssgResponse?.errorMessage, "error");
    } else {
      setActiveRoomMessages(prev => ([...prev, {
        message: inputMessage,
        senderID: userInfo?._id,
        chatRoomID: activeChatRoomID,
        time: getCurrentTime()
      }]))
      setInputMessage("");
    }
  };

  useEffect(() => {
    if(!userInfo?._id) return
    fetchChatRooms();
  }, [userInfo]);

  const fetchChatRooms = async () => {
    const fetchRoomsResponse = await fetchUserChatRooms(userInfo?._id);

    if (fetchRoomsResponse?.status == 200) {
      setShowSkeleton(false);
      setAllChatRooms(fetchRoomsResponse?.allChatRooms);
    } else {
      callEnqueueSnackbar(fetchRoomsResponse?.errorMessage, "error");
      setShowSkeleton(true)
    }
  };

  useEffect(() => {
    if (!activeChatRoomID) return;

    // function to fetch Room chats
    fetchActiveRoomMessages()
  }, [activeChatRoomID]);

  useEffect(() => {
    if (!activeRoomMessages || !chatMessagesWrapperRef.current) return;

    chatMessagesWrapperRef.current.scrollTo({
      top: chatMessagesWrapperRef.current.scrollHeight,
    });
  }, [activeRoomMessages]);

  const fetchActiveRoomMessages = async() => {
    const fetchResponse = await fetchChatRoomDetails(activeChatRoomID);

    if (fetchResponse?.status == 200) {
      setShowSkeleton(false);

      setActiveRoomMessages(fetchResponse?.chatRoomDetails);
    } else {
      callEnqueueSnackbar(fetchResponse?.errorMessage, "error");
      setShowSkeleton(true)
    }
  }

  const toggleOpenAllChats = () => {
    setOpenAllChats((prev) => !prev);
  };

  useEffect(() => {
    // the messages every minutes
    // will implement real-time messaging in a later version
    if(!activeChatRoomID) return

    const intervalId = setInterval(() => {
      fetchActiveRoomMessages();
    }, 60000); // 

    // Cleanup
    return () => clearInterval(intervalId);
  }, [activeChatRoomID, fetchActiveRoomMessages]);

  return (
    <div className="chatsPage">
      <Navbar />
      <div className="chatPage_container">
        <div
          className={`allChats_container ${openAllChats && "open"}`}
          onClick={toggleOpenAllChats}
        >
          <div className="allChatsText_container">
            <h3 className="allChats">All Chats</h3>
            <TouchAppIcon className="touchIcon" />
          </div>
          <div className="allChats_innerWrapper">
            {allChatRooms?.map((chat, i) => (
              <div
                key={i}
                className={`singleChat_container ${
                  activeChatRoomID == chat?._id && "activeRoom"
                }`}
                onClick={() => setActiveChatRoomID(chat?._id)}
              >
                <div className="chat_page_chefImg_container">
                  <Image
                    src={
                      chat?.secondMember?.image
                        ? chat?.secondMember?.image
                        : `/images/chef_drawing_one.png`
                    }
                    width={150}
                    height={150}
                    alt="chef image"
                    className={`singleChat_pic`}
                  />
                </div>
                <div className="chatDetails_container">
                  <p className="chat_chefName">{chat?.secondMember?.name}</p>
                  <p className="chat_lastMessage">
                    {chat?.lastMessage?.message?.length > 20
                      ? chat?.lastMessage?.message?.slice(0, 20) + "..."
                      : chat?.lastMessage?.message}
                  </p>
                </div>
                <div className="chatdate_container">
                  <p className="lastMessage_date">
                    {chat?.lastMessage?.timeStamp}
                  </p>
                </div>
              </div>
            ))}
            {showSkeleton &&
              Array(10)
                .fill(null)
                .map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    animation="wave"
                    style={{ width: "100%", height: "90px" }}
                  />
                ))}
          </div>
        </div>
        <div className="activeChat_container" onMouseEnter={() => setInputFocus(true)} onMouseLeave={() => setInputFocus(false)}>
          {!showSkeleton ? (
            <div
              className={`tapToMesgContainer ${activeRoomMessages && "hide"}`}
            >
              <Image
                src={`/images/bubble-chat.png`}
                width={200}
                height={200}
                alt="chef drawing"
                className={`selectMessage_Icon ${activeRoomMessages && "hide"}`}
              />
            </div>
          ) : (
            <div
              className={`tapToMesgContainer ${activeRoomMessages && "hide"}`}
            >
              <Skeleton
                variant="rounded"
                animation="wave"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
          <div className="chatPage_bg_wrapper">
            <Image
              src={`/images/chatPage_bg.png`}
              width={1000}
              height={1000}
              alt="chef drawing"
              className={`chatPage_bg`}
            />
          </div>
          <div ref={chatMessagesWrapperRef} className="chatMessages_container">
            {activeRoomMessages?.map((message, i) => (
              <div
                key={i}
                className={`messageContainer ${
                  message?.senderID == userInfo?._id && "selfSent"
                }`}
              >
                <p className="messageText">{message?.message}</p>
                <p className="time">{message?.time}</p>
              </div>
            ))}
          </div>
          <div className="sendChat_container">
            <div className="chat_innerWrapper">
              <div className="chat_inputBox">
                <textarea
                  id="description-overview"
                  name="descriptionOverview"
                  placeholder="Message"
                  rows={inputFocus ? "8" : "1"}
                  className="inputEl chatMessage"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="sendBtn" onClick={sendMessage}>
              <SendIcon sx={{ fontSize: 18 }} className="sendMessageIcon" />
            </div>
          </div>
        </div>
      </div>
      <MenuNav />
      <SnackbarComponent ref={enqueueFuncRef} />
    </div>
  );
};

export default ChatsPage;
