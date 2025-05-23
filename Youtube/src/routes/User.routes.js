import { Router } from "express";
import {
  registerUser,
  logInUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  upadateUserAvatar,
  upadateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/User.Controllers.js";
import { upload } from "../middlewares/Multer.middleware.js"; 
import { verifyJWT } from "../middlewares/Auth.middleware.js";


const router = Router()
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name:"coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(logInUser);
//sercure routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeCurrentPassword);

router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-account").patch(verifyJWT,updateAccountDetails);
router.route("/avatar").patch(verifyJWT,upload.single("avatar"), upadateUserAvatar);
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"), upadateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("history").get(verifyJWT,getWatchHistory)



export default router