const express=require("express");
const {z} =require("zod");
const {User}=require("../db");
const jwt=require("jsonwebtoken");
const router=express.Router();
const {JWT_SECRET}=require("../config")

const userSchema=z.object({
    username:z.string().email(),
    firstname:z.string(),
    password:z.string(),
    lastname:z.string()
})

router.post("/signup",async (req,res)=>{
    const body=req.body;
    const {success}=userSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect Inputs"
        })
    }
    const user=User.findOne({username:body.username});
    if(user._id){
        return res.json({
            message:"Username already taken"
        })
    }
    const dbUser=await User.create(body);
    const token=jwt.sign({userId:user._id},JWT_SECRET);
    res.status(200).json({
        message:"User created Successfully",
        token:token,
    })
    
})
module.exports=router;
