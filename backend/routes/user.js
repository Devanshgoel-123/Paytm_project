const express=require("express");
const {z} =require("zod");
const {Account}=require("../db")
const {User}=require("../db");
const jwt=require("jsonwebtoken");
const router=express.Router();
const JWT_SECRET=require("../config");
const {authMiddleware}=require("./middleware")


router.get("/bulk",authMiddleware,async(req,res)=>{
    const filter=req.query.filter || "";
    try{
        const users=await User.find({ // This or thing is new for me, thus 
            $or: [{
                firstname: {
                    "$regex": filter //Check if this substring is present in the name
                }
            }, {
                lastname: {
                    "$regex": filter
                }
            }]
        });
        console.log(users)
        if(users){
            res.json({ 
                user: users.map(user => ({
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    _id: user._id
                }))
            })
        }

    }catch(err){
        res.status(400).json({"message":"Could not find anyone with this name"});
    }
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

const userSchema=z.object({
    username:z.string().email(),
    firstname:z.string(),
    password:z.string(),
    lastname:z.string()
})

router.post("/signup",async (req,res)=>{
    const body=req.body;
    console.log(body);
    const {success}=userSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect Inputs"
        })
    }
    const user= await User.findOne({username:body.username});
    console.log(user);
    if(user!=null){
        return res.json({
            message:"Username already taken"
        })
    } 
    const dbUser=await User.create(body);
    const token=jwt.sign({userId:dbUser._id},JWT_SECRET);
    console.log(token)
    await Account.create({
        userId:dbUser._id,
        balance:1+Math.random()*10000,
    })
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
       console.log(token);
       return res.status(200).json({
             token:token
    })
    }
   res.status(411).json({
    message:"Error while logging in"
   })
})

module.exports=router;
