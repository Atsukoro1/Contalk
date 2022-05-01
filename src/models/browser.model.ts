import { 
    Schema, 
    Types,
    model
} from "mongoose";

export interface Browser {
    _id: Types.ObjectId,
    author: Types.ObjectId;
    userAgents: Types.Array<string>;
    timeZone: string;
    ipAddr?: string;
    createdAt: Date;
    updatedAt: Date;
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
}, {
    timestamps: true,
    versionKey: false
});

export const Browser = model<Browser>("Device", browserSchema);