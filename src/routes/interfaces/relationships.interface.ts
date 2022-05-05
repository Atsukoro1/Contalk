import { ObjectId } from "mongoose";

export interface RelationshipsRequestBody {
    _id: ObjectId
};

export interface RelationshipsResponse {
    success: boolean;
};

export interface RelationshipsError {
    error: string;
    statusCode: number;
};