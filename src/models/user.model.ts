import { 
    Schema,
    Types,
    model
} from "mongoose";

export interface User {
    _id: Types.ObjectId,
    type: string,
    name: string;
    surname: string;
    phone?: string;
    password: string;
    email: string;
    isActive: boolean;
    fullname: string;
    createdAt: Date;
    updatedAt: Date;
};

const userSchema : Schema<User> = new Schema({
    type: {
        type: String,
        enum: ['USER', 'ADMIN', 'BANNED'],
        default: 'USER'
    },

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
    }
},
{
    timestamps: true,
    versionKey: false
});

userSchema.virtual('fullname').get(function() : String {
    return this.name + this.surname;
});

export const User = model<User>("User", userSchema);