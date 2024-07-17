const JWT_SECRET=require("../config")
const jwt=require("jsonwebtoken")

const authMiddleware=async (req,res,next)=>{
   const authHeader=req.headers;
   if(!authHeader){
    res.status(402).json({message:"Auth token not present"});
   }
   const token=authHeader.authorization;
   console.log(token)
   try{
    const decoded=await jwt.verify(token,JWT_SECRET);
    console.log(decoded)
    if(decoded.userId){
        req.userId=decoded.userId;
        next();
    }
   }catch(err){
    console.log(err)
    return res.status(403).json({});
   }
}
module.exports={authMiddleware};