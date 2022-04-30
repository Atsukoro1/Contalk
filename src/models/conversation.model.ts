import { Schema, model } from "mongoose";

export interface Conversation {
    title?: String;
    creator: Schema.Types.ObjectId;
    recipient: Schema.Types.ObjectId;
    channedId: Number;
    createdAt: Date;
    updatedAt: Date;  
};

const conversationSchema : Schema = new Schema({
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
    },

    createdAt: {
        type: Date,
        default: new Date(),
        immutable: true,
        required: false
    },

    updatedAt: {
        type: Date,
        default: new Date(),
        required: false
    }
});

export const Conversation = model("Conversation", conversationSchema);