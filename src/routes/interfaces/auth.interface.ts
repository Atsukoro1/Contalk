import { FastifyRequest } from "fastify";
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

export interface AuthRegisterBody {
    username: string; 
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: number;
};

export interface AuthLoginBody {
    email: string;
    password: string;
};

export interface LoginRequest extends FastifyRequest {
    body: AuthLoginBody
};

export interface RegisterRequest extends FastifyRequest {
    body: AuthRegisterBody
};