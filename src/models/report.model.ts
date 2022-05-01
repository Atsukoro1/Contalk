import { 
    Schema, 
    model, 
    Document 
} from "mongoose";

export interface Report extends Document {
    creator: Schema.Types.ObjectId;
    target: Schema.Types.ObjectId;
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
    timestamps: true
});

export const Report = model<Report>("Report", reportSchema);