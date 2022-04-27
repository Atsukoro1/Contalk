import { 
    FastifyRequest,
    FastifyReply,
    onErrorHookHandler
} from "fastify";
import Joi from "joi";

export const registerRoute = {
    method: 'POST',
    url: '/api/auth/register',
    schema: Joi.object({
        username: Joi.string().min(3).max(48).alphanum().required(),
        password: Joi.string().min(8).max(255).required(),
        email: Joi.string().email().min(5).max(255).required()
    }),

    async handler(
        request : FastifyRequest, 
        reply : FastifyReply
    ) {
        reply.status(200).send({ token: "kldsjklds", message: "Zabij se!" });
    },

    async validationCompiler(
        schema : Joi.Schema, 
        method : String, 
        url : String, 
        httpPart : FastifyRequest
    ) {
        return function(data : any) {
            const result = schema.validate(data);

            if(result.error) {
                return { error: result.error.details[0].message }
            } else {
                return result.value;
            };
        }
    }
};