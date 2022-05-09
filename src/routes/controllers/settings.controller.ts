import { 
    settingsService 
} from "../services/settings.service";
import { 
    settingsValidator
} from "../validators/settings.validator";

module.exports = [
    {
        url: '/settings', 
        method: 'POST',
        schema: settingsValidator,
        service: settingsService
    }
];