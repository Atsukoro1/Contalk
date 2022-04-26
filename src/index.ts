import dotenvLoader from "./loaders/dotenvLoader";
import databaseLoader from "./loaders/databaseLoader";
import webserverLoader from "./loaders/webServerLoader";

/**
 * @async
 * @description Program starts running in this function
 */
(async function() : Promise<void> {
    await dotenvLoader();
    await databaseLoader();
    await webserverLoader();
}());