// Services, models & Interfaces
import { 
    SettingsBody,
    SettingsError,
    SettingsResponse
} from "../interfaces/settings.interface";
import { User } from "../../models/user.model";

export async function settingsService(
    body : SettingsBody 
) : Promise<SettingsError | SettingsResponse> {
    return {
        success: true
    }
};