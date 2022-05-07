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
    reportServiceAddFriend,
    reportServiceBlock,
    reportServiceDeclineFriendRequest,
    reportServiceUnblock
} from "../services/relationships.service";

const validationSchema = Joi.object({
    _id: Joi.string().custom((value, helpers) => {
        if(!isValidObjectId(value)) {
            return helpers.message({ custom: "_id should be a valid ObjectId" });
        } else {
            return value;
        }
    }, "Check if value is a valid Mongoose ObjectId").required()
});

function schemaValidator({ schema } : any) {
    return (data : any) => schema.validate(data);
};

export const addFriendController : RouteOptions = {
    url: '/relationships/friends', 
    method: 'POST',
    schema: {
        body: validationSchema
    },

    validatorCompiler: ({ schema } : any) => {
        return data => schema.validate(data)
    },

    async handler(req : FastifyRequest, res : FastifyReply) : Promise<RelationshipsError | RelationshipsResponse> {
        const response = await reportServiceAddFriend(<any>req.body, (<any>req).user);

        return response;
    }
};

export const blockUserController : RouteOptions = {
    url: '/relationships/block',
    method: 'POST',
    schema: {
        body: validationSchema
    },
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) : Promise<RelationshipsError | RelationshipsResponse> {
        const response = await reportServiceBlock(<any>req.body, (<any>req).user);

        return response;
    }
};

export const declineFriendController : RouteOptions = {
    url: '/relationships/friends',
    method: 'DELETE',
    schema: {
        body: validationSchema
    },
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) : Promise<RelationshipsError  | RelationshipsResponse> {
        const response = await reportServiceDeclineFriendRequest(<any>req.body, (<any>req).user);

        return response;
    }
};

export const unblockUserController : RouteOptions = {
    url: '/relationships/block',
    method: 'DELETE',
    schema: {
        body: validationSchema
    },
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) :  Promise<RelationshipsError | RelationshipsResponse> {
        const response = await reportServiceUnblock(<any>req.body, (<any>req).user);

        return response;
    }
};