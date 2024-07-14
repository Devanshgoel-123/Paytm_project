const express=require("express");
const {z} =require("zod");
const {User}=require("../db");
const jwt=require("jsonwebtoken");
const router=express.Router();
const {JWT_SECRET}=require("../config");
const {authMiddleware}=require("./middleware")
const userSchema=z.object({
    username:z.string().email(),
    firstname:z.string(),
    password:z.string(),
    lastname:z.string()
})

const updateBody=z.object({
    firstname:z.string(),
    password:z.string(),
    lastname:z.string()
})
router.put("/",authMiddleware,async(req,res)=>{
    const {success}=updateBody.safeParse(body);
    if(!success){
        return res.status(411).json({
            message:"Error while updating information"
        })
    }
   const body=req.body;
   const filter={_id:req.userId}
   await User.updateOne(body,filter);
   res.json({message:"Updated Succesfully"});
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
const signinBody=z.object({
    username:z.string().email(),
    password:z.string()
})
router.post("/signin",async (req,res)=>{
    const body=req.body;
    const {success}=signinBody.safeParse(body);
    if(!success){
        return res.status(411).json({
            message:"Email already Taken / Incorrect Inputs"
        })
    }
    const user=await User.findOne({
        username: body.username,
        password:body.password
    });
    if(user){
       const token=jwt.sign({userId:user._id},JWT_SECRET);
       return res.status(200).json({
             token:token
    })
    return ;
    }
   res.status(411).json({
    message:"Error while logging in"
   })
})

module.exports=router;
