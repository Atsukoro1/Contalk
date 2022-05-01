import { 
    Schema, 
    Types,
    model
} from "mongoose";

export interface Report {
    _id: Types.ObjectId,
    creator: Types.ObjectId;
    target: Types.ObjectId;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
};

const reportSchema : Schema<Report> = new Schema({
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
}, {
    timestamps: true,
    versionKey: false
});

export const Report = model<Report>("Report", reportSchema);