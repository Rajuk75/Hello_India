const ListingModel = require("./models/listing.js");
const { listingSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
        if (!req.isAuthenticated()){
            console.log("User is not authenticated, saving original URL:", req.originalUrl);  // Log the original URL
            req.session.redirectUrl = req.originalUrl;  // Save the original URL
            req.flash("error", "Please log in!");
            return res.redirect("/login");
        }
        next();
    };



module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        console.log("Redirect URL found in session:", req.session.redirectUrl);  // Log the redirect URL
        res.locals.redirectUrl = req.session.redirectUrl;  // Set it in locals
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const foundListing = await ListingModel.findById(id);

    if (!foundListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Compare both the foundListing owner and currUser as strings
    if (foundListing.owner.toString() !== res.locals.currUser._id.toString()) {
        req.flash("error", "You don't have permission!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// // Middleware to validate listing data using Joi schema
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // Validate request body against the schema
    console.log(error);
    if (error) {
        // If there's a validation error, format and throw it as an expressError
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new expressErrors(404, errMsg);
    } else {
        next(); // If valid, proceed to the next middleware/route
    }
};

