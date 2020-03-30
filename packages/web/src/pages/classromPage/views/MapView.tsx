import * as React from "react";
import { HashLoader } from 'react-spinners';
import { ClassRoomMap } from '../../../components/ClassRoomMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom, faDownload } from '@fortawesome/free-solid-svg-icons';

interface MapViewProps {
    students: string[];
    desks: string;
    canvasWidth?: number;
    canvasHeight?: number;
    highlightedDesk?: number;
    onDeskIsHighlighted?: (index: number | null) => void;
}

export const MapView: React.FC<MapViewProps> = ({
    canvasWidth, canvasHeight, desks, students, highlightedDesk, onDeskIsHighlighted
}) => {
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

    const content = (
        <React.Fragment>
            <ClassRoomMap
                width={canvasWidth!}
                height={canvasHeight!}
                students={students}
                highlightedDesk={highlightedDesk}
                onDeskIsHighlighted={onDeskIsHighlighted}
                desks={desks} scale={55} notEditable />
            <div className="functions">
                <button className="btn" title="Scarica la mappa dei posti" onClick={downloadMap}>
                    <FontAwesomeIcon icon={faDownload} />
                </button>
                <button className="btn" title="Cambia i posti">
                    <FontAwesomeIcon icon={faRandom} />
                </button>
            </div>
        </React.Fragment>
    );

    return (
        <div className="ClassroomPage__MapView">
            {canvasWidth && canvasHeight ? content : <HashLoader color="#dadfe1" />}
        </div>
    );
}
