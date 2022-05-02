// Interfaces, services & Models
import { 
    AuthError,
    AuthLoginBody, 
    AuthRegisterBody, 
    AuthResponse 
} from "../interfaces/auth.interface";
import { User } from "../../models/user.model";

// Modules
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

export async function loginService(body : AuthLoginBody) : Promise<AuthResponse | AuthError> {
    const existingUser = await User.findOne({ email: body.email });
    if(!existingUser) {
        return {
            error: "User with this email does not exist!",
            statusCode: 400
        };
    };

    const passMatch = await argon2.verify(existingUser.password, body.password);
    if(!passMatch) {
        return {
            error: "Password does not match!",
            statusCode: 400
        };
    };

    const token = await jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET);

    return {
        message: "Welcome back!",
        token: token,
        user: existingUser
    };
};

export async function registerService(body : AuthRegisterBody) : Promise<AuthResponse | AuthError> {
    const existingUser = await User.findOne({ email: body.email });
    if(existingUser) {
        return {
            error: "User with this email already exists!",
            statusCode: 400
        };
    };

    body.password = await argon2.hash(body.password);

    const newUser = new User(body);
    newUser.save();

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);

    return {
        message: "Thank you for registering!",
        token: token,
        user: newUser
    };
};