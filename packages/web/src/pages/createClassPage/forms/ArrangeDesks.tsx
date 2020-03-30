import * as React from 'react';
import { ClassRoomMap } from '../../../components/ClassRoomMap';
import { HashLoader } from "react-spinners"

interface ArrangeDesksProps {
    studensNumber?: number | null;
    storeValues: (desks: string | null, id?: number | string) => void;
    id?: any;
}

export const ArrangeDesks: React.FC<ArrangeDesksProps> = ({ studensNumber, storeValues, id }) => {

    const [width, setWith] = React.useState<number | null>(null);
    const [height, setHeight] = React.useState<number | null>(null);
    const [desks, setDesks] = React.useState("[]");
    const [desksNumber, setDesksNumber] = React.useState(0);

    // Funzione chiamata solo una volta dopo aver renderizzato
    React.useEffect(() => {
        // IMPOSTA LE DIMENSIONI DEL CANVAS
        const parent = document.getElementById("CreateClassPage__form-content");
        if (parent) {
            const { width: w, height: h } = parent.getBoundingClientRect();
            const offsetX = 100;
            const offSetY = 120;
            setWith(w - offsetX);
            setHeight(h - offSetY);
        }
    }, []);

    React.useEffect(() => { // invia i valori al form
        if (desksNumber === studensNumber) storeValues(desks, id);
        else storeValues(null, id);
    }, [desks])

    /**
     * Funzione chiamata quando avviene una modifica nella configurazione
     * della classe
     * @param desksJSON 
     */
    const handleChanges = (desksJSON: string) => {
        // salva l'array aggiornato dei banchi e il loro numero
        const n = JSON.parse(desksJSON).length;
        setDesksNumber(n);
        setDesks(desksJSON);

    }

    const showText = () => {
        if (!studensNumber) return;
        const remainingDesks = studensNumber - desksNumber;
        if (remainingDesks > 0)
            return `Devi ancora disporre ${remainingDesks} ${remainingDesks === 1 ? "banco" : "banchi"}`;
        else return `Hai disposto abbastanza banchi per tutti gli studenti`;
    }

    return (
        <div className="ArrangeDesks">
            <h1 className="subtitle"> Disponi i banchi come sono nella classe</h1>
            {width && height && studensNumber ? (
                <div className="container">
                    <div>
                        <p className="desks-info"> {showText()} </p>
                        <ClassRoomMap
                            width={width}
                            height={height}
                            maxDesks={studensNumber}
                            handleChanges={handleChanges}
                        />
                    </div>
                </div>
            ) : <HashLoader color="#dadfe1" />
            }
        </div>
    );
}
