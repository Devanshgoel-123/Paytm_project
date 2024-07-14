const express=require("express");
const { authMiddleware } = require("./middleware");
const { Account } = require("../db");
const router=express.Router();


router.get("/balance",authMiddleware,(req,res)=>{
    const account=Account.findOne({userId:req.userId});
    res.status(200).json({
        balance:account.balance
    })
});

router.post("/transfer",authMiddleware,async (req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = req.body;
    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }
    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
    //THis is the basic code which can be fooled
    // const {to,amount}=req.body;
    // const toAccount=await Account.findOne({userId:to});
    // if(!toAccount){
    //     return res.status(401).json({
    //         message:"Invalid Account!"
    //     })
    // }
    // const checkSenderbalance= await Account.findOne({userId:req.userId}).balance;
    // if(checkSenderbalance>amount){
    // const filter={userId:to};
    // await Account.findOneAndUpdate({userId:req.userId},{
    //     $inc:{balance:-amount}
    // })
    // await Account.findOneAndUpdate(filter,{
    //     $inc:{balance:amount}
    // })
    
    // }else{
    //     return res.status(400).json({
    //         message:"Insufficient balance"
    //     })
    // }
    
})
module.exports=router;

