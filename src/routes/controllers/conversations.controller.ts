// Modules
import { 
    FastifyReply,
    FastifyRequest, 
    RouteOptions 
} from "fastify";

// Services, models, validators and interfaces
import {
    schemaValidator,
    createConversationValidator
} from "../validators/conversation.validators";
import {
    ConversationError,
    ConversationResponse
} from "../interfaces/conversation.interface"
import {
    conversationCreateService
} from "../services/conversations.service"

export const conversationCreateController : RouteOptions = {
    method: 'POST',
    url: '/conversation',
    schema: createConversationValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) {
        const response : ConversationError | ConversationResponse = await conversationCreateService(<any>req.body);

        return response;
    }
};