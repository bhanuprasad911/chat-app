import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

const apikey = process.env.STREAM_API_KEY;
const secret = process.env.STREAM_API_SECRET;

const streamCient = StreamChat.getInstance(apikey, secret);

export const upsertStreamUsers = async (userdata) => {
  try {
    await streamCient.upsertUsers([userdata]);
    return userdata;
  } catch (error) {
    console.error("error upserting stream user", error);
  }
};

export const generateStreamToken =(userId) => {
  try {
    const userIdString = userId.toString();
    const token = streamCient.createToken(userIdString);
    return token;
  } catch (error) {
    console.error("error generating stream token", error);
  }
}

