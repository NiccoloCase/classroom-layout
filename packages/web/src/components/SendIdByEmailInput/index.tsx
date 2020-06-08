import React, { useState, useEffect, FormEvent, ReactNode } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from "lodash";
import * as classnames from "classnames";
import { useValueValidation, validateClassroomEmail } from '../../helper';
import { useSendClassroomIdByEmailMutation, useIsEmailAlreadyUsedLazyQuery } from '../../generated/graphql';
import { DotLoader } from '../../../../../node_modules/react-spinners';

export const SendIdByEmailInput = () => {
    const [emailValidation, validateEmail] = useValueValidation(validateClassroomEmail);
    const [email, setEmail] = useState("");
    //  tempo che manca prima che si possa spedrire un'altra email
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    // GRAPQHL
    const [checkIfEmailIsAlreadyUsed, checkIfEmailIsAlreadyUsedResponse] = useIsEmailAlreadyUsedLazyQuery();
    const [sendEmail, { data, error, loading }] = useSendClassroomIdByEmailMutation();

    useEffect(() => {
        if (timeLeft === 0) setTimeLeft(null)
        if (!timeLeft) return;

        const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const submit = async () => {
        // invia l'email
        await sendEmail({ variables: { email } });
        // imposta un timer che deve trascorrere prima che l'utente possa spedire un altra email
        setTimeLeft(30);
    }

    /**
     * Funzione chiamata ogni volta che il valore del campo dell'email cambia
     */
    const handleEmailChange = async (e: FormEvent<HTMLInputElement>) => {
        const newEmail = e.currentTarget.value;
        setEmail(newEmail);
        const { hasPassed } = await validateEmail(newEmail, { allowAlreadyUsedEmail: true });
        if (hasPassed && !isEmpty(email)) checkIfEmailIsAlreadyUsed({ variables: { email: newEmail } });
    }

    /**
     * Verifica che l'email passata sia valida
     */
    const isEmailVaid = () => {
        if (checkIfEmailIsAlreadyUsedResponse.loading) return false;
        if (checkIfEmailIsAlreadyUsedResponse.data)
            return emailValidation.hasPassed && checkIfEmailIsAlreadyUsedResponse.data.isEmailAlreadyUsed
        return emailValidation.hasPassed;
    }


    /**
     * Renderizza il testo sotto l'input box. Può essere un messaggio di successo o uno di errore
     */
    const renderText = () => {
        // messaggio di errore
        let warning: string | null | ReactNode = null;
        // qualsiasi altro messaggio 
        let msg: string | null | ReactNode = null;

        // 1) Controlla se ci sono degli errori
        // casella vuota
        if (isEmpty(email)) warning = null;
        // email non corretta formalmente
        else if (!emailValidation.hasPassed && email.length !== 0)
            warning = "L'email passata non è corretta";
        // email non associata a nessuna classe
        else if (
            checkIfEmailIsAlreadyUsedResponse.data && !checkIfEmailIsAlreadyUsedResponse.data.isEmailAlreadyUsed)
            warning = "L'email non è associata a nessuna classe";
        // errore durante il l'invio dell'email
        else if (error) warning = "Qualcosa è andato storto, riprova più tardi.";

        // 2) se non ci sono errori imposta altri eventuali messaggi da mostarre al client
        else {
            // se l'email è stata inviata con successo
            if (data && data.sendClassroomIdByEmail.recipient === email)
                msg = (
                    <>
                        <FontAwesomeIcon icon={faCheck} />
                        <strong>Email inviata</strong>
                    </>
                );
        }

        // aggiune un icona al messaggio di errore
        if (warning) warning = (
            <>
                <FontAwesomeIcon icon={faExclamationCircle} />
                {warning}
            </>
        );

        // mostra l'eventuale messaggio
        return (
            <span style={{ opacity: (msg || warning) ? 1 : 0 }} className={classnames({ error: warning })}>
                {msg ? msg : (warning ? warning : ".")}
            </span>
        );
    }

    /**
     * Renderizza in modo dinamico il contenuto del bottone di submit
     */
    const renderButtonContent = () => {
        if (loading) return (
            <>
                Invia
                <div className="spinner" >
                    <DotLoader color="#404040" size="1rem" />
                </div>
            </>
        );
        else if (!!timeLeft) return <> Rinvia {timeLeft}</>
        return (
            <>
                {data && data.sendClassroomIdByEmail.recipient === email ? "Rinvia" : "Invia"}
                <FontAwesomeIcon icon={faPaperPlane} />
            </>
        )
    }

    return (
        <div className="email-input">
            <p>Se hai dimenticato l'ID puoi sempre recuperarlo con l'email che hai utilizzato in fase di registrazione della classe. Inseriscila nella capo sottostante e ti verrà mando l'ID della tua classe per email</p>
            <div className="input-box">
                <input type="email" placeholder="Email associata alla classe" value={email} onChange={handleEmailChange} />
                <button disabled={!!timeLeft || !isEmailVaid()} onClick={submit}>
                    {renderButtonContent()}
                </button>
            </div>
            {renderText()}
        </div>
    );
}