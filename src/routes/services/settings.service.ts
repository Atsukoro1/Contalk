import { 
    SettingsBody,
    SettingsError,
    SettingsResponse
} from "routes/interfaces/settings.interface";

export async function settingsService(
    body : SettingsBody 
) : Promise<SettingsError | SettingsResponse> {
    return {
        success: true
    }
};