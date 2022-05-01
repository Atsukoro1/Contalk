import { 
    Schema, 
    model, 
    Document 
} from "mongoose";

export interface Browser extends Document {
    author: Schema.Types.ObjectId;
    userAgents: Array<string>;
    timeZone: string;
    ipAddr?: string;
};

const browserSchema : Schema<Browser> = new Schema({
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
        required: false
    },

    ipAddr: {
        type: String,
        min: 8,
        required: false,
        max: 64
    }
});

export const Browser = model<Browser>("Device", browserSchema);