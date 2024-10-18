const mongoose = require("mongoose");
const Review = require("./review.js"); // Ensure you import the Review model
const Schema = mongoose.Schema;
// const Review= require("./review.js");

// Define the listing schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    image: {
        type: mongoose.Schema.Types.Mixed, // Allow image to be either an object or a string
        // required: true, // Make it required if necessary
    },
    reviews: [{
        type: Schema.Types.ObjectId, // Use ObjectId type to reference the Review model
        ref: "Review" // Reference the Review model
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});


//ye code jab hm listing ko delete krenge to uska review bhi delete kr dega....
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});



// Create the Listing model
const Listing = mongoose.model("Listing", listingSchema);

// Export the Listing model
module.exports = Listing;
