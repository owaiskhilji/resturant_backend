import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username:{
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
            index : true  // searching feild kisi bh feild pr enable krni h to index ka use hoga
        },
        email:{
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
        },
        password :{
            type : String,
            required : [true ," password is requried"]
        },
        admin : [
            {
                type : Schema.Types.ObjectId,
                ref : "Menu"
            }
        ],
        refreshToken:{
            type : String
        }

    }
,{timestamps:true})


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password =await bcrypt.hash(this.password,10) // do parameter leta h phla kiso ko hsh krna h dusra kitna round krna h
    next()
})
// kuxh ese methods ka use krna hoga take user ko import krae to user se pouch le k pasword shi ya nh
// is me ap custom method bh bna skte ho 
userSchema.methods.inCorrectPassword = async function(password){
    // bcrpt agr password hash kr ta h to whi check bh krta h
    return await bcrypt.compare(password,this.password)   
}
// ACCESS TOKEN
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        // payload
        {
            _id : this.id, // mongoebd se get kia h
            username : this.username,
            email : this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
}
// REFRESH ACCESS TOKEN
userSchema.methods.generaterefreshAccessToken = function(){
    return jwt.sign(
        // payload
        {
            _id : this.id, // mongoosebd se get kia h
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY 
        }
    )
}

export const User = mongoose.model("User",userSchema)
 

