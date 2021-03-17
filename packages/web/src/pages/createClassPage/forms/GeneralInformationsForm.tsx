import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import image from "../../../assets/images/pc-email.svg";

// validazione
import { useValueValidation, validateClassroomName, validateClassroomEmail } from '../../../helper';

interface GeneralInformationsFormProps {
    storeValues: (classroomName: string | null, email: string | null, id?: number | string) => void;
    id: number | string;
    containerHeight?: number;
}

export const GeneralInformationsForm: React.FC<GeneralInformationsFormProps> = ({ storeValues, id, containerHeight: height }) => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [nameValidation, validateName] = useValueValidation(validateClassroomName);
    const [emailValidation, validateEmail] = useValueValidation(validateClassroomEmail);

    // Funzione chiamata al cambiamento dei valori del form
    React.useEffect(() => {
        // Invia al form parente i valori dei campi
        if (emailValidation.hasPassed && nameValidation.hasPassed) storeValues(name, email, id);
        else storeValues(null, null, id);
    }, [name, email, nameValidation, emailValidation]);

    /**
     * Funzione chiamata ogni volta avviene una modifica in una casella di testp
     */
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target } = e;
        if (target.name === "name") {
            setName(target.value);
            validateName(target.value);
        }
        else if (target.name === "email") {
            setEmail(target.value);
            validateEmail(target.value);
        }
    }

    return (
        <div className="GeneralInformationsForm" style={{ height }}>
            <div className="inputs">
                <div className="subtitle">
                    <span className="number-circle">
                        <FontAwesomeIcon icon={faCircle} />
                        <strong className="number-circle__number">1</strong>
                    </span>
                    <h4>Fornisci le informazioni richieste:</h4>
                </div>
                <div className="fields">
                    <div className="field">
                        <input type="text" name="name" className="input"
                            placeholder="Nome della nuova classe" value={name} onChange={onChange} />
                        <h5 className="error-text">{nameValidation.msg}</h5>
                    </div>
                    <div className="field">
                        <input type="email" name="email" className="input" placeholder="Email"
                            value={email} onChange={onChange} />
                        <h5 className="error-text">{emailValidation.msg}</h5>
                    </div>
                </div>
            </div>
            <div className="image">
                <div className="img-wrapper">
                    <img src={image} />
                </div>
                <p className="paragraph">È richiesta un'email valida nell’eventualità di avere la necessità do recuperare l’ID della classe associata.</p>
            </div>
        </div>
    )
}