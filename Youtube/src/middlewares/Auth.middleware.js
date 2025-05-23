import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken"
import { User } from "../models/UserModels.js";




export const verifyJWt = asyncHandler(async(req ,res, next) =>{

try {
        const token =req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer","")
    
        if(!token){
          throw new ApiError(401, "Unauthorized request");
        }
        const decodedToken  = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id).select(
          "-password -refreshToken"
        );
    
        if(!user){
            throw new ApiError(401, "Invalid Access token");
        }
        req.user = user;
        next()
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid access token")
    
}
})