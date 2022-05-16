declare interface RelationshipsRequestBody {
    _id: string;
}

declare interface RelationshipsFindUsersRequestBody {
    searchString: string;
}

declare interface RelationshipsResponse {
    success: boolean;
}

declare interface RelationshipsError {
    error: string;
}