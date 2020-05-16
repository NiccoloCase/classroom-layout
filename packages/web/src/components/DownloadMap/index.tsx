import * as React from "react";
import classnames from "classnames";
import { DeskInput } from '../../generated/graphql';
import styles from "./DownloadMap.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { SlideDown } from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import { ClassRoomMap, classroomMapColors, IClassroomMapColors } from '../ClassRoomMap';
import { useOutsideClickDetector } from '../../helper';

interface DownloadMapProps {
    desks: DeskInput[];
    students: string[];
    /** Funzione chiamata quando il pop-up deve essere chiuso */
    popupHasClosed?: () => void;
}

export const DownloadMapComponent: React.FC<DownloadMapProps> = ({ desks, students, popupHasClosed }) => {
    // tamplate dello stile scelto 
    const [styleOption, setStyleOption] = React.useState(0);
    // preview della mappa
    const template = React.useRef<ClassRoomMap | null>(null);
    // contenitore
    const container = React.useRef<HTMLDivElement | null>(null);
    // rivela quando il client clica al di fuori del pop-up 
    useOutsideClickDetector(container, closePopup);
    // colore riempimento dei banchi 
    const [desksFillColor, setDesksFillColor] = React.useState("#eeeeee");
    const [disableFill, setDisableFill] = React.useState(false);
    // colore dei bordi banchi 
    const [desksStrokeColor, setDesksStrokeColor] = React.useState("#dadce0");
    const [disableStroke, setDisableStroke] = React.useState(false);
    // colore dei testi
    const [textColor, setTextColor] = React.useState("#909090");
    const [disableText, setDisableText] = React.useState(false);
    // colore di sfondo
    const [backgroundColor, setBackgroundColor] = React.useState("#ffffff");
    const [disableBackground, setDisableBackground] = React.useState(true);

    /**
     * Avverte il componente parente che il client ha deciso di chiudere il pop-up
     */
    function closePopup() {
        if (popupHasClosed) popupHasClosed();
    }

    /**
     * Sacrica la piantina della classe
     */
    const downloadMap = () => {
        if (!template.current) return;
        const { canvas } = template.current
        if (!canvas) return;
        const dataURL = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');
        link.download = 'map.jpg';
        link.href = dataURL;
        link.click();
    }

    const renderCustumOptions = () => (
        <>
            {/* colore riempimento */}
            <div className={styles.colorPickerContainer}>
                <input type="color" className={styles.colorPicker} value={desksFillColor}
                    onChange={e => setDesksFillColor(e.target.value)} disabled={disableFill}
                />
                <span className={classnames({ [styles.disabled]: disableFill })}>
                    Riempimento dei banchi
             </span>
                <button title="Elimina la propietà" onClick={() => setDisableFill(!disableFill)}>
                    <FontAwesomeIcon icon={disableFill ? faPlus : faMinus} />
                </button>
            </div>
            {/* colore bordo */}
            <div className={styles.colorPickerContainer}>
                <input type="color" className={styles.colorPicker} value={desksStrokeColor}
                    onChange={e => setDesksStrokeColor(e.target.value)} disabled={disableStroke}
                />
                <span className={classnames({ [styles.disabled]: disableStroke })}>
                    Bordo dei banchi
             </span>
                <button title="Elimina la propietà" onClick={() => setDisableStroke(!disableStroke)}>
                    <FontAwesomeIcon icon={disableStroke ? faPlus : faMinus} />
                </button>
            </div>
            {/* colore del nome degli studenti */}
            <div className={styles.colorPickerContainer}>
                <input type="color" className={styles.colorPicker} value={textColor}
                    onChange={e => setTextColor(e.target.value)} disabled={disableFill}
                />
                <span className={classnames({ [styles.disabled]: disableText })}>
                    Colore testo degli studenti
             </span>
                <button title="Elimina la propietà" onClick={() => setDisableText(!disableText)}>
                    <FontAwesomeIcon icon={disableText ? faPlus : faMinus} />
                </button>
            </div>
            {/* colore riempimento sfondo */}
            <div className={styles.colorPickerContainer}>
                <input type="color" className={styles.colorPicker} value={backgroundColor}
                    onChange={e => setBackgroundColor(e.target.value)} disabled={disableFill}
                />
                <span className={classnames({ [styles.disabled]: disableBackground })}>
                    Colore dello sfondo
             </span>
                <button title="Elimina la propietà" onClick={() => setDisableBackground(!disableBackground)}>
                    <FontAwesomeIcon icon={disableBackground ? faPlus : faMinus} />
                </button>
            </div>
        </>
    );

    /**
     * Mappa della classe che sebbene sia renderizzata nel DOM è nascosta.
     * Serve per ricavare successivamente un immagine del canvas.
     */
    const renderTemplate = () => {
        let style: IClassroomMapColors;
        if (styleOption === 0) style = classroomMapColors.light;
        else if (styleOption === 1) style = classroomMapColors.dark;
        else style = {
            desksFillColor: disableFill ? null : desksFillColor,
            desksStrokeColor: disableStroke ? null : desksStrokeColor,
            backgroundColor: disableBackground ? null : backgroundColor,
            textColor: disableText ? null : textColor
        }

        return (
            <ClassRoomMap
                ref={template} className={styles.template}
                notEditable static width={3508} height={2480}
                desks={desks} students={students} style={style}
            />
        );
    }

    return (
        <>
            {renderTemplate()}
            <div className={styles.blur} />
            <div className={styles.container} ref={container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Scarica la piantina della classe</h2>
                    <FontAwesomeIcon icon={faTimes} onClick={closePopup} />
                </div>
                <div className={styles.appearanceContainer}>
                    <h3 className={styles.subtitle}>Stile</h3>
                    <div className={styles.options}>
                        <button onClick={() => setStyleOption(0)}
                            className={classnames(styles.styleOption, { [styles.active]: styleOption === 0 })}>
                            <img className={styles.optionImg}
                                src={require("../../assets/images/classroom-preview-light.png")} />
                            <label>Chiaro</label>
                        </button>
                        <button onClick={() => setStyleOption(1)}
                            className={classnames(styles.styleOption, { [styles.active]: styleOption === 1 })}>
                            <img className={styles.optionImg}
                                src={require("../../assets/images/classroom-preview-dark.png")} />
                            <label>Scuro</label>
                        </button>
                        <button onClick={() => setStyleOption(2)}
                            className={classnames(styles.styleOption, { [styles.active]: styleOption === 2 })}>
                            <img className={styles.optionImg}
                                src={require("../../assets/images/classroom-preview-custum.png")} />
                            <label>Personalizzato</label>
                        </button>
                    </div>
                </div>
                <SlideDown className={styles.custumOptions} >
                    {styleOption === 2 && renderCustumOptions()}
                </SlideDown>
                <button onClick={downloadMap} className={styles.saveButton}>
                    Scarica
            </button>
            </div>
        </>
    );
}