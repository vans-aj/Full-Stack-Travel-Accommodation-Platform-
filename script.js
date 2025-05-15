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
const userrouter = require("./routes/user.js");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

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


const sessionoptions = {
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.get('/', (req, res) => {
    res.send("Hello, this is the home page");
});
app.listen(port, () => {
    console.log("server is listening at 8080");
});

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
}
);

// all the routes
app.use("/listings", listingrouter);
app.use("/listings/:id/reviews", reviewrouter);
app.use("/",userrouter);


//err
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    console.error("Error:", err); // Log the error for debugging
    res.status(statusCode).render("error.ejs", { err }); // Render error page
});
app.use("*", (req, res, next) => {
    next(new expressError("Page not found", 404)); // Handle undefined routes
});