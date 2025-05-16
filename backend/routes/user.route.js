import express from "express";
import {
  getFriends,
  getRecommendations,
  addFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/friends", getFriends);

router.get("/recommendations", getRecommendations);

router.post("/addFriendRequest/:id", addFriendRequest);

router.put("/friendRequest/:id/accept", acceptFriendRequest);

router.get("/friendRequests", getFriendRequests);

router.get("/outgoingFriendRequests", getOutgoingFriendRequests);

export default router;
