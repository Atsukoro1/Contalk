import fastify from "fastify";
import { HTTPMethods } from "fastify";

// Routes
import { registerRoute } from "../routes/auth";

/**
 * @async
 * @name startWebserver
 * @description Prepare important middleware and then start webserver
 * @returns {Promise<void>}
 */
export default async function startWebserver() : Promise<void> {
    // Initializing new Fastify instance
    const server = fastify();

    server.route(registerRoute);
    
    // Server will start listening on specific port
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`[WEBSERVER] Webserver started on port *${PORT}!`);
    });

    return;
};