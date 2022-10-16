import * as mongoose from "mongoose";
import {config} from "./config";
import {logger} from "./logger";

export async function connectToDb() {
    try {
        await mongoose.connect(config.DATABASE_URL)
        logger.info("connected to database")
    } catch (e) {
        logger.error(e)
        process.exit(1)
    }
}

export function disconnectDb() {
    return mongoose.connection.close();
}