import express from "express";
import {apiError} from "./utils/apiError.js"
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express()
 const CORS_ORIGIN = process.env.ORIGIN
app.use(cors({
    origin: CORS_ORIGIN,
    credential:true
}))





app.use(express.json({limit:"16kb"}))

 app.use(express.urlencoded({expended : true , limit:"16kb"})) // expended object me nested object bna ta h 
app.use(express.static("Public"))
app.use(cookieParser())


// Routes import
import userRouter from "./routes/user.routes.js"
import menuRouter from "./routes/menu.routes.js"
import offermenuRouter from "./routes/offermenu.routes.js"
// ROUTES 

app.use("/api/v1/users",userRouter)
app.use("/api/v1/menu",menuRouter)
app.use("/api/v1/offermenu",offermenuRouter)





export { app }