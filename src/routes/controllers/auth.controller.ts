// Modules
import fastify, { 
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
    AuthErrorI,
    AuthResponseI
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

    async handler(req : FastifyRequest, res : FastifyReply) {
        const response : AuthErrorI | AuthResponseI = await loginService();

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
            password: Joi.string().min(8).max(255).required()
        })
    },

    async handler(req : FastifyRequest, res : FastifyReply) {
        const response : AuthErrorI | AuthResponseI = await registerService();

        return response;
    }
};