import Joi from "joi"
import { isValidObjectId } from "mongoose";

export const createConversationValidator = {
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

export function schemaValidator({ schema } : any) {
    return (data : any) => schema.validate(data);
};