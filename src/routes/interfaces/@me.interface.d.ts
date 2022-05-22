declare interface MeError {
    error: string;
}

declare interface MeResponse {
    user: object[],
    conversations: object[] | null,
    friendRequest: object[] | null
}