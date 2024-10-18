const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

// Requiring the Joi schema validation file for request validation
// const { listingSchema } = require("../schema.js");
const expressErrors = require("../utils/expressErrors.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");


// Define the route for GET and POST
router.route("/")
     // GET request for the listing index// Index route: Display all listings
    .get(wrapAsync(listingController.index))
    // Create route: Add a new listing to the database
    // Middleware to validate the listing before saving
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createlisting)); 
    // POST request to create a listing, with login and validation checks

    
    // New route: Show the form to create a new listing
    router.get("/new", isLoggedIn, listingController.renserNewForm);

    router.route("/:id")
    // Show route: Display a specific listing based on its ID
    .get( wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,
        validateListing, // Middleware to validate the listing before updating
        wrapAsync(listingController.updateListing))// Update route: Update an existing listing in the database
        // Delete route: Remove a listing from the database
    .delete( isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

// Edit route: Show the form to edit an existing listing
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// Export the router to be used in the main app
module.exports = router;
