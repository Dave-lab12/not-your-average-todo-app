import {createServer} from "./utils/createServer";
import {logger} from "./utils/logger";
import {config} from "./utils/config";
import {connectToDb, disconnectDb} from "./utils/db";
import {constants} from "os";

const signals = ["SIGINT", "SIGTERM", "SIGHUP"]

async function gracefulShutdown({signal, server}: {
    signal: typeof signals[number],
    server: Awaited<ReturnType<typeof createServer>>
}) {
    logger.info(`Got Signal ${signal}. Good bye`)
    await server.close()
    await disconnectDb()
    process.exit(0)
}

async function startServer() {
    const server = await createServer();

    await server.listen({
        port: config.PORT,
        host: config.HOST
    })
    await connectToDb()
    logger.info("App is listening")
    for(let i = 0;i<signals.length;i++){
        process.on(signals[i],()=> gracefulShutdown({
            signal:signals[i],
            server
        }))
    }
}

startServer()