export interface AuthErrorI {
    statusCode : Number;
    errors: String;
    message: String;
};

export interface AuthResponseI {
    token: String;
    message: String;
};