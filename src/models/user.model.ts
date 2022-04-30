import { Schema, model } from "mongoose";

export interface User {
    name: string;
    surname: string;
    phone?: number;
    password: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

const userSchema : Schema = new Schema({
    name: {
        type: String,
        min: 3,
        max: 32,
        required: true
    },

    surname: {
        type: String,
        min: 3,
        max: 32,
        required: true
    },

    phone: {
        type: String,
        required: false,
        unique: false,
        min: 9,
        max: 32
    },

    password: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        unique: true,
        min: 5,
        max: 255,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: new Date()
    },

    updatedAt: {
        type: Date,
        immutable: true,
        default: new Date()
    }
});

export const User = model("User", userSchema);