/**
 * Risultato della validazione
 */
export interface ValidationResult {
    /** Se la validazione è passata */
    hasPassed: boolean;
    /** Messaggio di errore */
    msg?: string | null;
};

/**
 * Valore restituito della hook di validazione
 */
export type ValidationHookResults<T> = [
    ValidationResult, (value: T, options?: { [key: string]: any }) => Promise<ValidationResult>
];

/**
 * Tipo dellqqa funzione nella quale deve essere contenuta la logica di validazione 
 */
export type ValidationMethodType<T> = (value: T, options?: { [key: string]: any })
    => ValidationResult | Promise<ValidationResult>;