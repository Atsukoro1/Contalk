import { Schema, model } from "mongoose";

export interface Blocked {
    createdAt: Date;
    creator: Schema.Types.ObjectId;
    target: Schema.Types.ObjectId
};

const blockedSchema = new Schema({
    createdAt: {
        type: Date,
        default: new Date()
    },

    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: false
    },

    target: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: false
    },
});

export const Blocked = model("Blocked", blockedSchema);