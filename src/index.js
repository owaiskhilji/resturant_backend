
import dotenv from "dotenv"
import connectDB from "./db/db.index.js"
import { app } from "./app.js"
dotenv.config({
    path: "./.env"
})


const PORT = process.env.PORT_APP || 5000

connectDB() 

.then(
    app.listen(PORT,()=>{
        console.log(`server in running on port ${PORT}`)
    })
)
.catch((err)=> console.log(`server connection failed ${err}`))







