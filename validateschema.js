const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    //declarigng listing as an obj under joi
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0), //setting val of price as non-negative (i.e min=0)
        image: Joi.string().allow("", null), //img can be empty else null value
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    //declarigng listing as an obj under joi
    review: Joi.object({

        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
        
    }).required(),
});