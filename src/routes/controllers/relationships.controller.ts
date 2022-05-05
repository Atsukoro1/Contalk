// Modules
import { 
    FastifyReply,
    FastifyRequest,
    RouteOptions
} from "fastify";
import Joi from "joi";
import { isValidObjectId } from "mongoose";

// Models, interfaces and services
import { 
    RelationshipsError, 
    RelationshipsResponse 
} from "../interfaces/relationships.interface"
import {
    reportServiceAddFriend
} from "../services/relationships.service";

export const settingsController : RouteOptions = {
    url: '/relationships/friends', 
    method: 'POST',
    schema: {
        body: Joi.object({
            _id: Joi.string().custom((value, helpers) => {
                if(!isValidObjectId(value)) {
                    return helpers.message({ custom: "_id should be a valid ObjectId" });
                } else {
                    return value;
                }
            }, "Check if value is a valid Mongoose ObjectId").required()
        })
    },

    validatorCompiler: ({ schema } : any) => {
        return data => schema.validate(data)
    },

    async handler(req : FastifyRequest, res : FastifyReply) : Promise<RelationshipsError | RelationshipsResponse> {
        const response = await reportServiceAddFriend(<any>req.body, (<any>req).user);

        return response;
    }
};