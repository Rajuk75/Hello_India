const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the review schema
const reviewSchema = new Schema({
    Comment: {
        type: String, // Use Mongoose's String type
        required: true, // Make it required
    },
    Rating: {
        type: Number, // Use Mongoose's Number type
        min: 1,
        max: 5,
        required: true, // Make it required
    },
    createdAt: {
        type: Date,
        default: Date.now, // Corrected to use Date.now as a function
    },
    author:{
        type:Schema.ObjectId,
        ref:"User"
    },
});

// Create the Review model
const Review = mongoose.model("Review", reviewSchema);

// Export the Review model
module.exports = Review;
