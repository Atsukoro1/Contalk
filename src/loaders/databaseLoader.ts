import mongoose from "mongoose";

/**
 * Estabilish connection with Mongoose database
 * Returns {Promise<void>}
 */
export default async function startDatabase() : Promise<void> {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`[DATABASE] Database connected!`);
        return;
    } catch(err) {
        console.log(`[DATABASE] There was a problem while estabilishing connectio ${err}`);
        return;
    }
};