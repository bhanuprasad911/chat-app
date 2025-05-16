import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getStreamToken } from "../libs/services";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  Channel,
  Message,
  MessageList,
  MessageInput,
  ChannelHeader,
  Chat,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

function Chatpage() {
  const { id } = useParams();
  const StreamApiKey = import.meta.env.VITE_STREAM_API_KEY;
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const { authUser } = useAuthUser();

  const { data: streamToken } = useQuery({
    queryKey: ["streamtoken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });



  useEffect(() => {
    const initChat = async () => {
      if (!streamToken) return;
      try {
        console.log("Initializing stream chat client");
        const chatClient = StreamChat.getInstance(StreamApiKey);
        await chatClient.connectUser(
          {
            id: authUser._id,
            name: authUser.fullname,
            image: authUser.profilePic,
          },
          streamToken
        );

        const channelId = [authUser._id, id].sort().join("-");
        const currentChannel = chatClient.channel("messaging", channelId, {
          members: [authUser._id, id],
        });
        await currentChannel.watch();
        setChatClient(chatClient);
        setChannel(currentChannel);
      } catch (error) {
        console.log("Error initialising chat client", error);
        toast.error("Cannot connect to chat, please try again later");
      } finally {
        setIsloading(false);
      }
    };
    initChat();
  }, [authUser, streamToken, id]);
  console.log(streamToken);
  console.log(id, StreamApiKey);
  const handleVideoCall=()=>{
    if (channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`
      channel.sendMessage({
        text:`I've started a video call. Join me here: ${callUrl}  `
      })
      toast.success("Video call started successfully!");
    }
  }

  console.log(isLoading, chatClient, channel);
  if (isLoading || !chatClient || !channel) {
    console.log(isLoading, chatClient, channel);

    return <ChatLoader />;
  }
  return (
    <div className="h-[92vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  );
}

export default Chatpage;
