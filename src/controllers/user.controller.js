import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { asyncHendler } from "../utils/asyncHendler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshyTokens = async(userId) => {
try {
  const user = await User.findById(userId)
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generaterefreshAccessToken()
  user.refreshToken  = refreshToken
await user.save({validateBeforeSave:false})  
return { accessToken,refreshToken }  
} catch (error) {
throw new apiError(500 ,error )  
}
 };

const registerUser = asyncHendler(async (req, res) => {
  

  // 1
  const { username, email,  password } = req.body;
  console.log("email : ", email);
  console.log("req.body", req.body);
  //2
  if (
    [username, email, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new apiError(400, "All feilds is required");
  }

  // 3
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExists) {
    throw new apiError(409, "email and username already exists");
  }

 

  // 6
  const user = await User.create({
    username,
    email,
    password,
  });

  // 7
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // 8
  if (!createUser) {
    throw new apiError(
      500,
      "sonething went wrong while registeration the user"
    );
  }

  // 9
  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "user register successfully"));
});

const loginUser = asyncHendler(async (req, res) => {
  
  //1 
  const {username,email,password} = req.body
  //2
  if (!username && !email) {
    throw new apiError (400,"username or email is required")
  }
  //3
  const user = await User.findOne({
    $or : [{username},
    {email}]
  })
  if (!user) {
    throw new apiError(404,"user is not exists")
  }

  // 4
const invalidPassword = await user.inCorrectPassword(password)
if (!invalidPassword) {
 throw new apiError(401 ,"Invalid user credentials") 
}

//5
 const { accessToken,refreshToken }= await generateAccessAndRefreshyTokens(user._id)
const loggaIn =await User.findById(user._id).select("-password -refreshToken")
console.log("refreshToken ",refreshToken )
//6

const options = {
  httpOnly : true,
  secure : true
}
return res 
.status(200)
.cookie("accessToken",accessToken,options) 
.cookie("refreshToken",refreshToken,options)
.json(
  new ApiResponse(
  200,
  {
  user : loggaIn, accessToken ,refreshToken
  }  ,
  "User is loggedIn successfully" 
  ) 
) 
  });


const logoutUser = asyncHendler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken : undefined
      }
    },
    {new:true}
  )
const options ={
    httpOnly : true,
    secure : true
  }
return res 
.status(200)
 .clearCookie("accessToken ", options)
 .clearCookie("refreshToken" , options)
.json(200,{},"user logged Out")

})


const refreshAccessToken = asyncHendler(async(req,res)=>{
const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
if(!incomingRefreshToken){
  throw new apiError(401, "unauthorized request")
}
try{
  const decodeToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  const user =await User.findById(decodeToken?._id)
  
  if (!user) {
    throw new apiError(401, "Invalid refresh token")
  }
  if(incomingRefreshToken !== user?.refreshToken){
    throw new apiError(401, "Refresh token is expired or used")
}

const {accessToken, newRefreshToken }=await generateAccessAndRefreshyTokens(user._id)

const options ={
  httpOnly : true,
  secure : true
}
return res 
.status(200)
.clearCookie("accessToken",accessToken, options)
.clearCookie("refreshToken" ,newRefreshToken, options)
.json(
  new ApiResponse(200,{
  accessToken,refreshToken:newRefreshToken
},"Access Token Refreshed")
)


}catch(err){
  throw new ApiError(500,err?.message|| "server error")
}


})



const chaangeCurrentPassword =asyncHendler(async(req,res)=>{
  const {oldPassword,newPassword}=req.body
  const user = await User.findById(user.req?._id)
  
  if(!user){
    throw new apiError(404, "user not found")
  }
  const isCorrectPassword =await user.inCorrectPassword(oldPassword)
  if(!isCorrectPassword){
    throw new apiError(401, "Invalid old password")
  }
  user.password = newPassword
await user.save({validateBeforeSave:false})


return res 
.status(200)
.json(
  new ApiResponse(200
  ,{},
  "new passowrd changed successFully")
)


})

const getCurrentUser =asyncHendler(async(req,res)=>{
  
return res 
.status(200)
.json(
  new ApiResponse(200
  ,
    req.user
  ,
  "get current user fetched"
)
)
})
  
const updateUser =asyncHendler(async(req,res)=>{
  const {fullName,username,email}=req.body
  const user =await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullName,
        username,
        email
      }
    },
    {new:true}
  )
return res 
.status(200)
.json(
  new ApiResponse(200
  ,
  user
  ,
  "user data updated successfully"
)
)
})
   

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  chaangeCurrentPassword,
  getCurrentUser,
  updateUser,
};
