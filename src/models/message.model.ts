import { 
    Schema, 
    model, 
    Document 
} from "mongoose";

export enum MessageType {
    POSTED = 1,
    DELETED = 2,
    EDITED = 3
};

export interface Message extends Document {
    content: string;
    author: Schema.Types.ObjectId;
    conversation: Schema.Types.ObjectId;
    messageType: MessageType;
    createdAt: Date;
    updatedAt: Date;
    isUpdated: boolean;
};

const messageSchema : Schema<Message> = new Schema({
    content: {
        type: String,
        min: 1,
        max: 1024,
        required: true
    },

    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: false
    },

    conversation: {
        types: Schema.Types.ObjectId,
        required: true,
        ref: "Conversation",
        unique: false
    },

    messageType: {
        type: Number,
        default: MessageType.POSTED,
        enum: MessageType
    },

    isUpdated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const Message = model<Message>("Message", messageSchema);
