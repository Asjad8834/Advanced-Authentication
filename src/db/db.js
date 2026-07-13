import mongoose from "mongoose";

import config from "../config/config.js"

async function connectDb(){
  try{
    await mongoose.connect(config.MONGO_URI);
    console.log("Database Connected")
  }
  catch(error){
    return res.status(400).json({
      message:"Unexpected Error",
      error: error.message
    })
  }
}

export default connectDb;