import fastify, { FastifyInstance, RouteOptions } from "fastify";
import fs from "fs";

/**
 * @async
 * @name loadRoutes
 * @description Load route controllers from controllers folder
 * @param {FastifyInstance} server Fastify instance to insert routes into
 * @returns {Promise<void>}
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
 * @async
 * @name loadMiddleware
 * @description Load middlewares, loggers and some other important things 
 * to run the whole application successfully
 * @param {FastifyInstance} server Fastify instance to insert middleware into
 * @returns {Promise<void>}
 */
async function loadMiddleware(server : FastifyInstance) : Promise<void> {
    server.register(require("@fastify/cors"));
};

/**
 * @default
 * @async
 * @name startWebserver
 * @description Initialize and start new Fastify instance
 * @returns {Promise<void>}
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