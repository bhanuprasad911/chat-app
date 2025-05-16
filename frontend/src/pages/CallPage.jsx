import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../libs/services";
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function Callpage() {
  const { id } = useParams();
  const [call, setCall] = useState(null);
  const [client, setClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser, isLoading } = useAuthUser();

  const { data: streamToken } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!streamToken || !authUser || !id) return;
      try {
        console.log("initialisiing stream video client");
        const user = {
          id: authUser._id,
          name: authUser.fullname,
          avatar: authUser.profilePic,
        };
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: streamToken,
        });
        const callInstance = videoClient.call("default", id);
        await callInstance.join({ create: true });
        console.log("joined call succesfully");
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.log("error joining call", error);
        toast.error("Could not join the call. Please try again later.");
      } finally {
        setIsConnecting(false);
      }
    };
    initCall();
  }, [streamToken, authUser, id]);

  if (isLoading || isConnecting) return <PageLoader />;

  return <div className="h-screen flex flex-col items-center justify-center">
    <div className="relative">
      {client && call && (
  <StreamVideo client={client}>
    <StreamCall call={call}>
      <CallContents />
    </StreamCall>
  </StreamVideo>
)}

    </div>

  </div>;
}

const CallContents = () => {

  const {useCallCallingState} = useCallStateHooks()
  const calling = useCallCallingState()
  const navigate=useNavigate()
  if(calling === CallingState.LEFT) return navigate("/")
    return (
  <StreamTheme>
    <SpeakerLayout/>
    <CallControls/>
  </StreamTheme>)
}

export default Callpage;
