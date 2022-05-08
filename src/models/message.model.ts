import { 
    Schema, 
    model,
    Types
} from "mongoose";

export enum MessageType {
    POSTED = 1,
    DELETED = 2,
    EDITED = 3
};

export interface Message {
    _id: Types.ObjectId,
    content: string;
    author: Types.ObjectId;
    conversation: Types.ObjectId;
    messageType: MessageType;
    createdAt: Date;
    updatedAt: Date;
    isUpdated: boolean;
    deletedFromSender: boolean;
    deletedFromReceiver: boolean;
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
        type: Schema.Types.ObjectId,
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
    },

    deletedFromSender: {
        type: Boolean, 
        default: false
    },

    deletedFromReceiver: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Message = model<Message>("Message", messageSchema);
