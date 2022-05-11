// Third party libraries
import { FastifyReply } from "fastify";

// Interfaces, services & Models
import {
    User
} from "../../models/user.model";

// Modules
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

/**
 * @async
 * @name loginService
 * @description Route that let's users log in into their existing account
 * @param {AuthLoginBody} body - Request body of the request
 * @returns {Promise<AuthResponse | AuthError>}
 */
export async function loginService(
    body: AuthLoginBody,
    user: User,
    res: FastifyReply
): Promise <AuthResponse | AuthError> {
    const existingUser = await User.findOne({
        email: body.email
    });
    if (!existingUser) {
        return res.status(400).send({
            error: "User with this email does not exist!",
            statusCode: 400
        });
    };

    const passMatch = await argon2.verify(existingUser.password, body.password);
    if (!passMatch) {
        return res.status(400).send({
            error: "Password does not match!",
            statusCode: 400
        });
    };

    const token = await jwt.sign({
        _id: existingUser._id
    }, process.env.JWT_SECRET);

    return res.status(200).send({
        message: "Welcome back!",
        token: token,
        user: existingUser
    });
};

/**
 * @async
 * @name registerService
 * @description Route that lets users create new account for our service
 * @param {AuthRegisterBody} body - Body of the HTTP request 
 * @returns {Promise<AuthResponse | AuthError>}
 */
export async function registerService(
    body: AuthRegisterBody,
    user: User,
    res: FastifyReply
): Promise < AuthResponse | AuthError > {
    const existingUser = await User.findOne({
        email: body.email
    });

    if (existingUser) {
        return res.status(400).send({
            error: "User with this email already exists!",
            statusCode: 400
        });
    };

    body.password = await argon2.hash(body.password);

    const newUser = new User(body);
    newUser.save();

    const token = jwt.sign({
        _id: newUser._id
    }, process.env.JWT_SECRET);

    return res.status(400).send({
        message: "Thank you for registering!",
        token: token,
        user: newUser
    });
};