import * as React from "react";
import { Classroom, MutationEditClassroomArgs, Omit } from '../../../../generated/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TabsEditsErrors } from '.';

interface EditStudentsTabProps {
    /** Classe */
    classroom: Classroom;
    /** Modifiche */
    edits: MutationEditClassroomArgs;
    /** Funzione che manda al componente parente le modifiche apportate */
    sendEdits: (edits: Omit<MutationEditClassroomArgs, "id">, errors?: TabsEditsErrors) => void;
}

export const EditStudentsTab: React.FC<EditStudentsTabProps> =
    ({ classroom, sendEdits, edits: { students, desks } }) => {
        const [inputValue, setInputValue] = React.useState("");

        /**
         * Funzione chimata ad ogni modifica di stato dell'input box
         */
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setInputValue(value);
        }

        /**
         * Aggiungi uno studente
         */
        const addStudent = () => {
            // aggiunge lo studente
            const array = [...students];
            array.push(inputValue);
            setInputValue("");
            // manda le modifiche con gli eventuali errori
            sendEdits({ students: array }, { desks: array.length !== desks!.length });
        }

        /**
         * Rimuove uno studente
         * @param index 
         */
        const removeStudent = (index: number) => {
            // rimuove lo studente
            const array = [...students];
            array.splice(index, 1);
            // manda le modifiche con gli eventuali errori
            sendEdits({ students: array }, { desks: array.length !== desks!.length });
        }

        /**
         * Mostra l'avviso al cambiamento del numero di studenti 
         */
        const renderChangelog = () => {
            if (!desks || !students) return;
            const studentsDiff = students.length - classroom.students.length;
            // mostra l'avviso solo se gli studenti sono stati cambiati e 
            // il numero di studenti non è uguale a quello di banchi
            if (studentsDiff !== 0 && desks.length !== students.length)
                return (
                    <div className="changelog">
                        <span>
                            {`Hai ${studentsDiff > 0 ? "aggiunto" : "rimosso"}
                    ${Math.abs(studentsDiff)} student${studentsDiff === 1 ? "e" : "i"}:`}
                        </span>
                        <h4> {studentsDiff > 0 ?
                            "Assicurati di disporre abbastanza banchi banchi per tutti." :
                            "Ricordati di elimiare i banchi superflui."
                        }</h4>
                    </div>
                );
            return null;
        }

        /**
         * Renderizza la lista di tutti gli studenti della classe
         */
        const renderStudents = () =>
            students!.map((student, i) => (
                <span key={i} className="student">
                    <span>{student}</span>
                    <FontAwesomeIcon icon={faTimes} onClick={() => removeStudent(i)} />
                </span>
            ));

        if (!students) return null;
        else return (
            <div className="edit-students-tab">
                <p className="section-title">
                    {students.length !== 0 ?
                        `La classe contiene ${students.length} student${students.length === 1 ? "e" : "i"}: ` :
                        `La classe non contiene studenti`
                    }
                </p>
                <div className="students-wrapper">
                    {renderStudents()}
                </div>
                <div className="bottom-section">
                    <div className="add-student-input" >
                        <p className="section-title">Aggiungi un nuovo studente alla classe:</p>
                        <div className="input-box">
                            <input type="text" placeholder="Cognome di un nuovo studente"
                                value={inputValue} onChange={handleInputChange}
                            />
                            <button onClick={addStudent}>Aggiungi</button>
                        </div>
                    </div>
                    {renderChangelog()}
                </div>
            </div>
        );
    }
