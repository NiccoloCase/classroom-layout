import * as React from "react";
import { isEmpty } from "lodash";
import { Classroom, MutationEditClassroomArgs, Omit } from '../../../../generated/graphql';
import { TabsEditsErrors } from '.';
// validazione
import { useValueValidation, validateClassroomName, validateClassroomEmail } from '../../../../helper';

interface EditInfoTabProps {
    /** Classe */
    classroom: Classroom;
    /** Modifiche */
    edits: MutationEditClassroomArgs;
    /** Funzione che manda al componente parente le modifiche apportate */
    sendEdits: (edits: Omit<MutationEditClassroomArgs, "id">, errors?: TabsEditsErrors | boolean) => void;
}

export const EditInfoTab: React.FC<EditInfoTabProps> = ({ sendEdits, edits, classroom }) => {
    const [nameValidation, validateName] = useValueValidation(validateClassroomName);
    const [emailValidation, validateEmail] = useValueValidation(validateClassroomEmail);

    React.useEffect(() => {
        // valida i valori se non sono vuoti 
        if (edits.name && !isEmpty(edits.name)) validateName(edits.name);
        if (edits.email && !isEmpty(edits.email) && edits.email !== classroom.email)
            validateEmail(edits.email);
    }, []);

    /**
     * Funzione chiamata quando avviene nel campo del nome
     */
    const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // validazione
        const { hasPassed } = await validateName(value);
        if (hasPassed) sendEdits({ name: value }, false);
        else sendEdits({ name: value }, true);
    }

    /**
     * Funione chiamata quando avviene nel campo dell'email
     */
    const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // salta la validazione se l'email è rimasta invariata
        if (value === classroom.email)
            return sendEdits({ email: value }, false);
        // validazione
        const { hasPassed } = await validateEmail(value);
        if (hasPassed) sendEdits({ email: value }, false);
        else sendEdits({ email: value }, false);
    }

    return (
        <div className="edit-info-tab">
            <div className="fields">
                <div className="field">
                    <label htmlFor="name-input" className="section-title">Nome della classe</label>
                    <input type="text" value={edits.name!} id="name-input" onChange={handleNameChange} placeholder="Nome della classe" />
                    {nameValidation.msg && <h5>{nameValidation.msg}</h5>}
                </div>
                <div className="field">
                    <label htmlFor="email-input" className="section-title">Email asscoiata</label>
                    <input type="email" value={edits.email!} id="email-input" onChange={handleEmailChange} placeholder="Email associata alla classe" />
                    {emailValidation.msg && <h5>{emailValidation.msg}</h5>}
                </div>
            </div>
        </div>
    );
}