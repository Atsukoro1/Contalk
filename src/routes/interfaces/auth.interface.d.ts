declare interface AuthError {
    statusCode : number;
    error: string;
}

declare interface AuthResponse {
    token: string;
    message: string;
    user: Object
}

declare interface AuthRegisterBody extends Record<string, any> {
    username: string; 
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: number;
}

declare interface AuthLoginBody extends Record<string, any> {
    email: string;
    password: string;
}