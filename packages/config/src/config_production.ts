import { IConfiguration } from "./config.type";

export const productionKeys: IConfiguration = {
    isProduction: true,
    server: {
        PORT: Number(process.env.PORT!),
        DOMAIN: process.env.DOMAIN!
    },
    database: {
        URI: process.env.MONGO_URI!
    }
}

