import { IConfiguration } from "./config.type";

const config: IConfiguration = (function (env) {

    switch (env) {
        case 'production':
            return require("./config_production").productionKeys;
        case 'test':
            return require("./config_development").developmentKeys;
        default:
            return require("./config_development").developmentKeys;
    }
})(process.env.NODE_ENV);

/**
 * Configurazione del progetto
 */
export default config;
