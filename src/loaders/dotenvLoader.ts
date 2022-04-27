import dotenv from "dotenv";

/**
 * @async
 * @name binSearch
 * @description 
 * Recursive function that uses binary search algorithm to loop through 
 * process variables and check if variables that are required are defined
 * @param {String} toSearch String that we're searching for 
 * @param {Array<String>} field Array of strings to search in
 * @returns {Promise<Boolean>} If the element is in the array or not
 */
async function binSearch(toSearch: String, field: Array<String>): Promise<Boolean> {
    /*
        Define a middle index of the array and check if the wanted element is there    
    */
    const middle: number = Math.floor(field.length / 2);
    if (field[middle] === toSearch) {
        return true;
    };

    /*
        Check if string we are searching for is in the middle
    */
    if (field.length === middle) return false;

    if (toSearch.charCodeAt(0) < field[middle].charCodeAt(0)) {
        /* 
            String we're searching for is somewhere up the current location
        */
        return binSearch(toSearch, field.splice(0, middle));
    } else if (toSearch.charCodeAt(0) === field[middle].charCodeAt(0)) {
        /*
            String we're searching for is possibly somewhere near the middle
            There is high probability that the string in the middle is same ascii character
            as the one that we need, than only option that we can do is start cutting
            this array from the start
        */
        if (field[0] === toSearch) return true;
        return binSearch(toSearch, field.splice(1, field.length));
    } else {
        /*
            String we're searching for is somewhere down from the current location
        */
        return binSearch(toSearch, field.splice(middle, middle));
    }
};

/**
 * @async
 * @name checkForDotenvVars
 * @description Initialize dotenv and check if all variables in .env file are correctly defined
 * @returns {Promise<void>}
 */
export default async function checkForDotenvVars() : Promise<void> {
    await dotenv.config();

    const toCheck : Array<String> = [
        "MONGO_URI",
        "PORT"
    ];

    const envVars : Array<String> = [...Object.keys(process.env).sort()];

    toCheck.forEach(async(el : String) => {
        const found : Boolean = await binSearch(el, [...envVars]);

        if(found) {
            console.log(`[DOTENV] Variable ${el} successfully loaded.`);
        } else {
            console.log(`[DOTENV] Variable ${el} can't be found.`);
        }
    });

    return;
};