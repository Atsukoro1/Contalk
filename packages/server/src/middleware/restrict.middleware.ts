// Modules
import { 
    FastifyReply, 
    FastifyRequest, 
    FastifyInstance, 
    FastifyPluginOptions 
} from "fastify";
import fp from "fastify-plugin";
import { User } from "user.model";

/**
 * Creates a fastify middleware / plugin that restrict access from the service
 * for users that have been prohibited from using it
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
        if(req.url.includes('/auth')) return;
        
        if((<any>req).user.type === 'BANNED') return res.status(401).send({
            error: "You have been prohibited from using our service",
            statusCode: 401
        });
    });

    next();
});