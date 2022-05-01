import { 
    Schema, 
    Types,
    model
} from "mongoose";

export interface Relation {
    _id: Types.ObjectId,
    type: RelationType;
    creator: Types.ObjectId;
    target: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export enum RelationType {
    BLOCKED = "BLOCKED",
    FRIEND_REQUEST = "FRIEND_REQUEST",
    FRIENDS = "FRIENDS"
}

const newRelation : Schema<Relation> = new Schema({
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
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Relation = model<Relation>("Relation", newRelation)