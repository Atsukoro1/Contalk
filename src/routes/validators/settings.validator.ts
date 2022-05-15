import Joi from "joi";

export const settingsValidator = {
    body: Joi.object({
        password: Joi.string().required().min(8),
        newName: Joi.string().optional().min(3).max(32),
        newSurname: Joi.string().optional().min(3).max(32),
        newEmail: Joi.string().optional().email().min(5).max(255),
        newPhone: Joi.string().optional().min(9).max(32),
        newPassword: Joi.string().optional().min(8).max(1024)
    })
};
