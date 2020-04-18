import { IConfiguration } from "./config.type";

export const productionKeys: IConfiguration = {
    APP_NAME: "Classroom layout",
    isProduction: true,
    server: {
        PORT: Number(process.env.PORT!),
    },
    database: {
        URI: process.env.MONGO_URI!
    }
}

