// Interfaces, services & Models
import {
    ConversationError,
    ConversationResponse,
    ConversationCreateBody
} from "../interfaces/conversation.interface"
import { User } from "../../models/user.model";

export async function conversationCreateService(
    body : ConversationCreateBody
) : Promise<ConversationError | ConversationResponse> {
    return {
        error: "bruh momentus",
        statusCode: 400
    };
};