import { 
    Schema, 
    Types,
    model
} from "mongoose";

export interface Conversation {
    _id: Types.ObjectId,
    title?: string;
    creator: Types.ObjectId;
    recipient: Types.ObjectId;
    lastMessage: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const conversationSchema : Schema<Conversation> = new Schema({
    title: {
        type: String,
        min: 3,
        max: 40,
        required: false
    },

    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    recipient: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    lastMessage: {
        type: Schema.Types.ObjectId, 
        required: false,
        ref: "Message"
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Conversation = model<Conversation>("Conversation", conversationSchema);