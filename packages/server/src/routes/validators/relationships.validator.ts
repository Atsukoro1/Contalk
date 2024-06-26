import Joi from "joi";
import { isValidObjectId } from "mongoose";

export const relationshipsValidator = {
    body: Joi.object({
        _id: Joi.string().custom((value, helpers) => {
            if(!isValidObjectId(value)) {
                return helpers.message({ custom: "_id should be a valid ObjectId" });
            } else {
                return value;
            }
        }, "Check if value is a valid Mongoose ObjectId").required()
    })
}

export const relationshipsQueryValidator = {
    querystring: Joi.object({
        _id: Joi.string().custom((value, helpers) => {
            if(!isValidObjectId(value)) {
                return helpers.message({ custom: "_id should be a valid ObjectId" });
            } else {
                return value;
            }
        }, "Check if value is a valid Mongoose ObjectId").required()
    })
};

export const RelationshipsFindUsersValidator = {
    querystring: Joi.object({
        searchString: Joi.string().min(3).max(64).normalize("NFKD").alphanum().required()
    })
};