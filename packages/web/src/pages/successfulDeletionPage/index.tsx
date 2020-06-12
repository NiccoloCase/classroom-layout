import React, { useState, ChangeEvent } from "react";
import { useLocation, Link } from "react-router-dom";
import "./DeletedClassroomPage.scss";
import { primaryColor } from "../../styles/variables.scss";
import icon from "../../assets/images/sucess-tick.svg"
import Select, { StylesConfig } from 'react-select'
import makeAnimated from 'react-select/animated';
import { TitleComponent } from '../../components/TitleComponent';
import { useValueValidation, validateFeedbackTextarea } from '../../helper';
import { useSendFeedbackMutation } from '../../generated/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { UnauthorizedComponent } from '../../components/errorComponents';

// SELECT INPUT
const animatedComponents = makeAnimated();

const feedbackOptions = [
    { value: 'Poche funzionalità', label: 'Poche funzionalità' },
    { value: 'Un solo account per email', label: 'Un solo account per email' },
    { value: 'Servizio non di aiuto', label: 'Servizio non di aiuto' },
    { value: 'Scarsa possibilità di personalizzazione', label: 'Scarsa possibilità di personalizzazione' },
    { value: 'Applicazione troppo instabile', label: 'Applicazione troppo instabile' },
    { value: 'Problemi riguardo la visualizzazione della propria classe ', label: 'Problemi riguardo la visualizzazione della propria classe ' },
    { value: 'OTHER', label: 'Altro' }
];

const customStyles: StylesConfig = {
    container: styles => ({
        ...styles,
        paddingBottom: "0.5rem"
    }),
    control: styles => ({
        ...styles,
        borderRadius: 2,
        '&:hover': {
            borderColor: primaryColor,
            boxShadow: `0 0 0 0.5px ${primaryColor}`
        },
        border: '1px solid lightgray',
        boxShadow: 'none',
    }),
    menu: (styles) => ({
        ...styles,
        borderRadius: 2
    })
}

export const DeletedClassroomPage: React.FC = () => {
    const [selectValues, setSelectValues] = useState<Array<{ value: string, label: string }> | null>([]);
    // Textarea
    const [textareaValue, setTextareaValue] = useState("");
    const [textareaValidation, validateTextarea] = useValueValidation(validateFeedbackTextarea);
    // Graphql
    const [sendFeedback, sendFeedbackResult] = useSendFeedbackMutation();
    // Router
    const location = useLocation<{ email?: string, classroomName?: string }>();
    if (!location.state || !location.state.email || !location.state.classroomName)
        return <UnauthorizedComponent />

    const onTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setTextareaValue(value);
        validateTextarea(value);
    }

    const submitFeedback = async () => {
        if (Array.isArray(selectValues) && selectValues.length > 0) {
            const selectedValues = selectValues.map(v => v.value);
            let textField: string = "";

            // rimove, se presente, il valore OTHER
            const val = selectedValues.find(v => v === "OTHER");
            if (val) {
                const index = selectedValues.indexOf(val);
                if (index >= 0) {
                    selectedValues.splice(index, 1);
                    textField = textareaValue;
                }
            }

            if (selectedValues.length !== 0 || !val || textField.length !== 0)
                await sendFeedback({
                    variables: {
                        email: location.state.email!,
                        selectedValues,
                        textField: textField.length > 0 ? textField : null
                    }
                });
        }
    }

    const userCanSendFeedback = (): boolean => {
        if (Array.isArray(selectValues) && selectValues.length > 0) {
            const selectedValues = selectValues.map(v => v.value);
            let textField: string = "";
            // rimove, se presente, il valore OTHER
            const val = selectedValues.find(v => v === "OTHER");
            if (val) {
                const index = selectedValues.indexOf(val);
                if (index >= 0) {
                    selectedValues.splice(index, 1);
                    textField = textareaValue;
                }
            }
            if (selectedValues.length !== 0 || !val || textField.length !== 0)
                return true;
            return false;
        }
        return false;
    }

    return (
        <div className="DeletedClassroomPage">
            <TitleComponent title="Classe eliminata con successo" />
            <div className="container">
                <div className="top">
                    <img src={icon} alt="success" />
                </div>
                <div className="bottom">
                    <h2 className="title">La classe è stata eliminata con successo!</h2>
                    <p className="subtitle">
                        Abbiamo portato a termine la tua richiesta di soppressione  della classe
                        {" "}<em>{location.state.classroomName}</em>.
                        <br />
                        Contiamo che tu possa ritornare ad usare il nostro servizio al più presto possibile.
                    </p>
                    {sendFeedbackResult.data && sendFeedbackResult.data.sendFeedback.success ?
                        <div className="feedback-success">
                            <FontAwesomeIcon icon={faCheck} />
                            <h4>Grazie per il feedback</h4>
                        </div> :
                        <div className="feedback">
                            <p>Ci risulterebbe molto utile, al fine di contribuire al miglioramento l'esperienza d'uso della nostra applicazione, se lasciassi un feedback fornendoci maggiori informazioni riguardo il motivo di questa decisione. Puoi selezionare una o più motivazioni:</p>
                            <Select
                                isMulti
                                options={feedbackOptions}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                onChange={setSelectValues}
                                styles={customStyles}
                                placeholder="Seleziona..."
                            />
                            {selectValues && selectValues.find(option => option.value === "OTHER") &&
                                (<div className="textarea">
                                    <textarea
                                        id="feedback-textarea"
                                        rows={4}
                                        value={textareaValue}
                                        onChange={onTextareaChange}
                                        placeholder="Specifica la ragione (non presente tra quelle elencate) per la quale hai deciso di eliminare la classe" />
                                    <label htmlFor="feedback-textarea">{textareaValidation.msg}</label>
                                </div>)
                            }
                            <button
                                className="submit-feedback"
                                onClick={submitFeedback}
                                disabled={!userCanSendFeedback()}>
                                Invia il feedback
                            </button>
                        </div>
                    }
                    <div className="links">
                        <Link className="new-btn" to="/new">
                            Crea una nuova classe
                        </Link>
                        <Link className="home-btn" to="/landing">
                            Vai alla home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}