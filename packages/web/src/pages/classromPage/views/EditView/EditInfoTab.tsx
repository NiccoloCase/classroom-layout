import * as React from "react";
import { Classroom, MutationEditClassroomArgs, Omit } from '../../../../generated/graphql';
import { TabsEditsErrors } from '.';

interface EditInfoTabProps {
    /** Classe */
    classroom: Classroom;
    /** Modifiche */
    edits: MutationEditClassroomArgs;
    /** Funzione che manda al componente parente le modifiche apportate */
    sendEdits: (edits: Omit<MutationEditClassroomArgs, "id">, errors?: TabsEditsErrors) => void;
}

export const EditInfoTab: React.FC<EditInfoTabProps> = ({ sendEdits, edits }) => {

    /**
     * Funzione chiamata quando avviene nel campo del nome
     */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // setName(value);
        if (value.length < 3)
            sendEdits({ name: value }, { name: true });
        else sendEdits({ name: value }, { name: false });
    }

    /**
     * Funione chiamata quando avviene nel campo dell'email
     */
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // setEmail(value);
        if (value.length < 3)
            sendEdits({ email: value }, { email: true });
        else sendEdits({ email: value }, { email: false });
    }

    return (
        <div className="edit-info-tab">
            <div className="fields">
                <div className="field">
                    <label htmlFor="name-input" className="section-title">Nome della classe</label>
                    <input type="text" value={edits.name!} id="name-input" onChange={handleNameChange} />
                </div>
                <div className="field">
                    <label htmlFor="email-input" className="section-title">Email asscoiata</label>
                    <input type="email" value={edits.email!} id="email-input" onChange={handleEmailChange} />
                </div>
            </div>
        </div>
    );
}