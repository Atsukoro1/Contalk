import { Schema, model } from "mongoose";

export interface Browser {
    author: Schema.Types.ObjectId;
    userAgents: Array<string>;
    timeZone?: string;
    ipAddr?: string;
};

const browserSchema : Schema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: true
    },

    userAgents: [{
        type: String,
        min: 20,
        max: 1000,
        default: []
    }],

    timeZone: {
        type: String,
        min: 5,
        max: 128,
        required: false,
        default: []
    },

    ipAddr: {
        type: String,
        min: 8,
        required: false,
        max: 64
    }
});

export const Browser = model("Device", browserSchema);