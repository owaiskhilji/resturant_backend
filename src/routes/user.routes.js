import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    chaangeCurrentPassword,
    getCurrentUser,
    updateUser,
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.midderwaer.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(
    upload.fields(
        [
            {
                name : "avatar",
                maxCount : 1
            },
            {
                name : "coverImage",
                maxCount: 1
            }

        ]
    )
    ,registerUser);
router.route("/login").post(loginUser) 


// secure routes 
router.route("/logout").post(verifyJwt,logoutUser)   
router.route("/refreshtoken").post(refreshAccessToken)   
router.route("/password_change").post(verifyJwt,chaangeCurrentPassword)   
router.route("/getcurrentuser").get(verifyJwt,getCurrentUser)   
router.route("/updateuser").patch(verifyJwt,updateUser)

export default router;