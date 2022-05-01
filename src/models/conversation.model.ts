import { 
    Schema, 
    model, 
    Document 
} from "mongoose";

export interface Conversation extends Document {
    title?: string;
    creator: Schema.Types.ObjectId;
    recipient: Schema.Types.ObjectId;
    channedId: number;
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
        ref: "User",
        unique: false
    },

    recipient: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User",
        unique: false
    }
}, {
    timestamps: true
});

export const Conversation = model<Conversation>("Conversation", conversationSchema);