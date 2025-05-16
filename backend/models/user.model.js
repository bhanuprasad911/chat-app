import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      // minlength:6
    },
    profilePic: {
      type: String,
      // required:true,
      default: "",
    },
    bio: {
      type: String,
      // required:true,
      default: "",
    },
    nativeLang: {
      type: String,
      // required:true,
      default: "",
    },
    learningLang: {
      type: String,
      // required:true,
      default: "",
    },
    location: {
      type: String,
      // required:true,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isCorrectPassword = await bcrypt.compare(
    candidatePassword,
    this.password
  );
  return isCorrectPassword;
};

const User = mongoose.model("User", userSchema);
export default User;
