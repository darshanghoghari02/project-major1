const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().allow("", null),
    category: Joi.string()
      .valid(
        "tranding",
        "rooms",
        "cities",
        "mountain",
        "castle",
        "pools",
        "camping",
        "farms",
        "arctic"
      )
      .required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required(),
  }).required(),
});
