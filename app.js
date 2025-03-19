//requiring pakcages
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
//conecting to mongodb

main().then(()=>{
    console.log("conected to wanderlust data base");
}).catch((err)=>{
    console.log(err);
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname , "views"));
app.listen(port,()=>{
    console.log("server is listening at 8080");
});

app.get("/listings",async (req,res)=>{
    const alllist = await Listing.find({});
    res.render("listing/index.ejs" , {alllist});
})

app.get("/listings/:id",async (req,res)=>{
    
})
// app.get("/testlisting",async (req,res)=>{
//     let list = new Listing({
//         title : "my new villa",
//         description: "buy my beach",
//         price : 1300,
//         location : "clement town",
//         country : "india"
//     });
//     await list.save(); 
//     console.log("list saved successfully");
//     res.send("successfully added");
// });

app.get('/',(req,res)=>{
    res.send("hello this is home page");
})
