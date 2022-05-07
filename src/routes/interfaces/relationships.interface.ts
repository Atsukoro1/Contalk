import { Types } from "mongoose";

export interface RelationshipsRequestBody {
    _id: Types.ObjectId
};

export interface RelationshipsResponse {
    success: boolean;
};

export interface RelationshipsError {
    error: string;
    statusCode: number;
};