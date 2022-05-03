// Modules
import fastify, { FastifyInstance, RouteOptions } from "fastify";
import fs from "fs";

/**
 * Load route controllers from controllers folder
 * Param - {FastifyInstance} server Fastify instance to insert routes into
 * Returns {Promise<void>}
 */
async function loadRoutes(server : FastifyInstance) : Promise<void> {
    const files : Array<String> = await fs.readdirSync("./dist/routes/controllers/").filter(
        el => el.endsWith('.js')
    );
    
    files.forEach(async file => {
        const content : Array<RouteOptions> = require(`../routes/controllers/${file}`);
        
        Object.keys(content).forEach((el : any) : void => {
            server.route(content[el]);
        });
    });
};

/**
 * Load middlewares, validators and other important things that we need
 * to run the whole app corectly
 * Param - {FastifyInstance} server Fastify instance to insert middleware into
 * Returns {Promise<void>}
 */
async function loadMiddleware(server : FastifyInstance) : Promise<void> { 
    server.register(require("../middleware/token.middleware"));
    server.register(require("../middleware/restrict.middleware"));
    server.register(require("@fastify/cors"));
};

/**
 * Initialize and start new Fastify instance
 * Returns {Promise<void>}
 */
export default async function startWebserver() : Promise<void> {
    const server = fastify();

    await loadRoutes(server);
    await loadMiddleware(server);
    
    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
        console.log(`[WEBSERVER] Webserver started on port *${PORT}!`);
    });
};