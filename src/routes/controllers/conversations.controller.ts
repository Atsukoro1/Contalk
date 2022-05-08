// Modules
import { 
    FastifyReply,
    FastifyRequest, 
    RouteOptions 
} from "fastify";

// Services, models, validators and interfaces
import {
    schemaValidator,
    createConversationValidator,
    conversationChangeTitleValidator,
    conversationMessageSendValidator
} from "../validators/conversation.validators";
import {
    ConversationError,
    ConversationResponse
} from "../interfaces/conversation.interface"
import {
    conversationCreateService,
    conversationChangeTitleService,
    conversationSendMessage
} from "../services/conversations.service"

export const conversationCreateController : RouteOptions = {
    method: 'POST',
    url: '/conversation',
    schema: createConversationValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) {
        const response : ConversationError | ConversationResponse = await conversationCreateService(<any>req.body, (<any>req).user);

        return response;
    }
};

export const conversationChangeTitleController : RouteOptions = {
    method: 'PATCH',
    url: '/conversation/title',
    schema: conversationChangeTitleValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) {
        const response : ConversationError | ConversationResponse = await conversationChangeTitleService(<any>req.body, (<any>req).user);

        return response;
    }
};

export const messageSendController : RouteOptions = {
    method: 'POST',
    url: '/conversation/messagfe',
    schema: conversationMessageSendValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) {
        const response : ConversationError | ConversationResponse = await conversationSendMessage(<any>req.body, (<any>req).user);

        return response;
    }
};