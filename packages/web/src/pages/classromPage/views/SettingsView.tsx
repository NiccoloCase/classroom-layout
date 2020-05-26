import * as React from "react";
import { ToggleSwitch } from '../../../components/ToggleSwitch';
import { TitleComponent } from '../../../components/TitleComponent';
import { InfoIcon } from '../../../components/InfoIconComponent';

interface SettingsViewProps {
    classID: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ classID }) => {
    // se la classe è salvata nello storage 
    const [isClassSaved, setIsClassSaved] = React.useState(
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
            <TitleComponent title="Mescola gli studenti" />
            <h3 className="title">Impostazioni</h3>
            <div className="card">
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
        </div>
    );
}