// Libraries
import {
    Socket
} from "socket.io";
import {
    verify
} from "jsonwebtoken";

// Models and interfaces
import { User } from "../models/user.model";

/**
 * @async 
 * @export 
 * @name validateSocket
 * @description Validates socket and returns a true otherwise throws error message
 * @param {Socket} socket a Socket connection estabilished between our server and client
 * @returns {Promise<boolean | Error>}
 */
async function validateSocket(socket : Socket) : Promise<boolean | Error> {
    // A token storing _id and iat of user we estabilished connection with
    const token : string | undefined = socket.handshake.query.token?.toString();
    if(!token) return new Error("Please provide an authentication token!");

    try {
        const validated = verify(token, process.env.JWT_SECRET);
        const user : User & Document | null = await User.findById((<any>validated)['_id']);
        (<any>socket).user = user;

        if(!user ?? user.type === 'BANNED') {
            throw new Error();
        };

        return true;
    } catch(err : unknown) {
        return new Error("You don't have access to this service!");
    }
};

/**
 * @async
 * @export
 * @default
 * @description A socket validation function that allows only registered users using 
 * the socket to receive messages, friend requests, etc...
 * @param socket 
 * @param next 
 */
export default async function(socket : Socket, next: () => void) : Promise<void> {
    const validation = await validateSocket(socket);

    if(typeof(validation) === 'boolean') {
        return next();
    } else {
        // @ts-ignore
        return next(validation);
    };
};