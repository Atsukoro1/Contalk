import EnvLoader from "./loaders/dotenvLoader";
import DbLoader from "./loaders/databaseLoader";
import WsLoader from "./loaders/webServerLoader";

/**
 * @async
 * @description Program starts running in this function
 */
(async function() : Promise<void> {
    await EnvLoader();
    await DbLoader();
    await WsLoader();
}());