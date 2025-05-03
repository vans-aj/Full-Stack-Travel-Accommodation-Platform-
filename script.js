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
const Review = require("./models/reviews.js");

//conecting to mongodb
main().then(() => {
    console.log("conected to wanderlust data base");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.listen(port, () => {
    console.log("server is listening at 8080");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, msg);
    } else {
        next();
    }
};

app.get("/listings", wrapAsync(async (req, res) => {
    const alllist = await Listing.find({});
    console.log("Fetched Listings:", alllist);
    res.render("listing/index.ejs", { alllist });
}));

app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listing/new.ejs");
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate('reviews');
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listing/show.ejs", { listing });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));

app.put(
    "/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`);
    })
);

app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res, next) => {
        let newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");
    })
);

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
        return next(new expressError("Listing not found", 404)); // Pass error to middleware
    }
    res.redirect("/listings");
}));

// app.use("*", (req, res, next) => {
//     next(new expressError("Page not found", 404)); // Handle undefined routes
// });

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    console.error("Error:", err); // Log the error for debugging
    res.status(statusCode).render("error.ejs", { err }); // Render error page
});

app.get("/listings/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log("Edit Route Accessed. ID:", id); // Debugging log
    const listing = await Listing.findById(id);
    if (!listing) {
        console.error("Listing not found for ID:", id); // Debugging log
        return next(new expressError("Listing not found", 404)); // Pass error to middleware
    }
    console.log("Fetched Listing:", listing); // Debugging log
    res.render("listing/update.ejs", { listing });
}));

app.get('/', (req, res) => {
    res.send("Hello, this is the home page");
});

app.post("/listings/:id/reviews", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new expressError("Listing not found", 404)); // Handle missing listing
    }
    const review = new Review(req.body.review);
    listing.reviews.push(review); // Link review to the listing
    await review.save();
    await listing.save();
    console.log("New review saved:", review);
    res.redirect(`/listings/${id}`); // Redirect back to the listing page
}));
