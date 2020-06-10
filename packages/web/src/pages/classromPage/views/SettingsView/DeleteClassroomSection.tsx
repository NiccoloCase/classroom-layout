import React, { useState, useEffect } from "react";
import { Popup } from '../../../../components/PopupComponent';
import { InputCode } from '../../../../components/InputCodeComponent';
import { useRequestClassroomDeletionMutation, useDeleteClassroomMutation } from '../../../../generated/graphql';
import { DotLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faChevronRight, faChevronLeft, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { GraphQLError } from '../../../../../../../node_modules/graphql';

interface DeleteClassroomSectionProps {
    classID: string;
    className: string;
    classEmail: string;
}

// lungehzza del token di verifica
const TOKEN_LENGTH = 9;

export const DeleteClassroomSection: React.FC<DeleteClassroomSectionProps> =
    ({ classID: id, classEmail, className }) => {
        // cronologia 
        const history = useHistory();
        // valore del token dell'input 
        const [tokenValue, setTokenValue] = useState("");
        // form
        const [currentForm, setCurrentForm] = useState(0);
        //  tempo che deve passare prima che il client possa rispedire l'email
        const [timeLeft, setTimeLeft] = useState<number | null>(null);
        // se il popup per l'eliminazione della classe è aperto
        const [isDeletionPopupOpen, setIsDeletionPopupOpen] = useState(false);
        // GRAPHQL
        const [sendtoken, sendTokenResult] = useRequestClassroomDeletionMutation();
        const [deleteClassroom, deleteClassroomResult] = useDeleteClassroomMutation();

        useEffect(() => {
            if (timeLeft === 0) setTimeLeft(null)
            if (!timeLeft) return;
            const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearInterval(intervalId);
        }, [timeLeft]);

        /**
         * Funziona chimata quando viene inserito  il code di verifica 
         */
        const onCodeTyped = async (token: string) => {
            const { errors, data } = await deleteClassroom({ variables: { token } });
            if (data && !errors)
                history.push("/deleted-classroom", { email: classEmail, classroomName: className });
        }

        /**
         * Funzione che richiede al server di inviare al client l'email con il token
         */
        const sendEmail = async () => {
            // manda l'email
            await sendtoken({ variables: { id } });
            // imposta un timer che deve trascorrere prima che l'utente possa spedire un altra email
            setTimeLeft(30);
        }

        /**
         * Renderizza in modo dinamico il contenuto del pulsante per mandare il token
         */
        const renderSendTokenButtonContent = () => {
            const { data, loading } = sendTokenResult;

            if (loading) return (
                <>
                    Invia
                <div className="spinner" >
                        <DotLoader color="#404040" size="1rem" />
                    </div>
                </>
            );
            else if (data && !!timeLeft) return <> Rinvia {timeLeft}</>
            return (
                <>
                    {data ? "Rinvia" : "Invia"}
                    <FontAwesomeIcon icon={faPaperPlane} />
                </>
            )
        }

        /**
         * Renderizza un eventuale messaggio di errore
         */
        const rendeErrorMessage = () => {
            // messaggio di errore
            let msg: string | null;
            // errore
            let error: GraphQLError | null;

            if (currentForm === 0 && sendTokenResult.error)
                error = sendTokenResult.error.graphQLErrors[0];
            else if (currentForm === 1 && tokenValue.length === TOKEN_LENGTH && deleteClassroomResult.error)
                error = deleteClassroomResult.error.graphQLErrors[0];
            else
                error = null;

            if (error &&
                error.extensions &&
                error.extensions.exception.response &&
                error.extensions.exception.response) {
                const { statusCode } = error.extensions.exception.response;
                if (statusCode >= 400 && statusCode < 500) {
                    // BAD REQUEST
                    msg = currentForm === 0 ?
                        "C’è stato un problema che ci ha impedito di mandare l’email. Prova più tardi." :
                        "Il codice passato non è valido: potrebbe essere scaduto o già utilizzato"
                } else
                    // INTERNAL SERVER ERROR
                    msg = "Non è possibile portare a termine l'operazione. Prova più tardi."
            }
            // NESSUN ERRORE
            else return null;

            return (
                <span className="error-msg">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {msg}
                </span>
            );
        }

        const renderCurrentForm = () => {
            switch (currentForm) {
                case 0:
                    return (
                        <div>
                            <p>Per completare l'operazione è necessario eseguire una verifica tramite un codie che verrà mandato all'email associta alla classe.</p>
                            <div>
                                <button
                                    className="send-btn"
                                    onClick={sendEmail}
                                    disabled={!!timeLeft || sendTokenResult.loading} >
                                    {renderSendTokenButtonContent()}
                                </button>
                                <button
                                    className="forward-btn"
                                    onClick={() => { setCurrentForm(1); setTokenValue(""); }}>
                                    {sendTokenResult.data ?
                                        "Ho ricevuto il codice" :
                                        "Ho già il codice"}
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                            {rendeErrorMessage()}
                        </div>
                    );
                case 1:
                    return (
                        <div>
                            <p>Inserisci il codice di verifica ricevuto tramite email nella sezione sottostante:</p>
                            <div className="token-input">
                                <InputCode
                                    cellsNumber={TOKEN_LENGTH}
                                    onCompleted={onCodeTyped}
                                    onType={setTokenValue} />
                            </div>
                            {rendeErrorMessage()}
                            <button
                                className="back-btn" onClick={() => setCurrentForm(0)}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                                Torna indietro
                        </button>
                        </div>
                    );
                default:
                    return null;
            }
        }

        return (
            <section className="delete-classroom-section">
                <button className="delete-btn"
                    onClick={() => setIsDeletionPopupOpen(!isDeletionPopupOpen)}>
                    Elimina classe
            </button>
                {/*POP-UP PER LA VERIFICA DELL'EMAIL */}
                <Popup isOpen={isDeletionPopupOpen} setIsOpen={setIsDeletionPopupOpen} title="Elimina la classe" className="verification-popup">
                    {renderCurrentForm()}
                </Popup>
            </section>
        );
    }