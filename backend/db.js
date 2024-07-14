const mongoose=require("mongoose");
const {Schema} = mongoose;
require('dotenv').config();
const connect=async()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to MongoDb")
}
connect();
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    firstname:{
        type:String,
        required:true,
        trim:true,
        maxLength:30
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
        maxLength:30
    }
})
const accountsSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, //This made sure that only registered users balances are stored in this databases
        ref:"User"
    },
    balance:{
        type:Number,
        required:true
    },
})

const Account=mongoose.model("Accounts",accountsSchema);

const User=mongoose.model("User",userSchema);
 module.exports={
    User,
    Account
 };
  
