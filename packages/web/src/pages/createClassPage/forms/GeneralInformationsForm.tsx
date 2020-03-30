import * as React from 'react'
import validator from "validator";
import { useIsEmailAlreadyUsedLazyQuery } from '../../../generated/graphql';

interface GeneralInformationsFormProps {
    storeValues: (classroomName: string | null, email: string | null, id?: number | string) => void;
    id?: number | string;
}

export const GeneralInformationsForm: React.FC<GeneralInformationsFormProps> = ({ storeValues, id }) => {
    const [name, setName] = React.useState("");
    const [nameError, setNameError] = React.useState<string | null | undefined>(undefined);
    const [email, setEmail] = React.useState("");
    const [emailError, setEmailError] = React.useState<string | null | undefined>(undefined);

    // Controlla che l'email non sia già stata utilizzata
    const [checkEmail, { data }] = useIsEmailAlreadyUsedLazyQuery();

    React.useEffect(() => {
        if (data && data.isEmailAlreadyUsed) {
            setEmailError("L'email è già associata a un account");
            storeValues(null, null, id);
        }
    }, [data])


    // Funzione chiamata ogni volta che i valori di "name" e di "email" si aggiornano
    React.useEffect(() => {
        // Invia al form parente i valori dei campi
        if (emailError === null && nameError === null) storeValues(name, email, id);
        else storeValues(null, null, id);
    }, [name, email]);

    /**
     * Validazione del campo del nome della classe
     * @param value Nome della classe
     */
    const validateName = (value: string) => {
        if (validator.isEmpty(value)) setNameError("Questo campo è richisto")
        else if (!validator.isLength(value, { min: 2 })) setNameError("Il nome è troppo corto");
        else if (!validator.isLength(value, { max: 20 })) setNameError("Il nome è troppo lungo");
        else setNameError(null);
    }

    /**
     * Validazione del campo della email
     * @param value Email
     */
    const validateEmail = (value: string) => {
        if (validator.isEmpty(value)) setEmailError("Questo campo è richisto")
        else if (!validator.isEmail(value)) setEmailError("E' richiesta un'email coretta");
        else setEmailError(null);
    }

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
        <div className="GeneralInformationsForm">
            <div className="inputs">
                <h1 className="subtitle">Fornisci le informazioni richieste:</h1>
                <div className="field">
                    <input type="text" name="name" className="input"
                        placeholder="Nome della nuova classe" value={name} onChange={onChange} />
                    <span className="error-text">{nameError}</span>
                </div>
                <div className="field">
                    <input type="email" name="email" className="input" placeholder="Email" value={email}
                        onChange={onChange} onBlur={() => checkEmail({ variables: { email } })} />
                    <span className="error-text">{emailError}</span>
                </div>
            </div>
            <div className="image">
                <img src={require("../../../assets/images/email.png")} />
                <p>L'email è necessaria soltanto in caso di perdita del profilo. Non sarà richiesta alcuna password.</p>
            </div>
        </div>
    )
}