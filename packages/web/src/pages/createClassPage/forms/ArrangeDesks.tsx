import * as React from 'react';
import { ClassRoomMap, Desk } from '../../../components/ClassRoomMap';
import { HashLoader } from "react-spinners"
import { DeskInput } from '../../../generated/graphql';
import { FontAwesomeIcon } from '../../../../../../node_modules/@fortawesome/react-fontawesome';
import { faCircle } from '../../../../../../node_modules/@fortawesome/free-regular-svg-icons';

interface ArrangeDesksProps {
    studensNumber?: number | null;
    storeValues: (desks: DeskInput[] | null, id?: number | string) => void;
    id: any;
    containerHeight?: number;
}

export const ArrangeDesks: React.FC<ArrangeDesksProps> =
    ({ studensNumber, storeValues, id, containerHeight }) => {
        // dimensioni canvas
        const [width, setWith] = React.useState<number | null>(null);
        const [height, setHeight] = React.useState<number | null>(null);
        // banchi
        const [desks, setDesks] = React.useState<DeskInput[]>([]);
        // contenitore del canvas
        const container = React.useRef<HTMLDivElement>(null);

        // Imposta le dimensioni del canvas 
        React.useEffect(() => {
            const setCanvasSize = () => {
                if (containerHeight && container && container.current) {
                    // dimensioni del contenitore
                    const containerWidth = container.current.getBoundingClientRect().width;
                    // imposta le dimensioni del canvas
                    const offsetY = 90;
                    setWith(containerWidth);
                    setHeight(containerHeight - container.current.offsetTop - offsetY);
                }
            }
            setCanvasSize();
            window.addEventListener("resize", setCanvasSize);
            return () => window.removeEventListener("resize", setCanvasSize);
        }, [container, containerHeight]);

        // invia i valori al form
        React.useEffect(() => {
            if (desks.length === studensNumber) {
                // trasla i banchi verso l'origine
                const translatedBenches = Desk.centerDesks(desks);
                // converte i banchi in oggetti 
                const desksObj = Desk.desksToObjs(translatedBenches);
                // invia i banchi
                storeValues(desksObj, id);
            }
            else storeValues(null, id);
        }, [desks, studensNumber])

        /**
         * Testo riguardo il numero degli banchi disposti  
         */
        const showText = () => {
            if (!studensNumber) return;
            const remainingDesks = studensNumber - desks.length;
            if (remainingDesks > 0)
                return `Devi ancora disporre ${remainingDesks} ${remainingDesks === 1 ? "banco" : "banchi"}`;
            else return `Hai disposto abbastanza banchi`;
        }

        return (
            <div className="ArrangeDesks">
                <div className="subtitle">
                    <span className="number-circle">
                        <FontAwesomeIcon icon={faCircle} />
                        <strong className="number-circle__number">3</strong>
                    </span>
                    <h4>Disponi i banchi per ogni studente:</h4>
                </div>
                <div className="container" ref={container}>
                    {width && height && studensNumber ? (
                        <div>
                            <p className="desks-info"> {showText()} </p>
                            <ClassRoomMap
                                width={width}
                                height={height}
                                maxDesks={studensNumber}
                                handleChanges={setDesks}
                            />
                        </div>
                    ) : <HashLoader color="#dadfe1" />}
                </div>
            </div>
        );
    }