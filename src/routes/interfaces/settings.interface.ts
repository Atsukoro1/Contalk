export interface SettingsError {
    statusCode : number;
    error: string;
};

export interface SettingsResponse {
    success: boolean;
};

export interface SettingsBody {
    [x: string]: any;
    password: string;
    newName?: string;
    newSurname?: string;
    newEmail?: string;
    newPhone?: string;
    newPassword?: string;
};