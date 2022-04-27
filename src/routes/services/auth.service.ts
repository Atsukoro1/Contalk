import { AuthErrorI, AuthResponseI } from "../interfaces/auth.interface";

export async function loginService() : Promise<AuthResponseI | AuthErrorI> {
    return { 
        token: "dsijd",
        message: "dsds"
    };
};

export async function registerService() : Promise<AuthResponseI | AuthErrorI> {
    return {
        errors: ["dsd"]
    }
};