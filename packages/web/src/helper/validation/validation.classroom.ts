import validator from "validator";
import { includes } from "lodash";
import { ValidationResult } from "./types";
// GRAPHQL
import { client as apolloClient } from '../../graphql';
import { isEmailAlreadyUsedQuery } from '../../graphql/documents/classroom';
import { IsEmailAlreadyUsedQuery } from '../../generated/graphql';

/**
 * Valida il valore del nome di una classe
 * @param value Nome della classe
 */
export const validateClassroomName = (value: string): ValidationResult => {
    /** Messaggio di errore */
    let msg = "";

    if (validator.isEmpty(value)) msg = "Questo campo è richisto";
    else if (!validator.isLength(value, { min: 2 })) msg = "Il nome è troppo corto";
    else if (!validator.isLength(value, { max: 20 })) msg = "Il nome è troppo lungo";
    else return { hasPassed: true };
    return { hasPassed: false, msg };
}

/**
 * Valida il valore dell'EMAIL associata a una classe
 * @param value Email
 */
export const validateClassroomEmail = async (value: string, options: { allowAlreadyUsedEmail?: string } = {}): Promise<ValidationResult> => {
    /** Messaggio di errore */
    let msg = "";

    if (validator.isEmpty(value)) msg = "Questo campo è richisto";
    else if (!validator.isEmail(value)) msg = "È richiesta un'email coretta";
    else {
        if (!options.allowAlreadyUsedEmail) {
            // Controlla che l'email non sia già stata utilizzata
            const { data } = await apolloClient.query<IsEmailAlreadyUsedQuery>({
                query: isEmailAlreadyUsedQuery, variables: { email: value }
            });
            if (data.isEmailAlreadyUsed) msg = "L'email è già associata a un altra classe";
            // validazione passata con successo
            else return { hasPassed: true };
        }
        // validazione passata con successo
        else return { hasPassed: true };
    }
    // restituisce gli errori della validazione
    return { hasPassed: false, msg };
}

/**
 * Valida il valore del nome di uno studente 
 * @param value Nome / cognome dello studente 
 */
export const validateClassroomStudentName = async (value: string, options?: { students?: string[] }): Promise<ValidationResult> => {
    /** Messaggio di errore */
    let msg = "";

    if (validator.isEmpty(value)) msg = "E' richiesto un nome";
    else if (!validator.isLength(value, { min: 3 })) msg = "Il nome è troppo corto";
    else if (!validator.isLength(value, { max: 20 })) msg = "Il nome è troppo lungo";
    else if (options && options.students && includes(options.students, value))
        msg = "Hai già aggiunto uno studente con questo nome";
    // validazione passata con successo
    else return { hasPassed: true };
    // restituisce gli errori della validazione
    return { hasPassed: false, msg };
}