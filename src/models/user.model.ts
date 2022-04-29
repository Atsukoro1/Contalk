import { Schema, model } from "mongoose";

export enum UserStatusE {
    ONLINE = "ONLINE",
    DND = "DND",
    IDLE = "IDLE",
    OFFLINE = "OFFLINE"
};

export interface UserI {
    username: String;
    password: String;
    email: String;
    status: String;
};

const newUser : Schema = new Schema({
    username: {
        type: String,
        min: 3,
        max: 42,
        required: true
    },

    password: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: Number,
        required: true,
        unique: true,
        min: 5,
        max: 255
    },

    status: {
        type: String,
        enum: Object.values(UserStatusE),
        default: "ONLINE",
        required: false
    }
});

export const UserModel = model("User", newUser);