import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); 
const url = process.env.MONGO_URI

const dbConnection = async()=>{
   console.log(url)
    // console.log(url)
   try{
await mongoose.connect(url);
console.log('Connection successfull')
   }catch(err){
    console.log(`Failed to connect to db ${err}`)

   }
}
export default dbConnection

