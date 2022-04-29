// Interfaces
import { AuthErrorI, AuthResponseI } from "../interfaces/auth.interface";

export async function loginService() : Promise<AuthResponseI | AuthErrorI> {
    return {
        message: "Ahoj! Prosel jsi",
        statusCode: 429,
        errors: "zmrde!"
    };
};

export async function registerService() : Promise<AuthResponseI | AuthErrorI> {
    return {
        message: "Ahoj! Prosel jsi",
        statusCode: 429,
        errors: "zmrde!"
    };
};