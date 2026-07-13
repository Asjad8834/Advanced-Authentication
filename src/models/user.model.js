import mongoose from "mongoose";

// Define a basic User schema (adjust fields as needed)


const userSchema = new mongoose.Schema({

  username:{
    type:String,
    required:[true, "Username is required"],
    unique: [true, "username has to be unique"]
  },

  email:{
    type: String,
    required:[true, "email is required"],
    unique: [true, "email is already under use"]
  },

  password:{
    type: String,
    required:[true, "Passowrd is required"],
  },

  verified:{
    type: Boolean,
    default: false,
  }

})

const userModel = mongoose.model("users", userSchema);

export default userModel;