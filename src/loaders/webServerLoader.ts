// Modules
import fastify, { 
    FastifyInstance, 
    FastifyRequest, 
    RouteOptions, 
    FastifyReply 
} from "fastify";
import fs, { appendFile } from "fs";

// Import another Loaders
import webSocketLoader from './websocketLoader';

/**
 * @async
 * @name loadRoutes
 * @description Load route controllers from controllers folder
 * @param {FastifyInstance} server Fastify instance to insert routes into
 * @returns {Promise<void>}
 */
async function loadRoutes(server : FastifyInstance) : Promise<void> {
    /*
        Filter files to fetch and return only files with .js suffix, typescript compiler turns our typescript files
        into regular javascript ones because otherwise node.js interpreter would not be able to run it
    */
    const files : Array<String> = await fs.readdirSync("./dist/routes/controllers/").filter(
        el => el.endsWith('.js')
    );
    
    // Loop through every file and register each route from array as fastify route controller
    files.forEach(async file => {
        try {
            const content : Array<RouteOptions> = require(`../routes/controllers/${file}`);

            content.forEach(route => {
                server.route({
                    url: route.url,
                    method: route.method,
                    schema: route.schema,

                    validatorCompiler: function schemaValidator({ schema } : any) {
                        return (data : any) => schema.validate(data);
                    },

                    async handler(req : FastifyRequest, res : FastifyReply) : Promise<void> {
                        if(route.method === 'GET' || route.method === 'DELETE') {
                            await (<any>route).service(req.query, (<any>req).user, res);
                        } else {
                            await (<any>route).service(req.body, (<any>req).user, res);
                        }
                    }
                });

                console.log(`[ROUTES] Succefully registered route {${route.method}} -> ${route.url}`);
            });

        } catch(err) {
            console.log("[ROUTES] Error while fetching route from file -> " + file)
            return;
        }
    });
};

/**
 * @async
 * @name loadMiddleware
 * @description Load middlewares, validators and other important things that we need
 * to run the whole app corectly
 * @param {FastifyInstance} server Fastify instance to insert middleware into
 * @returns {Promise<void>}
 */
async function loadMiddleware(server : FastifyInstance) : Promise<void> { 
    server.register(require("@fastify/cors"), {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH']
    });
    server.register(require("../middleware/token.middleware"));
    server.register(require("../middleware/restrict.middleware"));
    server.register(require("fastify-socket.io"), {
        cors: {
            origin: true,
            methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH']
        }
    });
};

/**
 * @async
 * @export
 * @name startWebserver
 * @descripion Initialize and start new Fastify instance
 * @returns {Promise<void>}
 */
export default async function startWebserver() : Promise<void> {
    const server = fastify();

    await loadRoutes(server);
    await loadMiddleware(server);
    
    const PORT = process.env.PORT ?? 3000;

    server.listen(PORT, () => {
        console.log(`[WEBSERVER] Webserver started on port *${PORT}!`);
    });

    await webSocketLoader(<any>server);
};