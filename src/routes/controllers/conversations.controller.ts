// Services, models, validators and interfaces
import {
    createConversationValidator,
    conversationChangeTitleValidator,
    conversationMessageSendValidator,
    conversationMessageDeleteValidator,
    conversationMessageEditValidator
} from "../validators/conversation.validators";
import {
    conversationCreateService,
    conversationChangeTitleService,
    conversationSendMessage,
    conversationDeleteMessage,
    conversationMessageEditService
} from "../services/conversations.service"

module.exports = [
    {
        method: 'PATCH',
        url: '/conversation/message',
        schema: conversationMessageEditValidator,
        service: conversationMessageEditService
    },
    {
        method: 'DELETE',
        url: '/conversation/message',
        schema: conversationMessageDeleteValidator,
        service: conversationDeleteMessage
    },
    {
        method: 'POST',
        url: '/conversation/message',
        schema: conversationMessageSendValidator,
        service: conversationSendMessage
    },
    {
        method: 'PATCH',
        url: '/conversation/title',
        schema: conversationChangeTitleValidator,
        service: conversationChangeTitleService
    },
    {
        method: 'POST',
        url: '/conversation',
        schema: createConversationValidator,
        service: conversationCreateService
    }
];