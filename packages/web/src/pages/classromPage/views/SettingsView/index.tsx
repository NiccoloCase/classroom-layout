import React, { useState } from "react";
import { ToggleSwitch } from '../../../../components/ToggleSwitch';
import { TitleComponent } from '../../../../components/TitleComponent';
import { InfoIcon } from '../../../../components/InfoIconComponent';
import { DeleteClassroomSection } from './DeleteClassroomSection';

interface SettingsViewProps {
    classID: string;
    className: string;
    classEmail: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ classID, className, classEmail }) => {
    // se la classe è salvata nello storage 
    const [isClassSaved, setIsClassSaved] = useState(
        localStorage.getItem("favorite-classroom-id") === classID);

    /**
     * Funzione chiamata al cambiamento dell'input switch del salvataggio della classe
     */
    const handleClassSaveToggle = () => {
        if (isClassSaved)
            // rimove la classe dallo storage
            localStorage.removeItem("favorite-classroom-id");
        else
            // salva l'id della classe nello storage
            localStorage.setItem("favorite-classroom-id", classID);
        // salva le modifiche
        setIsClassSaved(!isClassSaved);
    }

    return (
        <div className="ClassroomPage__SettingsView">
            <TitleComponent title="Impostazioni" />
            <h3 className="title">Impostazioni</h3>
            <div className="card">
                <div className="settings">
                    <div className="setting">
                        <ToggleSwitch checked={isClassSaved} onChange={handleClassSaveToggle} />
                        <span>
                            Salva la classe in locale
                        <InfoIcon>
                                <h4>Salva la classe nella cache del browser.</h4>
                                <p>Questa operazione
                            comporta la perdita dei dati di un altra eventuale classe salvata.</p>
                            </InfoIcon>
                        </span>
                    </div>
                </div>
                <DeleteClassroomSection
                    classID={classID}
                    className={className}
                    classEmail={classEmail} />
            </div>
        </div>
    );
}