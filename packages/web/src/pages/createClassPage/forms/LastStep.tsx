import React, { useRef, useState } from "react";
import VisibilitySensor from "react-visibility-sensor";
import { useCreateClassroomMutation, DeskInput } from '../../../generated/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckSquare, faCopy, faChevronRight, faLink } from '@fortawesome/free-solid-svg-icons';
import { faSlackHash } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { DotLoader } from 'react-spinners';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import config from "@crl/config";

interface LastStepProps {
    name?: string;
    email?: string;
    desks?: DeskInput[];
    students?: string[];
}

export const LastStep: React.FC<LastStepProps> = ({ name, email, desks, students }) => {
    const idInput = useRef<HTMLInputElement>(null);
    const [isLinkShown, setIsLinkShown] = useState(false);
    // GRAPQHL
    const [addClass, { data, error }] = useCreateClassroomMutation();

    // TEST
    /*     name = "test";
        email = Math.random() * 100 + "test@gmail.com";
        desks = [{ x: 0, y: 0, orientation: 1 }, { x: 3, y: 3, orientation: 1 }];
        students = ["abcd", "abcde"]; */

    /**
     * Funzione chiamata quando il componente entra o esce dallo schermo
     * @param isVisible 
     */
    const onChange = (isVisible: boolean) => {
        if (isVisible && !data && name && email && desks && students)
            addClass({ variables: { name, email, desks, students } });
    }

    /**
     * Copia l'ID negli appunti
     */
    const copyId = () => {
        if (!idInput.current) return;
        idInput.current.select();
        document.execCommand("copy");
    }

    /**
     * Renderizza il contenuto giusto a seconda dell'esito della richiesta
     */
    const renderContent = () => {
        // ERRORE
        if (error) {
            const err = error.graphQLErrors[0];
            // errore sconosciuto
            let message = "Non ci è stato possibile completare le registrazione di una nuova classe. Riprova più tardi";
            // errore 400
            if (err && err.extensions && err.extensions.exception) {
                const status = err.extensions.exception.status;
                if (status === 400)
                    message = "Ci risulta che i dati inseriti non siano tutti validi. \n Controllali e riprova.";
            }
            return (
                <div className="error-box">
                    <h1><FontAwesomeIcon icon={faExclamationCircle} /> Abbiamo riscontrato un errore!</h1>
                    <div className="errors">
                        {message.split("\n").map((item, i) => <h3 key={i}>{item}</h3>)}
                    </div>
                </div>
            );
        }

        // OPERAZIONE RIUSCITA CON SUCCCESSO
        else if (data) {
            // disabilita il bottone per tornare in dientro
            (document.getElementById("btn-prev") as HTMLButtonElement).disabled = true;
            // ID della classe
            const { id } = data.createClassroom;

            return (
                <div className="success-box">
                    <h1><FontAwesomeIcon icon={faCheckSquare} /> La registrazione è andata a buon fine</h1>
                    <p className="paragraph">
                        L'ID (e il link) riportato sotto è quello associato alla classe appena creata ed è indispensabile per accedervi. <br /> Nel caso in cui sia perso, è comunque possibile ottenerne un altro tramite l'email inserita in fase di registrazione. <br /> È fondamentale che non sia divulgato a persone indesiderate, poiché tramite esso è possibile il controllo totale della classe, compresa l’eliminazione.
                    </p>
                    <span className="id-box">
                        <input type="text" readOnly ref={idInput}
                            value={isLinkShown ? `${config.server.WEB_APP_DOMAIN}/${id}` : id}
                        />
                        <button onClick={copyId} title={`Copia ${!isLinkShown ? "l'ID" : "il link"}`}>
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                        <button onClick={() => setIsLinkShown(!isLinkShown)}
                            title={`Mostra ${isLinkShown ? "l'ID" : "il link"}`}>
                            <FontAwesomeIcon icon={isLinkShown ? faSlackHash : faLink} />
                        </button>
                    </span>
                    <br />
                    <Link to={`/${id}`} className="class-link-button">
                        Vai alla classe
                        <FontAwesomeIcon icon={faChevronRight} />
                    </Link>
                </div>
            );
        }

        // CARICAMENTO
        else return (
            <div className="loading-box">
                <DotLoader color="#dadfe1" />
            </div>
        );
    }

    return (
        <VisibilitySensor onChange={onChange}>
            <div className="CreateClassPage__LastStep">
                <div className="subtitle">
                    <span className="number-circle">
                        <FontAwesomeIcon icon={faCircle} />
                        <strong className="number-circle__number">4</strong>
                    </span>
                    <h4>Ci siamo quasi!</h4>
                </div>
                {renderContent()}
            </div>
        </VisibilitySensor>
    );
}