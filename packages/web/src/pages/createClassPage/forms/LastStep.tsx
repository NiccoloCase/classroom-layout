import * as React from "react";
import VisibilitySensor from "react-visibility-sensor";
import { useCreateClassroomMutation, DeskInput } from '../../../generated/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckSquare, faCopy, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

interface LastStepProps {
    name?: string;
    email?: string;
    desks?: DeskInput[];
    students?: string[];
}

export const LastStep: React.FC<LastStepProps> = ({ name, email, desks, students }) => {
    const idInput = React.useRef<HTMLInputElement>(null);
    // GRAPQHL
    const [addClass, { data, error }] = useCreateClassroomMutation();

    // For the development
    /* 
    name = "shsih";
    email = Math.random() * 100 + "abc@gmail.com";
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
                    <p>
                        L'ID riportato sotto è quello associato alla classe appena creata ed è indispensabile per accedervi. <br /> Nel caso in cui sia perso, è comunque possibile ottenerne un altro tramite l'email inserita in fase di registrazione.
                    </p>
                    <span className="id-box">
                        <input type="text" value={id} ref={idInput} readOnly />
                        <button onClick={copyId}><FontAwesomeIcon icon={faCopy} /> </button>
                    </span>
                    <br />
                    <button className="class-link-button">
                        <Link to={`/${id}`}>Vai alla classe</Link>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            );
        }

        // CARICAMENTO
        else return (
            <div className="loading-box">
                <FadeLoader color="#dadfe1" />
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