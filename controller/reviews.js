const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        let listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        let newReview = new Review(req.body.review);
        newReview.author = req.user._id; // Storing the author as the currently logged-in user
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error creating review:", error);
        req.flash("error", "Unable to add review. Please try again later.");
        res.redirect("/listings");
    }
};


module.exports.destroyReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params;
        
        // Find the listing and the review to delete
        const listing = await Listing.findById(id).populate("owner");
        const review = await Review.findById(reviewId);
        
        if (!listing || !review) {
            req.flash("error", "Listing or review not found!");
            return res.redirect(`/listings/${id}`);
        }

        // Authorization check: Only the author of the review or the owner of the listing can delete the review
        if (review.author.toString() !== req.user._id.toString() && listing.owner._id.toString() !== req.user._id.toString()) {
            req.flash("error", "You do not have permission to delete this review.");
            return res.redirect(`/listings/${id}`);
        }

        // Remove the review from the listing's reviews array
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        
        // Delete the review by its ID
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error deleting review:", error);
        req.flash("error", "Unable to delete review. Please try again later.");
        res.redirect(`/listings/${id}`);
    }
};
