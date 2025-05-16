import User from "../models/user.model.js";
import FriendRequest from "../models/friendrequest.model.js";

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullname nativeLang learningLang location profilePic"
      );
    // console.log(user);
    res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.log("error in getting friends list", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getRecommendations = async (req, res) => {
  try {
    const currentUser = req.user;
    const recommendations = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    res.status(200).json({ recommendations });
  } catch (error) {
    console.log("error in getRecommendations", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const addFriendRequest = async (req, res) => {
  console.log(req.params)
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    if (senderId === receiverId)
      return res
        .status(400)
        .json({ message: "Cannot send friend request to yourself" });
    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: "User not found" });
    if (receiver.friends.includes(senderId))
      return res.status(400).json({ message: "User is already your friend" });

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });
    if (existingRequest)
      return res.status(400).json({ message: "Friend request already sent" });
    const newrequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });
    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("error in addFriendRequest", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  console.log(req.params)
  try {
    const friendRequestId = req.params.id;
    const friendRequest = await FriendRequest.findById(friendRequestId);
    console.log(friendRequest);
    console.log(friendRequest.receiver.toString());
    console.log(req.user._id.toString())
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (friendRequest.receiver.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to accept this request" });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.receiver },
    });
    await User.findByIdAndUpdate(friendRequest.receiver, {
      $addToSet: { friends: friendRequest.sender },
    });
    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.log("error in acceptFriendRequest", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const pendingRequests = await FriendRequest.find({
      receiver: req.user._id,
      status: "pending",
    }).populate("sender", "fullname nativeLang learningLang profilePic");
    const acceptedRequests = await FriendRequest.find({
      receiver: req.user._id,
      status: "accepted",
    }).populate("sender", "fullname profilePic");
    res.status(200).json({ pendingRequests, acceptedRequests });
  } catch (error) {
    console.log("error in getFriendRequests", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getOutgoingFriendRequests = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("receiver", "fullname nativeLang learningLang profilePic");
    res.status(200).json({ outgoingRequests });
  } catch (error) {
    console.log("error in getOutgoingFriendRequests", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


