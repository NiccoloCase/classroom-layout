import { IConfiguration } from "./config.type";

const config: IConfiguration = (function (env) {
    switch (env) {
        case 'production':
            return require("./config_production").productionKeys;
        default:
            try {
                // controlla che il modulo esista 
                const dev = require("./config_development");
                return dev.developmentKeys;
            }
            catch (e) {
                console.error("It is not possible to load the configuration module for development");
                return {};
            }
    }
})(process.env.NODE_ENV);

/**
 * Configurazione del progetto
 */
export default config;
