// Modules, types and interfaces
import { 
    FastifyInstance 
} from 'fastify';
import {
    Server as SocketServer
} from 'socket.io';

// Socket validation middleware
import socketValidation from "../middleware/socketToken.middleware";

/*
    Extend FastifyInstance interface by SocketServer
*/
interface FastifyServer extends FastifyInstance {
    io: SocketServer
};

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

    server.io.use(socketValidation);
    
    server.io.on('connection', (socket) => {
        console.info('Socket connected!', socket.id);

        socket.on('disconnect', () => {
            console.info('Socket disconnected!', socket.id);
        });
    });
}