import { useState } from "react";
// import { isEmpty } from "lodash";
import { ValidationResult, ValidationHookResults, ValidationMethodType } from './types';

/**
 * Hook di validazione
 * @param validationMethod Funzione con la quale validare il valore passato
 */
export function useValueValidation<T>(validationMethod: ValidationMethodType<T>): ValidationHookResults<T> {
    // risultato della validazione
    const [validationOutcome, setValidationOutcome] = useState<ValidationResult>({ hasPassed: false });

    /**
     * Funzione che valida il parametro passato
     * @param value Valore da validare
     */
    async function validateValue(value: T, options?: { [key: string]: any }) {
        const validation = validationMethod(value, options);
        try {
            const result = await Promise.resolve(validation);
            setValidationOutcome(result);
            return result;
        }
        catch (err) {
            const result = { hasPassed: false };
            setValidationOutcome(result);
            return result;
        };
    }
    return [validationOutcome, validateValue];
}