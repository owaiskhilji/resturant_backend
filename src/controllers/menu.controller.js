import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { asyncHendler } from "../utils/asyncHendler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Menu } from "../models/menu.model.js";




const menuController =  asyncHendler(async (req,res)=>{
     try{
    const {menuname,category,price} = req.body
    
const menuCreate = await Menu.create({
    menuname,
    category,
    price
})
console.log("menuCreate",menuCreate)

if(!menuCreate){
    throw new apiError(500,"menu is not find")
}
 await menuCreate.save()
return res
.status(201)
.json(new ApiResponse(200, menuCreate, "menu successfully"));

}catch(err){
    console.error("Menu Server Error:", err);    
    throw new apiError(500,"menu server error",err)
}
    })


    
    
    const getMenu = asyncHendler(async(_,res)=>{
     try{
        const filePath = path.resolve("src/data/menu.json");
        const staticMenu = await JSON.parse(fs.readFileSync(filePath,"utf-8"))
        console.log("static",staticMenu)
        
        if(!staticMenu){
            throw new apiError(400,"staticMenu is not found")
        }
        const dynamicMenu = await Menu.find().sort({createdAt:-1}).limit(1)
        console.log("dyn",dynamicMenu)
        
        if(!dynamicMenu){
            throw new apiError(400,"dynamicMenu is not found")
        }
        const allMenus = [...staticMenu , ...dynamicMenu]
         
         console.log("Allmenu",allMenus)
             return res
             .status(201)
             .json(new ApiResponse(200, allMenus, "menu fetching successfully"))
     }catch(err){
        throw new apiError(500,"get err",err?.message)
     }
})

     


const deleteMenu = asyncHendler(async(req,res) =>{
    try {
        const { id } = req.params
        
          const deltMenu = await Menu.findByIdAndDelete(id)
            if(!deltMenu){
                throw new apiError(404,"deltMenu is not deleted");
            }
        res.
        status(200).
        json(new ApiResponse(200,
            deltMenu
            ," Menu Deleted"
        ))
    } catch (error) {
        console.log("Delete error",error)
        res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, null, "Error deleting create", error));

    }
    })
     



        
    const editMenu = asyncHendler(async(req,res) =>{
        try {
            const { id } = req.params
            console.log("ID",id)
            
if(!mongoose.Types.ObjectId.isValid(id)){
    throw new apiError(400,"Id in not defined");
}
            const {menuname,category,price} = req.body
            const edit_menu = await Menu.findByIdAndUpdate(
                id,
                {menuname,category,price} 
                ,{new: true})
                if(!edit_menu){
                    throw new apiError(404,"Edit Menu is not editted");
                }
                
            res.
            status(200).
            json(new ApiResponse(200,
                edit_menu,
                " Menu editted successfully"))
        } catch (error) {
            console.log("edit error",error.message,error)
        }
        })
    













    export {
        menuController,
        getMenu,
        deleteMenu,
        editMenu
    }