import { IConfiguration } from "./config.type";

export const developmentKeys: IConfiguration = {
    APP_NAME: "Classroom layout",
    isProduction: false,
    server: {
        PORT: 5000,
        WEB_APP_DOMAIN: "localhost:3000"
    },
    database: {
        URI: "mongodb://admin:AdminDatabas3@ds029585.mlab.com:29585/classroom_layout-dev"
    },
    emailService: {
        SENDER: "caselli.niccolo.developer@gmail.com",
        USER: "99a61f513d831fec7bfba6640a0c12a8",
        PASSWORD: "ad581a019ce95184be38f92de87e359d"
    }
}

