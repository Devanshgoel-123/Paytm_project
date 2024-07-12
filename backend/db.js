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

const User=mongoose.model("User",userSchema);
 module.exports={
    User
 };
  
