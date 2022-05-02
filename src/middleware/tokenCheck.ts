import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model";

export default async function checkForToken(
    req : FastifyRequest, 
    res : FastifyReply, 
    next : () => void
) : Promise<void> {
    console.log(req.headers.cookie);

    next();
};