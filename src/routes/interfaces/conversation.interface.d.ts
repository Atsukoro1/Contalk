declare interface ConversationResponse {
    success: boolean;
}

declare interface ConversationError {
    error: string;
}

declare interface ConversationCreateBody {
    _id: string;
}

declare interface ConversationChangeTitleBody {
    _id: string;
    title: string;
}

declare interface ConversationSendMessageBody {
    _id: string;
    textContent: string;
}

declare interface ConversationDeleteMessageBody {
    _id: string,
    messageId: string
}

declare interface ConversationEditMessageBody {
    _id: string,
    messageId: string,
    textContent: string
}