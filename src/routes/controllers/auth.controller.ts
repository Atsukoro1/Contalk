// Modules
import { 
    FastifyReply,
    FastifyRequest, 
    RouteOptions 
} from "fastify";
import Joi from "joi";

// Service & Interfaces
import { 
    loginService, 
    registerService
} from "../services/auth.service";
import {
    AuthError,
    AuthResponse
} from "../interfaces/auth.interface";

export const loginController : RouteOptions = {
    method: 'POST',
    url: '/auth/login',
    schema: {
        body: Joi.object({
            email: Joi.string().email().min(5).max(255).required(),
            password: Joi.string().min(8).max(255).required()
        })
    },

    validatorCompiler: ({ schema } : any) => {
        return data => schema.validate(data)
    },

    async handler(req : FastifyRequest, res : FastifyReply) {
        const response : AuthError | AuthResponse = await loginService(<any>req.body);

        return response;
    }
};

export const registerController : RouteOptions = {
    method: 'POST',
    url: '/auth/register',
    schema: {
        body: Joi.object({
            username: Joi.string().min(3).max(42).alphanum().required(),
            email: Joi.string().email().min(5).max(255).required(),
            password: Joi.string().min(8).max(255).required(),
            name: Joi.string().min(3).max(32).alphanum().required(),
            surname: Joi.string().min(3).max(32).alphanum().required(),
            phone: Joi.string().required().min(9).max(32)
        })
    },

    validatorCompiler: ({ schema } : any) => {
        return data => schema.validate(data)
    },

    async handler(req : FastifyRequest, res : FastifyReply) {
        const response : AuthError | AuthResponse = await registerService(<any>req.body);

        return response;
    }
};