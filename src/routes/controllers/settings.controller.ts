// Modules
import { 
    FastifyReply,
    FastifyRequest,
    RouteOptions
} from "fastify";

// Service & Interfaces
import { 
    SettingsResponse, 
    SettingsError 
} from "../interfaces/settings.interface";
import { 
    settingsService 
} from "../services/settings.service";
import { 
    settingsValidator,
    schemaValidator 
} from "../validators/settings.validator";

export const settingsController : RouteOptions = {
    url: '/settings', 
    method: 'POST',
    schema: settingsValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) : Promise<SettingsError | SettingsResponse> {
        const response = await settingsService(<any>req.body, (<any>req).user);

        return response;
    }
};