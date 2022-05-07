import { Types } from "mongoose";

export interface ConversationResponse {
    success: boolean;
}

export interface ConversationError {
    error: string;
    statusCode: number;
}

export interface ConversationCreateBody {
    _id: Types.ObjectId
}