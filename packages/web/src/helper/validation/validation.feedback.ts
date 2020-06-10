import validator from "validator";
import { ValidationResult } from "./types";

/**
 * Valida il valore del'aria di testo di un feedbeck
 * @param value Valore dell'area di testo
 */
export const validateFeedbackTextarea = (value: string): ValidationResult => {
    /** Messaggio di errore */
    let msg = "";

    if (!validator.isLength(value, { max: 200 })) msg = "Il feedback è troppo lungo";
    else return { hasPassed: true };
    return { hasPassed: false, msg };
}

