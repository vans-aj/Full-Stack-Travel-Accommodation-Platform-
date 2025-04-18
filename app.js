//requiring pakcages
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/asyncwrap.js");
const expressError = require("./utils/expresserror.js");
const { listingSchema } = require("./schema.js");
const listing = require('./models/listing.js');
//conecting to mongodb

main().then(()=>{
    console.log("conected to wanderlust data base");
}).catch((err)=>{
    console.log(err);
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname , "views"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname , "/public")));
app.listen(port,()=>{
    console.log("server is listening at 8080");
});
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, msg);
    }
    else {
        next();
    } 
}
app.get("/listings", wrapAsync(async (req, res) => {
    const alllist = await Listing.find({});
    console.log("Fetched Listings:", alllist);
    res.render("listing/index.ejs", { alllist });
}))

app.get("/listings/new", wrapAsync(async (req,res)=>{
    res.render("listing/new.ejs");
}))

app.get("/listings/:id", wrapAsync(async (req,res)=>{
    try {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listing/show.ejs",{listing});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}))
app.put(
    "/listings/:id",
    validateListing,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

app.post(
    "/listings",
    validateListing,
    wrapAsync (async (req,res,next)=>{
        let newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");
}));
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findByIdAndDelete(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}))

app.use("*",(req,res,next)=>{
    next(new expressError("page not found",404));
})

app.use((err,req, res, next) => {
    let {statusCode , message} = err;
    res.render("error.ejs");
    res.status(statusCode).send(message);
});

app.get("/listings/:id/edit", wrapAsync(async (req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/update.ejs" , {listing});
}))
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
