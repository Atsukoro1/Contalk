import { Types } from "mongoose";

export interface ReportError {
    statusCode : number;
    error: string;
};

export interface ReportResponse {
    success: boolean;
};

export interface ReportBody {
    _id: Types.ObjectId;
    reason: string;
};