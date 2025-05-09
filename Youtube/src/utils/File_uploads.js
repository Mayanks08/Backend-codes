import { v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadOncloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath)  return null
         // uploading a file to cloudinary 
      const response =  await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
        })
        // uploading successfull
        console.log("file is uploaded")
        // return response.url()
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // here we removing the loacally or temporary files
        
    }
}


export {uploadOncloudinary}