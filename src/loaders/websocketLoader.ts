// Libraries
import { 
    FastifyInstance 
} from 'fastify';
import {
    Server as SocketServer, 
    Socket
} from 'socket.io';
import { 
    Document,
    Types 
} from "mongoose";

// Modules, types and interfaces
import { User } from '../models/user.model';

// Socket validation middleware
import socketValidation from "../middleware/socketToken.middleware";

/*
    IO Socket server instance that we are using to send messages to
    another connected socket
*/
export let io : SocketServer | null = null;

/*
    We'll store all connected users here.
    All users will be stored in format mongoose_object_id => socket_id

    We're using this because when we need to get socket_id to send message to for example
    we will need the socket id but the only thing we have is mongoose object id so we'll convert it
*/
export const connectedUsers : Map<string, string> = new Map();

/**
 * @export
 * @async
 * @name emitEvent
 * @description Emits a message to another connected socket,
 * we're using this function primary in routes because we don't have
 * access to the fastify server instance there.
 * @param {Types.ObjectId} userId 
 * @param {Socket} socket 
 * @param {string} event 
 * @param {string} data 
 * @returns {Promise<void>}
 */
export async function emitEvent(
    userId: Types.ObjectId,
    event: string,
    data: any
) : Promise<void> {
    const sendTo : string | undefined = connectedUsers.get(userId.toString());
    if(!sendTo || io === null) return;

    await io.to(sendTo)
    .emit(event, data);
}

/*
    We need to extend some interfaces in order to have correct typings in our IDE
*/
interface FastifyServer extends FastifyInstance {
    io: SocketServer
};

interface SocketConnection extends Socket {
    user: User & Document
};

/**
 * @async
 * @name setUserActivity
 * @description Set user online status to false or true based on if is socket online
 * @param {User & Document} user User object
 * @param {boolean} online If User is online
 * @returns {Promise<void>}
 */
async function setUserActivity(user : User & Document, online : boolean) : Promise<void> {
    await user.updateOne({
        isActive: online ? true : false
    });
}

/**
 * @async
 * @default
 * @exports
 * @description We'll handle the socket server start and connecting using
 * a middleware from another folder
 * @param {FastifyServer} server Fastify server instance extended by
 * the socket server
 * @returns {Promise<void>}
 */
export default async function(server : FastifyServer) : Promise<void> {
    await server.ready();
    io = server.io;

    server.io.use(socketValidation);
    
    server.io.on('connection', async(socket : SocketConnection) => {
        await setUserActivity(socket.user, true);
        connectedUsers.delete(socket.user._id.toString());
        connectedUsers.set(socket.user._id.toString(), socket.id);

        socket.on('disconnect', async() => {
            await setUserActivity(socket.user, false);
            connectedUsers.delete(socket.user._id.toString());
        });
    });
}