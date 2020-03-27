export interface IConfiguration {
    /** Se l'istanza è in produzione */
    isProduction: boolean,
    server: {
        /** Porta del server */
        PORT: number;
        /** Dominio del server */
        DOMAIN: string;
    },
    database: {
        /** URI di conessione al server */
        URI: string;
    }
}