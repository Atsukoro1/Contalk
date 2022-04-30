import { Schema, model } from "mongoose";

export interface Report {
    createdAt: Date;
    creator: Schema.Types.ObjectId;
    target: Schema.Types.ObjectId;
    reason: string;
};

const reportSchema = new Schema({
    createdAt: {
        type: Date,
        default: new Date()
    },

    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: "User"
    },

    target: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: "User"
    },

    reason: {
        type: String,
        required: true,
        min: 32,
        max: 1024
    }
});

export const Report = model("Report", reportSchema);