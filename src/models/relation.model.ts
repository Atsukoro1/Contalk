import { Schema, model } from "mongoose";

export interface Relation {
    type: RelationType;
    creator: Schema.Types.ObjectId;
    target: Schema.Types.ObjectId;
    createdAt: Date;
};

export enum RelationType {
    BLOCKED = "BLOCKED",
    FRIEND_REQUEST = "FRIEND_REQUEST",
    FRIENDS = "FRIENDS"
}

const newRelation : Schema = new Schema({
    type: {
        type: String,
        required: true,
        eval: Object.values(RelationType)
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    target: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        immutable: true,
        default: new Date()
    }
});

export const Relation = model("Relation", newRelation)