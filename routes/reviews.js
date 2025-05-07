const express = require('express'); 
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/asyncwrap.js");
const { listingSchema, reviewShema } = require("../schema.js");
const expressError = require("../utils/expresserror.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

const validateReview = (req, res, next) => {
    let { error } = reviewShema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, msg);
    } else {
        next();
    }
};
// create review route
router.post("/",validateReview, wrapAsync(async (req, res, next) => {
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

//delete review route
router.delete("/:reviewId", wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await  Review.findById(reviewId);
    res.redirect(`/listings/${id}`); // Redirect back to the listing page
}
));

module.exports = router;