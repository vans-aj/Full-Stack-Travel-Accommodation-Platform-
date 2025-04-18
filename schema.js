const joi = require("joi");
const listingSchema = joi.object({
    listing:joi.object({
        title:joi.string().required(),
        price:joi.number().required().min(0),
        description:joi.string().required(),
        location:joi.string().required(),
        image:joi.string().allow("",null)
    }).required()
});