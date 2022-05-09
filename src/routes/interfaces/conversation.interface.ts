import { Types } from "mongoose";

export interface ConversationResponse {
    success: boolean;
}

export interface ConversationError {
    error: string;
    statusCode: number;
}

export interface ConversationCreateBody {
    _id: Types.ObjectId;
}

export interface ConversationChangeTitleBody {
    _id: Types.ObjectId;
    title: string;
}

export interface ConversationSendMessageBody {
    _id: Types.ObjectId;
    textContent: string;
}

export interface ConversationDeleteMessageBody {
    _id: Types.ObjectId,
    messageId: Types.ObjectId
}