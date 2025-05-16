import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { upsertStreamUsers } from "../config/stream.js";

const jwtSecret = process.env.JWT_SECRET;


export const signup = async (req, res) => {
  try {
    console.log(req.body)
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password)
      return res.status(400).json({ message: "Please fill all the fields!" });
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists!" });
    const idx = Math.floor(Math.random() * 50) + 1;
    const randAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    const newuser = new User({
      fullname,
      email,
      password,
      profilePic: randAvatar,
    });
try {
  await upsertStreamUsers({
    id:newuser._id,
    fullname: newuser.fullname,
    profilePic: newuser.profilePic || "",
  });
  console.log(`new user created in stream for the user ${newuser.fullname}`);
  
} catch (error) {
  console.error(`Failed to create user in stream for the user ${newuser.fullname}`, error);
  // throw error; // Uncomment this line to throw an error in case of stream error
  
}
    

    const token = jwt.sign({ id: newuser._id }, jwtSecret, { expiresIn: "1h" });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const user = await newuser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await User.findOne({ email });
    if (!exist) return res.status(401).json({ message: "Invalid credentials" });

    const correctPassword = await exist.comparePassword(password);
    if (!correctPassword)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: exist._id }, jwtSecret, { expiresIn: "1h" });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged in successfully", success:true, exist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully", success: true });
};



export const onboardUser = async (req, res) => {
  try {
    const id = req.user._id
    const {fullname, bio, nativeLang, learningLang,location} = req.body
    if (!fullname ||!bio ||!nativeLang ||!learningLang ||!location)
      return res.status(400).json({ message: "Please fill all the fields!", missingFields:[
    !fullname && "fullname",
    !bio && "bio" ,
    !nativeLang && "nativeLang",
    !learningLang && "learningLang",
    !location && "location"
    ].filter(Boolean) });

    const updatedUser = await User.findByIdAndUpdate(id, {...req.body, isOnboarded:true}, {new: true})
    if(!updatedUser) return res.status(404).json({ message: "User not found!" })

      try {
        await upsertStreamUsers({
          id:updatedUser._id,
          fullname:updatedUser.fullname,
          profilePic:updatedUser.profilePic || ""
        })
        console.log(`user ${updatedUser.fullname} onboarded in stream`)
        
      } catch (error) {
        console.error(`Failed to onboard user ${updatedUser.fullname} in stream`, error);
        
      }

    
    res.status(200).json({ message: "User onboarded successfully", success:true, updatedUser })


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal server error' });
    
  }
}

