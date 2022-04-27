import fastify, { FastifyReply, FastifyRequest, RouteOptions } from "fastify";

export const loginController : RouteOptions = {
    method: 'POST',
    url: '/auth/login',

    async handler(req : FastifyRequest, res : FastifyReply) {
        return res.send("lskdfjsdlkfs");
    }
};

export const registerController : RouteOptions = {
    method: 'POST',
    url: '/auth/register',

    async handler(req : FastifyRequest, res : FastifyReply) {
        return res.send("fhsjkdhf");
    }
};