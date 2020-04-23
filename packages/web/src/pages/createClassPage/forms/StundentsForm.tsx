import * as React from 'react'
import * as _ from "lodash";
import validator from "validator";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons';
/** Numero massimo degli studenti */
const MAX_STDUENTS = 30;

const STUDENTS_TEST = ["Niccolò", "Iacopo", "Caio", "Sempronio"];

interface StundentsFormProps {
    storeValues: (students: null | string[], id?: number | string) => void;
    id: number | string;
    containerHeight?: number;
}

export const StundentsForm: React.FC<StundentsFormProps> = ({ storeValues, id, containerHeight }) => {
    const [students, setStudents] = React.useState<string[]>(STUDENTS_TEST);
    const [inputValue, setInputValue] = React.useState("");
    const [inputError, setInputError] = React.useState<string | null | undefined>(undefined);
    const studentsContainer = React.useRef<HTMLInputElement>(null);
    // Funzione chiamata ogni volta che avviene un cambiamneto nella lista degli studenti
    React.useEffect(() => {
        // SCROLL DOWN 
        if (studentsContainer && studentsContainer.current) {
            const wrapper = studentsContainer.current;
            const item = wrapper.childNodes[wrapper.childNodes.length - 1] as HTMLElement;
            if (item) {
                const count = item.offsetTop - wrapper.scrollTop - 60;
                wrapper.scrollBy({ top: count, left: 0, behavior: 'smooth' })
            }
        }
        // INVIA LE INFORMAZIONI ALL "PARENT CONTAINER"
        // controlla che il numero di studenti sia giusto
        if (students.length > 1 && students.length <= MAX_STDUENTS) storeValues(students, id);
        else storeValues(null, id);
    }, [students]);


    /**
     * Controlla se il valore passato è validto come nome di uno studente
     * @param value 
     */
    const validateInputBox = (value: string) => {
        if (validator.isEmpty(value)) setInputError("E' richiesto un nome");
        else if (!validator.isLength(value, { min: 3 })) setInputError("Il nome è troppo corto");
        else if (!validator.isLength(value, { max: 20 })) setInputError("Il nome è troppo lungo");
        else if (_.includes(students, value)) setInputError("Hai già aggiunto uno studente con questo nome");
        else setInputError(null);
    }

    /**
     * Restituisce un messagio in cui è detto il numero di studenti aggiunti
     */
    const studentsNumber = () => {
        if (students.length === 0) return "Non hai registarto ancora nessuno studente";
        if (students.length === 1) return "É presente 1 studente"
        if (students.length > MAX_STDUENTS) return "Hai registrato troppi studenti. Devi eliminarli alcuni"
        else return `Sono presenti ${students.length} studenti`
    }

    /**
     * Mosttra la "card" di uno studente 
     */
    const renderStudents = () => students.map((student, index) => (
        <div key={index} className="student-card">
            <span>{student}</span>
            <FontAwesomeIcon icon={faTimes} onClick={() => removeStudent(index)} />
        </div>
    ));

    /**
     * Rimuove uno studente
     * @param index Numero dello studente ada rimuovere
     */
    const removeStudent = (index: number) => {
        const array = [...students];
        array.splice(index, 1);
        setStudents(array);
    }

    /**
     * Aggiunge un nuovo studente
     */
    const addStudent = () => {
        if (inputValue.length <= 1) return;
        const array = [...students];
        const newStudent = inputValue;
        array.push(newStudent);
        setStudents(array);
        setInputValue("");
    }


    return (
        <div className="StudentsForm" style={{ height: containerHeight }}>
            <div className="left">
                <div className="subtitle">
                    <span className="number-circle">
                        <FontAwesomeIcon icon={faCircle} />
                        <strong className="number-circle__number">2</strong>
                    </span>
                    <h4>Registra gli studenti presenti nella classe:</h4>
                </div>
                <div className="input-box">
                    <div className="field">
                        <input
                            type="text" className="input" placeholder="Cognome dello studente"
                            value={inputValue}
                            onChange={e => {
                                setInputValue(e.target.value);
                                validateInputBox(e.target.value)
                            }}
                            onKeyPress={e => { if (e.key === "Enter") addStudent() }} />
                    </div>
                    <button
                        onClick={addStudent}
                        disabled={inputError !== null}
                        title={inputError !== null ? inputError : undefined}>
                        Aggiungi
                    </button>
                </div>
                <span>{studentsNumber()} </span>
            </div>
            <div className="right" ref={studentsContainer as any}>
                {renderStudents()}
            </div>
        </div>
    )
}
