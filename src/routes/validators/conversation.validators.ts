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

export const conversationChangeTitleValidator = {
    body: Joi.object({
        _id: Joi.string().custom((value, helpers) => {
            if(!isValidObjectId(value)) {
                return helpers.message({ custom: "_id should be a valid ObjectId" });
            } else {
                return value;
            }
        }, "Check if value is a valid Mongoose ObjectId").required(),
        title: Joi.string().max(40).min(3).required()
    })
};

export const conversationMessageSendValidator = {
    body: Joi.object({
        _id: Joi.string().custom((value, helpers) => {
            if(!isValidObjectId(value)) {
                return helpers.message({ custom: "_id should be a valid ObjectId" });
            } else {
                return value;
            }
        }, "Check if value is a valid Mongoose ObjectId").required(),
        textContent: Joi.string().required().min(1).max(1024)
    })
}

export const conversationMessageDeleteValidator = {
    body: Joi.object({
        _id: Joi.string().custom((value, helpers) => {
            if(!isValidObjectId(value)) {
                return helpers.message({ custom: "_id should be a valid ObjectId" });
            } else {
                return value;
            }
        }, "Check if value is a valid Mongoose ObjectId").required(),
        messageId: Joi.string().custom((value, helpers) => {
            if(!isValidObjectId(value)) {
                return helpers.message({ custom: "_id should be a valid ObjectId" });
            } else {
                return value;
            }
        }, "Check if value is a valid Mongoose ObjectId").required()
    })
};

export function schemaValidator({ schema } : any) {
    return (data : any) => schema.validate(data);
};