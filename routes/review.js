const express=require("express");
const router =express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");

// Requiring the Joi schema validation file
const { listingSchema,reviewSchema } = require("../schema.js");
const expressErrors = require("../utils/expressErrors.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {saveRedirectUrl,isLoggedIn,isOwner}=require("../middleware.js");

const reviewController = require("../controller/reviews.js");

 
const validateReview=(req,res,next)=> {
  
    let {error} = reviewSchema.validate(req.body); // Validate request body against schema
    console.log(error);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new expressErrors(404,errMsg);
    }else{
      next();
    }
  };

// Review Route for Submitting Reviews

router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));


// Review Route for DELETE Reviews


router.delete("/:reviewId",isLoggedIn,isOwner, wrapAsync(reviewController.destroyReview));

module.exports=router;