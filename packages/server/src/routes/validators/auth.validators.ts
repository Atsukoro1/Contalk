import Joi from "joi"

export const loginValidator = {
    body: Joi.object({
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required()
    })
}

export const registerValidator = {
    body: Joi.object({
        username: Joi.string().min(3).max(42).alphanum().required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required(),
        name: Joi.string().min(3).max(32).alphanum().required(),
        surname: Joi.string().min(3).max(32).alphanum().required()
    })
}