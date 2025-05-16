import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const jwtSecret = process.env.JWT_SECRET;

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "No token provided" });
  const decoded = jwt.verify(token, jwtSecret);
  if (!decoded) return res.status(401).json({ message: "Invalid token" });
  const user = await User.findById(decoded.id).select("-password");
  if (!user)
    return res.status(401).json({ message: "Unauthorised - User not found" });

  req.user = user;
  next();
  } catch (error) {
    console.error('error in middleware',error);
    res.status(500).json({ message: "Server Error" });
    
  }
};

export default protectRoute;
