import { IConfiguration } from "./config.type";

export const developmentKeys: IConfiguration = {
    APP_NAME: "Classroom layout",
    isProduction: false,
    server: {
        PORT: 5000
    },
    database: {
        URI: "mongodb://admin:AdminDatabas3@ds029585.mlab.com:29585/classroom_layout-dev"
    }
}

