import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { measureMemory } from "vm";
import { sendEmail } from "../services/email.service.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import otpmodel from "../models/otp.model.js"; 
import otpModel from "../models/otp.model.js";


//Register function
export async function registerUser(req, res){
  try{

    const {username, email, password} = req.body;

    if(!username || !email || !password){
      return res.status(401).json({
        messaeg:"All fields are required",
      })
    }

    //Now we will check if a user already exists with those credentials

    const userAlreadyExists = await userModel.findOne({
      $or:[
        {username},
        {email}
      ]
    })

    if(userAlreadyExists){
      return res.status(409).json({
        message:"User already Exists"
      })
    }

    // Now we have made sure that the user is new 
    // Now we will hash their password, this tiem we will use crypto we can also use bcrypt
    
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    
    //No we will create the user
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword
    })


    const otp = generateOtp();
    const html = getOtpHtml(otp);

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await otpModel.create({
      email,
      user: user._id,
      otpHash
    });

    // email--> [to , subject, text, html]
    await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html)
    
    
    
    // We have made to tokens one is the acces token and the other is the refresh token---> Access token is short lived(max 15 min) and we will store it in the memory and the other being the refresh token which is long lived and we will store it in the cookies

    //How these two function is that to maximze security; the server first issue an access token and a refreh token to the user the access token expires after a small duration and now whatevver the function the user assigns to the server it is verified by the refresh token which can be used by the server to obtain the acces token and complete the assigned task
    
    return res.status(201).json({
      message:"User registered Succesfully",
      user:{
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    })

  }
  catch(error){
    return res.status(401).json({
      message: "Unexpected Error",
      error: error.message
    })
  }

}


export async function login(req, res){

  const {email, password} = req.body;

  const user = await userModel.findOne({email});


  if(!user){
    return res.status(401).json({
      message:"Invalid credentials"
    })
  }

  if(!user.verified){
    return res.status(401).json({
      message:"Unauthorized, user not verified",
    })
  }

  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

  const isPasswordValid = hashedPassword === user.password;

  if(!isPasswordValid){
    return res.status(401).json({
      messaeg:"Invalid credentials"
    })
  }

  const refreshToken = jwt.sign({
    id: user._id
  }, config.JWT_SECRET, { expiresIn:"7d" });

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const session = await sessionModel.create({
    user: user.id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  })

  const accessToken = jwt.sign({
    id: user._id,
    sessionId: session._id
  }, config.JWT_SECRET, { expiresIn:"15m" })

  res.cookie("refreshToken", refreshToken, {
    httplOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  return res.status(200).json({
    message:"Logged In Successfully",
    user:{
      username: user.username,
      email: user.email
    },
    accessToken,
  })

}


export async function getMe(req, res){

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  
  
  if(!token){
    return res.status(401).json({
      messaeg:"Unauthorized, token not found",
    })
  }

  // Now that we have a token we will read that token
  const decoded = jwt.verify(token, config.JWT_SECRET);

  const user = await userModel.findById(decoded.id);

  return res.status(200).json({
    messaeg:"User details fetched Succesfully",
    user:{
      username: user.username,
      email: user.email,
    }
  })


}


export async function refreshToken(req, res){

  const refreshToken = req.cookies.token;

  if(!refreshToken){
    return res.status(401).json({
      message:"Unauthorized, refresh token not found"
    })
  }

  //Now that we have the refresh token we will try and get the acces token

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  const accessToken = jwt.sign({
    id: decoded.id
  }, config.JWT_SECRET, {expiresIn:"15m"})

  // For additional security we will create a new refresh token as well

  const newRefreshToken = jwt.sign({
    id:decoded.id,
  }, config.JWT_SECRET, {expiresIn:"7d"});

  const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  return res.status(200).json({
    message:"Access token refreshed Succesfully",
    accessToken
  })

}



export async function logout(req, res){

  const refreshToken = req.cookes.refreshToken;

  if(!refreshToken){
    return res.status(401).json({
      message:"Unauthorized"
    })
  }

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false
  })

  if(!session){
    return res.status(401).json({
      message:"Invalid refresh token",
    })
  }

  session.revoked = true;
  await session.save();

  res.clearCookie("refreshToken");

  return res.status(200).json({
    message:"Logged out succesfully"
  })

}


export async function logoutAll(req, res){

  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(401).json({
      messaeg:"Refresh Token not found",
    })
  }

  const decoded = jwt.verify(refreshToken, JWT_SECRET);


await sessionModel.updateMany({
  user: decoded.id,
  revoked: false
}, { revoked: true})

res.clearCookie("refreshToken");

return res.status(200).json({
  message:"Logged out from all devices Succesfully"
})

}


export async function verifyEmail(req, res){

  const {otp, email} = req.body;

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const otpDoc = await otpModel.findOne({
    email, 
    otpHash
  })

  if(!otpDoc){
    return res.status(400).json({
      message:"Invalid OTP"
    })
  }


  const user = await userModel.findByIdAndUpdate(
    otpDoc.user,
    {
        $set: {
            verified: true,
        },
    },
    {
        new: true,
        runValidators: true,
    }
);


  await otpModel.deleteMany({
    user: otpDoc.user
  })

  return res.status(200).json({
    message:"Email verified Succesfully",
    user:{
      username: user.username,
      email: user.email,
      verified: user.verified
    }
  })

}