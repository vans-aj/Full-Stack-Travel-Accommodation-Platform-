const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/asyncwrap.js");
const { listingSchema,reviewShema } = require("../schema.js");
const expressError = require("../utils/expresserror.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, msg);
    } else {
        next();
    }
};
// index route
router.get("/", wrapAsync(async (req, res) => {
    const alllist = await Listing.find({});
    console.log("Fetched Listings:", alllist);
    res.render("listing/index.ejs", { alllist });
}));

// new route
router.get("/new", wrapAsync(async (req, res) => {
    res.render("listing/new.ejs");
}));

// Show route
router.get("/:id", wrapAsync(async (req, res) => {
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

// create route
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
        let newlisting = new Listing(req.body.listing);
        await newlisting.save();
        req.flash("success","New listing created ");
        res.redirect("/listings");
    })
);

// edit route
router.get("/:id/edit", wrapAsync(async (req, res, next) => {
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

// update route
router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`);
    })
);

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
        return next(new expressError("Listing not found", 404)); // Pass error to middleware
    }
    res.redirect("/listings");
}));

module.exports = router;