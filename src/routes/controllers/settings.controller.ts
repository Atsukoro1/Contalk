// Modules
import { 
    FastifyReply,
    FastifyRequest,
    RouteOptions 
} from "fastify";
import Joi from "joi";

// Service & Interfaces
import { 
    SettingsResponse, 
    SettingsError 
} from "routes/interfaces/settings.interface";
import { 
    settingsService 
} from "routes/services/settings.service";

export const settingsController : RouteOptions = {
    url: '/settings', 
    method: 'POST',
    schema: {
        body: Joi.object({
            password: Joi.string().required().min(8),
            newName: Joi.string().optional().min(3).max(32),
            newSurname: Joi.string().optional().min(3).max(32),
            newEmail: Joi.string().optional().email().min(5).max(255),
            newPhone: Joi.string().optional().min(9).max(32),
            newPassword: Joi.string().optional().min(8).max(1024)
        })
    },

    validatorCompiler: ({ schema } : any) => {
        return data => schema.validate(data)
    },

    async handler(req : FastifyRequest, res : FastifyReply) : Promise<SettingsError | SettingsResponse> {
        // @ts-ignore
        const response = await settingsService(req.body);

        return response;
    }
};