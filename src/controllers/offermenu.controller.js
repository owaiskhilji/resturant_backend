import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { asyncHendler } from "../utils/asyncHendler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

import { OfferMenu } from "../models/offermenu.model.js";

const offerMenuController =  asyncHendler(async (req,res)=>{
     try{
    const {menuname,category,price} = req.body
    
const offerMenuCreate = await OfferMenu.create({
    menuname,
    category,
    price
})
if(!offerMenuCreate){
    throw new apiError(500,"menu is not find")
}
 await offerMenuCreate.save()
return res
.status(201)
.json(new ApiResponse(200, offerMenuCreate, "menu successfully"));

}catch(err){
    console.error("Menu Server Error:", err);    
    throw new apiError(500,"menu server error",err)
}
    })


    
    
    const getofferMenu = asyncHendler(async(_,res)=>{
     try{
         const filePath = path.resolve("src/data/offermenu.json");
                 const staticOfferMenu = await JSON.parse(fs.readFileSync(filePath,"utf-8"))
                 if(!staticOfferMenu){
                     throw new apiError(400,"static offermenu is not found")
                    }
                 const daynamicOfferMenu = await OfferMenu.find().sort({createdAt:-1}).limit(1)
                 if(!daynamicOfferMenu){
                     throw new apiError(400,"dynamic offermenu is not found")
                    }
                    
                    const allMenus = [...staticOfferMenu , ...daynamicOfferMenu]
                    return res
    .status(201)
    .json(new ApiResponse(200, allMenus, "offermenu fetching successfully"))
}catch(err){
   throw new apiError(500,"getoffer mane error",err)
}
})

     


const deleteOfferMenu = asyncHendler(async(req,res) =>{
    try {
        const { id } = req.params
        
          const deltOfferMenu = await OfferMenu.findByIdAndDelete(id)
            if(!deltOfferMenu){
                throw new apiError(404,"deltMenu is not deleted");
            }
        res.
        status(200).
        json(new ApiResponse(200,
            deltOfferMenu
            ," Menu Deleted"
        ))
    } catch (error) {
        console.log("Delete error",error)
        res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, null, "Error deleting create", error));

    }
    })
     



        
    const editOfferMenu = asyncHendler(async(req,res) =>{
        try {
            const { id } = req.params
            console.log("ID",id)
            
if(!mongoose.Types.ObjectId.isValid(id)){
    throw new apiError(400,"Id in not defined");
}
            const {menuname,category,price} = req.body
            const edit_offermenu = await OfferMenu.findByIdAndUpdate(
                id,
                {menuname,category,price} 
                ,{new: true})
                if(!edit_offermenu){
                    throw new apiError(404,"Edit Menu is not editted");
                }
                
            res.
            status(200).
            json(new ApiResponse(200,
                edit_offermenu,
                " Menu editted successfully"))
        } catch (error) {
            console.log("edit error",error.message,error)
        }
        })
    




    export {
        offerMenuController,
        getofferMenu,
        deleteOfferMenu,
        editOfferMenu
    }