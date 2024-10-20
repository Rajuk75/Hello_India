const Joi = require('joi');

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      filename: Joi.string(),
      url: Joi.string().uri(),
    }).required(),
    price: Joi.number().required().min(0), // Price must be a positive number
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

module.exports = { listingSchema };

module.exports.reviewSchema=Joi.object({
  review:Joi.object({
    Rating: Joi.number().required().min(1).max(5),
    Comment:Joi.string().required()
  }).required(),
});
