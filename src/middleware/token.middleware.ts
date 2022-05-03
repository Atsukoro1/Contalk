// Modules
import { 
    FastifyReply, 
    FastifyRequest, 
    FastifyInstance, 
    FastifyPluginOptions 
} from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import fp from "fastify-plugin";

// Service, models & Interfaces
import { User } from "../models/user.model";

/**
 * Converts simple simple cookie string returned by HTTP protocol into a Javascript object
 * Param - {string} cookieString A string with cookies contained in HTTP request
 * Returns {Record<string, any> | null}
 */
function cookieParser(cookieString : string) : Record<string, any> | null {
    if(!cookieString) return null;

    const cookiesUnparsed : Array<Array<string>> = cookieString.split(";").map(el => el.split("="));
    const cookiesParsed : Record<string, any> = {};

    for(const cookie of cookiesUnparsed) {
        cookiesParsed[cookie[0]] = cookie[1];
    };

    return cookiesParsed;
}

/**
 * Parse cookies, check token one, verify it and return back user or
 * error in case something happened
 * Param - {FastifyRequest} req - Fastify request
 * Param - {FastifyReply} res - Fastify reply
 * Returns - {Promise<void>}
 */
async function handleCookies(
    req : FastifyRequest, 
    res : FastifyReply
) : Promise<void> {
    if(req.url.includes('/auth')) return;

    try {
        const cookies : Record<string, any> | null = cookieParser(req.headers.cookie);
        if(!cookies || !cookies['token']) throw new Error();

        const payload : string | JwtPayload = await jwt.verify(cookies['token'], process.env.JWT_SECRET);

        const existingUser : User = await User.findById((<any>payload)._id);

        // @ts-ignore
        req.user = existingUser;

        return;
    } catch(err) {
        return res.status(401).send({
            error: "You need to provide token in order to access our services",
            errorCode: 401
        });
    };
};

/**
 * Creates a fastify middleware / plugin that verifies token
 * sent from frontend and turn it into User object
 * Param - {FastifyInstance} fastify
 * Param - {FastifyPluginOptions} options
 * Param - {void} next
 * Returns {void}
 */
export default fp(function(
    fastify : FastifyInstance,
    options : FastifyPluginOptions, 
    next : () => void
) : void {

    /**
     * Listen on every request and process it
     * Param - {FastifyRequest} req
     * Param - {FastifyReply} res
     * Returns {Promise<void>}
     */
    fastify.addHook('onRequest', async (
        req : FastifyRequest,
        res : FastifyReply
    ) : Promise<void> => {
        // Exclude authentication routes from this middleware
        await handleCookies(req, res);

        return;
    });

    next();
});