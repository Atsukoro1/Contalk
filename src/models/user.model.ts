import { Schema, model } from "mongoose";

export interface UserI {
    name: String;
    surname: String;
    phone?: Number;
    password: String;
    email: String;
    isActive: Boolean;
    isReported: Boolean;
    isBlocked: Boolean;
    createdAt: Date;
    updatedAt: Date;
};

const newUser : Schema = new Schema({
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
        type: Number,
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

    isBlocked: {
        type: Boolean,
        default: false
    },

    isReported: {
        type: Boolean,
        default: false
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

export const UserModel = model("User", newUser);