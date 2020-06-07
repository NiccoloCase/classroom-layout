export interface IConfiguration {
    /** Nome dell'applicazione */
    APP_NAME: string,
    /** Se l'istanza è in produzione */
    isProduction: boolean,
    server: {
        /** Porta del server */
        PORT: number;
        /** Dominio della webapp */
        WEB_APP_DOMAIN: string;
    },
    database: {
        /** URI di conessione al server */
        URI: string;
    },
    emailService: {
        /** Dominio dell'email */
        SENDER: string;
        /** Utente dell'API */
        USER: string;
        /** Password dell'API */
        PASSWORD: string;
    }
}