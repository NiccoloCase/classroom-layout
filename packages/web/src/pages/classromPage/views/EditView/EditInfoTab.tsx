import * as React from "react";
import { Classroom, MutationEditClassroomArgs } from '../../../../generated/graphql';

interface EditInfoTabProps {
    /** classe */
    classroom: Classroom;
    /** Funzione che richiede al server il salvataggio delle modifiche */
    saveEdits: (edits: MutationEditClassroomArgs) => void;
}

export const EditInfoTab: React.FC<EditInfoTabProps> = ({ classroom, saveEdits }) => {
    // nome della classe
    const [name, setName] = React.useState(classroom.name);
    // email associata alla classe
    const [email, setEmail] = React.useState(classroom.email);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setName(value);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmail(value);
    }

    /**
     * Funzione chiamata al click del pulsante per salvare le modifiche
     */
    const handleSaveButton = () => {
        saveEdits({ name, id: classroom.id });
    }

    return (
        <div className="edit-info-tab">
            <div className="form">
                <div className="fields">
                    <div className="field">
                        <label htmlFor="name-input">Nome della classe</label>
                        <input type="text" value={name} id="name-input" onChange={handleNameChange} />
                    </div>
                    <div className="field">
                        <label htmlFor="email-input">Email asscoiata</label>
                        <input type="email" value={email} id="email-input" onChange={handleEmailChange} />
                    </div>
                </div>
            </div>
            <div className="functions">
                <button className="btn" title="Ripristina" >
                    ripristina
                </button>
                <button className="btn" title="Salva le modifiche" onClick={handleSaveButton}>
                    salva
                </button>
            </div>
        </div>
    );
}