const mongoose=require("mongoose");
const {Schema} = mongoose;


await mongoose.connect("mongodb+srv://dgoel7146:dEmpiw-9miwxe-saqjud@paytmcluster.jhshquc.mongodb.net/")
const userSchema=new Schema({
    userName:{
        type:String,
        required:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    firstName:{
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
    lastName:{
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
  
