//requiring pakcages
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expresserror.js");
const listingrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/reviews.js");

//conecting to mongodb
main().then(() => {
    console.log("conected to wanderlust data base");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// some middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// listening to the server at port 8080
app.listen(port, () => {
    console.log("server is listening at 8080");
});

// all the routes
app.use("/listings", listingrouter);
app.use("/listings/:id/reviews", reviewrouter);



//err
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    console.error("Error:", err); // Log the error for debugging
    res.status(statusCode).render("error.ejs", { err }); // Render error page
});
app.get('/', (req, res) => {
    res.send("Hello, this is the home page");
});
app.use("*", (req, res, next) => {
    next(new expressError("Page not found", 404)); // Handle undefined routes
});