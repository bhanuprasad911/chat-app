import { axiosInstance } from "./axios";

export const signup = async (formData) => {
  const res = await axiosInstance.post("/auth/signup", formData);
  return res.data;
};

export const login = async (formData) => {
  const res = await axiosInstance.post("/auth/login", formData);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    // console.log("error in auth user request", error.message);
    return null;
  }
};

export const updateUser = async (userData) => {
  const res = await axiosInstance.post("/auth/onboard", userData);
  return res.data;
};
export const getFriends = async()=>{
  const res = await axiosInstance.get('/user/friends')
  return res.data.friends;
}

export const getRecommendations = async()=>{
  const res = await axiosInstance.get('/user/recommendations')
  return res.data.recommendations;
}

export const getOutGoingFrndReqs = async()=>{
  const res = await axiosInstance.get('/user/outgoingFriendRequests')

  return res.data.outgoingRequests
}

export const sendFrndReq = async (userId)=>{
  try {
    
    const res = await axiosInstance.post(`/user/addFriendRequest/${userId}`)
    console.log(res)
    return res.data
  } catch (error) {
    console.log(error)
    return error.message
    
  }
}
export const  getFrndReqs= async()=>{
  const res = await axiosInstance.get('/user/friendRequests')
  return res.data
}
export const acceptFrndReq = async (userid)=>{
  const res = await axiosInstance.put(`/user/friendRequest/${userid}/accept`)
  return res.data
}

export const getStreamToken = async()=>{
  const res = await axiosInstance.get('/chat/token')
  return res.data.token
}
