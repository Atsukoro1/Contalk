declare interface SettingsError {
    error: string;
}

declare interface SettingsResponse {
    success: boolean;
}

declare interface SettingsBody {
    [x: string]: any;
    password: string;
    newName?: string;
    newSurname?: string;
    newEmail?: string;
    newPhone?: string;
    newPassword?: string;
}