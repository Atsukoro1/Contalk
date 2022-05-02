import { User } from "models/user.model";

export interface AuthError {
    statusCode : number;
    error: string;
};

export interface AuthResponse {
    token: string;
    message: string;
    user: User
};

export interface AuthRegisterBody extends Record<string, any> {
    username: string; 
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: number;
};

export interface AuthLoginBody extends Record<string, any> {
    email: string;
    password: string;
};