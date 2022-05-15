import Joi from "joi";
import { isValidObjectId } from "mongoose";

export const reportValidator = {
    body: Joi.object({
        _id: Joi.string().custom((value, helpers) => {
            if(!isValidObjectId(value)) {
                return helpers.message({ custom: "_id should be a valid ObjectId" });
            } else {
                return true;
            }
        }, "Check if value is a valid Mongoose ObjectId").required(),
        reason: Joi.string().min(32).max(1024).required()
    })
};