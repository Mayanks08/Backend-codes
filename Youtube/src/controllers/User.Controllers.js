import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/UserModels.js"
import {uploadOncloudinary} from "../utils/File_uploads.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose,{isValidObjectId} from "mongoose";
import {Video } from "../models/Video.models.js"


const generateAccessTokenAndRefreshToken = async(userId)=>{
  try {
    const user = await User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ValidityBeforeSave:false})

    return{accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(500,"Something went wrong while genrateing access and refresh Token")
  }
}

const registerUser = asyncHandler( async(req, res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, password,email, username} =req.body
    console.log(email ,'email')

    if (
        [fullName, password, email, username].some((field) =>field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are Required")
    }
   const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const  coverLocalpathimage = req.files.coverimage[0]?.[Path];\
    let coverImageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
     const avatar = await uploadOncloudinary(avatarLocalPath);
     const coverImage = await uploadOncloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar file required")
    }
    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      password,
      email,
      username:username.toLowerCase(),
      
    });

     const createdUser = await User.findById(user._id).select("-password -refreshToken")

     if(!createdUser){
        throw new ApiError(500,"Something Went wrong while createing the user ")
     }
     return res.status(201).json(
        new ApiResponse(200,createdUser, "User registered")
     )
})

const logInUser = asyncHandler(async(req,res) =>{
  // req body se data lana
  // username or email base login feature
  // find user in database 
  //check for password is correct or wrong
  // if correct then return user data with token
  //access and referesh token
  // send this to secure cookie

  const {email,username,password} = req.body

  if(!username && !email){
    throw new ApiError(400,"Username or email is required ")
  }
  
  const user = await User.findOne({
    $or: [{email}, {username}],
  })

  if(!user){
    throw new ApiError(404,'User does not exists')
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
    throw new ApiError(404,'Password does not match')
  }

    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user.id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options ={
      httpOnly:true,
      secure:true,
      
    }
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken,options)
      .json(new ApiResponse(200,{
        user:loggedInUser,accessToken,refreshToken
      },"User logged in successfully"))

})


const logoutUser = asyncHandler(async(req, res) =>{
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{
        refreshToken:1
      }
    },
    {
      new:true
    },
  )
   const options ={
      httpOnly:true,
      secure:true,
      
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200,{},"User logged out successfully"))
  })

const refreshAccessToken=asyncHandler(async(req,res)=>{

   const incomingRefreshToken=req.cookies.
   refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
   throw new ApiError(401,"unauthorized request")
   }

  try {
    const decodedToken= jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  
    const user= await User.findById(decodedToken?._id)
  
    if(!user){
     throw new ApiError(401,"Invalid refresh token")
     }
  
     if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401," refresh token is expired and Used")
     }
    
     const options ={
        httpOnly:true,
        secure:true,
     }
      const {accessToken,newRefreshToken}=await generateAccessTokenAndRefreshToken(user._id)
  
      return res
      .status(200)
      .clearCookie("refreshToken",newRefreshToken,options)
      .clearCookie("accesstoken",accessToken,options)
      .json(new ApiResponse(200,{
        accessToken , refreshToken:newRefreshToken
      },"Access token refreshed successfully")
    )
  
  } catch (error) {
    throw new ApiError(401,error?.message || "invalid refresh token")
    
  }

  })


const changeCurrentPassword =asyncHandler(async(req,res) =>{
  const {oldPassword,newPassword}=req.body
  const user = await User.findById(req.user._id)
  const isPasswordCorrect =await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"old password is incorrect")
  }
  user.password =newPassword
  await user.save({
    ValidityBeforeSave:false
  })
  return res
  .status(200)
  .json(new ApiResponse(200,"password changed successfully"))
})

const getCurrentUser =asyncHandler(async(req,res) =>{
  return res
  .status(200)
  .json(new ApiResponse(200,req.user," current user details"))
})

const updateAccountDetails =asyncHandler(async(req,res) =>{
  const user = await User.findById(req.user._id)
  const {fullName,email}=req.body
  
  if(!fullName || !email){
    throw new ApiError(400,"please provide all fields")
  }
  User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullName, email } },
    { new: true}

  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user ,"Account details is updated Successfully"))
})

const upadateUserAvatar = asyncHandler(async(req,res) =>{
 
  const avatarLocalPath =  req.file?.path
   if(!avatarLocalPath){
    throw new ApiError(400,"please provide avatar")
   }
   const avatar = await uploadOncloudinary(avatarLocalPath);

   if(!avatar.url){
    throw new ApiError(400,"avatar upload failed")
   }
   
   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    { new: true}
  ).select("-password");
  return res
  .status(200)
  .json(new ApiResponse(200, user ,"Avatar is updated Successfully"))
})

const upadateUserCoverImage = asyncHandler(async (req, res) => {
  
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "please provide CoverImage");
  }
  const coverImage = await uploadOncloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, " failed to coverImageLocalPath ");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");
   return res
   .status(200)
   .json(new ApiResponse(200, user, "CoverImage is updated Successfully"))
})

const getUserChannelProfile = asyncHandler(async(req,res) =>{
   const {username} = req.params
   
   if(!username.trim()){
    throw new ApiError(400,"username is Missing")
   }
  
   const channel = await User.aggregate([
     {
       $match: { username: username?.toLowerCase() },
     },
     {
       $lookup: {
         from: "subscriptions",
         localField: "_id",
         foreignField: "channel",
         as: "subscribers",
       },
     },
     {
       $lookup: {
         from: "subscriptions",
         localField: "_id",
         foreignField: "subscriber",
         as: "subscribedTo",
       },
     },
     {
        $addFields:{
          subscribersCount:{$size:"$subscribers"},
          channelSubscribedToCount:{$size:"$subscribedTo"},
          isSubscribed:{
            $cond:{
                if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                then:true,
                else:false
            }
          }
        },
     },
     {
      $project: {
        email:1,
        fullName:1,
        username:1,
        avatar:1,
        coverImage:1,
        subscribersCount:1,
        channelSubscribedToCount:1,
        isSubscribed:1

      }
     }
   ]);
   
   if(!channel?.length){
     throw new ApiError(404, 'channel doesnot exists')
   }

   return res
   .status(200)
   .json(
     new ApiResponse(
      200,
      channel[0],
      "Channel fetched successfully",
     )
   )

})
const getWatchHistory = asyncHandler(async(req,res)=>{
  const user = await User.aggregate([
    {
      $match:{
        _id:new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                $project:{
                  fullName:1,
                  username:1,
                  avatar:1
                }
              }
            ]
            },

          },
          {
              $addFields:{
                owner:{
                  $first:"$owner",
                }
              }
          }
        ]
      }
    }
  ])
  
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      user[0].watchHistory,

    )
  )
}) 

export { 
  registerUser,
  logInUser,
  logoutUser ,
  refreshAccessToken , 
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  upadateUserAvatar,
  upadateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};