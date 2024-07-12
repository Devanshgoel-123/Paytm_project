const express = require("express");
const cors=require("cors");
const mainRouter=require("./routes/index");
const bodyParser = require("body-parser");

const app=express();
const PORT=3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use("/api/v1",mainRouter); // all request coming to /api/vi go to to the router, now udhar tum isko apne tarike se handle kar sakte ho
                               //app is used for the main router not the inside one

app.listen(PORT,()=>{
    console.log(`Listening on PORT : ${PORT}`)
})
