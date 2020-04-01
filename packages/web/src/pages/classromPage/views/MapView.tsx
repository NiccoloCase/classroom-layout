import * as React from "react";
import { HashLoader } from 'react-spinners';
import { ClassRoomMap } from '../../../components/ClassRoomMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom, faDownload } from '@fortawesome/free-solid-svg-icons';
import { DeskInput, useShuffleDesksMutation } from '../../../generated/graphql';

interface MapViewProps {
    classId: string;
    students: string[];
    desks: DeskInput[];
    canvasWidth?: number;
    canvasHeight?: number;
    highlightedDesk?: number;
    /** Funzione chiamata quando un banco viene selezionato / deselezionato */
    onDeskIsHighlighted?: (index: number | null) => void;
    /** Funzione chiamata quando i banchi vengono mischiati */
    onDesksAreShuffled: (shuffledStudents: string[]) => void;
}

export const MapView: React.FC<MapViewProps> = props => {
    // GRAPQHL
    const [shuffleMutation] = useShuffleDesksMutation({ variables: { id: props.classId } });

    /**
     * Sacrica la piantina della classe
     */
    const downloadMap = () => {
        const canvas: HTMLCanvasElement | null = document.querySelector(".ClassroomPage__MapView canvas");
        if (!canvas) return;
        const dataURL = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');
        link.download = 'map.jpg';
        link.href = dataURL;
        link.click();
    }

    const shuffleDesks = async () => {
        const { data } = await shuffleMutation();
        if (data)
            props.onDesksAreShuffled(data.shuffleDesks.students);
    }

    const content = (
        <React.Fragment>
            <ClassRoomMap
                width={props.canvasWidth!}
                height={props.canvasHeight!}
                students={props.students}
                highlightedDesk={props.highlightedDesk}
                onDeskIsHighlighted={props.onDeskIsHighlighted}
                desks={props.desks} scale={55} notEditable />
            <div className="functions">
                <button className="btn" title="Scarica la mappa dei posti" onClick={downloadMap}>
                    <FontAwesomeIcon icon={faDownload} />
                </button>
                <button className="btn" title="Cambia i posti" onClick={shuffleDesks}>
                    <FontAwesomeIcon icon={faRandom} />
                </button>
            </div>
        </React.Fragment>
    );

    return (
        <div className="ClassroomPage__MapView">
            {props.canvasWidth && props.canvasHeight ? content : <HashLoader color="#dadfe1" />}
        </div>
    );
}
