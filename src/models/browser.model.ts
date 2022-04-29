import { Schema, model } from "mongoose";

export interface Browser {
    userAgents: Array<String>;
    timeZone?: String;
    ipAddr?: String;
};

const browserSchema : Schema = new Schema({
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