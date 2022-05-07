// Modules
import { 
    FastifyReply,
    FastifyRequest, 
    RouteOptions 
} from "fastify";

// Service & Interfaces
import { 
    loginService, 
    registerService
} from "../services/auth.service";
import {
    AuthError,
    AuthResponse
} from "../interfaces/auth.interface";
import {
    loginValidator,
    registerValidator,
    schemaValidator
} from "../validators/auth.validators"

export const loginController : RouteOptions = {
    method: 'POST',
    url: '/auth/login',
    schema: loginValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) {
        const response : AuthError | AuthResponse = await loginService(<any>req.body);

        return response;
    }
};

export const registerController : RouteOptions = {
    method: 'POST',
    url: '/auth/register',
    schema: registerValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) {
        const response : AuthError | AuthResponse = await registerService(<any>req.body);

        return response;
    }
};