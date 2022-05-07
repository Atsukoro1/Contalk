// Modules
import { 
    FastifyReply,
    FastifyRequest,
    RouteOptions
} from "fastify";

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
import {
    relationshipsValidator,
    schemaValidator
} from "../validators/relationships.validator";

export const addFriendController : RouteOptions = {
    url: '/relationships/friends', 
    method: 'POST',
    schema: relationshipsValidator,

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
    schema: relationshipsValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) : Promise<RelationshipsError | RelationshipsResponse> {
        const response = await reportServiceBlock(<any>req.body, (<any>req).user);

        return response;
    }
};

export const declineFriendController : RouteOptions = {
    url: '/relationships/friends',
    method: 'DELETE',
    schema: relationshipsValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) : Promise<RelationshipsError  | RelationshipsResponse> {
        const response = await reportServiceDeclineFriendRequest(<any>req.body, (<any>req).user);

        return response;
    }
};

export const unblockUserController : RouteOptions = {
    url: '/relationships/block',
    method: 'DELETE',
    schema: relationshipsValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) :  Promise<RelationshipsError | RelationshipsResponse> {
        const response = await reportServiceUnblock(<any>req.body, (<any>req).user);

        return response;
    }
};