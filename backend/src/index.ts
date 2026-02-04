import 'dotenv/config'
import Fastify from "fastify";
import cors from '@fastify/cors'

import {dealsRoutes} from './routes/deals'
import {watchRulesRoutes} from './routes/watchRules'
console.log("Checking DB URL:", process.env.DATABASE_URL);
const app = Fastify({logger:true})

await app.register(cors, {origin: true})
await app.register(dealsRoutes);
await app.register(watchRulesRoutes);

app.get("/", async () => {
    return {message: "YOU MADE IT TO THE HOMEPAGE"}
})

app.get("/health", async () => {
    return {status: "ok"}
})



const start = async () => {
    try {
        await app.listen({ port: 3001, host: "0.0.0.0"})
        console.log("app running on port http://localhost:3001")
    } catch (err) {
        app.log.error(err);
        process.exit(1)
    }
}

start();
