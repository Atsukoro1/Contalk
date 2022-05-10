declare interface ReportError {
    statusCode : number;
    error: string;
}

declare interface ReportResponse {
    success: boolean;
}

declare interface ReportBody {
    _id: string;
    reason: string;
}