import { IConfiguration } from "./config.type";

const config: IConfiguration = (function (env) {

    switch (env) {
        case 'production':
            return require("./config_production").productionKeys;
        case 'test':
            return require("./config_development").developmentKeys;
        default:
            try {
                // controlla che il modulo esista 
                const dev = require("./config_development");
                return dev.developmentKeys;
            }
            catch (e) {
                console.error("it is not possible to load the configuration module for development");
            }
    }
})(process.env.NODE_ENV);

/**
 * Configurazione del progetto
 */
export default config;
