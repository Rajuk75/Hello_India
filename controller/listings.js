
const Listing=require("../models/listing");



module.exports.index=async (req, res) => {
        const allListings = await Listing.find({}); // Fetch all listings from the database
        // Render listings page and pass the data to the template
        res.render("listings/index.ejs", { allListings });
    };



    module.exports.renserNewForm=(req, res) => {
        res.render("listings/new.ejs"); // Render form for creating a new listing
    }

module.exports.showListing=async (req, res) => {
    let { id } = req.params;

    // Fetch the listing by ID and populate its reviews and owner
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author" // Ensure that "author" is a string to populate correctly
            }
        })
        .populate("owner"); // Populate the owner field

    // Check if the listing exists
    if (!listing) {
        req.flash("error", "Listing you are searching for does not exist!");
        return res.redirect("/listings"); // Redirect if the listing is not found
    }
    
    // Render show page for the listing
    res.render("listings/show.ejs", { listing });
};


module.exports.createlisting=async (req, res) => {
    const newListing = new Listing(req.body.listing); // Create new listing instance with the request data
    newListing.owner = req.user._id; // Assign the current logged-in user as the owner
    await newListing.save(); // Save the listing to the database
    req.flash("success", "New Listing Created!");
    
    // Redirect to listings page after successful creation
    res.redirect("/listings");
};


module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id); // Fetch listing by ID for editing
    if (!listing) {
        req.flash("error", "Listing you are searching for does not exist!");
        return res.redirect("/listings");
    }
    // Render edit form and pass the existing listing data to the template
    res.render("listings/edit.ejs", { listing });
};


module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    // Update the listing with new data
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated Successfully!");
    // Redirect to the updated listing's page
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    // Find and delete the listing by ID
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing); // Log the deleted listing for reference
    // Redirect to listings page after deletion
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
}

